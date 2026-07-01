// 사이트 구조(IA) 상수 — 코드 고정. 텍스트/연락처/콘텐츠는 백오피스(content-store)에서 관리.

export type NavItem = {
  label: string;
  en: string;
  href: string;
};

// IA — 0630 회의 반영: 회사소개(브랜드스토리) → 시공사례 → 도배지찾기 → 도배안내, 간편견적은 우측 액션
export const NAV: NavItem[] = [
  { label: "회사소개", en: "About", href: "/about" },
  { label: "시공사례", en: "Portfolio", href: "/portfolio" },
  { label: "도배지 찾기", en: "Finder", href: "/finder" },
  { label: "도배 안내", en: "Guide", href: "/guide" },
];

// 헤더 우측 액션바 — 회의 반영: 간편견적만 상시 노출(도배지찾기는 메인 메뉴에 있음)
export const ACTIONS = [
  { label: "간편견적", href: "/estimate", variant: "accent" as const },
];
