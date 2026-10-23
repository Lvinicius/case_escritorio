import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { TaskList } from "@/components/task-list";
import { Button } from "@/components/ui/button";
import { getNextPageParam, LISTAGEM_INPUT } from "@/lib/listagem";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

// A lista vive em memória e muda a cada operação: renderiza a cada requisição (SSR).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const t = await getTranslations("lista");
  await getQueryClient().prefetchInfiniteQuery(
    trpc.tarefa.listar.infiniteQueryOptions(LISTAGEM_INPUT, {
      getNextPageParam,
    }),
  );

  return (
    <HydrateClient>
      <PageHeader
        titulo={t("titulo")}
        descricao={t("subtitulo")}
        acao={
          <Button asChild>
            <Link href="/tarefas/nova">
              <Plus /> {t("novaTarefa")}
            </Link>
          </Button>
        }
      />
      <TaskList />
    </HydrateClient>
  );
}
