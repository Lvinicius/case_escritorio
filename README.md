# Gerenciador de Tarefas

Aplicação de gerenciamento de tarefas feita com **Next.js 15** e **tRPC**. As tarefas ficam em memória no servidor, a listagem é renderizada no servidor (SSR) e carrega mais itens conforme a rolagem.

## Funcionalidades

- Listagem renderizada no servidor com infinite scroll
- Criação e edição com validação no formulário e na API
- Exclusão direto na listagem, com confirmação, feedback e opção de desfazer
- Marcar tarefas como concluídas e filtrar entre todas, pendentes e concluídas
- Mensagens de erro claras (ex.: atualizar uma tarefa inexistente retorna `NOT_FOUND`)
- Estados de carregamento, sucesso e falha em todas as operações
- Interface em português, inglês e espanhol
- Tema claro e escuro
- Layout responsivo

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · tRPC v11 · TanStack Query v5 · Zod · superjson · Tailwind CSS · Radix UI (componentes no padrão shadcn/ui) · next-intl · next-themes · Vitest · Playwright · GitHub Actions

## Como executar

Requisitos: Node.js 20 ou superior (recomendado 22, ver `.nvmrc`). Não há variáveis de ambiente obrigatórias.

```bash
npm install
npm run dev
```

Acesse http://localhost:3000.

A lista começa vazia e, como os dados ficam em memória, é zerada sempre que o servidor reinicia. Para popular com tarefas de exemplo (útil para ver o infinite scroll), rode `npm run seed` em outro terminal com o servidor ligado.

| Comando                | Descrição                       |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Ambiente de desenvolvimento     |
| `npm run seed`         | Cria tarefas de exemplo via API |
| `npm run build`        | Build de produção               |
| `npm start`            | Servidor de produção            |
| `npm test`             | Testes da API (Vitest)          |
| `npm run test:e2e`     | Testes end-to-end (Playwright)  |
| `npm run lint`         | ESLint                          |
| `npm run typecheck`    | Checagem de tipos               |
| `npm run format:check` | Verificação de formatação       |

Os testes end-to-end sobem o build de produção: rode `npm run build` antes e, na primeira vez, `npx playwright install chromium`.

## Estrutura

```text
src/
  app/          páginas, rota /api/trpc, estados de loading, erro e 404
  components/   lista, filtros, card, formulário, preferências e componentes de UI
  hooks/        infinite scroll, exclusão, cache e tradução de erros
  lib/          schemas Zod, tratamento de erros e utilitários
  server/       store em memória, configuração e routers do tRPC
  trpc/         clientes tRPC para servidor e navegador
  i18n/         configuração de idiomas
messages/       traduções (pt, en, es)
e2e/            testes end-to-end
scripts/        seed de tarefas de exemplo
docs/           documentação do sistema
```

## Documentação

- [Arquitetura](docs/arquitetura.md): camadas, fluxos de SSR, paginação, exclusão e idiomas
- [API](docs/api.md): procedures, entradas, saídas e formato dos erros
- [Desenvolvimento](docs/desenvolvimento.md): comandos, testes, CI e convenções

## Decisões

- **Sem banco de dados:** o case pede armazenamento em memória. O acesso aos dados fica isolado em `TarefaStore`, então trocar por um banco não afeta os routers.
- **Tipos de ponta a ponta:** os schemas Zod validam a API e o formulário, e os tipos do cliente vêm direto do router tRPC.
- **Deploy:** em plataformas serverless (ex.: Vercel) as instâncias não compartilham memória, então o projeto foi pensado para rodar como um processo único (`npm run dev` ou `npm start`).
