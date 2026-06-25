import { NextResponse } from "next/server";
import { getContent, saveContent } from "@/lib/content-store";
import type { SiteContent } from "@/lib/content-types";

export const dynamic = "force-dynamic";

function authed(req: Request): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false; // 비밀번호 미설정 시 저장 차단
  const given = req.headers.get("x-admin-password");
  return given === pw;
}

// 현재 콘텐츠 조회 (공개 콘텐츠라 인증 불필요)
export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

// 콘텐츠 저장 (비밀번호 필요)
export async function POST(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ ok: false, error: "인증 실패" }, { status: 401 });
  }
  let body: SiteContent;
  try {
    body = (await req.json()) as SiteContent;
  } catch {
    return NextResponse.json({ ok: false, error: "잘못된 데이터" }, { status: 400 });
  }
  if (!body || !body.site || !Array.isArray(body.cases)) {
    return NextResponse.json({ ok: false, error: "콘텐츠 형식 오류" }, { status: 400 });
  }
  try {
    await saveContent(body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "저장 실패";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
