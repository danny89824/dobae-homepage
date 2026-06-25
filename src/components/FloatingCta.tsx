"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { telHref } from "@/lib/content-types";

function KakaoIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 3C6.99 3 3 6.2 3 10.13c0 2.52 1.66 4.73 4.16 5.99-.18.64-.66 2.36-.76 2.73-.12.46.17.45.36.33.15-.1 2.37-1.6 3.34-2.26.62.09 1.25.14 1.9.14 5.01 0 9-3.2 9-7.13S17.01 3 12 3z" />
    </svg>
  );
}
function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function ArrowUpIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export default function FloatingCta({
  phone,
  kakao,
}: {
  phone: string;
  kakao: string;
}) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* 데스크톱·태블릿: 우하단 플로팅 스택 */}
      <div className="hidden sm:flex fixed right-5 bottom-6 z-40 flex-col items-end gap-3">
        {showTop && (
          <div className="fab-wrap relative pop-in">
            <span className="fab-label">맨 위로</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="맨 위로 이동"
              className="fab bg-paper border border-line text-ink"
            >
              <ArrowUpIcon className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="fab-wrap relative">
          <span className="fab-label">전화 상담</span>
          <a href={telHref(phone)} aria-label={`전화 상담 ${phone}`} className="fab bg-dark text-on-dark">
            <PhoneIcon className="w-5 h-5" />
          </a>
        </div>
        <div className="fab-wrap relative">
          <span className="fab-label">카카오톡 상담</span>
          <a
            href={kakao}
            target="_blank"
            rel="noreferrer"
            aria-label="카카오톡 상담"
            className="fab soft-ping"
            style={{ background: "#FEE500", color: "#3C1E1E" }}
          >
            <KakaoIcon className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* 모바일: 하단 고정 CTA 바 */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-paper/95 backdrop-blur border-t border-line pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-[auto_auto_1fr] items-center gap-2 px-3 py-2.5">
          <a
            href={kakao}
            target="_blank"
            rel="noreferrer"
            aria-label="카카오톡 상담"
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl"
            style={{ background: "#FEE500", color: "#3C1E1E" }}
          >
            <KakaoIcon className="w-6 h-6" />
          </a>
          <a
            href={telHref(phone)}
            aria-label={`전화 상담 ${phone}`}
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-dark text-on-dark"
          >
            <PhoneIcon className="w-5 h-5" />
          </a>
          <Link href="/estimate" className="btn btn-accent w-full !py-3">
            간편견적 받기 →
          </Link>
        </div>
      </div>
    </>
  );
}
