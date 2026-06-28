// 서식 텍스트(HTML) 관련 유틸. 저장은 에디터(RichTextField)에서 1차 정제하고,
// 공개 렌더 시 여기서 위험요소를 한 번 더 제거(방어).

export const looksHtml = (s: string) => /<\/?[a-z][\s\S]*>/i.test(s || "");

// 렌더 방어용 — script/이벤트핸들러/javascript: 등 제거(정규식 기반, 서버 안전)
export function stripUnsafeHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<\s*(script|style|iframe|object|embed|link|meta|svg)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[^>]*\/?>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["']?)\s*javascript:[^"'>]*\2/gi, "");
}
