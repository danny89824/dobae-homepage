import type { Metadata } from "next";
import Link from "next/link";
import { SITE, TRUST, REGIONS } from "@/lib/site";

export const metadata: Metadata = {
  title: "회사소개 — 도배청년단",
  description: "도배의 바른 기준을 만드는 도배청년단. 직접 고용한 청년 시공단, 영업배상책임보험, 1년 무상 A/S. 서울·경기 도배 전문.",
};

export default function AboutPage() {
  return (
    <>
      <section className="pt-28 md:pt-32 pb-10 bg-soft border-b border-line">
        <div className="container-x">
          <p className="eyebrow num-label">About</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2 tracking-tight leading-tight">
            도배의 바른 기준을 <br className="hidden sm:block" />만드는 사람들
          </h1>
          <p className="text-sub mt-4 max-w-2xl text-[1.05rem] leading-relaxed">
            도배는 보이지 않는 바탕부터 시작됩니다. 도배청년단은 그 바탕을 정직하게 만들기 위해,
            가격을 먼저 공개하고 책임을 문서로 남기며 직접 고용한 팀으로 시공합니다.
          </p>
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
            <p className="eyebrow !text-gold">Why 도배청년단</p>
            <h2 className="text-2xl md:text-3xl font-bold mt-3">믿고 맡길 수 있는 이유</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mt-10">
            {[
              { t: "하도급 없는 직접 고용", d: "외주로 넘기지 않습니다. 자체 교육을 받은 청년 시공단이 처음부터 끝까지 직접 시공해 품질을 책임집니다." },
              { t: "영업배상책임보험 가입", d: "혹시 모를 시공 중 사고에 대비해 보험에 가입되어 있어, 안심하고 맡기실 수 있습니다." },
              { t: "1년 무상 A/S", d: "시공 후 1년간 무상 A/S로 끝까지 책임집니다. 카카오채널로 간편하게 접수하세요." },
              { t: "투명한 가격 기준", d: "전화로 캐묻지 않아도 간편견적으로 예상 금액을 먼저 확인할 수 있습니다." },
            ].map((x) => (
              <div key={x.t} className="reveal">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="text-gold">—</span> {x.t}
                </h3>
                <p className="text-on-dark-sub mt-2 leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 연락처 */}
      <section className="py-16 md:py-24">
        <div className="container-x grid md:grid-cols-2 gap-8 items-start">
          <div className="reveal">
            <p className="eyebrow num-label">Contact</p>
            <h2 className="text-2xl md:text-3xl font-bold mt-2.5">상담 안내</h2>
            <p className="text-sub mt-3">
              {REGIONS.join(" · ")} 시공 가능. 비대면 실측으로 방문 부담 없이 진행합니다.
            </p>

            <dl className="mt-8 space-y-4">
              <div className="flex gap-4">
                <dt className="w-20 shrink-0 text-sub text-sm">전화</dt>
                <dd className="font-semibold num-label">
                  <a href={SITE.phoneHref} className="link-underline">{SITE.phone}</a>
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
            <p className="text-sub mt-2 text-sm">
              가격이 궁금하면 간편견적, 어떤 벽지가 맞을지 고민이면 도배지 찾기로.
            </p>
            <div className="mt-6 grid gap-3">
              <Link href="/estimate" className="btn btn-accent w-full">간편견적 받기 →</Link>
              <Link href="/finder" className="btn btn-outline w-full">도배지 찾기</Link>
              <a href={SITE.phoneHref} className="btn btn-primary w-full">전화 상담 {SITE.phone}</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
