"use client";
import { useEffect, useRef, useState } from "react";
import type { TrustItem } from "@/lib/content-types";

// "2,000건+" / "99.8%" / "1년" / "0%" 처럼 접두/접미가 붙은 값을
// 숫자 부분만 0→목표로 카운트업하고 나머지는 그대로 유지한다.
function parse(value: string) {
  const m = value.match(/^(\D*)([\d.,]+)(.*)$/);
  if (!m) return { prefix: "", target: null as number | null, suffix: value, decimals: 0 };
  const numStr = m[2].replace(/,/g, "");
  const dot = numStr.indexOf(".");
  return {
    prefix: m[1],
    target: parseFloat(numStr),
    suffix: m[3],
    decimals: dot >= 0 ? numStr.length - dot - 1 : 0,
  };
}

function format(n: number, decimals: number) {
  return n.toLocaleString("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function StatValue({ value }: { value: string }) {
  const { prefix, target, suffix, decimals } = parse(value);
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (target == null) return;
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(target);
      return;
    }

    let raf = 0;
    let cancelled = false;
    const animate = () => {
      const dur = 1400;
      let t0 = 0;
      const tick = (t: number) => {
        if (cancelled) return;
        if (!t0) t0 = t;
        const p = Math.min((t - t0) / dur, 1);
        setN(target * (1 - Math.pow(1 - p, 3))); // easeOutCubic
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      animate();
      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
      };
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            io.unobserve(el);
            animate();
            break;
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [target]);

  if (target == null) {
    return <span ref={ref}>{value}</span>;
  }

  const animated = `${prefix}${format(n, decimals)}${suffix}`;
  const finalStr = `${prefix}${format(target, decimals)}${suffix}`;

  // 최종값으로 너비를 미리 예약(보이지 않는 sizer) + 카운트 숫자를 그 위에 우측정렬로 겹쳐
  // 표시 → 카운트업 중 숫자 너비 변화로 인한 레이아웃 흔들림(특히 모바일 줄바꿈)을 방지.
  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap tabular-nums" aria-label={finalStr}>
      <span className="invisible" aria-hidden>{finalStr}</span>
      <span className="absolute inset-0 text-right" aria-hidden>{animated}</span>
    </span>
  );
}

export default function TrustStats({ items }: { items: TrustItem[] }) {
  return (
    <div className="reveal reveal-delay-4 mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/20 pt-6 max-w-2xl">
      {items.map((t) => (
        <div key={t.label} className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-extrabold num-label">
            <StatValue value={t.value} />
          </span>
          <span className="text-xs md:text-sm text-white/70">{t.label}</span>
        </div>
      ))}
    </div>
  );
}
