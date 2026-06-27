"use client";
import { useState } from "react";
import { caseImages, type CaseItem } from "@/lib/content-types";

// 시공사례 카드 — 사진 여러 장이면 대표 사진 + 썸네일 전환 갤러리
export default function CaseCard({ item }: { item: CaseItem }) {
  const imgs = caseImages(item);
  const [idx, setIdx] = useState(0);
  const main = imgs[idx] ?? imgs[0];
  const many = imgs.length > 1;

  return (
    <article className="reveal group">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-soft">
        {main && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={main}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {item.tag && (
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-ink">
            {item.tag}
          </span>
        )}
        {many && (
          <span className="absolute bottom-3 right-3 text-xs font-semibold px-2 py-1 rounded-full bg-black/55 text-white num-label">
            {idx + 1} / {imgs.length}
          </span>
        )}
      </div>

      {many && (
        <div className="mt-2.5 flex gap-2 overflow-x-auto no-scrollbar">
          {imgs.map((u, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`${i + 1}번째 사진 보기`}
              className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                i === idx ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="mt-3.5">
        <h2 className="font-bold text-lg leading-snug">{item.title}</h2>
        <p className="text-sm text-sub mt-1.5">
          {item.space} · {item.wallpaper} · {item.region}
        </p>
      </div>
    </article>
  );
}
