"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { CaseItem } from "@/lib/content-types";

const AUTOPLAY_MS = 4000; // 자동 슬라이드 간격
const RESUME_MS = 6000; // 수동 조작 후 자동재생 재개 대기

export default function PortfolioSlider({ items }: { items: CaseItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // 드래그 상태
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });

  // 자동 슬라이드 상태
  const paused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const scrollByCards = useCallback((dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? card.clientWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  // 자동 슬라이드: 4초마다 다음, 끝이면 처음으로 루프
  useEffect(() => {
    if (items.length <= 1) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (reduce?.matches) return; // 모션 최소화 설정 시 자동재생 안 함

    const tick = () => {
      const el = trackRef.current;
      if (!el || paused.current || document.hidden) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else scrollByCards(1);
    };
    const id = setInterval(tick, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [items.length, scrollByCards]);

  // 수동 조작 후 일정 시간 자동재생 일시정지
  const pauseTemporarily = useCallback(() => {
    paused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      paused.current = false;
    }, RESUME_MS);
  }, []);

  const handleArrow = (dir: 1 | -1) => {
    scrollByCards(dir);
    pauseTemporarily();
  };

  // 포인터 드래그로 스크롤
  const onPointerDown = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!el) return;
    paused.current = true; // 드래그 중 자동재생 정지
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
    pauseTemporarily(); // 드래그 후 잠시 뒤 재개
  };

  return (
    <div
      className="reveal container-x"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      {/* 화살표 (데스크톱) */}
      <div className="flex justify-end gap-2 mb-4">
        <SliderArrow dir="prev" disabled={!canPrev} onClick={() => handleArrow(-1)} />
        <SliderArrow dir="next" disabled={!canNext} onClick={() => handleArrow(1)} />
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
                <Image
                  src={c.img}
                  alt={c.title}
                  fill
                  draggable={false}
                  sizes="(min-width: 640px) 340px, 78vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
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
