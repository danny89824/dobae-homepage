"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  PRICE, META, CONFIG, WP_LABEL, SCOPE_LABEL,
  nextStep, totalSteps, progressPct, compute, methodLabel,
  type EstimateState, type Step, type Wallpaper, type Grade,
} from "@/lib/price";
import { SITE } from "@/lib/site";

const won = (man: number) => `${man.toLocaleString()}만원`;

const STEP_TITLE: Record<string, { eyebrow: string; title: string; sub?: string }> = {
  space: { eyebrow: "STEP 01", title: "어떤 공간인가요?", sub: "공간 유형을 선택해 주세요." },
  size: { eyebrow: "STEP 02", title: "평형을 골라주세요", sub: "가장 가까운 크기를 선택하면 됩니다." },
  wallpaper: { eyebrow: "STEP 03", title: "어떤 벽지로 할까요?", sub: "합지와 실크, 용도에 맞게 골라보세요." },
  grade: { eyebrow: "STEP 04", title: "실크 등급을 골라주세요", sub: "예산과 취향에 맞는 등급을 선택합니다." },
  method_hapji: { eyebrow: "STEP 04", title: "합지 시공 방식", sub: "마감 수준에 따라 선택하세요." },
  method_silk: { eyebrow: "STEP 05", title: "실크 시공 방식", sub: "천장 마감 수준을 골라주세요." },
  scope: { eyebrow: "STEP 04", title: "시공 범위", sub: "어디까지 시공할지 선택하세요." },
};

interface Card {
  field: keyof EstimateState;
  value: string;
  emoji?: string;
  badge?: string;
  title: string;
  feat?: string;
  rec?: string;
  note?: string;
  price?: string;
}

export default function EstimateWizard() {
  const params = useSearchParams();
  const [S, setS] = useState<EstimateState>({});
  const [history, setHistory] = useState<EstimateState[]>([]);
  const prefill = useRef<{ wallpaper?: Wallpaper; grade?: Grade }>({});
  const topRef = useRef<HTMLDivElement>(null);
  const scrolledOnce = useRef(false);

  // 도배지 찾기에서 넘어온 추천값
  const [prefilled, setPrefilled] = useState(false);
  useEffect(() => {
    const wp = params.get("wallpaper");
    const gr = params.get("grade");
    if (wp === "hapji" || wp === "silk") {
      prefill.current.wallpaper = wp;
      setPrefilled(true);
    }
    if (gr === "기획" || gr === "일반" || gr === "프리미엄") {
      prefill.current.grade = gr as Grade;
    }
  }, [params]);

  const step: Step = useMemo(() => nextStep(S), [S]);

  const scrollTop = () => {
    if (!scrolledOnce.current) {
      scrolledOnce.current = true;
      return;
    }
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const choose = (field: keyof EstimateState, value: string) => {
    setHistory((h) => [...h, S]);
    const next: EstimateState = { ...S, [field]: value };
    if (field === "space") {
      next.size = next.wallpaper = next.grade = next.method = next.scope = undefined;
    }
    if (field === "size") {
      next.wallpaper = next.grade = next.method = next.scope = undefined;
      // 도배지 찾기 추천 적용 (한 번에 점프)
      if (prefill.current.wallpaper) {
        const sz = PRICE.spaces[next.space!].sizes![value];
        if (!sz.partial) {
          next.wallpaper = prefill.current.wallpaper;
          if (next.wallpaper === "silk" && prefill.current.grade) {
            next.grade = prefill.current.grade;
          }
        }
      }
    }
    if (field === "wallpaper") next.grade = next.method = next.scope = undefined;
    if (field === "grade") next.method = undefined;
    setS(next);
    scrollTop();
  };

  const back = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setS(prev);
      return h.slice(0, -1);
    });
    scrollTop();
  };

  const editChip = (field: keyof EstimateState) => {
    const order: (keyof EstimateState)[] = ["space", "size", "wallpaper", "grade", "method", "scope"];
    const i = order.indexOf(field);
    const next = { ...S };
    for (let j = i; j < order.length; j++) next[order[j]] = undefined;
    setS(next);
    setHistory([]);
    scrollTop();
  };

  const reset = () => {
    setS({});
    setHistory([]);
    scrollTop();
  };

  // 카드 목록 생성
  const cards: Card[] = useMemo(() => {
    if (step === "space") {
      return Object.entries(PRICE.spaces).map(([k, v]) => ({
        field: "space", value: k, emoji: v.emoji, title: v.label,
        feat: v.consult ? "맞춤 상담으로 안내" : undefined,
      }));
    }
    if (step === "size") {
      const sp = PRICE.spaces[S.space!];
      return Object.entries(sp.sizes!).map(([k, v]) => ({
        field: "size", value: k, title: v.label, feat: v.desc,
        note: v.sqm, badge: v.consult ? "상담" : undefined,
      }));
    }
    if (step === "wallpaper") {
      return (["hapji", "silk"] as Wallpaper[]).map((k) => {
        const m = META.wallpaper[k];
        return { field: "wallpaper", value: k, emoji: m.emoji, badge: m.pill, title: m.name, feat: m.feat, rec: m.rec };
      });
    }
    if (step === "grade") {
      const sz = PRICE.spaces[S.space!].sizes![S.size!];
      return (["기획", "일반", "프리미엄"] as Grade[]).map((g) => {
        const m = META.grade[g];
        const base = sz.silk![g].basic;
        return { field: "grade", value: g, badge: m.pill || undefined, title: `${g} 등급`, feat: m.feat, rec: m.brand, price: `기본 ${won(base)}~` };
      });
    }
    if (step === "method_hapji") {
      const sz = PRICE.spaces[S.space!].sizes![S.size!];
      return PRICE.modifiers.hapji.map((mo) => {
        const d = META.hapjiMethod[mo.key as keyof typeof META.hapjiMethod];
        return { field: "method", value: mo.key, badge: d.pill || undefined, title: d.name, feat: d.feat, rec: d.rec, price: won((sz.hapjiBase || 0) + (mo.add || 0)) };
      });
    }
    if (step === "method_silk") {
      const g = PRICE.spaces[S.space!].sizes![S.size!].silk![S.grade!];
      const entries: [string, number][] = [
        ["basic", g.basic],
        ["ceilingFloat", g.basic + 30],
        ["fullInterior", g.fullInterior],
      ];
      return entries.map(([key, price]) => {
        const d = META.silkMethod[key as keyof typeof META.silkMethod];
        return { field: "method", value: key, badge: d.pill || undefined, title: d.name, feat: d.feat, rec: "rec" in d ? d.rec : undefined, note: "note" in d ? d.note : undefined, price: won(price) };
      });
    }
    if (step === "scope") {
      const sz = PRICE.spaces[S.space!].sizes![S.size!];
      return (["wallOnly", "full"] as const).map((sc) => ({
        field: "scope", value: sc, title: SCOPE_LABEL[sc],
        feat: sc === "wallOnly" ? "벽면 위주로 깔끔하게" : "벽과 천장 모두 시공",
        price: won(sz.partial![S.wallpaper!][sc]),
      }));
    }
    return [];
  }, [step, S]);

  // 브레드크럼
  const crumbs = useMemo(() => {
    const out: { field: keyof EstimateState; label: string }[] = [];
    if (S.space) out.push({ field: "space", label: PRICE.spaces[S.space].label });
    if (S.size) out.push({ field: "size", label: PRICE.spaces[S.space!].sizes![S.size].label });
    if (S.wallpaper) out.push({ field: "wallpaper", label: WP_LABEL[S.wallpaper] });
    if (S.grade) out.push({ field: "grade", label: `${S.grade}등급` });
    if (S.method || S.scope) out.push({ field: (S.scope ? "scope" : "method") as keyof EstimateState, label: methodLabel(S) });
    return out;
  }, [S]);

  const pct = progressPct(S, step);
  const tot = step === "consult" ? "–" : totalSteps(S);
  const isWizard = step !== "result" && step !== "consult";

  return (
    <div ref={topRef} className="scroll-mt-24">
      {prefilled && isWizard && (
        <div className="mb-5 rounded-xl bg-accent-soft text-accent-ink px-4 py-3 text-sm flex items-center gap-2">
          <span>✨</span>
          <span>도배지 찾기 추천이 반영돼 있어요. 공간과 평형만 고르면 빠르게 견적이 나옵니다.</span>
        </div>
      )}

      {/* 진행바 */}
      {isWizard && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-sub mb-2">
            <span className="num-label">
              <span className="font-semibold text-ink">{pct}%</span> 완료
            </span>
            <span className="num-label">{typeof tot === "number" ? `총 ${tot}단계` : ""}</span>
          </div>
          <div className="h-1.5 rounded-full bg-soft-2 overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* 브레드크럼 */}
      {crumbs.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-6">
          {crumbs.map((c) => (
            <button
              key={c.field}
              onClick={() => editChip(c.field)}
              className="group inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full bg-soft border border-line hover:border-ink transition-colors"
              title="이 단계 수정"
            >
              <span>{c.label}</span>
              <span className="text-sub group-hover:text-ink">✎</span>
            </button>
          ))}
        </div>
      )}

      {isWizard && <StepCards step={step} cards={cards} S={S} onChoose={choose} />}

      {step === "result" && <Result S={S} onReset={reset} />}
      {step === "consult" && <Consult onReset={reset} />}

      {/* 뒤로 */}
      {(history.length > 0 || step === "result" || step === "consult") && (
        <div className="mt-8 flex items-center gap-3">
          {history.length > 0 && (
            <button onClick={back} className="btn btn-outline !py-2.5 !px-4 text-sm">
              ← 이전
            </button>
          )}
          <button onClick={reset} className="text-sm text-sub hover:text-ink underline underline-offset-4">
            처음부터 다시
          </button>
        </div>
      )}
    </div>
  );
}

function StepCards({
  step, cards, S, onChoose,
}: {
  step: Step;
  cards: Card[];
  S: EstimateState;
  onChoose: (f: keyof EstimateState, v: string) => void;
}) {
  const t = STEP_TITLE[step];
  const cols = cards.length >= 4 ? "sm:grid-cols-2" : cards.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div>
      {t && (
        <div className="mb-6">
          <p className="eyebrow num-label">{t.eyebrow}</p>
          <h2 className="text-2xl md:text-[1.7rem] font-bold mt-1.5">{t.title}</h2>
          {t.sub && <p className="text-sub mt-1.5">{t.sub}</p>}
        </div>
      )}
      <div className={`grid gap-3 ${cols}`}>
        {cards.map((c) => {
          const selected = S[c.field] === c.value;
          return (
            <button
              key={c.value}
              onClick={() => onChoose(c.field, c.value)}
              className={`text-left rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 ${
                selected ? "border-accent bg-accent-soft" : "border-line bg-paper hover:border-ink/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {c.emoji && <span className="text-2xl leading-none">{c.emoji}</span>}
                  <div className="min-w-0">
                    <div className="font-bold text-[1.05rem] flex items-center gap-2 flex-wrap">
                      {c.title}
                      {c.badge && (
                        <span className="text-[0.68rem] font-semibold px-1.5 py-0.5 rounded-full bg-ink text-white">
                          {c.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {c.price && (
                  <span className="shrink-0 text-accent font-bold num-label">{c.price}</span>
                )}
              </div>
              {c.feat && <p className="text-sm text-sub mt-2">{c.feat}</p>}
              {c.rec && <p className="text-sm text-accent-ink mt-1.5">👍 {c.rec}</p>}
              {c.note && <p className="text-xs text-sub/80 mt-1.5">※ {c.note}</p>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Result({ S, onReset }: { S: EstimateState; onReset: () => void }) {
  const r = compute(S);
  const sz = PRICE.spaces[S.space!].sizes![S.size!];
  const sqm = sz.sqm ? ` (${sz.sqm})` : "";
  const rows: [string, string][] = [
    ["공간", `${PRICE.spaces[S.space!].label} · ${sz.label}${sqm}`],
    ["벽지", `${WP_LABEL[S.wallpaper!]}${S.grade ? ` · ${S.grade}등급` : ""}`],
    ["시공", methodLabel(S)],
  ];
  return (
    <div>
      <div className="rounded-3xl border border-line bg-paper overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <div className="bg-dark text-on-dark px-6 md:px-8 py-7">
          <div className="flex items-center justify-between">
            <p className="eyebrow !text-gold">예상 가견적서</p>
            <span className="text-[0.7rem] px-2 py-1 rounded-full bg-white/10 border border-white/15">
              1년 무상 A/S
            </span>
          </div>
          <p className="mt-3 text-on-dark-sub text-sm">예상 시공 금액 (VAT 별도, 범위)</p>
          <div className="mt-1 flex items-end gap-2">
            <span className="text-4xl md:text-5xl font-extrabold num-label tracking-tight">
              {r.min.toLocaleString()}
            </span>
            <span className="text-on-dark-sub mb-1">~</span>
            <span className="text-4xl md:text-5xl font-extrabold num-label tracking-tight">
              {r.max.toLocaleString()}
            </span>
            <span className="text-on-dark-sub mb-1.5 ml-0.5">만원</span>
          </div>
          <p className="mt-3 text-xs text-on-dark-sub">
            VAT 포함 약 {won(r.vatP)} · 실측 후 최종 확정됩니다.
          </p>
        </div>
        <div className="px-6 md:px-8 py-6">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-baseline gap-3 py-2.5 border-b border-line last:border-0">
              <span className="text-sm text-sub w-16 shrink-0">{k}</span>
              <span className="flex-1 border-b border-dotted border-line/0" />
              <span className="font-semibold text-right">{v}</span>
            </div>
          ))}
          <div className="flex items-baseline gap-3 py-2.5 mt-1">
            <span className="text-sm text-sub w-16 shrink-0">공급가</span>
            <span className="flex-1" />
            <span className="font-semibold num-label">약 {won(r.p)}</span>
          </div>
        </div>
      </div>

      <LeadForm S={S} />

      <button onClick={onReset} className="sr-only">처음부터</button>
    </div>
  );
}

function LeadForm({ S }: { S: EstimateState }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    const lead = {
      name, phone, region,
      estimate: S,
      quote: compute(S),
      at: new Date().toISOString(),
    };
    try {
      const prev = JSON.parse(localStorage.getItem("dobae_leads") || "[]");
      prev.push(lead);
      localStorage.setItem("dobae_leads", JSON.stringify(prev));
    } catch {
      /* noop */
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mt-6 rounded-2xl border border-accent bg-accent-soft p-6 text-center">
        <p className="text-2xl">✅</p>
        <p className="font-bold text-lg mt-2">상담 신청이 접수됐어요</p>
        <p className="text-sub text-sm mt-1">
          빠른 시간 내에 연락드리겠습니다. 더 빠른 상담은 전화·카카오채널로도 가능해요.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <a href={SITE.phoneHref} className="btn btn-primary !py-2.5 !px-5 text-sm">
            전화 상담 {SITE.phone}
          </a>
          <a href={SITE.kakaoChannel} target="_blank" rel="noreferrer" className="btn btn-outline !py-2.5 !px-5 text-sm">
            카카오채널
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-2xl border border-line bg-soft p-6">
      <h3 className="font-bold text-lg">이 견적으로 상담 받기</h3>
      <p className="text-sub text-sm mt-1">연락처를 남기시면 비대면 실측과 함께 정확한 견적을 안내해 드려요.</p>
      <div className="grid sm:grid-cols-3 gap-3 mt-4">
        <input
          value={name} onChange={(e) => setName(e.target.value)}
          placeholder="이름" required
          className="rounded-xl border border-line bg-paper px-4 py-3 text-sm focus:border-accent focus:outline-none"
        />
        <input
          value={phone} onChange={(e) => setPhone(e.target.value)}
          placeholder="연락처" inputMode="tel" required
          className="rounded-xl border border-line bg-paper px-4 py-3 text-sm focus:border-accent focus:outline-none"
        />
        <input
          value={region} onChange={(e) => setRegion(e.target.value)}
          placeholder="시공 지역 (예: 송파구)"
          className="rounded-xl border border-line bg-paper px-4 py-3 text-sm focus:border-accent focus:outline-none"
        />
      </div>
      <button type="submit" className="btn btn-accent w-full mt-4">
        상담 신청하기
      </button>
      <p className="text-[0.7rem] text-sub mt-3 text-center">
        ※ 데모 단계로 입력 정보는 브라우저에만 저장됩니다. (리드 백엔드 연동 예정)
      </p>
    </form>
  );
}

function Consult({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-3xl border border-line bg-soft p-8 text-center">
      <p className="text-3xl">💬</p>
      <h2 className="text-2xl font-bold mt-3">맞춤 상담으로 안내해 드릴게요</h2>
      <p className="text-sub mt-2 max-w-md mx-auto">
        선택하신 공간은 현장 상황에 따라 견적 차이가 커서, 정확한 금액을 위해 직접 상담으로 도와드리는 것이 좋아요.
      </p>
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        <a href={SITE.phoneHref} className="btn btn-primary !px-6">전화 상담 {SITE.phone}</a>
        <a href={SITE.kakaoChannel} target="_blank" rel="noreferrer" className="btn btn-outline !px-6">
          카카오채널 상담
        </a>
      </div>
      <button onClick={onReset} className="mt-5 text-sm text-sub hover:text-ink underline underline-offset-4">
        다른 공간으로 다시 견적
      </button>
    </div>
  );
}
