import { z } from "zod";

export const LIMITE_TITULO = 120;
export const LIMITE_DESCRICAO = 1000;

// As mensagens são chaves de `messages/*.json`, traduzidas no cliente.
export const tarefaInput = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, "tituloObrigatorio")
    .max(LIMITE_TITULO, "tituloMax"),
  descricao: z.string().trim().max(LIMITE_DESCRICAO, "descricaoMax").optional(),
});

export const idInput = z.object({ id: z.string().min(1) });

export const atualizarTarefaInput = tarefaInput
  .partial()
  .extend({ ...idInput.shape, concluida: z.boolean().optional() });

export const listarTarefasInput = z.object({
  cursor: z.number().nullish(),
  limit: z.number().int().min(1).max(50).default(10),
});

export type TarefaInput = z.infer<typeof tarefaInput>;
export type AtualizarTarefaInput = z.infer<typeof atualizarTarefaInput>;
export type ListarTarefasInput = z.infer<typeof listarTarefasInput>;
export type CamposComErro = Partial<Record<keyof TarefaInput, string[]>>;
