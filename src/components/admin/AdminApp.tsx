"use client";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/content-types";
import { caseImages } from "@/lib/content-types";
import { Field, Section, Repeater, HeadEditor, ImageList } from "./fields";

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

const NAV = [
  { id: "basic", label: "기본" },
  { id: "home", label: "홈" },
  { id: "portfolio", label: "시공사례" },
  { id: "guide", label: "도배안내" },
  { id: "about", label: "회사소개" },
];

function Group({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 space-y-5">
      <h2 className="text-lg font-extrabold text-ink pt-2">{title}</h2>
      {children}
    </section>
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

  const c = content;
  const set = (patch: Partial<SiteContent>) => setContent({ ...c, ...patch });

  return (
    <div className="min-h-screen bg-soft pb-32">
      {/* 상단 바 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-line">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold">도배청년단 백오피스</span>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noreferrer" className="text-sm text-sub hover:text-ink underline underline-offset-4">사이트 보기 ↗</a>
            <button onClick={onLogout} className="text-sm text-sub hover:text-ink">로그아웃</button>
          </div>
        </div>
        {/* 섹션 내비 */}
        <nav className="max-w-3xl mx-auto px-4 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="shrink-0 text-sm px-3 py-1.5 rounded-full bg-soft border border-line hover:border-ink hover:bg-white transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        <p className="text-sm text-sub">
          내용을 수정한 뒤 <b className="text-ink">저장하기</b>를 누르면 사이트에 바로 반영됩니다.
        </p>

        {/* ===================== 기본 ===================== */}
        <Group id="basic" title="기본 · 사이트 전역">
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
        </Group>

        {/* ===================== 홈 ===================== */}
        <Group id="home" title="홈페이지">
          <Section title="메인 히어로" desc="홈 첫 화면">
            <div className="grid gap-3">
              <Field label="상단 라벨" value={c.hero.eyebrow} onChange={(v) => set({ hero: { ...c.hero, eyebrow: v } })} />
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="헤드라인 1줄" value={c.hero.headlineLine1} onChange={(v) => set({ hero: { ...c.hero, headlineLine1: v } })} />
                <Field label="헤드라인 2줄" value={c.hero.headlineLine2} onChange={(v) => set({ hero: { ...c.hero, headlineLine2: v } })} />
              </div>
              <Field label="히어로 문구" value={c.hero.sub} onChange={(v) => set({ hero: { ...c.hero, sub: v } })} textarea />
              <Field label="배경 이미지 URL" value={c.hero.image} onChange={(v) => set({ hero: { ...c.hero, image: v } })} mono />
              {c.hero.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.hero.image} alt="" className="h-32 w-full object-cover rounded-lg border border-line" />
              )}
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
                    <Field label="설명" value={it.desc} onChange={(v) => s({ desc: v })} textarea />
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
                  <Field label="후기 내용" value={it.body} onChange={(v) => s({ body: v })} textarea />
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
                  <Field label="답변" value={it.a} onChange={(v) => s({ a: v })} textarea />
                </div>
              )}
            />
          </Section>
        </Group>

        {/* ===================== 시공사례 ===================== */}
        <Group id="portfolio" title="시공사례 페이지">
          <Section title="페이지 상단 배너" desc="시공사례 페이지 헤더">
            <HeadEditor value={c.pageHeads.portfolio} onChange={(h) => set({ pageHeads: { ...c.pageHeads, portfolio: h } })} />
            <p className="text-[0.7rem] text-sub/70 mt-2">※ 설명 앞에 시공 권역이 자동으로 붙습니다.</p>
          </Section>

          <Section title="시공사례 목록" desc="홈 슬라이더 + 시공사례 페이지에 표시">
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
                      onChange={(imgs) => s({ images: imgs, img: imgs[0] || "" })}
                    />
                  </div>
                </div>
              )}
            />
          </Section>
        </Group>

        {/* ===================== 도배안내 ===================== */}
        <Group id="guide" title="도배 안내 페이지">
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
                    <Field label="설명" value={it.feat} onChange={(v) => s({ feat: v })} textarea />
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
                  <Field label="설명" value={it.desc} onChange={(v) => s({ desc: v })} textarea />
                </div>
              )}
            />
          </Section>
        </Group>

        {/* ===================== 회사소개 ===================== */}
        <Group id="about" title="회사소개 페이지">
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
                    <Field label="설명" value={it.desc} onChange={(v) => s({ desc: v })} textarea />
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
        </Group>
      </div>

      {/* 하단 저장 바 */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-line">
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
