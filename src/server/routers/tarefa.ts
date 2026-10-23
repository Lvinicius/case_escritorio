import { TRPCError } from "@trpc/server";
import {
  atualizarTarefaInput,
  idInput,
  listarTarefasInput,
  tarefaInput,
} from "@/lib/schemas";
import { publicProcedure, router } from "../trpc";

const tarefaNaoEncontrada = () =>
  new TRPCError({ code: "NOT_FOUND", message: "Tarefa não encontrada" });

function garantirExistencia<T>(valor: T | undefined): T {
  if (!valor) throw tarefaNaoEncontrada();
  return valor;
}

export const tarefaRouter = router({
  listar: publicProcedure
    .input(listarTarefasInput)
    .query(({ ctx, input }) => ctx.store.list(input)),

  buscarPorId: publicProcedure
    .input(idInput)
    .query(({ ctx, input }) => garantirExistencia(ctx.store.get(input.id))),

  criar: publicProcedure
    .input(tarefaInput)
    .mutation(({ ctx, input }) => ctx.store.create(input)),

  atualizar: publicProcedure
    .input(atualizarTarefaInput)
    .mutation(({ ctx, input }) => garantirExistencia(ctx.store.update(input))),

  deletar: publicProcedure.input(idInput).mutation(({ ctx, input }) => {
    if (!ctx.store.remove(input.id)) throw tarefaNaoEncontrada();
    return { id: input.id };
  }),
});
