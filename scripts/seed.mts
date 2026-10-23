import { createTRPCClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { TarefaInput } from "@/lib/schemas";
import type { AppRouter } from "@/server/routers/_app";

const baseUrl = process.env.SEED_URL ?? "http://localhost:3000";

const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({ url: `${baseUrl}/api/trpc`, transformer: superjson }),
  ],
});

const EXEMPLOS: TarefaInput[] = [
  {
    titulo: "Configurar ambiente de desenvolvimento",
    descricao: "Instalar Node.js 22 e as extensões do editor.",
  },
  {
    titulo: "Revisar requisitos do projeto",
    descricao: "Conferir os critérios de aceite da especificação.",
  },
  { titulo: "Definir modelo de dados" },
  {
    titulo: "Implementar endpoints tRPC",
    descricao: "Criar, listar, atualizar e excluir tarefas.",
  },
  { titulo: "Escrever testes da API" },
  {
    titulo: "Montar página de listagem",
    descricao: "Pré-carregar as tarefas com SSR.",
  },
  {
    titulo: "Criar formulário de tarefas",
    descricao: "Validar o título antes do envio.",
  },
  {
    titulo: "Adicionar feedback visual",
    descricao: "Mensagens de sucesso e erro nas operações.",
  },
  { titulo: "Implementar infinite scroll" },
  {
    titulo: "Configurar pipeline de CI",
    descricao: "Lint, typecheck, testes e build a cada push.",
  },
  {
    titulo: "Planejar reunião de alinhamento",
    descricao: "Pauta: prioridades da próxima sprint.",
  },
  { titulo: "Atualizar documentação" },
  { titulo: "Responder e-mails pendentes" },
  {
    titulo: "Organizar backlog",
    descricao: "Priorizar itens por impacto e esforço.",
  },
  { titulo: "Preparar apresentação da demo" },
];

try {
  for (const tarefa of EXEMPLOS) await api.tarefa.criar.mutate(tarefa);
  console.log(`${EXEMPLOS.length} tarefas de exemplo criadas em ${baseUrl}`);
} catch {
  console.error(
    `Não foi possível conectar em ${baseUrl}. O servidor está rodando (npm run dev)?`,
  );
  process.exit(1);
}
