import type { Idioma } from "@/i18n/config";
import { cn } from "@/lib/utils";

const BANDEIRAS: Record<Idioma, React.ReactNode> = {
  pt: (
    <>
      <rect width="28" height="20" fill="#009c3b" />
      <path d="M14 3 25 10 14 17 3 10Z" fill="#ffdf00" />
      <circle cx="14" cy="10" r="4" fill="#002776" />
    </>
  ),
  en: (
    <>
      <rect width="28" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((faixa) => (
        <rect
          key={faixa}
          y={(faixa * 20) / 13}
          width="28"
          height={20 / 13}
          fill="#b22234"
        />
      ))}
      <rect width="12" height={(7 * 20) / 13} fill="#3c3b6e" />
    </>
  ),
  es: (
    <>
      <rect width="28" height="20" fill="#aa151b" />
      <rect y="5" width="28" height="10" fill="#f1bf00" />
    </>
  ),
};

export function Flag({
  idioma,
  className,
}: {
  idioma: Idioma;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 28 20"
      aria-hidden
      className={cn("h-3.5 w-5 shrink-0 rounded-[2px] shadow-xs", className)}
    >
      {BANDEIRAS[idioma]}
    </svg>
  );
}
