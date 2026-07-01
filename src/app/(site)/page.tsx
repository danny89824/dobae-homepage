import Link from "next/link";
import Image from "next/image";
import FaqAccordion from "@/components/FaqAccordion";
import PortfolioSlider from "@/components/PortfolioSlider";
import RichText from "@/components/RichText";
import TrustStats from "@/components/TrustStats";
import { FaqJsonLd } from "@/components/JsonLd";
import { getContent } from "@/lib/content-store";
import { telHref } from "@/lib/content-types";

export default async function Home() {
  const c = await getContent();
  const { hero, site, trust, regions, cases, process, faq, standard, homeHeads, homeCta } = c;

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={hero.image}
            alt="정성껏 도배를 마친 따뜻한 거실"
            fill
            priority
            sizes="100vw"
            className="object-cover kenburns"
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
          <RichText html={hero.sub} className="reveal reveal-delay-2 mt-5 text-lg md:text-xl text-white/85 max-w-xl" />
          <div className="reveal reveal-delay-3 mt-8 flex flex-wrap gap-3">
            <Link href="/estimate" className="btn btn-accent !px-7 text-base">
              간편견적 받기 →
            </Link>
            <Link href="/finder" className="btn btn-ghost-light !px-7 text-base">
              도배지 찾기
            </Link>
          </div>

          <TrustStats items={trust} />
        </div>
      </section>

      {/* ===== STANDARD (dark) ===== */}
      <section className="bg-dark text-on-dark py-20 md:py-28">
        <div className="container-x">
          <div className="max-w-2xl reveal">
            <p className="eyebrow !text-gold">{standard.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 leading-tight whitespace-pre-line">
              {standard.heading}
            </h2>
            <p className="text-on-dark-sub mt-4 text-[1.05rem]">{standard.sub}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-12">
            {standard.pillars.map((b, i) => (
              <div
                key={b.no}
                className={`rounded-2xl border border-white/12 bg-white/[0.03] p-7 md:p-8 reveal reveal-delay-${(i % 3) + 1}`}
              >
                <span className="num-label text-gold/80 text-sm font-semibold">{b.no}</span>
                <h3 className="text-xl font-bold mt-3">{b.title}</h3>
                <RichText html={b.desc} className="text-on-dark-sub mt-3 leading-relaxed text-[0.95rem]" />
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
              <p className="eyebrow num-label">{homeHeads.portfolio.eyebrow}</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-2.5">{homeHeads.portfolio.heading}</h2>
              <p className="text-sub mt-3 max-w-lg">{homeHeads.portfolio.sub}</p>
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
            <p className="eyebrow">{homeCta.finder.eyebrow}</p>
            <h3 className="text-2xl md:text-3xl font-bold mt-3 text-accent-ink whitespace-pre-line">
              {homeCta.finder.title}
            </h3>
            <p className="text-accent-ink/80 mt-3 max-w-xs">{homeCta.finder.sub}</p>
            <span className="inline-flex items-center gap-1 mt-6 font-semibold text-accent-ink group-hover:gap-2 transition-all">
              {homeCta.finder.cta}
            </span>
            <span className="absolute -right-6 -bottom-6 text-[8rem] opacity-10 select-none">🎨</span>
          </Link>

          <Link
            href="/estimate"
            className="group relative rounded-3xl bg-dark text-on-dark p-8 md:p-10 overflow-hidden reveal reveal-delay-1"
          >
            <p className="eyebrow !text-gold">{homeCta.estimate.eyebrow}</p>
            <h3 className="text-2xl md:text-3xl font-bold mt-3 whitespace-pre-line">
              {homeCta.estimate.title}
            </h3>
            <p className="text-on-dark-sub mt-3 max-w-xs">{homeCta.estimate.sub}</p>
            <span className="inline-flex items-center gap-1 mt-6 font-semibold group-hover:gap-2 transition-all">
              {homeCta.estimate.cta}
            </span>
            <span className="absolute -right-4 -bottom-8 text-[8rem] opacity-10 select-none">💰</span>
          </Link>
        </div>
      </section>

      {/* ===== 프로세스 ===== */}
      <section className="bg-soft py-20 md:py-28">
        <div className="container-x">
          <div className="max-w-2xl reveal">
            <p className="eyebrow num-label">{homeHeads.process.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2.5">{homeHeads.process.heading}</h2>
            <p className="text-sub mt-3">{homeHeads.process.sub}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {process.map((p, i) => (
              <div key={p.no} className={`rounded-2xl bg-paper border border-line p-6 reveal reveal-delay-${(i % 3) + 1}`}>
                <span className="num-label text-accent font-extrabold text-2xl">{p.no}</span>
                <h3 className="font-bold text-lg mt-2">{p.title}</h3>
                <RichText html={p.desc} className="text-sub text-sm mt-2 leading-relaxed" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 md:py-28">
        <div className="container-x max-w-3xl">
          <div className="text-center reveal">
            <p className="eyebrow num-label">{homeHeads.faq.eyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2.5">{homeHeads.faq.heading}</h2>
          </div>
          <div className="mt-10 reveal">
            <FaqAccordion items={faq} />
          </div>
        </div>
      </section>

      <FaqJsonLd faq={faq} />

      {/* ===== 최종 CTA ===== */}
      <section className="bg-dark text-on-dark py-20 md:py-28">
        <div className="container-x text-center reveal">
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight whitespace-pre-line">
            {homeCta.finalHeading}
          </h2>
          <p className="text-on-dark-sub mt-5 max-w-md mx-auto">
            {regions.join(" · ")} 시공 가능. <br className="sm:hidden" />
            {homeCta.finalSub}
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
