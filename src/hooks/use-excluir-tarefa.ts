import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useCacheDeTarefas } from "@/hooks/use-cache-de-tarefas";
import { useTraduzirErro } from "@/hooks/use-traduzir-erro";
import { useTRPC } from "@/trpc/client";

export function useExcluirTarefa() {
  const trpc = useTRPC();
  const cache = useCacheDeTarefas();
  const t = useTranslations("exclusao");
  const { mensagem } = useTraduzirErro();

  return useMutation(
    trpc.tarefa.deletar.mutationOptions({
      onSuccess: () => toast.success(t("sucesso")),
      onError: (erro) => toast.error(mensagem(erro)),
      onSettled: cache.invalidar,
    }),
  );
}
