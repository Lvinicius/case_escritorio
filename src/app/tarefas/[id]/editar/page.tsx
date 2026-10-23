import { TRPCError } from "@trpc/server";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { TaskForm } from "@/components/task-form";
import { caller } from "@/trpc/server";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("formulario");
  return { title: t("editarTitulo") };
}

async function buscarTarefa(id: string) {
  try {
    return await caller.tarefa.buscarPorId({ id });
  } catch (erro) {
    if (erro instanceof TRPCError && erro.code === "NOT_FOUND") notFound();
    throw erro;
  }
}

export default async function EditarTarefaPage({ params }: Props) {
  const { id, titulo, descricao } = await buscarTarefa((await params).id);
  const t = await getTranslations("formulario");

  return (
    <>
      <PageHeader
        voltar
        titulo={t("editarTitulo")}
        descricao={t("editarDescricao")}
      />
      <TaskForm tarefa={{ id, titulo, descricao }} />
    </>
  );
}
