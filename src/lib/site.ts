// 도배청년단 사이트 공통 설정 (IA·연락처·신뢰지표)
// 실데이터는 dobaeym.com / 메모리 기반. 미확보 항목은 TODO 표기.

export const SITE = {
  name: "도배청년단",
  legal: "라이프리터치",
  slogan: "도배의 바른 기준, 도배청년단",
  sub: "차분하고 따뜻하게, 우리 집의 첫 바탕을 제대로.",
  phone: "010-2319-9442",
  phoneHref: "tel:01023199442",
  kakaoChannel: "https://pf.kakao.com/", // TODO: 실제 카카오채널 URL
  copyrightYear: 2025,
  // 미확보(사이트에 없음): 주소·사업자번호·대표자명·SNS URL
} as const;

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

// 신뢰 지표 (실데이터)
export const TRUST = [
  { value: "2,000건+", label: "누적 시공 (2021~)" },
  { value: "99.8%", label: "고객 만족도" },
  { value: "1년", label: "무상 A/S 보증" },
  { value: "0%", label: "하도급 없는 직접 고용" },
];

// 시공 권역 (실데이터)
export const REGIONS = ["서울 마포", "서울 강남", "서울 송파", "경기 성남", "경기 용인"];
