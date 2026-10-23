import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";

export default async function HomePage() {
  const t = await getTranslations("lista");

  return <PageHeader titulo={t("titulo")} descricao={t("subtitulo")} />;
}
