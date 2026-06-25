// 도배청년단 로고 — 라인아트 마크(집+롤러) + 워드마크, currentColor 적응
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      {/* 집 윤곽 */}
      <path
        d="M5 14.5 16 5l11 9.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 13.5V26h17V13.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 롤러(도배 도구) */}
      <rect x="12" y="15.5" width="8" height="4.2" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 19.7V26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({
  className = "",
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="w-7 h-7" />
      {showText && (
        <span className="font-bold tracking-tight text-[1.05rem] leading-none">
          도배청년단
        </span>
      )}
    </span>
  );
}
