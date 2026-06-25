import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getContent } from "@/lib/content-store";

// 콘텐츠 저장소를 읽어 헤더/푸터에 반영 — 수정 즉시 반영을 위해 동적 렌더
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getContent();
  return (
    <>
      <Header phone={content.site.phone} />
      <main className="flex-1">{children}</main>
      <Footer site={content.site} regions={content.regions} />
      <ScrollReveal />
    </>
  );
}
