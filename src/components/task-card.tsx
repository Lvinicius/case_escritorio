"use client";

import { CalendarClock } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { DeleteTaskButton } from "@/components/delete-task-button";
import { Card } from "@/components/ui/card";
import { useExcluirTarefa } from "@/hooks/use-excluir-tarefa";
import { cn } from "@/lib/utils";
import type { Tarefa } from "@/server/store";

export function TaskCard({ tarefa }: { tarefa: Tarefa }) {
  const t = useTranslations("tarefa");
  const formatar = useFormatter();
  const excluir = useExcluirTarefa();

  return (
    <Card
      className={cn(
        "p-5 transition-all hover:-translate-y-0.5 hover:shadow-md",
        excluir.isPending && "pointer-events-none opacity-60",
      )}
    >
      <div className="flex items-start gap-4">
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
        <div className="flex shrink-0 gap-1">
          <DeleteTaskButton
            titulo={tarefa.titulo}
            excluindo={excluir.isPending}
            onConfirmar={() => excluir.mutate({ id: tarefa.id })}
          />
        </div>
      </div>
    </Card>
  );
}
