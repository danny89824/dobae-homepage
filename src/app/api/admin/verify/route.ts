import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 비밀번호 검증 (백오피스 로그인용)
export async function POST(req: Request) {
  const pw = process.env.ADMIN_PASSWORD;
  let given = "";
  try {
    const body = (await req.json()) as { password?: string };
    given = body.password || "";
  } catch {
    given = "";
  }
  if (!pw) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_PASSWORD가 설정되지 않았습니다." },
      { status: 503 }
    );
  }
  return NextResponse.json({ ok: given === pw });
}
