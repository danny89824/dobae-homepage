"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SiteContent } from "@/lib/content-types";
import { caseImages } from "@/lib/content-types";
import { DEFAULT_THEME } from "@/lib/theme";
import { Field, Section, Repeater, HeadEditor, ImageList, UploadButton, ColorField, RichTextField } from "./fields";

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

type TabId = "basic" | "home" | "portfolio" | "guide" | "about";
const TABS: { id: TabId; label: string; preview: string; previewLabel: string }[] = [
  { id: "basic", label: "기본", preview: "/", previewLabel: "전역(헤더·푸터)" },
  { id: "home", label: "홈", preview: "/", previewLabel: "홈페이지" },
  { id: "portfolio", label: "시공사례", preview: "/portfolio", previewLabel: "시공사례 페이지" },
  { id: "guide", label: "도배안내", preview: "/guide", previewLabel: "도배 안내 페이지" },
  { id: "about", label: "회사소개", preview: "/about", previewLabel: "회사소개 페이지" },
];

function Editor({ pw, onLogout }: { pw: string; onLogout: () => void }) {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loadErr, setLoadErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  const [saveErr, setSaveErr] = useState("");
  const [tab, setTab] = useState<TabId>("basic");
  const initialRef = useRef<string>(""); // 마지막 저장 시점 스냅샷(JSON)

  useEffect(() => {
    fetch("/api/admin/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: SiteContent) => {
        setContent(d);
        initialRef.current = JSON.stringify(d);
      })
      .catch(() => setLoadErr("콘텐츠를 불러오지 못했습니다."));
  }, []);

  const dirty = useMemo(
    () => (content ? JSON.stringify(content) !== initialRef.current : false),
    [content]
  );

  const save = useMemo(
    () => async () => {
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
        if (data.ok) {
          initialRef.current = JSON.stringify(content);
          setSavedAt(new Date().toLocaleTimeString("ko-KR"));
          setContent((c) => (c ? { ...c } : c)); // dirty 재계산 트리거
        } else setSaveErr(data.error || "저장에 실패했습니다.");
      } catch {
        setSaveErr("저장 중 오류가 발생했습니다.");
      } finally {
        setSaving(false);
      }
    },
    [content, pw]
  );

  // 미저장 변경 시 이탈 경고
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // Ctrl/Cmd + S 저장
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty && !saving) save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dirty, saving, save]);

  const revert = () => {
    if (!initialRef.current) return;
    if (dirty && !confirm("마지막 저장 상태로 되돌릴까요? 저장하지 않은 변경은 사라집니다.")) return;
    setContent(JSON.parse(initialRef.current) as SiteContent);
  };

  if (loadErr) return <div className="p-10 text-center text-red-500">{loadErr}</div>;
  if (!content) return <div className="p-10 text-center text-sub">불러오는 중…</div>;

  const c = content;
  const set = (patch: Partial<SiteContent>) => setContent({ ...c, ...patch });
  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div className="min-h-screen bg-soft pb-24">
      {/* 상단 바 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-line">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold shrink-0">도배청년단 백오피스</span>
            {dirty ? (
              <span className="shrink-0 text-[0.7rem] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">● 저장 안 됨</span>
            ) : savedAt ? (
              <span className="shrink-0 text-[0.7rem] text-sub">저장됨 {savedAt}</span>
            ) : null}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a href="/admin/board" className="text-sm text-accent font-semibold hover:underline underline-offset-4">실행보드 →</a>
            <a href="/" target="_blank" rel="noreferrer" className="text-sm text-sub hover:text-ink underline underline-offset-4">사이트 ↗</a>
            <button onClick={onLogout} className="text-sm text-sub hover:text-ink">로그아웃</button>
          </div>
        </div>
        {/* 탭 */}
        <div className="max-w-3xl mx-auto px-4 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
                t.id === tab
                  ? "bg-ink text-white border-ink"
                  : "bg-soft border-line text-sub hover:border-ink hover:bg-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* 탭 컨텍스트 */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <p className="text-sm text-sub">
            <b className="text-ink">{activeTab.previewLabel}</b> 콘텐츠를 편집합니다.
          </p>
          <a href={activeTab.preview} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline shrink-0">
            미리보기 ↗
          </a>
        </div>

        <div className="space-y-5">
          {/* ===================== 기본 ===================== */}
          {tab === "basic" && (
            <>
              <Section title="색상 · 테마" desc="섹션 배경/포인트 색 — 저장 시 전 페이지에 반영됩니다. 글자색은 배경 밝기에 따라 자동 대비.">
                <div className="grid sm:grid-cols-2 gap-3">
                  <ColorField label="페이지 기본 배경" value={c.theme.paper} onChange={(v) => set({ theme: { ...c.theme, paper: v } })} hint="밝은 색 권장 (FAQ·카드 등)" />
                  <ColorField label="밝은 섹션 배경" value={c.theme.soft} onChange={(v) => set({ theme: { ...c.theme, soft: v } })} hint="프로세스·후기 섹션" />
                  <ColorField label="어두운 섹션 배경" value={c.theme.dark} onChange={(v) => set({ theme: { ...c.theme, dark: v } })} hint="기준·최종 CTA·푸터 / 어두운 색 권장" />
                  <ColorField label="포인트 색" value={c.theme.accent} onChange={(v) => set({ theme: { ...c.theme, accent: v } })} hint="버튼·강조·링크" />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <button type="button" onClick={() => set({ theme: { ...DEFAULT_THEME } })} className="text-xs text-sub underline hover:text-ink">
                    기본 색으로 초기화
                  </button>
                  <div className="flex items-center gap-1">
                    {[c.theme.paper, c.theme.soft, c.theme.dark, c.theme.accent].map((col, i) => (
                      <span key={i} className="w-6 h-6 rounded-md border border-line" style={{ background: col }} title={col} />
                    ))}
                  </div>
                </div>
              </Section>

              <Section title="사이트 정보" desc="연락처·슬로건 등 기본 정보 (헤더/푸터/전역)">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="슬로건" value={c.site.slogan} onChange={(v) => set({ site: { ...c.site, slogan: v } })} />
                  <Field label="전화번호" value={c.site.phone} onChange={(v) => set({ site: { ...c.site, phone: v } })} hint="tel 링크 자동 생성" />
                  <Field label="서브 문구" value={c.site.sub} onChange={(v) => set({ site: { ...c.site, sub: v } })} />
                  <Field label="카카오채널 URL" value={c.site.kakaoChannel} onChange={(v) => set({ site: { ...c.site, kakaoChannel: v } })} />
                  <Field label="법인명" value={c.site.legal} onChange={(v) => set({ site: { ...c.site, legal: v } })} />
                  <Field label="저작권 연도" value={c.site.copyrightYear} onChange={(v) => set({ site: { ...c.site, copyrightYear: Number(v) || c.site.copyrightYear } })} />
                </div>
              </Section>

              <Section title="신뢰 지표" desc="2,000건+ / 99.8% 등 핵심 숫자 (홈 히어로·회사소개)">
                <Repeater
                  items={c.trust}
                  onChange={(trust) => set({ trust })}
                  blank={() => ({ value: "", label: "" })}
                  itemLabel={(it) => it.value || "지표"}
                  render={(it, s) => (
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="숫자/값" value={it.value} onChange={(v) => s({ value: v })} hint="숫자는 0부터 카운트업" />
                      <Field label="설명" value={it.label} onChange={(v) => s({ label: v })} />
                    </div>
                  )}
                />
              </Section>

              <Section title="시공 권역" desc="한 줄에 하나씩 (푸터·홈·회사소개에 표시)">
                <Field
                  label="권역 목록"
                  value={c.regions.join("\n")}
                  onChange={(v) => set({ regions: v.split("\n").map((s) => s.trim()).filter(Boolean) })}
                  textarea
                  hint="예: 서울 마포 / 줄바꿈으로 구분"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.regions.map((r) => (
                    <span key={r} className="text-xs px-2 py-0.5 rounded-full bg-soft border border-line">{r}</span>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* ===================== 홈 ===================== */}
          {tab === "home" && (
            <>
              <Section title="메인 히어로" desc="홈 첫 화면">
                <div className="grid gap-3">
                  <Field label="상단 라벨" value={c.hero.eyebrow} onChange={(v) => set({ hero: { ...c.hero, eyebrow: v } })} />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="헤드라인 1줄" value={c.hero.headlineLine1} onChange={(v) => set({ hero: { ...c.hero, headlineLine1: v } })} />
                    <Field label="헤드라인 2줄" value={c.hero.headlineLine2} onChange={(v) => set({ hero: { ...c.hero, headlineLine2: v } })} />
                  </div>
                  <RichTextField label="히어로 문구" value={c.hero.sub} onChange={(v) => set({ hero: { ...c.hero, sub: v } })} />
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="block text-xs font-semibold text-sub">배경 이미지</span>
                      <UploadButton pw={pw} label="이미지 업로드" onUploaded={(urls) => urls[0] && set({ hero: { ...c.hero, image: urls[0] } })} />
                    </div>
                    <Field label="" value={c.hero.image} onChange={(v) => set({ hero: { ...c.hero, image: v } })} mono placeholder="https://… 또는 업로드" />
                    {c.hero.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.hero.image} alt="" className="h-32 w-full object-cover rounded-lg border border-line mt-2" />
                    )}
                  </div>
                </div>
              </Section>

              <Section title="우리의 기준 (Standard)" desc="다크 섹션 — 제목 + 3가지 기둥">
                <div className="grid gap-3">
                  <div className="grid sm:grid-cols-[150px_1fr] gap-3">
                    <Field label="라벨(영문)" value={c.standard.eyebrow} onChange={(v) => set({ standard: { ...c.standard, eyebrow: v } })} />
                    <Field label="제목" value={c.standard.heading} onChange={(v) => set({ standard: { ...c.standard, heading: v } })} />
                  </div>
                  <Field label="설명" value={c.standard.sub} onChange={(v) => set({ standard: { ...c.standard, sub: v } })} textarea />
                </div>
                <div className="mt-4">
                  <Repeater
                    items={c.standard.pillars}
                    onChange={(pillars) => set({ standard: { ...c.standard, pillars } })}
                    blank={() => ({ no: String(c.standard.pillars.length + 1).padStart(2, "0"), title: "", desc: "" })}
                    itemLabel={(it) => `${it.no} ${it.title}`}
                    render={(it, s) => (
                      <div className="grid gap-3">
                        <div className="grid grid-cols-[80px_1fr] gap-3">
                          <Field label="번호" value={it.no} onChange={(v) => s({ no: v })} />
                          <Field label="제목" value={it.title} onChange={(v) => s({ title: v })} />
                        </div>
                        <RichTextField label="설명" value={it.desc} onChange={(v) => s({ desc: v })} />
                      </div>
                    )}
                  />
                </div>
              </Section>

              <Section title="전환 카드 (도배지 찾기 / 간편견적)" desc="홈 중앙의 두 안내 카드">
                <div className="grid gap-4">
                  <div className="rounded-xl border border-line p-4">
                    <p className="text-xs font-semibold text-accent mb-2">도배지 찾기 카드</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field label="라벨" value={c.homeCta.finder.eyebrow} onChange={(v) => set({ homeCta: { ...c.homeCta, finder: { ...c.homeCta.finder, eyebrow: v } } })} />
                      <Field label="버튼 문구" value={c.homeCta.finder.cta} onChange={(v) => set({ homeCta: { ...c.homeCta, finder: { ...c.homeCta.finder, cta: v } } })} />
                      <div className="sm:col-span-2">
                        <Field label="제목" value={c.homeCta.finder.title} onChange={(v) => set({ homeCta: { ...c.homeCta, finder: { ...c.homeCta.finder, title: v } } })} />
                      </div>
                      <div className="sm:col-span-2">
                        <Field label="설명" value={c.homeCta.finder.sub} onChange={(v) => set({ homeCta: { ...c.homeCta, finder: { ...c.homeCta.finder, sub: v } } })} textarea />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-line p-4">
                    <p className="text-xs font-semibold text-accent mb-2">간편견적 카드</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field label="라벨" value={c.homeCta.estimate.eyebrow} onChange={(v) => set({ homeCta: { ...c.homeCta, estimate: { ...c.homeCta.estimate, eyebrow: v } } })} />
                      <Field label="버튼 문구" value={c.homeCta.estimate.cta} onChange={(v) => set({ homeCta: { ...c.homeCta, estimate: { ...c.homeCta.estimate, cta: v } } })} />
                      <div className="sm:col-span-2">
                        <Field label="제목" value={c.homeCta.estimate.title} onChange={(v) => set({ homeCta: { ...c.homeCta, estimate: { ...c.homeCta.estimate, title: v } } })} />
                      </div>
                      <div className="sm:col-span-2">
                        <Field label="설명" value={c.homeCta.estimate.sub} onChange={(v) => set({ homeCta: { ...c.homeCta, estimate: { ...c.homeCta.estimate, sub: v } } })} textarea />
                      </div>
                    </div>
                  </div>
                </div>
              </Section>

              <Section title="홈 섹션 제목" desc="시공사례·프로세스·후기·FAQ 섹션의 제목/설명">
                <div className="grid gap-4">
                  {([
                    ["portfolio", "시공사례 섹션"],
                    ["process", "프로세스 섹션"],
                    ["reviews", "후기 섹션"],
                    ["faq", "FAQ 섹션"],
                  ] as const).map(([key, label]) => (
                    <div key={key} className="rounded-xl border border-line p-4">
                      <p className="text-xs font-semibold text-accent mb-2">{label}</p>
                      <HeadEditor
                        value={c.homeHeads[key]}
                        noSub={key === "faq"}
                        onChange={(h) => set({ homeHeads: { ...c.homeHeads, [key]: h } })}
                      />
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="최종 CTA" desc="홈 맨 아래 다크 배너">
                <div className="grid gap-3">
                  <Field label="제목" value={c.homeCta.finalHeading} onChange={(v) => set({ homeCta: { ...c.homeCta, finalHeading: v } })} />
                  <Field label="설명" value={c.homeCta.finalSub} onChange={(v) => set({ homeCta: { ...c.homeCta, finalSub: v } })} />
                </div>
              </Section>

              <Section title="고객 후기" desc="홈 후기 섹션·별점">
                <Repeater
                  items={c.reviews}
                  onChange={(reviews) => set({ reviews })}
                  blank={() => ({ name: "", space: "", rating: 5, body: "" })}
                  itemLabel={(it) => it.name || "새 후기"}
                  render={(it, s) => (
                    <div className="grid gap-3">
                      <div className="grid sm:grid-cols-[1fr_1fr_90px] gap-3">
                        <Field label="고객 표기" value={it.name} onChange={(v) => s({ name: v })} hint="예: 송파 김○○" />
                        <Field label="공간" value={it.space} onChange={(v) => s({ space: v })} hint="예: 아파트 32평 · 거실" />
                        <Field label="별점(1~5)" value={it.rating} onChange={(v) => s({ rating: Math.min(5, Math.max(1, Number(v) || 5)) })} />
                      </div>
                      <RichTextField label="후기 내용" value={it.body} onChange={(v) => s({ body: v })} />
                    </div>
                  )}
                />
              </Section>

              <Section title="자주 묻는 질문 (FAQ)" desc="홈 FAQ 아코디언">
                <Repeater
                  items={c.faq}
                  onChange={(faq) => set({ faq })}
                  blank={() => ({ q: "", a: "" })}
                  itemLabel={(it) => it.q || "새 질문"}
                  render={(it, s) => (
                    <div className="grid gap-3">
                      <Field label="질문" value={it.q} onChange={(v) => s({ q: v })} />
                      <RichTextField label="답변" value={it.a} onChange={(v) => s({ a: v })} hint="굵게·색·크기·가운데정렬 지원 · 줄바꿈 그대로 반영" />
                    </div>
                  )}
                />
              </Section>
            </>
          )}

          {/* ===================== 시공사례 ===================== */}
          {tab === "portfolio" && (
            <>
              <Section title="페이지 상단 배너" desc="시공사례 페이지 헤더">
                <HeadEditor value={c.pageHeads.portfolio} onChange={(h) => set({ pageHeads: { ...c.pageHeads, portfolio: h } })} />
                <p className="text-[0.7rem] text-sub/70 mt-2">※ 설명 앞에 시공 권역이 자동으로 붙습니다.</p>
              </Section>

              <Section title="시공사례 목록" desc="홈 슬라이더 + 시공사례 페이지에 표시 · 사례별 사진 여러 장 가능">
                <Repeater
                  items={c.cases}
                  onChange={(cases) => set({ cases })}
                  blank={() => ({ no: String(c.cases.length + 1).padStart(2, "0"), title: "", space: "", wallpaper: "", region: "", img: "", images: [], tag: "" })}
                  itemLabel={(it) => it.title || "새 사례"}
                  render={(it, s) => (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field label="제목" value={it.title} onChange={(v) => s({ title: v })} />
                      <Field label="태그" value={it.tag} onChange={(v) => s({ tag: v })} hint="예: 거실 / 침실" />
                      <Field label="공간" value={it.space} onChange={(v) => s({ space: v })} hint="예: 아파트 32평" />
                      <Field label="벽지" value={it.wallpaper} onChange={(v) => s({ wallpaper: v })} hint="예: 실크 · 일반" />
                      <Field label="지역" value={it.region} onChange={(v) => s({ region: v })} />
                      <Field label="번호" value={it.no} onChange={(v) => s({ no: v })} />
                      <div className="sm:col-span-2 rounded-xl border border-line p-3 bg-white">
                        <ImageList
                          images={caseImages(it)}
                          pw={pw}
                          onChange={(imgs) => s({ images: imgs, img: imgs[0] || "" })}
                        />
                      </div>
                    </div>
                  )}
                />
              </Section>
            </>
          )}

          {/* ===================== 도배안내 ===================== */}
          {tab === "guide" && (
            <>
              <Section title="페이지 상단 배너" desc="도배 안내 페이지 헤더">
                <HeadEditor value={c.pageHeads.guide} onChange={(h) => set({ pageHeads: { ...c.pageHeads, guide: h } })} />
              </Section>

              <Section title="도배지 종류 섹션 제목">
                <HeadEditor value={c.guide.wallpaperHead} onChange={(h) => set({ guide: { ...c.guide, wallpaperHead: h } })} />
              </Section>

              <Section title="도배지 종류 목록" desc="합지·실크·광폭 등">
                <Repeater
                  items={c.paperTypes}
                  onChange={(paperTypes) => set({ paperTypes })}
                  blank={() => ({ key: "new", name: "", badge: "", feat: "", best: "", price: "" })}
                  itemLabel={(it) => it.name || "새 도배지"}
                  render={(it, s) => (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field label="이름" value={it.name} onChange={(v) => s({ name: v })} />
                      <Field label="배지" value={it.badge} onChange={(v) => s({ badge: v })} hint="예: 가성비 · 종이" />
                      <div className="sm:col-span-2">
                        <RichTextField label="설명" value={it.feat} onChange={(v) => s({ feat: v })} />
                      </div>
                      <Field label="추천 용도" value={it.best} onChange={(v) => s({ best: v })} />
                      <Field label="가격대" value={it.price} onChange={(v) => s({ price: v })} />
                    </div>
                  )}
                />
              </Section>

              <Section title="프로모 박스" desc="도배지 종류 아래 '도배지 찾기' 유도 박스">
                <div className="grid gap-3">
                  <Field label="제목" value={c.guide.promoTitle} onChange={(v) => set({ guide: { ...c.guide, promoTitle: v } })} />
                  <Field label="설명" value={c.guide.promoSub} onChange={(v) => set({ guide: { ...c.guide, promoSub: v } })} />
                </div>
              </Section>

              <Section title="시공 과정 섹션 제목">
                <HeadEditor value={c.guide.processHead} onChange={(h) => set({ guide: { ...c.guide, processHead: h } })} />
              </Section>

              <Section title="시공 과정 단계" desc="홈·도배안내의 6단계">
                <Repeater
                  items={c.process}
                  onChange={(process) => set({ process })}
                  blank={() => ({ no: String(c.process.length + 1).padStart(2, "0"), title: "", desc: "" })}
                  itemLabel={(it) => `${it.no} ${it.title}`}
                  render={(it, s) => (
                    <div className="grid gap-3">
                      <div className="grid grid-cols-[80px_1fr] gap-3">
                        <Field label="번호" value={it.no} onChange={(v) => s({ no: v })} />
                        <Field label="제목" value={it.title} onChange={(v) => s({ title: v })} />
                      </div>
                      <RichTextField label="설명" value={it.desc} onChange={(v) => s({ desc: v })} />
                    </div>
                  )}
                />
              </Section>
            </>
          )}

          {/* ===================== 회사소개 ===================== */}
          {tab === "about" && (
            <>
              <Section title="페이지 상단 배너" desc="회사소개 페이지 헤더">
                <HeadEditor value={c.pageHeads.about} onChange={(h) => set({ pageHeads: { ...c.pageHeads, about: h } })} />
              </Section>

              <Section title="강점 섹션" desc="'믿고 맡길 수 있는 이유' 제목 + 강점 목록">
                <HeadEditor value={c.about.whyHead} noSub onChange={(h) => set({ about: { ...c.about, whyHead: h } })} />
                <div className="mt-4">
                  <Repeater
                    items={c.about.strengths}
                    onChange={(strengths) => set({ about: { ...c.about, strengths } })}
                    blank={() => ({ title: "", desc: "" })}
                    itemLabel={(it) => it.title || "새 강점"}
                    render={(it, s) => (
                      <div className="grid gap-3">
                        <Field label="제목" value={it.title} onChange={(v) => s({ title: v })} />
                        <RichTextField label="설명" value={it.desc} onChange={(v) => s({ desc: v })} />
                      </div>
                    )}
                  />
                </div>
              </Section>

              <Section title="연락처 섹션" desc="'상담 안내' 제목 + 안내 문구">
                <HeadEditor value={c.about.contactHead} onChange={(h) => set({ about: { ...c.about, contactHead: h } })} />
                <p className="text-[0.7rem] text-sub/70 mt-2">※ 설명 앞에 시공 권역이 자동으로 붙습니다.</p>
                <div className="mt-3">
                  <Field label="'지금 바로 시작하기' 안내 문구" value={c.about.contactNote} onChange={(v) => set({ about: { ...c.about, contactNote: v } })} textarea />
                </div>
              </Section>
            </>
          )}
        </div>
      </div>

      {/* 하단 저장 바 */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-line pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="text-sm min-w-0">
            {saveErr ? (
              <span className="text-red-500">{saveErr}</span>
            ) : dirty ? (
              <span className="text-amber-600">저장하지 않은 변경이 있습니다</span>
            ) : savedAt ? (
              <span className="text-accent">✓ {savedAt} 저장됨 · 사이트 반영</span>
            ) : (
              <span className="text-sub">변경 후 저장하면 즉시 반영 · ⌘/Ctrl+S</span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={revert}
              disabled={!dirty || saving}
              className="btn btn-outline !py-2.5 !px-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              되돌리기
            </button>
            <button
              onClick={save}
              disabled={!dirty || saving}
              className="btn btn-accent !px-7 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "저장 중…" : "저장하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
