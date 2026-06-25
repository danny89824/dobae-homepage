"use client";
import { useState } from "react";
import type { Faq } from "@/lib/content-types";

export default function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-[1.05rem] md:text-lg">{f.q}</span>
              <span
                className={`shrink-0 w-7 h-7 rounded-full border border-line flex items-center justify-center transition-transform duration-300 ${
                  isOpen ? "rotate-45 bg-ink text-white border-ink" : "text-sub"
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-sub leading-relaxed pb-6 pr-10">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
