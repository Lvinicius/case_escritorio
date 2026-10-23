"use client";

import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Error({ reset }: { reset: () => void }) {
  const t = useTranslations("erros");

  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <TriangleAlert className="text-destructive size-8" />
      <h1 className="text-lg font-semibold">{t("algoErrado")}</h1>
      <p className="text-muted-foreground text-sm">{t("naoCarregou")}</p>
      <Button onClick={reset} className="mt-2">
        {t("tentarNovamente")}
      </Button>
    </Card>
  );
}
