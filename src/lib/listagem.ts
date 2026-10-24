import type { Filtro } from "@/lib/schemas";
import type { PaginaDeTarefas } from "@/server/store";

export const TAMANHO_DA_PAGINA = 10;

export const inputDaListagem = (filtro: Filtro) => ({
  filtro,
  limit: TAMANHO_DA_PAGINA,
});

export const getNextPageParam = (pagina: PaginaDeTarefas) => pagina.nextCursor;
