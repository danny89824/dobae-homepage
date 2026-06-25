// ============================================================
// 도배청년단 가견적 가격엔진 (TypeScript 이식)
// 출처: 위태준 대표 가격시트 → dobae/price-model.json / estimate/index.html
// 가격 로직은 원본 그대로 보존. 단위=만원, 범위 ±10%, 5만원 라운딩, VAT 10%.
// ============================================================

export type Wallpaper = "hapji" | "silk";
export type Scope = "wallOnly" | "full";
export type Grade = "기획" | "일반" | "프리미엄";

type PartialPrice = { wallOnly: number; full: number };
type SilkPrice = { basic: number; fullInterior: number };

export interface SizeData {
  label: string;
  desc?: string;
  sqm?: string;
  hapjiBase?: number;
  silk?: Record<Grade, SilkPrice>;
  partial?: { hapji: PartialPrice; silk: PartialPrice };
  consult?: boolean;
}
export interface SpaceData {
  label: string;
  emoji: string;
  consult?: boolean;
  sizes?: Record<string, SizeData>;
}

export const PRICE: {
  modifiers: {
    hapji: { key: string; add: number }[];
    silk: { key: string; add?: number; absolute?: boolean }[];
  };
  spaces: Record<string, SpaceData>;
} = {
  modifiers: {
    hapji: [
      { key: "deotbang", add: 0 },
      { key: "removeBase", add: 27 },
      { key: "fullFloat", add: 55 },
    ],
    silk: [{ key: "basic" }, { key: "ceilingFloat", add: 30 }, { key: "fullInterior", absolute: true }],
  },
  spaces: {
    apartment: {
      label: "아파트",
      emoji: "🏢",
      sizes: {
        "15": { label: "15평형 내외", desc: "소형 평수", sqm: "전용 약 40㎡", hapjiBase: 100, silk: { 기획: { basic: 145, fullInterior: 215 }, 일반: { basic: 150, fullInterior: 235 }, 프리미엄: { basic: 180, fullInterior: 260 } } },
        "24": { label: "24평형 내외", desc: "방 3개 · 화장실 1~2개 구조", sqm: "전용 약 59㎡", hapjiBase: 115, silk: { 기획: { basic: 175, fullInterior: 260 }, 일반: { basic: 195, fullInterior: 285 }, 프리미엄: { basic: 230, fullInterior: 315 } } },
        "32": { label: "32평형 내외", desc: "가장 대중적인 국민 평수", sqm: "전용 약 84㎡", hapjiBase: 160, silk: { 기획: { basic: 225, fullInterior: 345 }, 일반: { basic: 255, fullInterior: 380 }, 프리미엄: { basic: 295, fullInterior: 420 } } },
        "42": { label: "42평형 내외", desc: "대형 평수 구조", sqm: "전용 약 114㎡", hapjiBase: 245, silk: { 기획: { basic: 310, fullInterior: 445 }, 일반: { basic: 355, fullInterior: 485 }, 프리미엄: { basic: 410, fullInterior: 540 } } },
        large: { label: "대형 평수 / 그 이상", consult: true },
      },
    },
    villa: {
      label: "빌라",
      emoji: "🏘️",
      sizes: {
        studio: { label: "원룸 · 소형 공간", desc: "10평 미만 · 부분시공", sqm: "전용 약 25㎡ 미만", partial: { hapji: { wallOnly: 35, full: 55 }, silk: { wallOnly: 50, full: 70 } } },
        "18": { label: "18평형 내외", desc: "소형 아파트 · 투룸 빌라 등", sqm: "전용 약 46㎡", hapjiBase: 115, silk: { 기획: { basic: 175, fullInterior: 260 }, 일반: { basic: 195, fullInterior: 285 }, 프리미엄: { basic: 230, fullInterior: 315 } } },
        "24": { label: "24평형 내외", desc: "방 3개 구조", sqm: "전용 약 59㎡", hapjiBase: 160, silk: { 기획: { basic: 225, fullInterior: 345 }, 일반: { basic: 255, fullInterior: 380 }, 프리미엄: { basic: 295, fullInterior: 420 } } },
        "32": { label: "32평형 내외", desc: "대형 빌라", sqm: "전용 약 84㎡", hapjiBase: 245, silk: { 기획: { basic: 310, fullInterior: 445 }, 일반: { basic: 355, fullInterior: 485 }, 프리미엄: { basic: 410, fullInterior: 540 } } },
        "42plus": { label: "42평형 그 이상", consult: true },
      },
    },
    officetel: {
      label: "오피스텔",
      emoji: "🏬",
      sizes: {
        studio7: { label: "7평형 원룸", desc: "부분시공", sqm: "전용 약 17㎡", partial: { hapji: { wallOnly: 30, full: 50 }, silk: { wallOnly: 45, full: 65 } } },
        tworoom10: { label: "10평대 투룸", desc: "투룸 구조", sqm: "전용 약 26㎡~", hapjiBase: 160, silk: { 기획: { basic: 230, fullInterior: 345 }, 일반: { basic: 260, fullInterior: 380 }, 프리미엄: { basic: 295, fullInterior: 420 } } },
        more: { label: "그 이상", consult: true },
      },
    },
    commercial: { label: "상가 및 그 외 공간", emoji: "🏪", consult: true },
  },
};

export const CONFIG = { rangePct: 0.1, roundTo: 5, vat: 0.1 };

// 설명(특징·추천) — 대표 기획 PDF 반영
export const META = {
  wallpaper: {
    hapji: { emoji: "📄", name: "합지 벽지", pill: "종이벽지", feat: "종이로 이루어진 기본 벽지", rec: "가성비 위주 · 임대용 공간에 적합" },
    silk: { emoji: "✨", name: "실크 벽지", pill: "고급벽지", feat: "표면 코팅으로 오염에 강하고 관리가 편함", rec: "직접 거주하실 공간에 강력 추천" },
  },
  hapjiMethod: {
    deotbang: { name: "기본 덧방 시공", pill: "비용 절감형", feat: "현재 벽지 위에 새 벽지를 그대로 시공 (기본 제공)", rec: "최소 비용으로 빠르게 분위기를 바꾸고 싶을 때" },
    removeBase: { name: "벽지 제거 후 밑작업", pill: "", feat: "기존 벽지를 제거하고 벽면 밑작업 진행", rec: "잘 보이는 벽면의 마감 만족도를 높이고 싶을 때" },
    fullFloat: { name: "전체 띄움 시공", pill: "고급 마감형", feat: "천장 포함 공간 전체 초배(띄움) 작업", rec: "합지 중 가장 매끄럽고 완벽한 마감을 원할 때" },
  },
  grade: {
    기획: { pill: "비용 절감형", feat: "깔끔한 대중적 벽지 (색상 선택 제한)", rec: "임대용 · 합리적 절감이 필요할 때", brand: "예: 하이브리드" },
    일반: { pill: "", feat: "다양한 컬러와 패턴 보유", rec: "취향에 맞는 디자인을 원할 때", brand: "예: 로젠스 · 베스트" },
    프리미엄: { pill: "하이엔드", feat: "생활기스에 강한 내구성 · 도톰한 고급 질감", rec: "오래도록 깊이 있는 마감을 원할 때", brand: "예: 디아망 · 프리오 · 파셀로" },
  },
  silkMethod: {
    basic: { name: "기본 실크 시공", pill: "", feat: "기본 실크 도배 공정", note: "천장 이음매에 미세 자국·들뜸이 생길 수 있어요" },
    ceilingFloat: { name: "천장 띄움시공 포함", pill: "균일 마감", feat: "벽+천장 띄움시공 및 정밀 밑작업", rec: "사계절 매끄러운 천장 마감을 원할 때" },
    fullInterior: { name: "전체 인테리어 공사", pill: "풀 리모델링", feat: "천장 전체 띄움 + 벽면 퍼티(핸디코트)", rec: "몰딩·문·샷시 교체 시 필수" },
  },
} as const;

export const WP_LABEL: Record<Wallpaper, string> = { hapji: "합지", silk: "실크" };
export const SCOPE_LABEL: Record<Scope, string> = { wallOnly: "벽면만", full: "전체(벽+천장)" };

// ============================================================
// 상태 / 플로우
// ============================================================
export interface EstimateState {
  space?: string;
  size?: string;
  wallpaper?: Wallpaper;
  grade?: Grade;
  method?: string;
  scope?: Scope;
}

export type Step =
  | "space" | "size" | "wallpaper" | "grade"
  | "method_hapji" | "method_silk" | "scope"
  | "result" | "consult";

export function nextStep(S: EstimateState): Step {
  if (!S.space) return "space";
  const sp = PRICE.spaces[S.space];
  if (sp.consult) return "consult";
  if (!S.size) return "size";
  const sz = sp.sizes![S.size];
  if (sz.consult) return "consult";
  if (sz.partial) {
    if (!S.wallpaper) return "wallpaper";
    if (!S.scope) return "scope";
    return "result";
  }
  if (!S.wallpaper) return "wallpaper";
  if (S.wallpaper === "hapji") {
    if (!S.method) return "method_hapji";
    return "result";
  }
  if (!S.grade) return "grade";
  if (!S.method) return "method_silk";
  return "result";
}

export const STEP_IDX: Record<string, number> = {
  space: 1, size: 2, wallpaper: 3, grade: 4, method_silk: 5, method_hapji: 4, scope: 4,
};

export function totalSteps(S: EstimateState): number {
  const sp = S.space ? PRICE.spaces[S.space] : null;
  const sz = sp && S.size && sp.sizes ? sp.sizes[S.size] : null;
  if (sz && sz.partial) return 4;
  if (S.wallpaper === "silk") return 5;
  return 4;
}

export function progressPct(S: EstimateState, step: Step): number {
  if (step === "result" || step === "consult") return 100;
  let done = 0;
  if (S.space) done++;
  if (S.size) done++;
  if (S.wallpaper) done++;
  if (S.grade) done++;
  if (S.method || S.scope) done++;
  return Math.min(95, Math.round((done / totalSteps(S)) * 100));
}

// ============================================================
// 계산
// ============================================================
export interface Quote {
  p: number;        // 공급가 (VAT 별도)
  min: number;
  max: number;
  vatP: number;     // VAT 포함가
}

export function compute(S: EstimateState): Quote {
  const sz = PRICE.spaces[S.space!].sizes![S.size!];
  let p = 0;
  if (sz.partial) {
    p = sz.partial[S.wallpaper!][S.scope!];
  } else if (S.wallpaper === "hapji") {
    const m = PRICE.modifiers.hapji.find((o) => o.key === S.method);
    p = (sz.hapjiBase || 0) + (m?.add || 0);
  } else {
    const g = sz.silk![S.grade!];
    if (S.method === "fullInterior") p = g.fullInterior;
    else if (S.method === "ceilingFloat") p = g.basic + 30;
    else p = g.basic;
  }
  const r = CONFIG.roundTo;
  return {
    p,
    min: Math.round((p * (1 - CONFIG.rangePct)) / r) * r,
    max: Math.round((p * (1 + CONFIG.rangePct)) / r) * r,
    vatP: Math.round(p * (1 + CONFIG.vat)),
  };
}

export function methodLabel(S: EstimateState): string {
  const sz = PRICE.spaces[S.space!].sizes![S.size!];
  if (sz.partial) return SCOPE_LABEL[S.scope!];
  if (S.wallpaper === "hapji") return META.hapjiMethod[S.method as keyof typeof META.hapjiMethod].name;
  return META.silkMethod[S.method as keyof typeof META.silkMethod].name;
}
