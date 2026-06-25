"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { QUESTIONS, computeResult, type FinderResult } from "@/lib/finder";
import { WP_LABEL } from "@/lib/price";
import { telHref } from "@/lib/content-types";

type Phase = "intro" | "quiz" | "result";

export default function FinderQuiz({ phone }: { phone: string }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const topRef = useRef<HTMLDivElement>(null);

  const total = QUESTIONS.length;
  const result: FinderResult | null = useMemo(
    () => (phase === "result" ? computeResult(answers) : null),
    [phase, answers]
  );

  const scrollTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const pick = (optionIdx: number) => {
    const q = QUESTIONS[idx];
    const nextAnswers = { ...answers, [q.id]: optionIdx };
    setAnswers(nextAnswers);
    if (idx + 1 < total) {
      setIdx(idx + 1);
      scrollTop();
    } else {
      setPhase("result");
      scrollTop();
    }
  };

  const back = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      scrollTop();
    } else {
      setPhase("intro");
    }
  };

  const restart = () => {
    setAnswers({});
    setIdx(0);
    setPhase("intro");
    scrollTop();
  };

  return (
    <div ref={topRef} className="scroll-mt-24">
      {phase === "intro" && <Intro total={total} onStart={() => setPhase("quiz")} />}

      {phase === "quiz" && (
        <Question
          idx={idx}
          total={total}
          answered={answers[QUESTIONS[idx].id]}
          onPick={pick}
          onBack={back}
        />
      )}

      {phase === "result" && result && (
        <Result result={result} onRestart={restart} phone={phone} />
      )}
    </div>
  );
}

function Intro({ total, onStart }: { total: number; onStart: () => void }) {
  return (
    <div className="rounded-3xl border border-line bg-paper overflow-hidden">
      <div className="bg-dark text-on-dark px-7 md:px-10 py-12 text-center">
        <p className="eyebrow !text-gold">Wallpaper Finder</p>
        <h2 className="text-3xl md:text-4xl font-extrabold mt-3 leading-tight">
          우리 집에 어울리는 <br /> 도배지를 찾아드려요
        </h2>
        <p className="text-on-dark-sub mt-4 max-w-md mx-auto">
          {total}개의 질문, 약 1분이면 충분해요. 공간과 취향에 맞는 벽지 종류·등급·컬러 무드를 추천하고, 바로 예상 견적까지 연결해 드립니다.
        </p>
        <button onClick={onStart} className="btn btn-accent !px-8 mt-7">
          시작하기 →
        </button>
      </div>
      <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line">
        {[
          { t: "취향 진단", d: "분위기·톤·생활환경" },
          { t: "맞춤 추천", d: "합지/실크·등급·컬러" },
          { t: "견적 연결", d: "추천값으로 바로 견적" },
        ].map((x) => (
          <div key={x.t} className="px-6 py-5 text-center">
            <p className="font-bold">{x.t}</p>
            <p className="text-sm text-sub mt-1">{x.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Question({
  idx, total, answered, onPick, onBack,
}: {
  idx: number;
  total: number;
  answered?: number;
  onPick: (i: number) => void;
  onBack: () => void;
}) {
  const q = QUESTIONS[idx];
  const pct = Math.round((idx / total) * 100);
  return (
    <div>
      <div className="mb-7">
        <div className="flex items-center justify-between text-xs text-sub mb-2 num-label">
          <span>
            Q<b className="text-ink">{idx + 1}</b> / {total}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-soft-2 overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl md:text-[1.8rem] font-bold leading-snug">{q.q}</h2>
      {q.hint && <p className="text-sub mt-2">{q.hint}</p>}

      <div className="grid gap-3 mt-7">
        {q.options.map((o, i) => {
          const selected = answered === i;
          return (
            <button
              key={i}
              onClick={() => onPick(i)}
              className={`text-left rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 group ${
                selected
                  ? "border-accent bg-accent-soft"
                  : "border-line bg-paper hover:border-ink/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="font-semibold text-[1.05rem]">{o.label}</span>
                  {o.desc && <p className="text-sm text-sub mt-0.5">{o.desc}</p>}
                </div>
                <span className="shrink-0 w-7 h-7 rounded-full border border-line group-hover:border-accent flex items-center justify-center text-sub group-hover:text-accent transition-colors">
                  →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onBack}
        className="mt-7 text-sm text-sub hover:text-ink underline underline-offset-4"
      >
        ← 이전
      </button>
    </div>
  );
}

function Result({ result, onRestart, phone }: { result: FinderResult; onRestart: () => void; phone: string }) {
  const { wallpaper, grade, mood, productHint } = result;
  const estimateHref = `/estimate?wallpaper=${wallpaper}${
    wallpaper === "silk" ? `&grade=${encodeURIComponent(grade)}` : ""
  }`;

  return (
    <div>
      <div className="rounded-3xl border border-line overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        {/* 컬러 무드 헤더 */}
        <div className="relative px-7 md:px-10 py-12 text-center overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${mood.palette[1]}, ${mood.palette[3]})`,
            }}
          />
          <div className="relative">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-white/80">
              Your Wallpaper Mood
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 text-white drop-shadow-sm">
              {mood.title}
            </h2>
            <p className="text-white/90 mt-3 max-w-md mx-auto">{mood.tagline}</p>
            <div className="mt-6 flex justify-center gap-1.5">
              {mood.palette.map((c) => (
                <span
                  key={c}
                  className="w-9 h-9 rounded-full ring-2 ring-white/70 shadow"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 추천 내용 */}
        <div className="bg-paper px-7 md:px-10 py-8">
          <p className="text-ink leading-relaxed">{mood.desc}</p>

          <div className="grid sm:grid-cols-3 gap-3 mt-7">
            <Stat label="추천 벽지" value={`${WP_LABEL[wallpaper]} 벽지`} />
            <Stat label="추천 등급" value={wallpaper === "silk" ? `${grade} 등급` : "합지 시공"} />
            <Stat label="키워드" value={mood.keywords.slice(0, 2).join(" · ")} />
          </div>

          <div className="mt-6 rounded-2xl bg-soft border border-line p-5">
            <p className="text-sm font-semibold">추천 제품군</p>
            <p className="text-sm text-sub mt-1">{productHint}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {mood.keywords.map((k) => (
                <span key={k} className="text-xs px-2.5 py-1 rounded-full bg-paper border border-line">
                  #{k}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link href={estimateHref} className="btn btn-accent flex-1">
              이 추천으로 간편견적 받기 →
            </Link>
            <a href={telHref(phone)} className="btn btn-outline flex-1">
              전화로 샘플 상담
            </a>
          </div>
          <p className="text-xs text-sub mt-3 text-center">
            추천값이 견적에 자동으로 반영됩니다. 공간과 평형만 고르면 끝!
          </p>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-6 block mx-auto text-sm text-sub hover:text-ink underline underline-offset-4"
      >
        다시 진단하기
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4 text-center">
      <p className="text-xs text-sub">{label}</p>
      <p className="font-bold mt-1">{value}</p>
    </div>
  );
}
