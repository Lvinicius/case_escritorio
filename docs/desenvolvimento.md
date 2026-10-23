# Desenvolvimento

## Ambiente

- Node.js 20 ou superior (recomendado 22, ver `.nvmrc`).
- Não há variáveis de ambiente obrigatórias nem segredos. Arquivos `.env*` são ignorados pelo git.
- `PORT` (opcional) muda a porta usada pelo cliente tRPC no servidor; `SEED_URL` (opcional) muda o endereço usado pelo seed.

## Comandos

| Comando                | Descrição                                    |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Ambiente de desenvolvimento                  |
| `npm run seed`         | Cria 15 tarefas de exemplo no servidor no ar |
| `npm run build`        | Build de produção                            |
| `npm start`            | Servidor de produção                         |
| `npm test`             | Testes da API (Vitest)                       |
| `npm run test:e2e`     | Testes end-to-end (Playwright)               |
| `npm run lint`         | ESLint                                       |
| `npm run typecheck`    | Checagem de tipos                            |
| `npm run format`       | Formata o código com Prettier                |
| `npm run format:check` | Verifica a formatação                        |

## Testes

- **API** (`src/server/routers/tarefa.test.ts`): chamam os procedures direto com `createCaller`, cada teste com um store novo. Cobrem validação, paginação, filtros, atualização, `NOT_FOUND`, exclusão e restauração.
- **End-to-end** (`e2e/tarefas.spec.ts`): Playwright sobe o build de produção na porta 3100 e percorre, em ordem, criar com validação, editar, concluir, filtrar por status, excluir e desfazer, infinite scroll, 404 e troca de idioma e tema. Rode `npm run build` antes e, na primeira vez, `npx playwright install chromium`.

## CI

O workflow `.github/workflows/ci.yml` roda em todo pull request e em push na `main`: formatação, lint, typecheck, testes da API, build e testes end-to-end. Ele usa só permissão de leitura e não depende de segredos.

## Como adicionar um texto traduzido

1. Adicione a chave nos três arquivos de `messages/` (`pt.json`, `en.json`, `es.json`).
2. Use `useTranslations("<namespace>")` em componentes cliente ou `getTranslations` no servidor.

## Convenções

- Commits seguem [Conventional Commits](https://www.conventionalcommits.org/pt-br/).
- Cada funcionalidade vai numa branch própria e entra na `main` por pull request, com o CI verde.
