"use client";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content-types";
import { Field, Section, Repeater } from "./fields";

const PW_KEY = "dobae_admin_pw";

export default function AdminApp() {
  const [pw, setPw] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(PW_KEY);
    if (saved) setPw(saved);
  }, []);

  if (!pw) return <Login onAuth={(p) => { sessionStorage.setItem(PW_KEY, p); setPw(p); }} />;
  return <Editor pw={pw} onLogout={() => { sessionStorage.removeItem(PW_KEY); setPw(null); }} />;
}

function Login({ onAuth }: { onAuth: (pw: string) => void }) {
  const [value, setValue] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: value }),
      });
      const data = await res.json();
      if (data.ok) onAuth(value);
      else setErr(data.error || "비밀번호가 올바르지 않습니다.");
    } catch {
      setErr("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-soft px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-line bg-white p-8">
        <h1 className="text-xl font-bold">도배청년단 백오피스</h1>
        <p className="text-sm text-sub mt-1">관리자 비밀번호를 입력하세요.</p>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="비밀번호"
          autoFocus
          className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm mt-5 focus:border-accent focus:outline-none"
        />
        {err && <p className="text-sm text-red-500 mt-2">{err}</p>}
        <button type="submit" disabled={loading} className="btn btn-accent w-full mt-4 disabled:opacity-60">
          {loading ? "확인 중…" : "로그인"}
        </button>
      </form>
    </div>
  );
}

function Editor({ pw, onLogout }: { pw: string; onLogout: () => void }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loadErr, setLoadErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");
  const [saveErr, setSaveErr] = useState("");

  useEffect(() => {
    fetch("/api/admin/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: SiteContent) => setContent(d))
      .catch(() => setLoadErr("콘텐츠를 불러오지 못했습니다."));
  }, []);

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setSaveErr("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json", "x-admin-password": pw },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (data.ok) setSavedAt(new Date().toLocaleTimeString("ko-KR"));
      else setSaveErr(data.error || "저장에 실패했습니다.");
    } catch {
      setSaveErr("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loadErr) return <div className="p-10 text-center text-red-500">{loadErr}</div>;
  if (!content) return <div className="p-10 text-center text-sub">불러오는 중…</div>;

  const set = (patch: Partial<SiteContent>) => setContent({ ...content, ...patch });

  return (
    <div className="min-h-screen bg-soft pb-32">
      {/* 상단 바 */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-line">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold">도배청년단 백오피스</span>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="text-sm text-sub hover:text-ink underline underline-offset-4">사이트 보기 ↗</a>
            <button onClick={onLogout} className="text-sm text-sub hover:text-ink">로그아웃</button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <p className="text-sm text-sub">
          내용을 수정한 뒤 <b className="text-ink">저장하기</b>를 누르면 사이트에 바로 반영됩니다.
        </p>

        {/* 사이트 정보 */}
        <Section title="사이트 정보" desc="연락처·슬로건 등 기본 정보">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="슬로건" value={content.site.slogan} onChange={(v) => set({ site: { ...content.site, slogan: v } })} />
            <Field label="전화번호" value={content.site.phone} onChange={(v) => set({ site: { ...content.site, phone: v } })} hint="tel 링크는 자동 생성" />
            <Field label="서브 문구" value={content.site.sub} onChange={(v) => set({ site: { ...content.site, sub: v } })} />
            <Field label="카카오채널 URL" value={content.site.kakaoChannel} onChange={(v) => set({ site: { ...content.site, kakaoChannel: v } })} />
            <Field label="법인명" value={content.site.legal} onChange={(v) => set({ site: { ...content.site, legal: v } })} />
            <Field label="저작권 연도" value={content.site.copyrightYear} onChange={(v) => set({ site: { ...content.site, copyrightYear: Number(v) || content.site.copyrightYear } })} />
          </div>
        </Section>

        {/* 히어로 */}
        <Section title="메인 히어로" desc="홈페이지 첫 화면">
          <div className="grid gap-3">
            <Field label="상단 라벨" value={content.hero.eyebrow} onChange={(v) => set({ hero: { ...content.hero, eyebrow: v } })} />
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="헤드라인 1줄" value={content.hero.headlineLine1} onChange={(v) => set({ hero: { ...content.hero, headlineLine1: v } })} />
              <Field label="헤드라인 2줄" value={content.hero.headlineLine2} onChange={(v) => set({ hero: { ...content.hero, headlineLine2: v } })} />
            </div>
            <Field label="히어로 문구" value={content.hero.sub} onChange={(v) => set({ hero: { ...content.hero, sub: v } })} textarea />
            <Field label="배경 이미지 URL" value={content.hero.image} onChange={(v) => set({ hero: { ...content.hero, image: v } })} mono />
            {content.hero.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={content.hero.image} alt="" className="h-32 w-full object-cover rounded-lg border border-line" />
            )}
          </div>
        </Section>

        {/* 신뢰 지표 */}
        <Section title="신뢰 지표" desc="2,000건+ / 99.8% 등 핵심 숫자">
          <Repeater
            items={content.trust}
            onChange={(trust) => set({ trust })}
            blank={() => ({ value: "", label: "" })}
            itemLabel={(it) => it.value || "지표"}
            render={(it, s) => (
              <div className="grid grid-cols-2 gap-3">
                <Field label="숫자/값" value={it.value} onChange={(v) => s({ value: v })} />
                <Field label="설명" value={it.label} onChange={(v) => s({ label: v })} />
              </div>
            )}
          />
        </Section>

        {/* 시공 권역 */}
        <Section title="시공 권역" desc="한 줄에 하나씩">
          <Field
            label="권역 목록"
            value={content.regions.join("\n")}
            onChange={(v) => set({ regions: v.split("\n").map((s) => s.trim()).filter(Boolean) })}
            textarea
            hint="예: 서울 마포 / 줄바꿈으로 구분"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {content.regions.map((r) => (
              <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-soft border border-line">{r}</span>
            ))}
          </div>
        </Section>

        {/* 시공사례 */}
        <Section title="시공사례" desc="홈 슬라이더·시공사례 페이지에 표시">
          <Repeater
            items={content.cases}
            onChange={(cases) => set({ cases })}
            blank={() => ({ no: String(content.cases.length + 1).padStart(2, "0"), title: "", space: "", wallpaper: "", region: "", img: "", tag: "" })}
            itemLabel={(it) => it.title || "새 사례"}
            render={(it, s) => (
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="제목" value={it.title} onChange={(v) => s({ title: v })} />
                <Field label="태그" value={it.tag} onChange={(v) => s({ tag: v })} hint="예: 거실 / 침실" />
                <Field label="공간" value={it.space} onChange={(v) => s({ space: v })} hint="예: 아파트 32평" />
                <Field label="벽지" value={it.wallpaper} onChange={(v) => s({ wallpaper: v })} hint="예: 실크 · 일반" />
                <Field label="지역" value={it.region} onChange={(v) => s({ region: v })} />
                <Field label="번호" value={it.no} onChange={(v) => s({ no: v })} />
                <div className="sm:col-span-2">
                  <Field label="이미지 URL" value={it.img} onChange={(v) => s({ img: v })} mono />
                  {it.img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.img} alt="" className="h-24 w-full object-cover rounded-lg border border-line mt-2" />
                  )}
                </div>
              </div>
            )}
          />
        </Section>

        {/* 프로세스 */}
        <Section title="시공 과정" desc="홈·도배안내의 단계 안내">
          <Repeater
            items={content.process}
            onChange={(process) => set({ process })}
            blank={() => ({ no: String(content.process.length + 1).padStart(2, "0"), title: "", desc: "" })}
            itemLabel={(it) => `${it.no} ${it.title}`}
            render={(it, s) => (
              <div className="grid gap-3">
                <div className="grid grid-cols-[80px_1fr] gap-3">
                  <Field label="번호" value={it.no} onChange={(v) => s({ no: v })} />
                  <Field label="제목" value={it.title} onChange={(v) => s({ title: v })} />
                </div>
                <Field label="설명" value={it.desc} onChange={(v) => s({ desc: v })} textarea />
              </div>
            )}
          />
        </Section>

        {/* FAQ */}
        <Section title="자주 묻는 질문" desc="홈 FAQ 아코디언">
          <Repeater
            items={content.faq}
            onChange={(faq) => set({ faq })}
            blank={() => ({ q: "", a: "" })}
            itemLabel={(it) => it.q || "새 질문"}
            render={(it, s) => (
              <div className="grid gap-3">
                <Field label="질문" value={it.q} onChange={(v) => s({ q: v })} />
                <Field label="답변" value={it.a} onChange={(v) => s({ a: v })} textarea />
              </div>
            )}
          />
        </Section>

        {/* 도배지 종류 */}
        <Section title="도배지 종류" desc="도배 안내 페이지">
          <Repeater
            items={content.paperTypes}
            onChange={(paperTypes) => set({ paperTypes })}
            blank={() => ({ key: "new", name: "", badge: "", feat: "", best: "", price: "" })}
            itemLabel={(it) => it.name || "새 도배지"}
            render={(it, s) => (
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="이름" value={it.name} onChange={(v) => s({ name: v })} />
                <Field label="배지" value={it.badge} onChange={(v) => s({ badge: v })} hint="예: 가성비 · 종이" />
                <div className="sm:col-span-2">
                  <Field label="설명" value={it.feat} onChange={(v) => s({ feat: v })} textarea />
                </div>
                <Field label="추천 용도" value={it.best} onChange={(v) => s({ best: v })} />
                <Field label="가격대" value={it.price} onChange={(v) => s({ price: v })} />
              </div>
            )}
          />
        </Section>
      </div>

      {/* 하단 저장 바 */}
      <div className="fixed bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur border-t border-line">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="text-sm">
            {saveErr ? (
              <span className="text-red-500">{saveErr}</span>
            ) : savedAt ? (
              <span className="text-accent">✓ {savedAt} 저장됨 · 사이트에 반영되었습니다</span>
            ) : (
              <span className="text-sub">변경 후 저장하면 즉시 반영됩니다</span>
            )}
          </div>
          <button onClick={save} disabled={saving} className="btn btn-accent !px-7 disabled:opacity-60">
            {saving ? "저장 중…" : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
