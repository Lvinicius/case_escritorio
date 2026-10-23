# Arquitetura

## Visão geral

```text
Navegador ── tRPC (HTTP) ──> /api/trpc ──> tarefaRouter ──> TarefaStore (Map em memória)
    ▲                                                            │
    └── HTML + cache hidratado <── Server Component (prefetch) ──┘
```

A aplicação é um único projeto Next.js 15 (App Router). O mesmo servidor entrega as páginas e a API tRPC, então frontend e backend compartilham tipos e schemas sem geração de código.

## Camadas

| Camada      | Onde                    | Responsabilidade                                                   |
| ----------- | ----------------------- | ------------------------------------------------------------------ |
| Páginas     | `src/app`               | Rotas, SSR, estados de loading, erro e 404                         |
| Componentes | `src/components`        | Lista, filtros, card, formulário, preferências e componentes de UI |
| Hooks       | `src/hooks`             | Infinite scroll, exclusão com desfazer, cache e tradução de erros  |
| Clientes    | `src/trpc`              | Cliente tRPC do navegador e proxy de prefetch no servidor          |
| API         | `src/server/routers`    | Procedures do tRPC, validação de entrada e erros                   |
| Dados       | `src/server/store.ts`   | Repositório em memória (`TarefaStore`)                             |
| Regras      | `src/lib/schemas.ts`    | Schemas Zod usados pela API e pelo formulário                      |
| Idiomas     | `src/i18n`, `messages/` | Leitura do idioma no servidor e textos em pt, en e es              |

## Fluxos

### Listagem (SSR + infinite scroll)

1. A página `/` é um Server Component (`src/app/(lista)/page.tsx`) que chama `prefetchInfiniteQuery` com a primeira página.
2. O cache do React Query é serializado com superjson e entregue ao cliente via `HydrationBoundary`, então o HTML já chega com as tarefas.
3. `TaskList` usa `useSuspenseInfiniteQuery` com o mesmo input e reaproveita esse cache, sem nova requisição.
4. Um `IntersectionObserver` observa o fim da lista e pede a próxima página usando o `nextCursor`.

### Filtro por status

- As abas "Todas", "Pendentes" e "Concluídas" (`TaskFilters`) são links para `/?filtro=pendentes` e `/?filtro=concluidas`. O filtro fica na URL, então o SSR já entrega a lista filtrada, o link pode ser compartilhado e o botão voltar do navegador funciona.
- A página valida o parâmetro com o mesmo schema Zod da API; um valor desconhecido cai em "Todas".
- O filtro é aplicado no servidor, dentro de `listar`, então o infinite scroll continua paginando só as tarefas daquele status. Cada filtro tem sua própria entrada no cache do React Query.
- Os contadores das abas usam `total` e `concluidas`, que a API devolve junto com cada página.

### Paginação

A paginação é por cursor: o cursor é o timestamp de `dataCriacao` da última tarefa recebida. O store garante datas estritamente crescentes, então o cursor é único e a lista não pula nem repete itens quando há exclusões entre as páginas.

### Criação e edição

- `TaskForm` atende criar e editar. Ele valida com o mesmo schema Zod da API antes de enviar e mostra os erros por campo.
- Se a API recusar a entrada, os `fieldErrors` enviados pelo `errorFormatter` aparecem nos campos.
- A página de edição busca a tarefa no servidor com `createCaller` e responde 404 se ela não existir.
- Depois de salvar, o cache da lista é descartado e o SSR entrega a lista atualizada.

### Exclusão e desfazer

- A exclusão pede confirmação e invalida a lista ao concluir.
- O toast de sucesso tem a ação "Desfazer", que chama `restaurar`. A tarefa volta com o mesmo id e data, então reaparece na mesma posição.
- O store guarda as tarefas excluídas num mapa separado só para permitir essa restauração.

### Concluir tarefa

O checkbox do card chama `atualizar` com `concluida` e aplica a mudança na hora (atualização otimista), revertendo se a API falhar.

## Dados em memória

`TarefaStore` guarda as tarefas num `Map` mantido em `globalThis`, para sobreviver ao hot reload do `next dev`. Os dados são perdidos quando o servidor reinicia, o que é intencional (o case pede armazenamento em memória).

Como o acesso aos dados fica isolado no store, trocar por um banco de dados não muda os routers.

Em plataformas serverless (ex.: Vercel) cada instância tem sua própria memória, então a aplicação deve rodar como um processo único (`npm run dev` ou `npm start`).

## Idiomas e tema

- O idioma fica no cookie `NEXT_LOCALE` (padrão `pt`), sem prefixo na URL. O servidor lê o cookie em `src/i18n/request.ts`, então o SSR já sai traduzido.
- A troca de idioma é uma server action (`definirIdioma`) seguida de `router.refresh()`.
- As mensagens de validação do Zod são chaves de tradução (ex.: `tituloObrigatorio`), traduzidas no cliente.
- Datas são formatadas pelo next-intl com fuso fixo, para o HTML do servidor e o do cliente baterem.
- O tema usa next-themes com a classe `dark`. O padrão segue o sistema e o usuário pode alternar.
