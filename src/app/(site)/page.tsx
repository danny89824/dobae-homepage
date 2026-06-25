import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import PortfolioSlider from "@/components/PortfolioSlider";
import { getContent } from "@/lib/content-store";
import { telHref } from "@/lib/content-types";

export default async function Home() {
  const c = await getContent();
  const { hero, site, trust, regions, cases, process, faq } = c;

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.image}
            alt="정성껏 도배를 마친 따뜻한 거실"
            className="w-full h-full object-cover kenburns"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/25" />
        </div>

        <div className="container-x relative pb-16 md:pb-24 pt-32 text-white">
          <p className="eyebrow !text-white/80 reveal">{hero.eyebrow}</p>
          <h1 className="reveal reveal-delay-1 mt-4 text-[2.6rem] leading-[1.1] sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl">
            {hero.headlineLine1}
            <br />
            {hero.headlineLine2}
          </h1>
          <p className="reveal reveal-delay-2 mt-5 text-lg md:text-xl text-white/85 max-w-xl">
            {hero.sub}
          </p>
          <div className="reveal reveal-delay-3 mt-8 flex flex-wrap gap-3">
            <Link href="/estimate" className="btn btn-accent !px-7 text-base">
              간편견적 받기 →
            </Link>
            <Link href="/finder" className="btn btn-ghost-light !px-7 text-base">
              도배지 찾기
            </Link>
          </div>

          <div className="reveal reveal-delay-4 mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/20 pt-6 max-w-2xl">
            {trust.map((t) => (
              <div key={t.label} className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-extrabold num-label">{t.value}</span>
                <span className="text-xs md:text-sm text-white/70">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STANDARD (dark) ===== */}
      <section className="bg-dark text-on-dark py-20 md:py-28">
        <div className="container-x">
          <div className="max-w-2xl reveal">
            <p className="eyebrow !text-gold">Our Standard</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 leading-tight">
              도배에 없던 기준을, <br className="hidden sm:block" />
              우리가 만듭니다
            </h2>
            <p className="text-on-dark-sub mt-4 text-[1.05rem]">
              화려한 약속 대신, 당연한 것을 당연하게. 도배청년단이 일하는 세 가지 방식입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px mt-12 bg-white/10 rounded-2xl overflow-hidden">
            {[
              { n: "01", t: "가격을 먼저 공개합니다", d: "전화로 캐묻지 않아도 됩니다. 간편견적으로 예상 금액을 먼저 확인하고 시작하세요. 정찰제에 가까운 투명한 기준." },
              { n: "02", t: "책임을 문서로 남깁니다", d: "시공 후 1년 무상 A/S로 책임집니다. 말이 아니라 보증으로, 끝까지 함께합니다." },
              { n: "03", t: "직접 고용한 팀이 합니다", d: "하도급으로 넘기지 않습니다. 자체 교육을 받은 청년 시공단이 처음부터 끝까지 직접 시공합니다." },
            ].map((b, i) => (
              <div key={b.n} className={`bg-dark p-7 md:p-8 reveal reveal-delay-${i + 1}`}>
                <span className="num-label text-gold/80 text-sm font-semibold">{b.n}</span>
                <h3 className="text-xl font-bold mt-3">{b.t}</h3>
                <p className="text-on-dark-sub mt-3 leading-relaxed text-[0.95rem]">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 시공사례 (슬라이더) ===== */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <div className="flex items-end justify-between gap-4 reveal">
            <div>
              <p className="eyebrow num-label">Portfolio</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-2.5">
                서울과 경기, 2,000곳의 바탕
              </h2>
              <p className="text-sub mt-3 max-w-lg">
                같은 집도 도배 하나로 이렇게 달라집니다. 도배청년단이 다녀간 공간들.
              </p>
            </div>
            <Link href="/portfolio" className="hidden sm:inline-flex link-underline font-semibold shrink-0">
              전체 사례 보기 →
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <PortfolioSlider items={cases} />
        </div>
        <div className="container-x mt-6 sm:hidden">
          <Link href="/portfolio" className="btn btn-outline w-full">
            전체 사례 보기 →
          </Link>
        </div>
      </section>

      {/* ===== 두 전환 동선 ===== */}
      <section className="pb-20 md:pb-28">
        <div className="container-x grid md:grid-cols-2 gap-4">
          <Link
            href="/finder"
            className="group relative rounded-3xl bg-accent-soft border border-accent/20 p-8 md:p-10 overflow-hidden reveal"
          >
            <p className="eyebrow">Wallpaper Finder</p>
            <h3 className="text-2xl md:text-3xl font-bold mt-3 text-accent-ink">
              어떤 도배지가 <br /> 우리 집에 맞을까?
            </h3>
            <p className="text-accent-ink/80 mt-3 max-w-xs">
              1분 진단으로 벽지 종류·등급·컬러 무드를 추천받아 보세요.
            </p>
            <span className="inline-flex items-center gap-1 mt-6 font-semibold text-accent-ink group-hover:gap-2 transition-all">
              도배지 찾기 시작 →
            </span>
            <span className="absolute -right-6 -bottom-6 text-[8rem] opacity-10 select-none">🎨</span>
          </Link>

          <Link
            href="/estimate"
            className="group relative rounded-3xl bg-dark text-on-dark p-8 md:p-10 overflow-hidden reveal reveal-delay-1"
          >
            <p className="eyebrow !text-gold">Simple Estimate</p>
            <h3 className="text-2xl md:text-3xl font-bold mt-3">
              전화 없이, <br /> 가격부터 확인
            </h3>
            <p className="text-on-dark-sub mt-3 max-w-xs">
              공간과 평형, 벽지만 고르면 예상 금액이 바로 나옵니다.
            </p>
            <span className="inline-flex items-center gap-1 mt-6 font-semibold group-hover:gap-2 transition-all">
              간편견적 받기 →
            </span>
            <span className="absolute -right-4 -bottom-8 text-[8rem] opacity-10 select-none">💰</span>
          </Link>
        </div>
      </section>

      {/* ===== 프로세스 ===== */}
      <section className="bg-soft py-20 md:py-28">
        <div className="container-x">
          <div className="max-w-2xl reveal">
            <p className="eyebrow num-label">Process</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2.5">
              복잡할 것 없습니다. 여섯 걸음
            </h2>
            <p className="text-sub mt-3">
              간편견적부터 1년 무상 A/S까지, 처음부터 끝까지 투명하게.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {process.map((p, i) => (
              <div key={p.no} className={`rounded-2xl bg-paper border border-line p-6 reveal reveal-delay-${(i % 3) + 1}`}>
                <span className="num-label text-accent font-extrabold text-2xl">{p.no}</span>
                <h3 className="font-bold text-lg mt-2">{p.title}</h3>
                <p className="text-sub text-sm mt-2 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 md:py-28">
        <div className="container-x max-w-3xl">
          <div className="text-center reveal">
            <p className="eyebrow num-label">FAQ</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2.5">자주 묻는 질문</h2>
          </div>
          <div className="mt-10 reveal">
            <FaqAccordion items={faq} />
          </div>
        </div>
      </section>

      {/* ===== 최종 CTA ===== */}
      <section className="bg-dark text-on-dark py-20 md:py-28">
        <div className="container-x text-center reveal">
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
            우리 집의 첫 바탕,
            <br />
            제대로 시작해 볼까요
          </h2>
          <p className="text-on-dark-sub mt-5 max-w-md mx-auto">
            {regions.join(" · ")} 시공 가능. <br className="sm:hidden" />
            가격부터 확인하고, 편하게 상담하세요.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link href="/estimate" className="btn btn-accent !px-8 text-base">
              간편견적 받기 →
            </Link>
            <a href={telHref(site.phone)} className="btn btn-ghost-light !px-8 text-base">
              전화 상담 {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
