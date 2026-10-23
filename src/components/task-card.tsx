"use client";

import { CalendarClock } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import type { Tarefa } from "@/server/store";

export function TaskCard({ tarefa }: { tarefa: Tarefa }) {
  const t = useTranslations("tarefa");
  const formatar = useFormatter();

  return (
    <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="min-w-0 flex-1 space-y-1.5">
        <h2 className="font-semibold break-words">{tarefa.titulo}</h2>
        {tarefa.descricao && (
          <p className="text-muted-foreground line-clamp-3 text-sm break-words whitespace-pre-line">
            {tarefa.descricao}
          </p>
        )}
        <p className="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
          <CalendarClock className="size-3.5" />
          {t("criadaEm", {
            data: formatar.dateTime(tarefa.dataCriacao, {
              dateStyle: "short",
              timeStyle: "short",
            }),
          })}
        </p>
      </div>
    </Card>
  );
}
