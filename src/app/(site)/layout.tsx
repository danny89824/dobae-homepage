import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingCta from "@/components/FloatingCta";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { getContent } from "@/lib/content-store";

// 콘텐츠 저장소를 읽어 헤더/푸터에 반영 — 수정 즉시 반영을 위해 동적 렌더
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getContent();
  return (
    <>
      <a href="#main" className="skip-link">
        본문 바로가기
      </a>
      <Header phone={content.site.phone} />
      {/* 모바일 하단 고정 CTA 바 높이만큼 여백 확보 */}
      <main id="main" className="flex-1 pb-16 sm:pb-0">
        {children}
      </main>
      <Footer site={content.site} regions={content.regions} />
      <ScrollReveal />
      <FloatingCta phone={content.site.phone} kakao={content.site.kakaoChannel} />
      <LocalBusinessJsonLd content={content} />
    </>
  );
}
