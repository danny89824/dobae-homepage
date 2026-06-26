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

// ── 섹션 카피(제목/문구) 편집용 ──────────────────────────────
export interface SectionHead {
  eyebrow: string;
  heading: string;
  sub: string;
}
export interface Pillar {
  no: string;
  title: string;
  desc: string;
}
export interface CtaCard {
  eyebrow: string;
  title: string;
  sub: string;
  cta: string;
}
export interface Strength {
  title: string;
  desc: string;
}

// 홈 "Our Standard" 다크 섹션
export interface StandardSection {
  eyebrow: string;
  heading: string;
  sub: string;
  pillars: Pillar[];
}
// 홈 섹션 제목들
export interface HomeHeads {
  portfolio: SectionHead;
  process: SectionHead;
  reviews: SectionHead;
  faq: SectionHead;
}
// 홈 전환 동선·최종 CTA
export interface HomeCta {
  finder: CtaCard;
  estimate: CtaCard;
  finalHeading: string;
  finalSub: string;
}
// 서브페이지 상단 배너
export interface PageHeads {
  portfolio: SectionHead;
  guide: SectionHead;
  about: SectionHead;
}
// 도배 안내 페이지 섹션
export interface GuideContent {
  wallpaperHead: SectionHead;
  processHead: SectionHead;
  promoTitle: string;
  promoSub: string;
}
// 회사소개 페이지
export interface AboutContent {
  whyHead: SectionHead;
  strengths: Strength[];
  contactHead: SectionHead;
  contactNote: string;
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
  // ── 신규: 섹션 카피 전면 편집 ──
  standard: StandardSection;
  homeHeads: HomeHeads;
  homeCta: HomeCta;
  pageHeads: PageHeads;
  guide: GuideContent;
  about: AboutContent;
}

// 전화번호 → tel: href
export const telHref = (phone: string) => `tel:${phone.replace(/[^0-9]/g, "")}`;
