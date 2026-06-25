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
  const started = useRef(false);

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

    const run = () => {
      if (started.current) return;
      started.current = true;
      const dur = 1400;
      let raf = 0;
      let t0 = 0;
      const tick = (t: number) => {
        if (!t0) t0 = t;
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        setN(target * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    };

    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {prefix}
      {target == null ? suffix : format(n, decimals)}
      {target == null ? "" : suffix}
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
