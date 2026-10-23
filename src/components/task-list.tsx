"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { ClipboardList, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { TaskCard } from "@/components/task-card";
import { Card } from "@/components/ui/card";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import {
  getNextPageParam,
  LISTAGEM_INPUT,
  TAMANHO_DA_PAGINA,
} from "@/lib/listagem";
import { useTRPC } from "@/trpc/client";

export function TaskList() {
  const trpc = useTRPC();
  const t = useTranslations("lista");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.tarefa.listar.infiniteQueryOptions(LISTAGEM_INPUT, {
        getNextPageParam,
      }),
    );
  const sentinela = useInfiniteScroll(
    fetchNextPage,
    hasNextPage && !isFetchingNextPage,
  );

  const tarefas = data.pages.flatMap((pagina) => pagina.itens);

  if (tarefas.length === 0) return <ListaVazia />;

  return (
    <section className="space-y-3">
      <ul className="space-y-3">
        {tarefas.map((tarefa) => (
          <li key={tarefa.id}>
            <TaskCard tarefa={tarefa} />
          </li>
        ))}
      </ul>
      <div
        ref={sentinela}
        className="text-muted-foreground flex justify-center py-4 text-sm"
      >
        {isFetchingNextPage && (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" /> {t("carregandoMais")}
          </span>
        )}
        {!hasNextPage && tarefas.length > TAMANHO_DA_PAGINA && t("fim")}
      </div>
    </section>
  );
}

function ListaVazia() {
  const t = useTranslations("lista");

  return (
    <Card className="flex flex-col items-center gap-3 border-dashed px-6 py-14 text-center">
      <div className="bg-accent text-accent-foreground rounded-full p-3">
        <ClipboardList className="size-6" />
      </div>
      <div className="space-y-1">
        <h2 className="font-semibold">{t("vazioTitulo")}</h2>
        <p className="text-muted-foreground text-sm">{t("vazioTexto")}</p>
      </div>
    </Card>
  );
}
