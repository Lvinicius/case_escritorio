import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { TaskForm } from "@/components/task-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("formulario");
  return { title: t("novaTitulo") };
}

export default async function NovaTarefaPage() {
  const t = await getTranslations("formulario");

  return (
    <>
      <PageHeader
        voltar
        titulo={t("novaTitulo")}
        descricao={t("novaDescricao")}
      />
      <TaskForm />
    </>
  );
}
