"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { NAV, ACTIONS, SITE } from "@/lib/site";

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 홈만 투명 히어로 오버레이 사용, 나머지는 항상 solid
  const overlayHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isSolid = solid || !overlayHome || open;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        isSolid
          ? "bg-paper/92 backdrop-blur border-b border-line text-ink"
          : "bg-transparent text-white border-b border-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between h-16 md:h-[68px]">
        <Link href="/" aria-label="도배청년단 홈" className="shrink-0">
          <Logo />
        </Link>

        {/* 데스크톱 내비 */}
        <nav className="hidden lg:flex items-center gap-7 text-[0.95rem] font-medium">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`link-underline transition-opacity ${
                  active ? "opacity-100" : "opacity-80 hover:opacity-100"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* 우측 액션 */}
        <div className="flex items-center gap-2">
          <a
            href={SITE.phoneHref}
            className={`hidden md:inline text-sm font-semibold num-label mr-1 ${
              isSolid ? "text-ink" : "text-white"
            }`}
          >
            {SITE.phone}
          </a>
          {ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`hidden sm:inline-flex btn !py-2.5 !px-4 text-sm ${
                a.variant === "accent"
                  ? "btn-accent"
                  : isSolid
                  ? "btn-outline"
                  : "btn-ghost-light"
              }`}
            >
              {a.label}
            </Link>
          ))}

          {/* 모바일 토글 */}
          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 -mr-1"
          >
            <span className="relative block w-6 h-4">
              <span
                className={`absolute left-0 top-0 h-0.5 w-6 bg-current transition-transform ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] h-0.5 w-6 bg-current transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] h-0.5 w-6 bg-current transition-transform ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* 모바일 드로어 */}
      <div
        className={`lg:hidden overflow-hidden bg-paper text-ink transition-[max-height] duration-400 ease-out ${
          open ? "max-h-[80vh] border-b border-line" : "max-h-0"
        }`}
      >
        <nav className="container-x py-4 flex flex-col">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-baseline justify-between py-3.5 border-b border-line/70 last:border-0"
            >
              <span className="text-lg font-semibold">{n.label}</span>
              <span className="eyebrow !text-sub">{n.en}</span>
            </Link>
          ))}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Link href="/finder" className="btn btn-outline">
              도배지 찾기
            </Link>
            <Link href="/estimate" className="btn btn-accent">
              간편견적
            </Link>
          </div>
          <a
            href={SITE.phoneHref}
            className="mt-3 text-center text-sm font-semibold num-label text-sub"
          >
            전화 상담 {SITE.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
