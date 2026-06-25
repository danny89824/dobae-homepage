import { ImageResponse } from "next/og";

export const alt = "도배청년단 — 도배의 바른 기준";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LINE1 = "도배의 바른 기준,";
const LINE2 = "도배청년단";
const SUB = "가격은 먼저, 책임은 문서로.";
const FOOT = "직접 고용한 청년 시공단의 정직한 도배 · dobaeym.com";

// 한글 글리프 렌더를 위해 Google Fonts(Noto Sans KR)를 동적 로드
async function loadFont(text: string) {
  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@800&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!src) throw new Error("font url not found");
  const res = await fetch(src[1]);
  if (!res.ok) throw new Error("font fetch failed");
  return res.arrayBuffer();
}

export default async function OpengraphImage() {
  const fontData = await loadFont(LINE1 + LINE2 + SUB + FOOT);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#16201d",
          color: "#f2f1ec",
          padding: "80px",
          fontFamily: "Noto Sans KR",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#c2a36a",
            fontSize: 26,
            letterSpacing: 4,
          }}
        >
          <div style={{ width: 40, height: 4, background: "#c2a36a" }} />
          SINCE 2021 · DOBAE CHEONGNYEONDAN
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 28, fontSize: 92, fontWeight: 800, lineHeight: 1.1 }}>
          <span>{LINE1}</span>
          <span style={{ color: "#7fb3a6" }}>{LINE2}</span>
        </div>
        <div style={{ marginTop: 28, fontSize: 40, color: "#a9b4ac" }}>{SUB}</div>
        <div style={{ marginTop: 56, fontSize: 24, color: "#8a958d" }}>{FOOT}</div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Noto Sans KR", data: fontData, weight: 800, style: "normal" }],
    }
  );
}
