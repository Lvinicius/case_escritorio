import { useTranslations } from "next-intl";
import { chaveDoErro } from "@/lib/erros";

export function useTraduzirErro() {
  const t = useTranslations();
  return {
    mensagem: (erro: unknown) => t(chaveDoErro(erro)),
  };
}
