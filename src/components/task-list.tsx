"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { ClipboardList, Loader2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { TaskCard } from "@/components/task-card";
import { TaskFilters } from "@/components/task-filters";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import {
  getNextPageParam,
  inputDaListagem,
  TAMANHO_DA_PAGINA,
} from "@/lib/listagem";
import type { Filtro } from "@/lib/schemas";
import { useTRPC } from "@/trpc/client";

export function TaskList({ filtro }: { filtro: Filtro }) {
  const trpc = useTRPC();
  const t = useTranslations("lista");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.tarefa.listar.infiniteQueryOptions(inputDaListagem(filtro), {
        getNextPageParam,
      }),
    );
  const sentinela = useInfiniteScroll(
    fetchNextPage,
    hasNextPage && !isFetchingNextPage,
  );

  const tarefas = data.pages.flatMap((pagina) => pagina.itens);
  const { total, concluidas } = data.pages[0];

  if (total === 0) return <ListaVazia />;

  return (
    <section className="space-y-3">
      <TaskFilters atual={filtro} total={total} concluidas={concluidas} />
      {tarefas.length === 0 && (
        <p className="text-muted-foreground rounded-xl border border-dashed px-6 py-10 text-center text-sm">
          {t(`vazioFiltro.${filtro}`)}
        </p>
      )}
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
      <Button asChild className="mt-2">
        <Link href="/tarefas/nova">
          <Plus /> {t("criarTarefa")}
        </Link>
      </Button>
    </Card>
  );
}
