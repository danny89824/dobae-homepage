import type { Metadata } from "next";
import { getContent } from "@/lib/content-store";

export const metadata: Metadata = {
  title: "개인정보 처리방침 — 도배청년단",
  description: "도배청년단(라이프리터치) 개인정보 수집·이용에 관한 처리방침입니다.",
  robots: { index: true, follow: true },
};

export default async function PrivacyPage() {
  const { site } = await getContent();
  const company = site.legal || "라이프리터치";

  return (
    <>
      <section className="pt-28 md:pt-32 pb-10 bg-soft border-b border-line">
        <div className="container-x">
          <p className="eyebrow num-label">PRIVACY</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2 tracking-tight leading-tight">
            개인정보 처리방침
          </h1>
          <p className="text-sub mt-4 max-w-2xl leading-relaxed">
            {company}(이하 &lsquo;회사&rsquo;)은(는) 이용자의 개인정보를 중요하게 여기며, 관련 법령을 준수합니다.
          </p>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-x max-w-3xl space-y-10 text-[0.95rem] leading-relaxed text-ink">
          <div>
            <h2 className="text-lg font-bold mb-2">1. 수집하는 개인정보 항목</h2>
            <p className="text-sub">
              회사는 상담 신청·간편견적 서비스 제공을 위해 아래 정보를 수집합니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sub">
              <li>필수: 이름, 연락처(휴대전화번호)</li>
              <li>선택: 시공 지역, 견적 관련 입력값, 문의 내용</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">2. 개인정보의 수집·이용 목적</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sub">
              <li>상담 및 견적 안내, 시공 문의 응대</li>
              <li>서비스 제공 및 관련 연락</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">3. 보유 및 이용 기간</h2>
            <p className="text-sub">
              수집한 개인정보는 상담·문의 처리 완료 후 지체 없이 파기합니다. 다만 관계 법령에 따라
              보존할 필요가 있는 경우 해당 기간 동안 보관합니다.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">4. 제3자 제공 및 처리위탁</h2>
            <p className="text-sub">
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않으며, 법령에 근거가 있거나
              이용자의 동의가 있는 경우에 한합니다.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">5. 정보주체의 권리</h2>
            <p className="text-sub">
              이용자는 언제든지 자신의 개인정보에 대한 열람·정정·삭제·처리정지를 요청할 수 있으며,
              아래 연락처로 요청하실 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">6. 개인정보 보호책임자 및 문의</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sub">
              <li>상호: {company}</li>
              <li>연락처: {site.phone}</li>
            </ul>
            <p className="mt-3 text-xs text-sub bg-soft border border-line rounded-xl px-4 py-3">
              ※ 정식 공개 전 확인 필요: 사업자등록번호, 대표자명, 사업장 주소, 개인정보 보호책임자
              성명·이메일을 이 방침과 사이트 하단(푸터)에 추가해야 합니다. 통신판매(결제)를 진행하는
              경우 통신판매업 신고번호도 함께 표기해야 합니다.
            </p>
          </div>

          <p className="text-xs text-sub pt-4 border-t border-line">
            본 방침은 {site.copyrightYear}년 기준이며, 내용 변경 시 본 페이지를 통해 공지합니다.
          </p>
        </div>
      </section>
    </>
  );
}
