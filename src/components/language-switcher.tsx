"use client";

import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Flag } from "@/components/flag";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { definirIdioma } from "@/i18n/actions";
import { IDIOMAS, type Idioma } from "@/i18n/config";

export function LanguageSwitcher() {
  const atual = useLocale() as Idioma;
  const router = useRouter();
  const t = useTranslations("preferencias");
  const [trocando, iniciarTroca] = useTransition();

  const selecionar = (idioma: Idioma) =>
    iniciarTroca(async () => {
      await definirIdioma(idioma);
      router.refresh();
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t("idioma")}
          disabled={trocando}
        >
          <Flag idioma={atual} />
          <span className="uppercase">{atual}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {IDIOMAS.map((idioma) => (
          <DropdownMenuItem key={idioma} onSelect={() => selecionar(idioma)}>
            <Flag idioma={idioma} />
            {t(`idiomas.${idioma}`)}
            {idioma === atual && <Check className="ml-auto size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
