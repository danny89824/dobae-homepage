import type { Metadata } from "next";
import BoardClient from "@/components/admin/BoardClient";

export const metadata: Metadata = {
  title: "실행 관리보드 · 백오피스",
  robots: { index: false, follow: false },
};

export default function AdminBoardPage() {
  return <BoardClient />;
}
