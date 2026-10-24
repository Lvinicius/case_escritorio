import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useCacheDeTarefas } from "@/hooks/use-cache-de-tarefas";
import { useTraduzirErro } from "@/hooks/use-traduzir-erro";
import { useTRPC, useTRPCClient } from "@/trpc/client";

export function useExcluirTarefa() {
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const cache = useCacheDeTarefas();
  const t = useTranslations("exclusao");
  const { mensagem } = useTraduzirErro();

  // O card some da lista após a exclusão, então o "desfazer" não pode depender dele.
  const desfazer = (id: string) =>
    trpcClient.tarefa.restaurar
      .mutate({ id })
      .then(() => toast.success(t("restaurada")))
      .catch((erro) => toast.error(mensagem(erro)))
      .finally(cache.invalidar);

  return useMutation(
    trpc.tarefa.deletar.mutationOptions({
      onSuccess: ({ id }) =>
        toast.success(t("sucesso"), {
          action: { label: t("desfazer"), onClick: () => desfazer(id) },
        }),
      onError: (erro) => toast.error(mensagem(erro)),
      onSettled: cache.invalidar,
    }),
  );
}
