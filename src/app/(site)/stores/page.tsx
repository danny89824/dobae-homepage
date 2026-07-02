import type { Metadata } from "next";
import { getContent } from "@/lib/content-store";
import { telHref } from "@/lib/content-types";
import { STORES } from "@/lib/site";

export const metadata: Metadata = {
  title: "매장 위치 · 방문 상담 — 도배청년단",
  description:
    "송파·강서 지점에서 도배지 샘플북을 직접 보고 상담하세요. 화면 속 샘플과 실제 벽지는 다릅니다. 오시는 길과 방문 상담 안내.",
  robots: { index: true, follow: true },
};

const naverMap = (addr: string) => `https://map.naver.com/p/search/${encodeURIComponent(addr)}`;
const kakaoMap = (addr: string) => `https://map.kakao.com/?q=${encodeURIComponent(addr)}`;

export default async function StoresPage() {
  const { site } = await getContent();

  return (
    <>
      {/* ===== 배너 ===== */}
      <section className="pt-28 md:pt-32 pb-10 bg-soft border-b border-line">
        <div className="container-x">
          <p className="eyebrow num-label">Visit</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2 tracking-tight leading-tight">
            직접 보고 고르는 게<br className="hidden sm:block" /> 가장 확실합니다
          </h1>
          <p className="text-sub mt-4 max-w-2xl text-[1.05rem] leading-relaxed">
            화면 속 샘플과 실제 벽지는 다릅니다. 가까운 지점에 오시면 도배지 샘플북을 직접 보고,
            우리 집에 맞는 선택을 함께 찾아 드립니다.
          </p>
        </div>
      </section>

      {/* ===== 지점 목록 ===== */}
      <section className="py-14 md:py-20">
        <div className="container-x">
          <div className="grid md:grid-cols-3 gap-4">
            {STORES.map((s) => {
              const preparing = s.status === "preparing";
              return (
                <div
                  key={s.key}
                  className={`rounded-2xl border border-line p-6 md:p-7 flex flex-col ${
                    preparing ? "bg-soft" : "bg-paper"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold">{s.name}</h2>
                    {preparing ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                        오픈 준비중
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-soft text-accent">
                        운영중
                      </span>
                    )}
                  </div>

                  {preparing ? (
                    <p className="text-sub mt-4 flex-1 leading-relaxed">
                      곧 문을 엽니다. 오픈 소식은 카카오채널로 먼저 알려 드릴게요.
                    </p>
                  ) : (
                    <>
                      <p className="text-ink mt-4 leading-relaxed flex-1">{s.address}</p>
                      {s.hours && <p className="text-sub text-sm mt-2">{s.hours} · 방문 상담 예약제</p>}
                      <div className="mt-5 flex flex-wrap gap-2">
                        <a
                          href={naverMap(s.address)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline !py-2 !px-3.5 text-sm"
                        >
                          네이버 지도
                        </a>
                        <a
                          href={kakaoMap(s.address)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline !py-2 !px-3.5 text-sm"
                        >
                          카카오맵
                        </a>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 방문 상담 CTA ===== */}
      <section className="pb-20 md:pb-28">
        <div className="container-x">
          <div className="rounded-3xl bg-dark text-on-dark p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold">방문 전에 미리 연락 주세요</h2>
            <p className="text-on-dark-sub mt-3 max-w-lg mx-auto leading-relaxed">
              방문 상담은 예약제로 운영됩니다. 원하는 시간에 맞춰 샘플북과 상담을 준비해 두겠습니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <a
                href={site.kakaoChannel}
                target="_blank"
                rel="noreferrer"
                className="btn btn-accent !px-7"
              >
                카카오채널 상담
              </a>
              <a href={telHref(site.phone)} className="btn btn-ghost-light !px-7">
                전화 {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
