import { randomUUID } from "node:crypto";
import type {
  AtualizarTarefaInput,
  ListarTarefasInput,
  TarefaInput,
} from "@/lib/schemas";

export type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  concluida: boolean;
  dataCriacao: Date;
};

export type PaginaDeTarefas = {
  itens: Tarefa[];
  nextCursor: number | null;
  total: number;
};

export class TarefaStore {
  private tarefas = new Map<string, Tarefa>();
  private ultimaCriacao = 0;

  list({ cursor, limit }: ListarTarefasInput): PaginaDeTarefas {
    const todas = [...this.tarefas.values()];
    const recentesPrimeiro = todas.sort(
      (a, b) => b.dataCriacao.getTime() - a.dataCriacao.getTime(),
    );
    const restantes =
      cursor == null
        ? recentesPrimeiro
        : recentesPrimeiro.filter((t) => t.dataCriacao.getTime() < cursor);
    const itens = restantes.slice(0, limit);
    const temMais = restantes.length > limit;

    return {
      itens,
      nextCursor: temMais ? itens.at(-1)!.dataCriacao.getTime() : null,
      total: todas.length,
    };
  }

  get(id: string) {
    return this.tarefas.get(id);
  }

  create({ titulo, descricao }: TarefaInput) {
    const tarefa: Tarefa = {
      id: randomUUID(),
      titulo,
      descricao: descricao || undefined,
      concluida: false,
      dataCriacao: this.proximaData(),
    };
    this.tarefas.set(tarefa.id, tarefa);
    return tarefa;
  }

  update({ id, ...dados }: AtualizarTarefaInput) {
    const atual = this.tarefas.get(id);
    if (!atual) return undefined;

    const atualizada: Tarefa = { ...atual, ...dados };
    if (dados.descricao !== undefined)
      atualizada.descricao = dados.descricao || undefined;
    this.tarefas.set(id, atualizada);
    return atualizada;
  }

  remove(id: string) {
    return this.tarefas.delete(id);
  }

  // Datas estritamente crescentes tornam dataCriacao um cursor único e estável,
  // mesmo com exclusões entre uma página e outra.
  private proximaData() {
    this.ultimaCriacao = Math.max(Date.now(), this.ultimaCriacao + 1);
    return new Date(this.ultimaCriacao);
  }
}

// Mantém os dados entre os hot reloads do `next dev`.
const globalComStore = globalThis as typeof globalThis & {
  tarefaStore?: TarefaStore;
};
export const tarefaStore = (globalComStore.tarefaStore ??= new TarefaStore());
