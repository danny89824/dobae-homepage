"use client";
import React, { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { SectionHead } from "@/lib/content-types";

// 파일 1개를 Vercel Blob에 업로드하고 URL 반환 (관리자 비번을 clientPayload로 전달)
async function uploadImage(file: File, pw: string): Promise<string> {
  const safe = file.name.replace(/[^\w.\-]/g, "_");
  const blob = await upload(`uploads/${safe}`, file, {
    access: "public",
    handleUploadUrl: "/api/admin/upload",
    clientPayload: pw,
  });
  return blob.url;
}

// 파일 선택 → 업로드 → URL들을 콜백으로 전달하는 버튼
export function UploadButton({
  pw, onUploaded, multiple, label = "사진 업로드",
}: {
  pw: string;
  onUploaded: (urls: string[]) => void;
  multiple?: boolean;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handle = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setBusy(true);
    setErr("");
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) {
        urls.push(await uploadImage(f, pw));
      }
      onUploaded(urls);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "업로드 실패");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-line-2 bg-white px-3 py-2 text-xs font-semibold text-ink hover:border-ink disabled:opacity-50"
      >
        {busy ? "업로드 중…" : `📁 ${label}`}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        hidden
        onChange={(e) => handle(e.target.files)}
      />
      {err && <span className="text-xs text-red-500">{err}</span>}
    </span>
  );
}

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

// 섹션 제목(라벨/제목/설명) 편집기 — 여러 섹션에서 재사용
export function HeadEditor({
  value,
  onChange,
  noSub,
}: {
  value: SectionHead;
  onChange: (v: SectionHead) => void;
  noSub?: boolean;
}) {
  return (
    <div className="grid gap-3">
      <div className="grid sm:grid-cols-[150px_1fr] gap-3">
        <Field label="라벨(영문)" value={value.eyebrow} onChange={(v) => onChange({ ...value, eyebrow: v })} hint="예: Portfolio" />
        <Field label="제목" value={value.heading} onChange={(v) => onChange({ ...value, heading: v })} />
      </div>
      {!noSub && (
        <Field label="설명" value={value.sub} onChange={(v) => onChange({ ...value, sub: v })} textarea />
      )}
    </div>
  );
}

// 이미지 URL 여러 장 편집 — 썸네일·순서이동·삭제·추가. 첫 장이 대표(커버).
export function ImageList({
  images,
  onChange,
  pw,
}: {
  images: string[];
  onChange: (next: string[]) => void;
  pw: string;
}) {
  const setAt = (i: number, v: string) => {
    const next = images.slice();
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => onChange(images.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = images.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="block text-xs font-semibold text-sub">사진 ({images.length}장)</span>
        <span className="text-[0.7rem] text-sub/70">첫 번째 = 대표(커버) 사진</span>
      </div>
      {images.map((url, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="relative shrink-0">
            {url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border border-line bg-soft" />
            ) : (
              <div className="w-16 h-16 rounded-lg border border-dashed border-line-2 bg-soft" />
            )}
            {i === 0 && (
              <span className="absolute -top-1.5 -left-1.5 text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full bg-accent text-white">대표</span>
            )}
          </div>
          <input
            value={url}
            onChange={(e) => setAt(i, e.target.value)}
            placeholder="https://… 이미지 URL"
            className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-xs font-mono focus:border-accent focus:outline-none"
          />
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                className="w-6 h-6 rounded-md border border-line bg-white text-sub text-xs disabled:opacity-30 hover:border-ink">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1}
                className="w-6 h-6 rounded-md border border-line bg-white text-sub text-xs disabled:opacity-30 hover:border-ink">↓</button>
            </div>
            <button type="button" onClick={() => remove(i)}
              className="w-full h-6 rounded-md border border-red-200 bg-white text-red-500 text-xs hover:bg-red-50">삭제</button>
          </div>
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <UploadButton pw={pw} multiple label="사진 업로드" onUploaded={(urls) => onChange([...images, ...urls])} />
        <button
          type="button"
          onClick={() => onChange([...images, ""])}
          className="rounded-lg border border-dashed border-line-2 px-3 py-2 text-xs font-semibold text-sub hover:border-accent hover:text-accent"
        >
          + URL 직접 입력
        </button>
      </div>
    </div>
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
