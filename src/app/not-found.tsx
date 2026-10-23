import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  const t = useTranslations();

  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <SearchX className="text-muted-foreground size-8" />
      <h1 className="text-lg font-semibold">{t("erros.naoEncontrada")}</h1>
      <p className="text-muted-foreground text-sm">
        {t("erros.naoEncontradaTexto")}
      </p>
      <Button asChild className="mt-2">
        <Link href="/">{t("formulario.voltar")}</Link>
      </Button>
    </Card>
  );
}
