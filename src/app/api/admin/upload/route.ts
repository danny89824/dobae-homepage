import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const dynamic = "force-dynamic";

// 백오피스 이미지 업로드 — Vercel Blob 클라이언트 업로드 토큰 발급.
// 클라이언트가 파일을 Blob에 직접 올리므로 서버리스 함수 본문 4.5MB 제한을 우회.
export async function POST(request: Request) {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        // 업로드 토큰 발급 전 관리자 비밀번호 검증
        const pw = process.env.ADMIN_PASSWORD?.trim();
        if (!pw || (clientPayload || "").trim() !== pw) {
          throw new Error("인증 실패");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
          addRandomSuffix: true,
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
        };
      },
      onUploadCompleted: async () => {
        // 업로드 완료 후 별도 처리 없음 (URL은 클라이언트가 직접 받음)
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "업로드 실패" },
      { status: 400 }
    );
  }
}
