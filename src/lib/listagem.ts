import type { PaginaDeTarefas } from "@/server/store";

export const TAMANHO_DA_PAGINA = 10;

export const LISTAGEM_INPUT = { limit: TAMANHO_DA_PAGINA };

export const getNextPageParam = (pagina: PaginaDeTarefas) => pagina.nextCursor;
