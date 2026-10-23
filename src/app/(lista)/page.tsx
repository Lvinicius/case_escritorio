import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { TaskList } from "@/components/task-list";
import { Button } from "@/components/ui/button";
import { getNextPageParam, inputDaListagem } from "@/lib/listagem";
import { filtroInput } from "@/lib/schemas";
import { getQueryClient, HydrateClient, trpc } from "@/trpc/server";

// A lista vive em memória e muda a cada operação: renderiza a cada requisição (SSR).
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ filtro?: string | string[] }> };

export default async function HomePage({ searchParams }: Props) {
  const t = await getTranslations("lista");
  const filtro = filtroInput.catch("todas").parse((await searchParams).filtro);
  await getQueryClient().prefetchInfiniteQuery(
    trpc.tarefa.listar.infiniteQueryOptions(inputDaListagem(filtro), {
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
      <TaskList filtro={filtro} />
    </HydrateClient>
  );
}
