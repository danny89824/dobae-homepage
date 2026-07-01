import "server-only";
import { list, put, del } from "@vercel/blob";

// 상담 신청(리드) 저장 모델.
// 저장: Vercel Blob에 "건별 불변 파일"(leads/<uuid>.json)로 append.
// content-store와 달리 리드는 계속 쌓이므로, 건마다 새 파일을 만들어
// 동시 저장 시 read-modify-write 경합을 원천 차단한다.
//
// ⚠️ 개인정보 주의: 이름·연락처가 포함된다. Blob은 공개 접근이라 URL은
// 랜덤 접미사로 추측 불가능하게 만들지만, 정식 공개 전에는 비공개 DB로
// 이전을 권장한다. (조회·삭제는 관리자 비밀번호로만 가능)

export interface Lead {
  id: string;
  name: string;
  phone: string;
  region?: string;
  message?: string;
  source?: string; // "estimate" | "consult" | ...
  estimate?: unknown; // 견적 입력 스냅샷
  quote?: unknown; // 계산된 견적
  at: string; // ISO 8601 (서버 시각)
}

// 관리자 조회 시에만 노출되는 내부 필드(삭제용 Blob URL 포함)
export interface StoredLead extends Lead {
  url: string;
}

const PREFIX = "leads/";

function hasBlob() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

type NewLead = Omit<Lead, "id" | "at">;

export async function saveLead(input: NewLead): Promise<Lead> {
  if (!hasBlob()) {
    throw new Error("BLOB_READ_WRITE_TOKEN 미설정 — 저장소가 연결되지 않았습니다.");
  }
  const lead: Lead = {
    ...input,
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
  };
  await put(`${PREFIX}${lead.id}.json`, JSON.stringify(lead, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: true, // URL 추측 방지(개인정보 보호)
  });
  return lead;
}

export async function listLeads(): Promise<StoredLead[]> {
  if (!hasBlob()) return [];
  const { blobs } = await list({ prefix: PREFIX });
  const items = await Promise.all(
    blobs.map(async (b) => {
      try {
        const res = await fetch(b.url, { cache: "no-store" });
        if (!res.ok) return null;
        const data = (await res.json()) as Lead;
        return { ...data, url: b.url } satisfies StoredLead;
      } catch {
        return null;
      }
    })
  );
  return items
    .filter((x): x is StoredLead => x !== null)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

export async function deleteLead(url: string): Promise<void> {
  if (!hasBlob()) throw new Error("BLOB_READ_WRITE_TOKEN 미설정");
  // 우리 저장소(leads/) 소속 URL만 삭제 허용
  if (!url.includes("/leads/")) throw new Error("삭제 대상이 올바르지 않습니다.");
  await del(url);
}
