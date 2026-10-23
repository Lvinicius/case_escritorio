import { z } from "zod";

export const LIMITE_TITULO = 120;
export const LIMITE_DESCRICAO = 1000;

export const tarefaInput = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, "Título é obrigatório")
    .max(
      LIMITE_TITULO,
      `Título deve ter no máximo ${LIMITE_TITULO} caracteres`,
    ),
  descricao: z
    .string()
    .trim()
    .max(
      LIMITE_DESCRICAO,
      `Descrição deve ter no máximo ${LIMITE_DESCRICAO} caracteres`,
    )
    .optional(),
});

export const idInput = z.object({ id: z.string().min(1) });

export const atualizarTarefaInput = tarefaInput.partial().extend(idInput.shape);

export const listarTarefasInput = z.object({
  cursor: z.number().nullish(),
  limit: z.number().int().min(1).max(50).default(10),
});

export type TarefaInput = z.infer<typeof tarefaInput>;
export type AtualizarTarefaInput = z.infer<typeof atualizarTarefaInput>;
export type ListarTarefasInput = z.infer<typeof listarTarefasInput>;
