"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const PW_KEY = "dobae_admin_pw";

type Lead = {
  id: string;
  name: string;
  phone: string;
  region?: string;
  message?: string;
  source?: string;
  quote?: { total?: number } | unknown;
  at: string;
  url: string;
};

function fmtDate(iso: string): string {
  try {
    const d = new Date(iso);
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  } catch {
    return iso;
  }
}

function quoteTotal(q: Lead["quote"]): string {
  if (q && typeof q === "object" && "total" in q) {
    const t = (q as { total?: unknown }).total;
    if (typeof t === "number") return t.toLocaleString("ko-KR") + "원";
  }
  return "-";
}

export default function LeadsClient() {
  const [pw, setPw] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPw(sessionStorage.getItem(PW_KEY));
    setReady(true);
  }, []);

  const load = useCallback(async (password: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        headers: { "x-admin-password": password },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "불러오기 실패");
      setLeads(data.leads as Lead[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready && pw) load(pw);
  }, [ready, pw, load]);

  const remove = async (lead: Lead) => {
    if (!pw) return;
    if (!confirm(`${lead.name} 님의 상담 신청을 삭제할까요?`)) return;
    try {
      const res = await fetch(`/api/leads?url=${encodeURIComponent(lead.url)}`, {
        method: "DELETE",
        headers: { "x-admin-password": pw },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "삭제 실패");
      setLeads((prev) => (prev ? prev.filter((l) => l.id !== lead.id) : prev));
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제 실패");
    }
  };

  const exportCsv = () => {
    if (!leads?.length) return;
    const head = ["신청일시", "이름", "연락처", "지역", "예상견적", "메모", "경로"];
    const rows = leads.map((l) => [
      fmtDate(l.at),
      l.name,
      l.phone,
      l.region || "",
      quoteTotal(l.quote),
      (l.message || "").replace(/\n/g, " "),
      l.source || "",
    ]);
    const csv = [head, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dobae-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!ready) return null;

  if (!pw) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft px-4">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 text-center">
          <h1 className="text-lg font-bold">로그인이 필요합니다</h1>
          <p className="text-sm text-sub mt-2">상담 신청 내역은 백오피스 비밀번호로 보호됩니다.</p>
          <Link href="/admin" className="btn btn-accent w-full mt-5 inline-block">
            백오피스 로그인으로 이동
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-line">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin" className="text-sm font-bold text-ink hover:text-accent shrink-0">
              ← 백오피스
            </Link>
            <span className="text-sm font-bold text-sub truncate">
              상담 신청 {leads ? `(${leads.length})` : ""}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button onClick={() => pw && load(pw)} className="text-sm text-sub hover:text-ink">
              새로고침
            </button>
            <button
              onClick={exportCsv}
              disabled={!leads?.length}
              className="text-sm text-accent font-semibold hover:underline disabled:opacity-40"
            >
              CSV 내보내기
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading && <p className="text-sm text-sub">불러오는 중…</p>}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
        {leads && leads.length === 0 && !loading && (
          <div className="text-center text-sub py-20">
            <p className="text-2xl">📭</p>
            <p className="mt-2 text-sm">아직 접수된 상담 신청이 없습니다.</p>
          </div>
        )}
        {leads && leads.length > 0 && (
          <div className="space-y-3">
            {leads.map((l) => (
              <div key={l.id} className="rounded-2xl border border-line bg-soft p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-ink">{l.name}</span>
                      <a href={`tel:${l.phone}`} className="text-accent font-semibold text-sm">
                        {l.phone}
                      </a>
                      {l.region && (
                        <span className="text-xs text-sub bg-white border border-line rounded-full px-2 py-0.5">
                          {l.region}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-sub mt-1">
                      {fmtDate(l.at)} · 예상견적 {quoteTotal(l.quote)}
                      {l.source ? ` · ${l.source}` : ""}
                    </p>
                    {l.message && <p className="text-sm text-ink mt-2 whitespace-pre-wrap">{l.message}</p>}
                  </div>
                  <button
                    onClick={() => remove(l)}
                    className="text-xs text-sub hover:text-red-600 shrink-0"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-[0.7rem] text-sub mt-8">
          ※ 개인정보가 포함된 내역입니다. 열람·다운로드한 파일은 안전하게 관리하고, 목적 달성 후 파기하세요.
        </p>
      </main>
    </div>
  );
}
