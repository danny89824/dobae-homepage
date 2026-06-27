import type { ThemeColors } from "./content-types";

// #rgb 또는 #rrggbb 만 허용(CSS 깨짐/주입 방지), 아니면 기본값
const HEX = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/;
const safe = (v: string | undefined, fb: string) =>
  typeof v === "string" && HEX.test(v.trim()) ? v.trim() : fb;

function srgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
}
function luminance(hex: string): number {
  const [r, g, b] = srgb(hex);
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
// 배경 명도에 따라 읽기 좋은 글자색(어두운/밝은) 자동 선택
const onColor = (bg: string) => (luminance(bg) > 0.5 ? "#17150f" : "#f2f1ec");

export const DEFAULT_THEME: ThemeColors = {
  paper: "#ffffff",
  soft: "#f6f5f2",
  dark: "#16201d",
  accent: "#1f5e54",
};

// 테마 → :root CSS 변수 선언문. globals.css의 토큰을 런타임 덮어써 전 섹션 색 반영.
export function themeVars(theme?: Partial<ThemeColors>): string {
  const paper = safe(theme?.paper, DEFAULT_THEME.paper);
  const soft = safe(theme?.soft, DEFAULT_THEME.soft);
  const dark = safe(theme?.dark, DEFAULT_THEME.dark);
  const accent = safe(theme?.accent, DEFAULT_THEME.accent);
  const ink = onColor(paper);
  const onDark = onColor(dark);
  return [
    `--paper:${paper}`,
    `--soft:${soft}`,
    `--dark:${dark}`,
    `--accent:${accent}`,
    `--ink:${ink}`,
    `--ink-2:${ink}`,
    `--on-dark:${onDark}`,
    `--sub:color-mix(in srgb, ${ink} 52%, ${paper})`,
    `--on-dark-sub:color-mix(in srgb, ${onDark} 62%, ${dark})`,
    `--accent-soft:color-mix(in srgb, ${accent} 14%, #ffffff)`,
    `--accent-ink:color-mix(in srgb, ${accent} 80%, #000000)`,
  ].join(";");
}
