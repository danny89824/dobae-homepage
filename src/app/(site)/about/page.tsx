import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content-store";
import { telHref } from "@/lib/content-types";
import RichText from "@/components/RichText";

export const metadata: Metadata = {
  title: "회사소개 — 도배청년단",
  description: "도배의 바른 기준을 만드는 도배청년단. 직접 고용한 청년 시공단, 영업배상책임보험, 1년 무상 A/S. 서울·경기 도배 전문.",
};

export default async function AboutPage() {
  const { site: SITE, trust: TRUST, regions: REGIONS, pageHeads, about } = await getContent();
  return (
    <>
      <section className="pt-28 md:pt-32 pb-10 bg-soft border-b border-line">
        <div className="container-x">
          <p className="eyebrow num-label">{pageHeads.about.eyebrow}</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2 tracking-tight leading-tight whitespace-pre-line">
            {pageHeads.about.heading}
          </h1>
          <p className="text-sub mt-4 max-w-2xl text-[1.05rem] leading-relaxed">{pageHeads.about.sub}</p>
        </div>
      </section>

      {/* 지표 */}
      <section className="py-14 md:py-20">
        <div className="container-x">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST.map((t) => (
              <div key={t.label} className="rounded-2xl border border-line bg-paper p-6 text-center reveal">
                <p className="text-3xl md:text-4xl font-extrabold num-label text-accent">{t.value}</p>
                <p className="text-sm text-sub mt-2">{t.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 강점 */}
      <section className="bg-dark text-on-dark py-16 md:py-24">
        <div className="container-x">
          <div className="max-w-2xl reveal">
            <p className="eyebrow !text-gold">{about.whyHead.eyebrow}</p>
            <h2 className="text-2xl md:text-3xl font-bold mt-3">{about.whyHead.heading}</h2>
            {about.whyHead.sub && <p className="text-on-dark-sub mt-3">{about.whyHead.sub}</p>}
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mt-10">
            {about.strengths.map((x) => (
              <div key={x.title} className="reveal">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="text-gold">—</span> {x.title}
                </h3>
                <RichText html={x.desc} className="text-on-dark-sub mt-2 leading-relaxed" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 연락처 */}
      <section className="py-16 md:py-24">
        <div className="container-x grid md:grid-cols-2 gap-8 items-start">
          <div className="reveal">
            <p className="eyebrow num-label">{about.contactHead.eyebrow}</p>
            <h2 className="text-2xl md:text-3xl font-bold mt-2.5">{about.contactHead.heading}</h2>
            <p className="text-sub mt-3">
              {REGIONS.join(" · ")} 시공 가능. {about.contactHead.sub}
            </p>

            <dl className="mt-8 space-y-4">
              <div className="flex gap-4">
                <dt className="w-20 shrink-0 text-sub text-sm">전화</dt>
                <dd className="font-semibold num-label">
                  <a href={telHref(SITE.phone)} className="link-underline">{SITE.phone}</a>
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-20 shrink-0 text-sub text-sm">카카오</dt>
                <dd>
                  <a href={SITE.kakaoChannel} target="_blank" rel="noreferrer" className="link-underline font-semibold">
                    카카오채널 도배청년단
                  </a>
                </dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-20 shrink-0 text-sub text-sm">법인</dt>
                <dd className="font-semibold">{SITE.legal}</dd>
              </div>
              <div className="flex gap-4">
                <dt className="w-20 shrink-0 text-sub text-sm">운영</dt>
                <dd className="text-sub">평일 09:00 – 18:00</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl bg-soft border border-line p-8 reveal">
            <h3 className="text-xl font-bold">지금 바로 시작하기</h3>
            <p className="text-sub mt-2 text-sm">{about.contactNote}</p>
            <div className="mt-6 grid gap-3">
              <Link href="/estimate" className="btn btn-accent w-full">간편견적 받기 →</Link>
              <Link href="/finder" className="btn btn-outline w-full">도배지 찾기</Link>
              <a href={telHref(SITE.phone)} className="btn btn-primary w-full">전화 상담 {SITE.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
