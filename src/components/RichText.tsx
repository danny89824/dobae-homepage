import { looksHtml, stripUnsafeHtml } from "@/lib/sanitize";

// 설명/본문 렌더러.
// - 서식(HTML)이 있으면 정제 후 그대로 렌더(입력한 굵기·색·크기·정렬 반영)
// - 평문이면 줄바꿈(\n)을 그대로 보존해 표시(입력한 양식대로)
export default function RichText({
  html,
  className = "",
  as: Tag = "div",
}: {
  html: string;
  className?: string;
  as?: "div" | "span" | "p";
}) {
  if (!html) return null;
  if (!looksHtml(html)) {
    return (
      <Tag className={className} style={{ whiteSpace: "pre-wrap" }}>
        {html}
      </Tag>
    );
  }
  return (
    <Tag
      className={`rich ${className}`}
      dangerouslySetInnerHTML={{ __html: stripUnsafeHtml(html) }}
    />
  );
}
