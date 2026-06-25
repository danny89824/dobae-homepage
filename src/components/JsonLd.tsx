import type { SiteContent } from "@/lib/content-types";

const SITE_URL = "https://dobaeym.com";

// 지역 사업자(도배/인테리어 시공) 구조화 데이터 — 로컬 검색 노출 강화
export function LocalBusinessJsonLd({ content }: { content: SiteContent }) {
  const { site, regions, reviews } = content;
  const ratings = reviews?.filter((r) => r.rating > 0) ?? [];
  const avg =
    ratings.length > 0
      ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length
      : null;

  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "도배청년단",
    description:
      "가격은 먼저, 책임은 문서로. 직접 고용한 청년 시공단이 만드는 정직한 도배.",
    url: SITE_URL,
    telephone: site.phone,
    image: `${SITE_URL}/opengraph-image`,
    priceRange: "₩₩",
    areaServed: regions.map((r) => ({ "@type": "City", name: r })),
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressRegion: "서울·경기",
    },
    ...(avg
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avg.toFixed(1),
            reviewCount: ratings.length,
            bestRating: 5,
          },
        }
      : {}),
    sameAs: site.kakaoChannel ? [site.kakaoChannel] : [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// FAQ 구조화 데이터 — 검색 결과 리치 스니펫
export function FaqJsonLd({ faq }: { faq: SiteContent["faq"] }) {
  if (!faq?.length) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
