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
  img: string;          // 대표(커버) 사진 — images[0]와 동기화, 하위호환용
  images?: string[];    // 사례별 사진 여러 장 (첫 장이 대표)
  tag: string;
}

// 사례의 사진 목록 — images가 있으면 그것, 없으면 img 단일로 폴백(구버전 호환)
export const caseImages = (c: Pick<CaseItem, "img" | "images">): string[] =>
  (c.images && c.images.length ? c.images : c.img ? [c.img] : []).filter(Boolean);
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

// 사이트 전역 색상(섹션 배경/포인트) — CSS 변수로 주입돼 전 페이지에 반영
export interface ThemeColors {
  paper: string;  // 페이지 기본 배경
  soft: string;   // 밝은 섹션 배경 (프로세스·후기 등)
  dark: string;   // 어두운 섹션 배경 (기준·최종CTA·푸터)
  accent: string; // 포인트 색 (버튼·강조·링크)
}

export interface SiteContent {
  theme: ThemeColors;
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
