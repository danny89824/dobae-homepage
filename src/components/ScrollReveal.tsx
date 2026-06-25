"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// .reveal 요소를 뷰포트 진입 시 .is-in 으로 전환 (전역 1회 마운트)
export default function ScrollReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)")
    );
    if (!("IntersectionObserver" in window) || els.length === 0) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
