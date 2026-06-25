"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CaseItem } from "@/lib/content";

export default function PortfolioSlider({ items }: { items: CaseItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // 드래그 상태
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? card.clientWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // 포인터 드래그로 스크롤
  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startLeft - dx;
  };
  const endDrag = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    drag.current.active = false;
  };

  return (
    <div className="reveal container-x">
      {/* 화살표 (데스크톱) */}
      <div className="flex justify-end gap-2 mb-4">
        <SliderArrow dir="prev" disabled={!canPrev} onClick={() => scrollByCards(-1)} />
        <SliderArrow dir="next" disabled={!canNext} onClick={() => scrollByCards(1)} />
      </div>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none -mx-1 px-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex gap-4 pb-2">
          {items.map((c) => (
            <article
              key={c.no}
              className="snap-start shrink-0 w-[78vw] xs:w-[60vw] sm:w-[340px]"
              onClickCapture={(e) => {
                // 드래그 직후 클릭 무시
                if (drag.current.moved) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-soft group pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  draggable={false}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-ink">
                  {c.tag}
                </span>
              </div>
              <div className="mt-3.5">
                <h3 className="font-bold text-[1.05rem] leading-snug">{c.title}</h3>
                <p className="text-sm text-sub mt-1.5">
                  {c.space} · {c.wallpaper} · {c.region}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <p className="text-xs text-sub mt-3 sm:hidden">← 좌우로 밀어 더 보기 →</p>
    </div>
  );
}

function SliderArrow({
  dir, disabled, onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "이전 사례" : "다음 사례"}
      className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
        disabled
          ? "border-line text-line-2 cursor-not-allowed"
          : "border-line-2 text-ink hover:bg-ink hover:text-white hover:border-ink"
      }`}
    >
      {dir === "prev" ? "←" : "→"}
    </button>
  );
}
