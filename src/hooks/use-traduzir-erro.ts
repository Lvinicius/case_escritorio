import { useTranslations } from "next-intl";
import { chaveDoErro } from "@/lib/erros";
import { LIMITE_DESCRICAO, LIMITE_TITULO } from "@/lib/schemas";

const LIMITES = { tituloMax: LIMITE_TITULO, descricaoMax: LIMITE_DESCRICAO };

export function useTraduzirErro() {
  const t = useTranslations();
  return {
    validacao: (chave: string) => t(`validacao.${chave}`, LIMITES),
    mensagem: (erro: unknown) => t(chaveDoErro(erro), LIMITES),
  };
}
