import type { ReviewItem } from "@/lib/content-types";

function Stars({ rating }: { rating: number }) {
  const r = Math.max(0, Math.min(5, rating));
  return (
    <span className="inline-flex gap-0.5 text-gold" aria-label={`5점 만점에 ${r}점`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="w-4 h-4"
          fill={i < r ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2 5.06 16.8l.94-5.5-4-3.9 5.53-.8L10 1.6z" />
        </svg>
      ))}
    </span>
  );
}

export default function Reviews({ items }: { items: ReviewItem[] }) {
  if (!items?.length) return null;
  const avg =
    items.reduce((s, r) => s + (r.rating || 0), 0) / items.length;

  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="flex items-end justify-between gap-4 reveal">
          <div>
            <p className="eyebrow num-label">Reviews</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2.5">
              먼저 다녀간 분들의 이야기
            </h2>
            <p className="text-sub mt-3 max-w-lg">
              과장 없이, 받은 그대로. 도배청년단과 함께한 집들의 후기입니다.
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end shrink-0">
            <div className="flex items-center gap-2">
              <Stars rating={Math.round(avg)} />
              <span className="num-label text-xl font-extrabold">{avg.toFixed(1)}</span>
            </div>
            <span className="text-xs text-sub mt-1">고객 후기 {items.length}건 평균</span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r, i) => (
            <figure
              key={`${r.name}-${i}`}
              className={`card-lift rounded-2xl bg-paper border border-line p-6 flex flex-col reveal reveal-delay-${(i % 3) + 1}`}
            >
              <Stars rating={r.rating} />
              <blockquote className="mt-3 text-[0.97rem] leading-relaxed text-ink-2 flex-1">
                “{r.body}”
              </blockquote>
              <figcaption className="mt-5 pt-4 border-t border-line">
                <span className="font-bold">{r.name}</span>
                <span className="block text-sm text-sub mt-0.5">{r.space}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
