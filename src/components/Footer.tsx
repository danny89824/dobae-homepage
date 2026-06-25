import Link from "next/link";
import Logo from "./Logo";
import { NAV, SITE, REGIONS } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-dark text-on-dark">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="text-on-dark" />
            <p className="mt-4 text-on-dark-sub text-[0.95rem] leading-relaxed max-w-xs">
              가격은 먼저, 책임은 문서로. <br />
              직접 고용한 청년 시공단이 만드는 정직한 도배.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <span
                  key={r}
                  className="text-xs px-2.5 py-1 rounded-full border border-white/15 text-on-dark-sub"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow !text-gold mb-4">Menu</p>
            <ul className="space-y-2.5 text-[0.95rem]">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-on-dark-sub hover:text-on-dark transition-colors">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow !text-gold mb-4">Contact</p>
            <a
              href={SITE.phoneHref}
              className="block text-2xl font-bold num-label tracking-tight"
            >
              {SITE.phone}
            </a>
            <p className="mt-2 text-on-dark-sub text-sm">평일 09:00 – 18:00 상담</p>
            <a
              href={SITE.kakaoChannel}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex btn btn-accent !py-2.5 !px-5 text-sm"
            >
              카카오채널 상담
            </a>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-2 sm:items-center justify-between text-xs text-on-dark-sub">
          <p>
            {SITE.name} · 법인 {SITE.legal} &nbsp;|&nbsp; © {SITE.copyrightYear}{" "}
            {SITE.name}. All rights reserved.
          </p>
          <p className="opacity-70">도배의 바른 기준</p>
        </div>
      </div>
    </footer>
  );
}
