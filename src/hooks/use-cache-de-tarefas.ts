import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function useCacheDeTarefas() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const filtro = { queryKey: trpc.tarefa.pathKey() };

  return {
    invalidar: () => queryClient.invalidateQueries(filtro),
    // Fora da listagem, descartar o cache evita exibir dados antigos antes do SSR hidratar os novos.
    descartar: () => queryClient.removeQueries(filtro),
  };
}
