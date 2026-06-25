"use client";
import React from "react";

export function Field({
  label, value, onChange, textarea, placeholder, hint, mono,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
  hint?: string;
  mono?: boolean;
}) {
  const cls =
    "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none " +
    (mono ? "font-mono text-xs" : "");
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-sub mb-1">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={cls + " resize-y"}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
      {hint && <span className="block text-[0.7rem] text-sub/70 mt-1">{hint}</span>}
    </label>
  );
}

export function Section({
  title, desc, children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 md:p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        {desc && <p className="text-sm text-sub mt-0.5">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

// 리스트(반복) 편집기: 항목 추가/삭제/순서이동
export function Repeater<T>({
  items, onChange, blank, render, itemLabel,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  blank: () => T;
  render: (item: T, set: (patch: Partial<T>) => void) => React.ReactNode;
  itemLabel?: (item: T, i: number) => string;
}) {
  const setAt = (i: number, patch: Partial<T>) => {
    const next = items.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-line bg-soft/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-sub">
              {itemLabel ? itemLabel(item, i) : `#${i + 1}`}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                className="w-7 h-7 rounded-md border border-line bg-white text-sub disabled:opacity-30 hover:border-ink">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1}
                className="w-7 h-7 rounded-md border border-line bg-white text-sub disabled:opacity-30 hover:border-ink">↓</button>
              <button type="button" onClick={() => remove(i)}
                className="w-7 h-7 rounded-md border border-red-200 bg-white text-red-500 hover:bg-red-50">✕</button>
            </div>
          </div>
          {render(item, (patch) => setAt(i, patch))}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, blank()])}
        className="w-full rounded-xl border border-dashed border-line-2 py-2.5 text-sm font-semibold text-sub hover:border-accent hover:text-accent"
      >
        + 항목 추가
      </button>
    </div>
  );
}
