"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const PW_KEY = "dobae_admin_pw";

export default function BoardClient() {
  const [pw, setPw] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY);
    setPw(saved);
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!pw) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft px-4">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 text-center">
          <h1 className="text-lg font-bold">로그인이 필요합니다</h1>
          <p className="text-sm text-sub mt-2">
            실행 관리보드는 백오피스 비밀번호로 보호됩니다.
          </p>
          <Link href="/admin" className="btn btn-accent w-full mt-5 inline-block">
            백오피스 로그인으로 이동
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm font-bold text-ink hover:text-accent">
            ← 백오피스
          </Link>
          <span className="text-sm font-bold text-sub">실행 관리보드</span>
        </div>
        <div className="text-xs text-sub">
          저장은 본인 브라우저(localStorage)에 보관됩니다 · 백업: 보드 우측 상단 &quot;백업 내보내기&quot;
        </div>
      </header>
      <iframe
        src="/admin/board.html"
        title="도배청년단 실행 관리보드"
        className="flex-1 w-full border-0"
        style={{ minHeight: "calc(100vh - 44px)" }}
      />
    </div>
  );
}
