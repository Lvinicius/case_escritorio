import { expect, test, type APIRequestContext } from "@playwright/test";

// O servidor sobe vazio e os dados são compartilhados entre os testes, que rodam em ordem.
test.describe.configure({ mode: "serial" });

const criarPelaApi = (request: APIRequestContext, titulo: string) =>
  request.post("/api/trpc/tarefa.criar", { data: { json: { titulo } } });

test("começa sem tarefas e cria a primeira com validação", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Nenhuma tarefa por aqui")).toBeVisible();

  await page.getByRole("link", { name: "Criar tarefa" }).click();
  await page.getByRole("button", { name: "Criar tarefa" }).click();
  await expect(page.getByText("Título é obrigatório")).toBeVisible();

  await page.getByLabel("Título").fill("Estudar tRPC");
  await page.getByLabel("Descrição").fill("Ler a documentação oficial");
  await page.getByRole("button", { name: "Criar tarefa" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByText("Tarefa criada")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Estudar tRPC" }),
  ).toBeVisible();
});

test("edita uma tarefa", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Editar tarefa" }).first().click();
  await expect(page.getByLabel("Título")).toHaveValue("Estudar tRPC");

  await page.getByLabel("Título").fill("Estudar tRPC a fundo");
  await page.getByRole("button", { name: "Salvar alterações" }).click();

  await expect(page.getByText("Tarefa atualizada")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Estudar tRPC a fundo" }),
  ).toBeVisible();
});

test("marca uma tarefa como concluída", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("checkbox", { name: "Marcar como concluída" })
    .first()
    .click();

  await expect(page.getByRole("link", { name: "Concluídas 1" })).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: "Marcar como pendente" }),
  ).toBeChecked();
});

test("filtra tarefas pendentes e concluídas", async ({ page, request }) => {
  const resposta = await criarPelaApi(request, "Tarefa pendente");
  const { id } = (await resposta.json()).result.data.json;
  const concluida = page.getByRole("heading", { name: "Estudar tRPC a fundo" });
  const pendente = page.getByRole("heading", { name: "Tarefa pendente" });

  await page.goto("/");
  await page.getByRole("link", { name: /Pendentes/ }).click();
  await expect(page).toHaveURL("/?filtro=pendentes");
  await expect(pendente).toBeVisible();
  await expect(concluida).toBeHidden();

  await page.getByRole("link", { name: /Concluídas/ }).click();
  await expect(page).toHaveURL("/?filtro=concluidas");
  await expect(concluida).toBeVisible();
  await expect(pendente).toBeHidden();

  await page.reload();
  await expect(page.getByRole("link", { name: /Concluídas/ })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(concluida).toBeVisible();

  await request.post("/api/trpc/tarefa.deletar", { data: { json: { id } } });
});

test("exclui e desfaz a exclusão", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Excluir tarefa" }).first().click();
  await page.getByRole("button", { name: "Excluir", exact: true }).click();

  await expect(page.getByText("Tarefa excluída")).toBeVisible();
  await expect(page.getByText("Nenhuma tarefa por aqui")).toBeVisible();

  await page.getByRole("button", { name: "Desfazer" }).click();
  await expect(page.getByText("Tarefa restaurada")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Estudar tRPC a fundo" }),
  ).toBeVisible();
});

test("carrega mais tarefas ao rolar a lista", async ({ page, request }) => {
  for (let i = 1; i <= 12; i++) await criarPelaApi(request, `Tarefa ${i}`);

  await page.goto("/");
  await expect(page.getByRole("listitem")).toHaveCount(10);

  await page.getByRole("listitem").last().scrollIntoViewIfNeeded();
  await expect(page.getByRole("listitem")).toHaveCount(13);
  await expect(page.getByText("Você chegou ao fim da lista.")).toBeVisible();
});

test("mostra 404 para tarefa inexistente", async ({ page }) => {
  const resposta = await page.goto("/tarefas/nao-existe/editar");

  expect(resposta?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Tarefa não encontrada" }),
  ).toBeVisible();
});

test("troca o idioma e o tema", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Idioma" }).click();
  await page.getByRole("menuitem", { name: "Inglês" }).click();
  await expect(page.getByRole("heading", { name: "My tasks" })).toBeVisible();

  await page.getByRole("button", { name: "Language" }).click();
  await page.getByRole("menuitem", { name: "Spanish" }).click();
  await expect(page.getByRole("heading", { name: "Mis tareas" })).toBeVisible();

  // O navegador do teste usa o tema claro do sistema por padrão.
  await page.getByRole("button", { name: "Cambiar tema claro/oscuro" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
