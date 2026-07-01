import type { Metadata } from "next";
import LeadsClient from "@/components/admin/LeadsClient";

export const metadata: Metadata = {
  title: "상담 신청 · 백오피스",
  robots: { index: false, follow: false },
};

export default function AdminLeadsPage() {
  return <LeadsClient />;
}
