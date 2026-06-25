// ============================================================
// 도배지 찾기 (heimlab '무드 찾기' 변형)
// 객관식 진단 → 추천 도배지(합지/실크·등급·컬러무드) → 간편견적 prefill
// ============================================================
import type { Wallpaper, Grade } from "./price";

export type MoodKey = "warm" | "modern" | "natural" | "bold";

export interface FinderOption {
  label: string;
  desc?: string;
  // 가중치
  silk?: number;        // 실크 성향(+) / 합지 성향(-)
  gradeUp?: number;     // 등급 상향 점수
  mood?: MoodKey;       // 컬러 무드 투표
}

export interface FinderQuestion {
  id: string;
  q: string;
  hint?: string;
  options: FinderOption[];
}

export const QUESTIONS: FinderQuestion[] = [
  {
    id: "who",
    q: "이 공간에서 누가 지내게 되나요?",
    hint: "사용 목적에 따라 적합한 벽지가 달라져요.",
    options: [
      { label: "우리 가족이 오래 거주할 집", desc: "내 집, 장기 거주", silk: 2, gradeUp: 1 },
      { label: "전·월세 등 임대를 줄 공간", desc: "임대용", silk: -2 },
      { label: "잠깐 살다 이사 예정", desc: "단기 거주", silk: -1 },
      { label: "사무실·상가 등 상업 공간", desc: "상업용", silk: 1 },
    ],
  },
  {
    id: "mood",
    q: "어떤 분위기의 공간을 꿈꾸시나요?",
    options: [
      { label: "따뜻하고 포근한", desc: "아늑한 휴식 공간", mood: "warm" },
      { label: "깔끔하고 모던한", desc: "군더더기 없는 정돈", mood: "modern" },
      { label: "차분하고 내추럴한", desc: "자연을 닮은 편안함", mood: "natural" },
      { label: "개성 있고 무드 있는", desc: "나만의 포인트", mood: "bold", gradeUp: 1 },
    ],
  },
  {
    id: "tone",
    q: "선호하는 색감 톤은 어느 쪽인가요?",
    options: [
      { label: "밝은 화이트·아이보리", mood: "modern" },
      { label: "베이지·우드 웜톤", mood: "warm" },
      { label: "그레이·뉴트럴 모노", mood: "natural" },
      { label: "딥하고 짙은 컬러", mood: "bold", gradeUp: 1 },
    ],
  },
  {
    id: "life",
    q: "생활 환경은 어떤가요?",
    hint: "오염·스크래치 노출 정도에 따라 내구성이 중요해져요.",
    options: [
      { label: "아이·반려동물이 있어요", desc: "오염·스크래치 잦음", silk: 2, gradeUp: 1 },
      { label: "깔끔하게 오래 관리하고 싶어요", silk: 2 },
      { label: "큰 부담 없이 무난하면 돼요", silk: -1 },
    ],
  },
  {
    id: "budget",
    q: "예산은 어디에 무게를 두시겠어요?",
    options: [
      { label: "합리적인 가성비 우선", gradeUp: -1, silk: -1 },
      { label: "가격과 품질의 균형", gradeUp: 0 },
      { label: "퀄리티·내구성 최우선", gradeUp: 2, silk: 1 },
    ],
  },
  {
    id: "finish",
    q: "마감(천장·벽면)은 얼마나 신경 쓰고 싶나요?",
    options: [
      { label: "천장까지 완벽하고 매끄럽게", desc: "띄움시공 선호", silk: 1, gradeUp: 1 },
      { label: "보이는 벽면 위주로 깔끔하게", gradeUp: 0 },
      { label: "기본 마감이면 충분해요", silk: -1, gradeUp: -1 },
    ],
  },
];

// 컬러 무드별 추천 스타일 카탈로그
export interface MoodResult {
  key: MoodKey;
  title: string;
  tagline: string;
  desc: string;
  palette: string[]; // hex swatches
  keywords: string[];
}

export const MOODS: Record<MoodKey, MoodResult> = {
  warm: {
    key: "warm",
    title: "웜 코지",
    tagline: "햇살처럼 따뜻하게 감싸는 공간",
    desc: "베이지·우드 톤의 부드러운 색감으로 포근하고 안정적인 분위기를 만듭니다. 거실과 침실 어디에 두어도 편안한, 가장 사랑받는 무드예요.",
    palette: ["#E8DCC8", "#D9C3A5", "#C2A98A", "#8C7559", "#5B4B3A"],
    keywords: ["베이지", "우드", "린넨", "아이보리"],
  },
  modern: {
    key: "modern",
    title: "클린 모던",
    tagline: "군더더기 없는 깔끔한 화이트 무드",
    desc: "밝은 화이트·그레이로 공간을 넓고 환하게. 가구와 소품이 돋보이는 정돈된 배경을 원하는 분께 잘 맞습니다.",
    palette: ["#F7F6F3", "#E9E8E4", "#D2D1CC", "#A7A6A1", "#4B4A47"],
    keywords: ["화이트", "라이트그레이", "미니멀", "모노톤"],
  },
  natural: {
    key: "natural",
    title: "차분한 내추럴",
    tagline: "자연을 닮은 편안한 뉴트럴",
    desc: "그레이지·세이지 그린 등 자연에서 온 색으로 차분하고 균형 잡힌 공간을 만듭니다. 오래 봐도 질리지 않는 톤이에요.",
    palette: ["#E5E4DC", "#CBCDBE", "#A9AE97", "#7C8268", "#4D5340"],
    keywords: ["그레이지", "세이지", "올리브", "뉴트럴"],
  },
  bold: {
    key: "bold",
    title: "무드 딥톤",
    tagline: "한 벽으로 분위기를 바꾸는 포인트",
    desc: "딥 그린·네이비·테라코타 같은 짙은 색으로 공간에 개성과 깊이를 더합니다. 포인트 월이나 침실 무드 연출에 추천해요.",
    palette: ["#D9CFC2", "#9A7B5B", "#2F4A45", "#1F3344", "#7A3A2E"],
    keywords: ["딥그린", "네이비", "테라코타", "포인트월"],
  },
};

export interface FinderResult {
  wallpaper: Wallpaper;
  grade: Grade;
  mood: MoodResult;
  // 추천 제품군 (META.grade 기반 카피)
  productHint: string;
}

const GRADE_BRAND: Record<Grade, string> = {
  기획: "깔끔한 대중형 라인 (예: 하이브리드)",
  일반: "다양한 컬러·패턴 라인 (예: 로젠스 · 베스트)",
  프리미엄: "하이엔드 라인 (예: 디아망 · 프리오 · 파셀로)",
};

export function computeResult(answers: Record<string, number>): FinderResult {
  let silkScore = 0;
  let gradeScore = 0;
  const moodVotes: Record<MoodKey, number> = { warm: 0, modern: 0, natural: 0, bold: 0 };

  for (const qn of QUESTIONS) {
    const idx = answers[qn.id];
    if (idx === undefined) continue;
    const opt = qn.options[idx];
    if (!opt) continue;
    silkScore += opt.silk || 0;
    gradeScore += opt.gradeUp || 0;
    if (opt.mood) moodVotes[opt.mood] += 1;
  }

  const wallpaper: Wallpaper = silkScore >= 0 ? "silk" : "hapji";

  // 등급: 가중 점수 → 기획 / 일반 / 프리미엄
  let grade: Grade = "일반";
  if (gradeScore <= -1) grade = "기획";
  else if (gradeScore >= 3) grade = "프리미엄";

  // 무드: 최다 득표 (동률 시 우선순위)
  const order: MoodKey[] = ["warm", "natural", "modern", "bold"];
  let best: MoodKey = "warm";
  let bestN = -1;
  for (const k of order) {
    if (moodVotes[k] > bestN) {
      bestN = moodVotes[k];
      best = k;
    }
  }

  return {
    wallpaper,
    grade,
    mood: MOODS[best],
    productHint: GRADE_BRAND[grade],
  };
}
