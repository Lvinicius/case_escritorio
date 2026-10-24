import { useTranslations } from "next-intl";
import Link from "next/link";
import { FILTROS, type Filtro } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Props = { atual: Filtro; total: number; concluidas: number };

export function TaskFilters({ atual, total, concluidas }: Props) {
  const t = useTranslations("filtros");
  const quantidades: Record<Filtro, number> = {
    todas: total,
    pendentes: total - concluidas,
    concluidas,
  };

  return (
    <nav
      aria-label={t("rotulo")}
      className="bg-muted inline-flex max-w-full overflow-x-auto rounded-lg p-1 text-sm"
    >
      {FILTROS.map((filtro) => {
        const ativo = filtro === atual;
        return (
          <Link
            key={filtro}
            href={filtro === "todas" ? "/" : `/?filtro=${filtro}`}
            scroll={false}
            aria-current={ativo ? "page" : undefined}
            className={cn(
              "focus-visible:ring-ring/50 flex items-center gap-2 rounded-md px-3 py-1.5 font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px]",
              ativo
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t(filtro)}
            <span
              className={cn(
                "rounded-full px-1.5 text-xs tabular-nums",
                ativo
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/60",
              )}
            >
              {quantidades[filtro]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
