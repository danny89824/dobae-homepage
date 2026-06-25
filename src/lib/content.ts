// 홈/서브 페이지 공통 콘텐츠 (시공사례·프로세스·FAQ)
// 사진은 Unsplash CDN 핫링크(검증된 photo-id) — 실제 시공사진으로 교체 필요(placeholder)

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export interface CaseItem {
  no: string;
  title: string;
  space: string;
  wallpaper: string;
  region: string;
  img: string;
  tag: string;
}

export const CASES: CaseItem[] = [
  { no: "01", title: "햇살 가득한 거실, 웜 베이지로", space: "아파트 32평", wallpaper: "실크 · 일반", region: "서울 송파", img: U("1586023492125-27b2c045efd7"), tag: "거실" },
  { no: "02", title: "군더더기 없는 화이트 침실", space: "아파트 24평", wallpaper: "실크 · 프리미엄", region: "경기 성남", img: U("1505691938895-1758d7feb511"), tag: "침실" },
  { no: "03", title: "차분한 그레이지 원룸", space: "오피스텔 7평", wallpaper: "합지 · 전체", region: "서울 강남", img: U("1522708323590-d24dbb6b0267"), tag: "원룸" },
  { no: "04", title: "딥그린 포인트월 서재", space: "아파트 42평", wallpaper: "실크 · 프리미엄", region: "경기 용인", img: U("1567538096630-e0c55bd6374c"), tag: "포인트월" },
  { no: "05", title: "내추럴 우드 톤 주방", space: "빌라 24평", wallpaper: "실크 · 일반", region: "서울 마포", img: U("1556909211-36987daf7b4d"), tag: "주방" },
  { no: "06", title: "임대용 깔끔 합지 시공", space: "아파트 18평", wallpaper: "합지 · 덧방", region: "서울 송파", img: U("1513694203232-719a280e022f"), tag: "임대" },
];

export interface ProcessStep {
  no: string;
  title: string;
  desc: string;
}

export const PROCESS: ProcessStep[] = [
  { no: "01", title: "간편 가견적", desc: "홈페이지에서 공간과 벽지를 고르면 예상 금액을 바로 확인합니다. 전화 없이 가격부터." },
  { no: "02", title: "일정 예약", desc: "원하는 시공일을 예약합니다. (성수기 등은 3주 전 예약금으로 일정을 확정)" },
  { no: "03", title: "비대면 실측", desc: "방문 부담 없이 사진·도면 기반으로 꼼꼼히 실측하고 견적을 확정합니다." },
  { no: "04", title: "샘플 선택", desc: "추천 도배지 샘플을 함께 보며 우리 집에 맞는 벽지를 결정합니다." },
  { no: "05", title: "당일 시공", desc: "직접 고용한 청년 시공단이 약속한 날 정확히 시공하고, 카톡으로 진행 사진을 보내드립니다." },
  { no: "06", title: "1년 무상 A/S", desc: "시공 후 1년간 무상 A/S로 책임집니다. 접수는 카카오채널로 간편하게." },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQ: Faq[] = [
  { q: "전화하지 않아도 가격을 알 수 있나요?", a: "네. 간편견적에서 공간 유형과 평형, 벽지 종류만 고르면 예상 금액 범위를 바로 확인할 수 있습니다. 가격을 먼저 투명하게 공개하는 것이 도배청년단의 기준입니다." },
  { q: "실측은 꼭 방문해야 하나요?", a: "방문 없이 비대면 실측으로 진행합니다. 공간 사진과 도면, 평형 정보를 바탕으로 정확하게 산정하므로 바쁘셔도 부담이 없습니다." },
  { q: "시공 후 문제가 생기면 어떻게 하나요?", a: "시공일로부터 1년간 무상 A/S로 책임집니다. 들뜸·이음매 등 시공 관련 문제는 카카오채널로 접수해 주시면 빠르게 도와드립니다." },
  { q: "어떤 도배지를 사용하나요?", a: "합지·실크·광폭합지를 모두 다룹니다. 사용 목적과 예산, 원하는 분위기에 따라 '도배지 찾기'로 추천을 받아보실 수 있어요." },
  { q: "예약은 얼마나 미리 해야 하나요?", a: "원하는 일정에 맞춰 조율해 드립니다. 다만 성수기에는 일정이 빠르게 마감되므로, 3주 전 예약금으로 시공일을 확정하는 것을 권장합니다." },
];

// 도배지 종류 안내 (Guide 페이지)
export interface PaperType {
  key: string;
  name: string;
  badge: string;
  feat: string;
  best: string;
  price: string;
}

export const PAPER_TYPES: PaperType[] = [
  { key: "hapji", name: "합지 벽지", badge: "가성비 · 종이", feat: "종이로 이루어진 기본 벽지. 시공이 빠르고 비용 부담이 적습니다.", best: "임대용 · 단기 거주 공간", price: "원룸 부분시공 30만원대~" },
  { key: "silk", name: "실크 벽지", badge: "고급 · 관리 편함", feat: "표면 코팅으로 오염과 스크래치에 강하고 닦아서 관리할 수 있습니다.", best: "직접 거주하는 집 · 아이/반려동물 가정", price: "24평 기준 175만원대~" },
  { key: "wide", name: "광폭 합지", badge: "넓은 폭 · 깔끔", feat: "폭이 넓어 이음매가 적고 합지보다 매끈한 마감을 냅니다.", best: "합지의 가성비 + 깔끔함을 원할 때", price: "상담 시 안내" },
];
