import "server-only";
import { cache } from "react";
import { list, put, del } from "@vercel/blob";
import type { SiteContent } from "./content-types";
import { DEFAULT_CONTENT } from "./content-default";

// 불변 URL 패턴: 저장마다 새 파일(content/data-<random>.json)을 만들고
// 항상 가장 최근 파일을 읽는다. 같은 경로 덮어쓰기 시 발생하는 Blob CDN
// 캐시 staleness(쿼리스트링 무시)를 회피 → 수정이 즉시 반영된다.
const PREFIX = "content/data.json";
const KEEP = 3; // 안전상 최근 N개 보관, 나머지는 정리

function hasBlob() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

function newest<T extends { uploadedAt: Date | string }>(blobs: T[]): T | undefined {
  return blobs
    .slice()
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// 기본값 위에 저장값을 깊게 병합 — 구버전 Blob에 없는 새 키는 기본값으로 채워
// admin이 항상 완전한 콘텐츠를 받도록 한다(배열·원시값은 저장값 우선).
function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override === undefined ? base : (override as T));
  }
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(base)) {
    if (key in override) {
      out[key] = deepMerge((base as Record<string, unknown>)[key], override[key]);
    }
  }
  return out as T;
}

// 요청 단위 캐시 — 레이아웃/페이지가 같은 요청에서 한 번만 fetch
export const getContent = cache(async (): Promise<SiteContent> => {
  if (!hasBlob()) return DEFAULT_CONTENT;
  try {
    const { blobs } = await list({ prefix: "content/" });
    const latest = newest(blobs);
    if (!latest) return DEFAULT_CONTENT;
    // 불변 URL이라 CDN 캐시되어도 항상 최신 내용 (URL 자체가 버전)
    const res = await fetch(latest.url, { cache: "no-store" });
    if (!res.ok) return DEFAULT_CONTENT;
    const data = (await res.json()) as Partial<SiteContent>;
    return deepMerge(DEFAULT_CONTENT, data);
  } catch {
    return DEFAULT_CONTENT;
  }
});

export async function saveContent(content: SiteContent): Promise<void> {
  if (!hasBlob()) throw new Error("BLOB_READ_WRITE_TOKEN 미설정 — 저장소가 연결되지 않았습니다.");
  // 새 버전 파일 생성 (랜덤 접미사 → 불변 URL)
  await put(PREFIX, JSON.stringify(content, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: true,
  });
  // 오래된 버전 정리 (최근 KEEP개만 유지)
  try {
    const { blobs } = await list({ prefix: "content/" });
    const sorted = blobs
      .slice()
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    const stale = sorted.slice(KEEP);
    if (stale.length) await del(stale.map((b) => b.url));
  } catch {
    /* 정리는 실패해도 저장에는 영향 없음 */
  }
}
