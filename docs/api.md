# API

A API é exposta via tRPC em `/api/trpc`, com superjson (datas trafegam como `Date`). Todos os procedures ficam no router `tarefa`.

## Modelo

```ts
type Tarefa = {
  id: string; // UUID
  titulo: string; // 1 a 120 caracteres, sem espaços nas pontas
  descricao?: string; // até 1000 caracteres
  concluida: boolean;
  dataCriacao: Date;
};
```

## Procedures

| Procedure     | Tipo     | Entrada                                     | Saída                                      | Erros                      |
| ------------- | -------- | ------------------------------------------- | ------------------------------------------ | -------------------------- |
| `listar`      | query    | `{ cursor?, filtro = "todas", limit = 10 }` | `{ itens, nextCursor, total, concluidas }` | `BAD_REQUEST`              |
| `buscarPorId` | query    | `{ id }`                                    | `Tarefa`                                   | `NOT_FOUND`                |
| `criar`       | mutation | `{ titulo, descricao? }`                    | `Tarefa`                                   | `BAD_REQUEST`              |
| `atualizar`   | mutation | `{ id, titulo?, descricao?, concluida? }`   | `Tarefa`                                   | `NOT_FOUND`, `BAD_REQUEST` |
| `deletar`     | mutation | `{ id }`                                    | `{ id }`                                   | `NOT_FOUND`                |
| `restaurar`   | mutation | `{ id }`                                    | `Tarefa`                                   | `NOT_FOUND`                |

- `listar` devolve as tarefas mais recentes primeiro. `limit` vai de 1 a 50. Para a próxima página, envie o `nextCursor` recebido como `cursor`; `null` indica que não há mais itens. `filtro` aceita `todas`, `pendentes` ou `concluidas`. `total` e `concluidas` contam todas as tarefas, independente do filtro e da página, para alimentar os contadores das abas.
- `atualizar` altera apenas os campos enviados. Enviar `descricao: ""` remove a descrição.
- `restaurar` devolve uma tarefa excluída com o mesmo id e data de criação.

## Erros

Os erros seguem o formato do tRPC. Em erros de validação, `data.fieldErrors` traz as mensagens por campo:

```json
{
  "message": "...",
  "data": {
    "code": "BAD_REQUEST",
    "fieldErrors": { "titulo": ["tituloObrigatorio"] }
  }
}
```

As mensagens de campo são chaves de tradução de `messages/*.json` (`validacao.*`): `tituloObrigatorio`, `tituloMax` e `descricaoMax`.

Uma tarefa inexistente retorna `NOT_FOUND` com a mensagem `Tarefa não encontrada`.

## Uso

No cliente React (`src/trpc/client.tsx`):

```ts
const trpc = useTRPC();
const criar = useMutation(trpc.tarefa.criar.mutationOptions());
criar.mutate({ titulo: "Revisar PR" });
```

No servidor (`src/trpc/server.tsx`), sem passar por HTTP:

```ts
const tarefa = await caller.tarefa.buscarPorId({ id });
```

O script `scripts/seed.mts` mostra um cliente tRPC avulso, chamando a API de um servidor no ar.
