// 백오피스에서 편집 가능한 사이트 콘텐츠 모델 (SSOT)
// 저장: Vercel Blob (content.json) · 미설정 시 DEFAULT_CONTENT 폴백

export interface TrustItem {
  value: string;
  label: string;
}
export interface CaseItem {
  no: string;
  title: string;
  space: string;
  wallpaper: string;
  region: string;
  img: string;
  tag: string;
}
export interface ProcessStep {
  no: string;
  title: string;
  desc: string;
}
export interface Faq {
  q: string;
  a: string;
}
export interface ReviewItem {
  name: string;     // 고객 표기 (예: 송파 김○○)
  space: string;    // 공간 (예: 아파트 32평 · 거실)
  rating: number;   // 1~5
  body: string;     // 후기 본문
}
export interface PaperType {
  key: string;
  name: string;
  badge: string;
  feat: string;
  best: string;
  price: string;
}
export interface SiteInfo {
  slogan: string;
  sub: string;
  phone: string;
  kakaoChannel: string;
  legal: string;
  copyrightYear: number;
}
export interface HeroContent {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  sub: string;
  image: string;
}

export interface SiteContent {
  site: SiteInfo;
  hero: HeroContent;
  trust: TrustItem[];
  regions: string[];
  cases: CaseItem[];
  process: ProcessStep[];
  reviews: ReviewItem[];
  faq: Faq[];
  paperTypes: PaperType[];
}

// 전화번호 → tel: href
export const telHref = (phone: string) => `tel:${phone.replace(/[^0-9]/g, "")}`;
