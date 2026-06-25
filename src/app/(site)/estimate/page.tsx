import { Suspense } from "react";
import type { Metadata } from "next";
import EstimateWizard from "@/components/EstimateWizard";
import { getContent } from "@/lib/content-store";

export const metadata: Metadata = {
  title: "간편견적 — 전화 없이 가격부터",
  description: "공간과 평형, 벽지만 고르면 예상 도배 금액을 바로 확인하세요. 아파트·빌라·오피스텔 합지/실크 견적.",
};

export default async function EstimatePage() {
  const { trust: TRUST, site } = await getContent();
  return (
    <>
      <section className="pt-28 md:pt-32 pb-10 bg-soft border-b border-line">
        <div className="container-x">
          <p className="eyebrow num-label">Estimate</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2 tracking-tight">
            전화 없이, 가격부터 확인하세요
          </h1>
          <p className="text-sub mt-3 max-w-xl text-[1.05rem]">
            몇 번의 선택만으로 예상 도배 금액을 바로 보여드립니다. <br className="hidden sm:block" />
            가격을 먼저 투명하게 공개하는 것이 도배청년단의 기준입니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {TRUST.map((t) => (
              <div key={t.label} className="flex items-baseline gap-1.5">
                <span className="font-bold num-label text-accent">{t.value}</span>
                <span className="text-xs text-sub">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-x max-w-3xl">
          <Suspense fallback={<div className="h-64 rounded-2xl bg-soft animate-pulse" />}>
            <EstimateWizard phone={site.phone} kakao={site.kakaoChannel} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
