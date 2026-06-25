import type { Metadata } from "next";
import FinderQuiz from "@/components/FinderQuiz";
import { getContent } from "@/lib/content-store";

export const metadata: Metadata = {
  title: "도배지 찾기 — 우리 집 맞춤 벽지 진단",
  description: "몇 가지 질문으로 우리 집에 어울리는 도배지 종류·등급·컬러 무드를 추천받고, 바로 간편견적까지 연결하세요.",
};

export default async function FinderPage() {
  const { site } = await getContent();
  return (
    <section className="pt-28 md:pt-32 pb-16 md:pb-24 bg-soft min-h-screen">
      <div className="container-x max-w-3xl">
        <FinderQuiz phone={site.phone} />
      </div>
    </section>
  );
}
