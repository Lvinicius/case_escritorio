import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const t = useTranslations("lista");

  return (
    <div className="space-y-3" aria-busy="true" aria-label={t("carregando")}>
      <Skeleton className="mb-6 h-14 w-2/3" />
      {Array.from({ length: 4 }, (_, i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>
  );
}
