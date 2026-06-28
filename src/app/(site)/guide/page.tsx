import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/content-store";
import RichText from "@/components/RichText";

export const metadata: Metadata = {
  title: "도배 안내 — 도배지 종류와 시공 과정",
  description: "합지·실크·광폭합지의 차이와 추천 용도, 간편견적부터 1년 무상 A/S까지 도배청년단의 6단계 시공 과정 안내.",
};

export default async function GuidePage() {
  const { paperTypes: PAPER_TYPES, process: PROCESS, pageHeads, guide } = await getContent();
  return (
    <>
      <section className="pt-28 md:pt-32 pb-10 bg-soft border-b border-line">
        <div className="container-x">
          <p className="eyebrow num-label">{pageHeads.guide.eyebrow}</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2 tracking-tight">{pageHeads.guide.heading}</h1>
          <p className="text-sub mt-3 max-w-xl text-[1.05rem]">{pageHeads.guide.sub}</p>
        </div>
      </section>

      {/* 도배지 종류 */}
      <section className="py-16 md:py-24">
        <div className="container-x">
          <div className="max-w-2xl reveal">
            <p className="eyebrow num-label">{guide.wallpaperHead.eyebrow}</p>
            <h2 className="text-2xl md:text-3xl font-bold mt-2.5">{guide.wallpaperHead.heading}</h2>
            <p className="text-sub mt-3">{guide.wallpaperHead.sub}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {PAPER_TYPES.map((p) => (
              <div key={p.key} className="rounded-2xl border border-line bg-paper p-7 reveal">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-soft text-accent-ink">
                  {p.badge}
                </span>
                <h3 className="text-xl font-bold mt-4">{p.name}</h3>
                <RichText html={p.feat} className="text-sub text-sm mt-2.5 leading-relaxed" />
                <div className="mt-4 pt-4 border-t border-line space-y-1.5">
                  <p className="text-sm"><b className="text-ink">추천</b> <span className="text-sub">{p.best}</span></p>
                  <p className="text-sm"><b className="text-ink">가격대</b> <span className="text-accent num-label">{p.price}</span></p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-accent-soft border border-accent/20 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 reveal">
            <div>
              <p className="font-bold text-lg text-accent-ink">{guide.promoTitle}</p>
              <p className="text-accent-ink/80 text-sm mt-1">{guide.promoSub}</p>
            </div>
            <Link href="/finder" className="btn btn-accent shrink-0">도배지 찾기 →</Link>
          </div>
        </div>
      </section>

      {/* 시공 과정 */}
      <section className="bg-soft py-16 md:py-24">
        <div className="container-x">
          <div className="max-w-2xl reveal">
            <p className="eyebrow num-label">{guide.processHead.eyebrow}</p>
            <h2 className="text-2xl md:text-3xl font-bold mt-2.5">{guide.processHead.heading}</h2>
            <p className="text-sub mt-3">{guide.processHead.sub}</p>
          </div>

          <ol className="mt-10 grid gap-4">
            {PROCESS.map((p) => (
              <li key={p.no} className="flex gap-5 rounded-2xl bg-paper border border-line p-6 reveal">
                <span className="num-label text-accent font-extrabold text-2xl shrink-0 w-10">{p.no}</span>
                <div>
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <RichText html={p.desc} className="text-sub mt-1.5 leading-relaxed" />
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 text-center">
            <Link href="/estimate" className="btn btn-primary !px-8">간편견적부터 시작하기 →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
