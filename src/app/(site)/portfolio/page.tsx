import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content-store";

export const metadata: Metadata = {
  title: "시공사례 — 도배청년단이 다녀간 공간",
  description: "서울·경기 2,000곳 이상의 실제 도배 시공 사례. 아파트·빌라·오피스텔 거실/침실/원룸 시공 포트폴리오.",
};

export default async function PortfolioPage() {
  const { cases: CASES, regions: REGIONS, pageHeads } = await getContent();
  const head = pageHeads.portfolio;
  return (
    <>
      <section className="pt-28 md:pt-32 pb-10 bg-soft border-b border-line">
        <div className="container-x">
          <p className="eyebrow num-label">{head.eyebrow}</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2 tracking-tight">{head.heading}</h1>
          <p className="text-sub mt-3 max-w-xl text-[1.05rem]">
            {REGIONS.join(" · ")} {head.sub}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-x">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CASES.map((c) => (
              <article key={c.no} className="reveal group">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.img}
                    alt={c.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-ink">
                    {c.tag}
                  </span>
                </div>
                <div className="mt-3.5">
                  <h2 className="font-bold text-lg leading-snug">{c.title}</h2>
                  <p className="text-sm text-sub mt-1.5">
                    {c.space} · {c.wallpaper} · {c.region}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <p className="text-center text-sm text-sub mt-12">
            ※ 일부 이미지는 분위기 참고용이며, 실제 시공 사진으로 순차 교체 예정입니다.
          </p>

          <div className="mt-10 rounded-3xl bg-dark text-on-dark p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold">
              우리 집은 어떻게 달라질까요?
            </h2>
            <p className="text-on-dark-sub mt-3">가격부터 확인하고 편하게 상담하세요.</p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link href="/estimate" className="btn btn-accent !px-7">간편견적 받기 →</Link>
              <Link href="/finder" className="btn btn-ghost-light !px-7">도배지 찾기</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
