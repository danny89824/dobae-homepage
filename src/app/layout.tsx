import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dobaeym.com"),
  title: {
    default: "도배청년단 — 도배의 바른 기준",
    template: "%s | 도배청년단",
  },
  description:
    "가격은 먼저, 책임은 문서로. 직접 고용한 청년 시공단이 만드는 정직한 도배. 합지·실크·광폭, 간편견적으로 미리 가격을 확인하세요.",
  keywords: ["도배", "도배청년단", "실크벽지", "합지벽지", "도배견적", "아파트도배", "도배지찾기"],
  openGraph: {
    title: "도배청년단 — 도배의 바른 기준",
    description: "가격은 먼저, 책임은 문서로. 직접 고용한 청년 시공단의 정직한 도배.",
    type: "website",
    locale: "ko_KR",
    siteName: "도배청년단",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth" className="h-full">
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
