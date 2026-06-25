// 사이트 구조(IA) 상수 — 코드 고정. 텍스트/연락처/콘텐츠는 백오피스(content-store)에서 관리.

export type NavItem = {
  label: string;
  en: string;
  href: string;
};

// IA — 도배에 맞게 축소
export const NAV: NavItem[] = [
  { label: "시공사례", en: "Portfolio", href: "/portfolio" },
  { label: "도배 안내", en: "Guide", href: "/guide" },
  { label: "도배지 찾기", en: "Finder", href: "/finder" },
  { label: "간편견적", en: "Estimate", href: "/estimate" },
  { label: "회사소개", en: "About", href: "/about" },
];

// 헤더 우측 액션바 (heimlab식 전환 동선 상시 노출)
export const ACTIONS = [
  { label: "도배지 찾기", href: "/finder", variant: "outline" as const },
  { label: "간편견적", href: "/estimate", variant: "accent" as const },
];
