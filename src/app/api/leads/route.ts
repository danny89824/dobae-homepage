import { NextResponse } from "next/server";
import { saveLead, listLeads, deleteLead } from "@/lib/leads-store";

export const dynamic = "force-dynamic";

function authed(req: Request): boolean {
  const pw = process.env.ADMIN_PASSWORD?.trim();
  if (!pw) return false; // 비밀번호 미설정 시 관리자 기능 차단
  const given = req.headers.get("x-admin-password")?.trim();
  return !!given && given === pw;
}

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}
function fail(e: unknown) {
  const msg = e instanceof Error ? e.message : "처리 실패";
  return NextResponse.json({ ok: false, error: msg }, { status: 500 });
}
function str(v: unknown, max: number): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t ? t.slice(0, max) : undefined;
}

// 상담 신청 접수 — 공개(방문자)
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return bad("잘못된 요청입니다.");
  }
  // 허니팟: 사람에겐 안 보이는 필드가 채워지면 봇 → 성공한 척 조용히 무시
  if (body.hp) return NextResponse.json({ ok: true });

  const name = str(body.name, 40);
  const phone = str(body.phone, 30);
  if (!name || !phone) return bad("이름과 연락처를 입력해 주세요.");
  if (body.consent !== true) return bad("개인정보 수집·이용 동의가 필요합니다.");

  try {
    await saveLead({
      name,
      phone,
      region: str(body.region, 60),
      message: str(body.message, 1000),
      source: str(body.source, 30) || "estimate",
      estimate: body.estimate,
      quote: body.quote,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

// 리드 목록 조회 — 관리자 전용
export async function GET(req: Request) {
  if (!authed(req)) return bad("인증 실패", 401);
  try {
    const leads = await listLeads();
    return NextResponse.json({ ok: true, leads });
  } catch (e) {
    return fail(e);
  }
}

// 리드 삭제 — 관리자 전용 (?url=<blob url>)
export async function DELETE(req: Request) {
  if (!authed(req)) return bad("인증 실패", 401);
  const url = new URL(req.url).searchParams.get("url");
  if (!url) return bad("삭제 대상이 없습니다.");
  try {
    await deleteLead(url);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
