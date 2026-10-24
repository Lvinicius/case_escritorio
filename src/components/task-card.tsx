"use client";

import { useMutation } from "@tanstack/react-query";
import { CalendarClock, Pencil } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { DeleteTaskButton } from "@/components/delete-task-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useCacheDeTarefas } from "@/hooks/use-cache-de-tarefas";
import { useExcluirTarefa } from "@/hooks/use-excluir-tarefa";
import { useTraduzirErro } from "@/hooks/use-traduzir-erro";
import { cn } from "@/lib/utils";
import type { Tarefa } from "@/server/store";
import { useTRPC } from "@/trpc/client";

export function TaskCard({ tarefa }: { tarefa: Tarefa }) {
  const trpc = useTRPC();
  const t = useTranslations("tarefa");
  const formatar = useFormatter();
  const cache = useCacheDeTarefas();
  const { mensagem } = useTraduzirErro();
  const excluir = useExcluirTarefa();
  const alternar = useMutation(
    trpc.tarefa.atualizar.mutationOptions({
      onError: (erro) => toast.error(mensagem(erro)),
      onSettled: cache.invalidar,
    }),
  );

  // Mostra o novo estado enquanto a requisição está em andamento.
  const concluida = alternar.isPending
    ? Boolean(alternar.variables.concluida)
    : tarefa.concluida;

  return (
    <Card
      className={cn(
        "p-5 transition-all hover:-translate-y-0.5 hover:shadow-md",
        excluir.isPending && "pointer-events-none opacity-60",
      )}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          className="mt-0.5"
          checked={concluida}
          onCheckedChange={(marcada) =>
            alternar.mutate({ id: tarefa.id, concluida: marcada === true })
          }
          aria-label={concluida ? t("marcarPendente") : t("marcarConcluida")}
        />
        <div className="min-w-0 flex-1 space-y-1.5">
          <h2
            className={cn(
              "font-semibold break-words transition-colors",
              concluida && "text-muted-foreground line-through",
            )}
          >
            {tarefa.titulo}
          </h2>
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
          <Button asChild variant="ghost" size="icon" aria-label={t("editar")}>
            <Link href={`/tarefas/${tarefa.id}/editar`}>
              <Pencil />
            </Link>
          </Button>
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
