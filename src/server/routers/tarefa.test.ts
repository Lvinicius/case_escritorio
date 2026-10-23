import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it } from "vitest";
import { TarefaStore } from "../store";
import { createCaller } from "./_app";

let api: ReturnType<typeof createCaller>["tarefa"];

beforeEach(() => {
  api = createCaller({ store: new TarefaStore() }).tarefa;
});

const codigoDoErro = (promessa: Promise<unknown>) =>
  promessa.then(
    () => null,
    (erro: TRPCError) => erro.code,
  );

describe("tarefa.criar", () => {
  it("cria uma tarefa com id e data de criação", async () => {
    const tarefa = await api.criar({
      titulo: "  Estudar tRPC  ",
      descricao: "Ler a documentação",
    });

    expect(tarefa).toMatchObject({
      titulo: "Estudar tRPC",
      descricao: "Ler a documentação",
    });
    expect(tarefa.id).toBeTruthy();
    expect(tarefa.concluida).toBe(false);
    expect(tarefa.dataCriacao).toBeInstanceOf(Date);
  });

  it.each(["", "   "])("rejeita título vazio (%j)", async (titulo) => {
    expect(await codigoDoErro(api.criar({ titulo }))).toBe("BAD_REQUEST");
  });

  it("descarta descrição vazia", async () => {
    const tarefa = await api.criar({
      titulo: "Sem descrição",
      descricao: "  ",
    });
    expect(tarefa.descricao).toBeUndefined();
  });
});

describe("tarefa.listar", () => {
  it("pagina da mais recente para a mais antiga sem repetir itens", async () => {
    for (let i = 1; i <= 5; i++) await api.criar({ titulo: `Tarefa ${i}` });

    const primeira = await api.listar({ limit: 2 });
    await api.deletar({ id: primeira.itens[0].id });
    const segunda = await api.listar({ limit: 2, cursor: primeira.nextCursor });
    const terceira = await api.listar({ limit: 2, cursor: segunda.nextCursor });

    const titulos = [
      ...primeira.itens,
      ...segunda.itens,
      ...terceira.itens,
    ].map((t) => t.titulo);
    expect(titulos).toEqual([
      "Tarefa 5",
      "Tarefa 4",
      "Tarefa 3",
      "Tarefa 2",
      "Tarefa 1",
    ]);
    expect(terceira.nextCursor).toBeNull();
    expect(terceira.total).toBe(4);
  });

  it("conta as tarefas concluídas", async () => {
    const { id } = await api.criar({ titulo: "Feita" });
    await api.criar({ titulo: "Pendente" });
    await api.atualizar({ id, concluida: true });

    expect(await api.listar({ limit: 10 })).toMatchObject({
      total: 2,
      concluidas: 1,
    });
  });

  it.each([
    ["todas", ["Pendente", "Feita"]],
    ["pendentes", ["Pendente"]],
    ["concluidas", ["Feita"]],
  ] as const)("filtra por %s", async (filtro, esperadas) => {
    const { id } = await api.criar({ titulo: "Feita" });
    await api.criar({ titulo: "Pendente" });
    await api.atualizar({ id, concluida: true });

    const pagina = await api.listar({ filtro, limit: 10 });

    expect(pagina.itens.map((t) => t.titulo)).toEqual(esperadas);
    expect(pagina).toMatchObject({ total: 2, concluidas: 1 });
  });

  it("rejeita filtro desconhecido", async () => {
    expect(
      await codigoDoErro(
        api.listar({ filtro: "arquivadas" as never, limit: 10 }),
      ),
    ).toBe("BAD_REQUEST");
  });
});

describe("tarefa.atualizar", () => {
  it("altera apenas os campos enviados", async () => {
    const { id } = await api.criar({
      titulo: "Original",
      descricao: "Mantida",
    });

    const atualizada = await api.atualizar({ id, titulo: "Novo título" });

    expect(atualizada).toMatchObject({
      titulo: "Novo título",
      descricao: "Mantida",
    });
  });

  it("remove a descrição quando enviada vazia", async () => {
    const { id } = await api.criar({ titulo: "Tarefa", descricao: "Antiga" });
    expect(
      (await api.atualizar({ id, descricao: "" })).descricao,
    ).toBeUndefined();
  });

  it("retorna NOT_FOUND para tarefa inexistente", async () => {
    expect(
      await codigoDoErro(api.atualizar({ id: "inexistente", titulo: "X" })),
    ).toBe("NOT_FOUND");
  });

  it("marca e desmarca como concluída", async () => {
    const { id } = await api.criar({ titulo: "Tarefa" });

    expect((await api.atualizar({ id, concluida: true })).concluida).toBe(true);
    expect((await api.atualizar({ id, concluida: false })).concluida).toBe(
      false,
    );
  });

  it("rejeita título vazio", async () => {
    const { id } = await api.criar({ titulo: "Tarefa" });
    expect(await codigoDoErro(api.atualizar({ id, titulo: "" }))).toBe(
      "BAD_REQUEST",
    );
  });
});

describe("tarefa.deletar, restaurar e buscarPorId", () => {
  it("remove a tarefa", async () => {
    const { id } = await api.criar({ titulo: "Temporária" });

    expect(await api.deletar({ id })).toEqual({ id });
    expect(await codigoDoErro(api.buscarPorId({ id }))).toBe("NOT_FOUND");
  });

  it("retorna NOT_FOUND ao excluir tarefa inexistente", async () => {
    expect(await codigoDoErro(api.deletar({ id: "inexistente" }))).toBe(
      "NOT_FOUND",
    );
  });

  it("restaura a tarefa excluída na mesma posição", async () => {
    const antiga = await api.criar({ titulo: "Antiga" });
    await api.criar({ titulo: "Nova" });
    await api.deletar({ id: antiga.id });

    expect(await api.restaurar({ id: antiga.id })).toEqual(antiga);
    const { itens } = await api.listar({ limit: 10 });
    expect(itens.map((t) => t.titulo)).toEqual(["Nova", "Antiga"]);
  });

  it("retorna NOT_FOUND ao restaurar tarefa que não foi excluída", async () => {
    const { id } = await api.criar({ titulo: "Ativa" });
    expect(await codigoDoErro(api.restaurar({ id }))).toBe("NOT_FOUND");
  });
});
