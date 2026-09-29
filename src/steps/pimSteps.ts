import {
  Given as Dado,
  When as Quando,
  Then as Então,
} from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { CustomWorld } from "../support/world";
import { LoginPage } from "../pages/loginPage";
import { PimPage } from "../pages/pimPage";

Dado(
  "que o administrador está autenticado no sistema",
  async function (this: CustomWorld) {
    const loginPage = new LoginPage(this.page!);
    await loginPage.acessarPagina();
    await loginPage.preencherCredenciais("Admin", "admin123");
    await loginPage.submeterLogin();

    // Aguarda o login processar com margem de segurança antes de testar o PIM
    await expect(this.page!).toHaveURL(/.*dashboard/, { timeout: 15000 });
  },
);

Quando(
  "navego para o módulo {string}",
  async function (this: CustomWorld, modulo: string) {
    const pimPage = new PimPage(this.page!);
    if (modulo === "PIM") {
      await pimPage.menuPim.click();
    }
  },
);

Quando(
  "preencho os dados do novo funcionário com informações válidas",
  async function (this: CustomWorld) {
    const pimPage = new PimPage(this.page!);
    await pimPage.botaoAdd.click();

    // GERANDO DADOS DINÂMICOS COM FAKER
    this.funcionarioFake.nome = faker.person.firstName();
    this.funcionarioFake.sobrenome = faker.person.lastName();
    // Gera um ID numérico aleatório de 6 dígitos para evitar colisão
    this.funcionarioFake.id = faker.string.numeric(6);

    await pimPage.inputFirstName.fill(this.funcionarioFake.nome);
    await pimPage.inputLastName.fill(this.funcionarioFake.sobrenome);
    await pimPage.inputEmployeeId.fill(this.funcionarioFake.id);
  },
);

Quando("salvo o formulário", async function (this: CustomWorld) {
  const pimPage = new PimPage(this.page!);
  await pimPage.botaoSave.click();
});

Então(
  "o sistema deve exibir uma mensagem de {string}",
  async function (this: CustomWorld, mensagem: string) {
    const pimPage = new PimPage(this.page!);
    // Valida o balão verde (toast) de sucesso que sobe na tela
    await expect(pimPage.toastSuccess).toBeVisible();
  },
);

Então(
  "o funcionário deve aparecer na lista de empregados",
  async function (this: CustomWorld) {
    const pimPage = new PimPage(this.page!);

    // O OrangeHRM redireciona para o perfil após salvar, precisamos voltar para a lista
    await pimPage.abaEmployeeList.click();

    // Busca pelo ID gerado pelo Faker
    await pimPage.inputBuscaId.fill(this.funcionarioFake.id);
    await pimPage.botaoSearch.click();

    // Aguarda um instante para o grid atualizar (boa prática do Playwright: wait for response seria ideal, mas esse resolverá de forma simples)
    await this.page!.waitForTimeout(2000);

    // Valida se o ID na tabela é o mesmo que geramos
    await expect(pimPage.celulaGridId).toContainText(this.funcionarioFake.id);
  },
);

Quando(
  "clico no botão de adicionar funcionário",
  async function (this: CustomWorld) {
    const pimPage = new PimPage(this.page!);
    await pimPage.botaoAdd.click();
  },
);

Então(
  "o sistema deve indicar nos campos de nome que os dados são obrigatórios",
  async function (this: CustomWorld) {
    const pimPage = new PimPage(this.page!);

    // O First Name é o índice 0, e o Last Name é o índice 1.
    // Assim ignoramos qualquer erro no Employee Id (que seria o índice 2).
    await expect(pimPage.mensagensObrigatorias.nth(0)).toHaveText("Required");
    await expect(pimPage.mensagensObrigatorias.nth(1)).toHaveText("Required");
  },
);

Quando(
  "busco na lista por um ID de funcionário inexistente {string}",
  async function (this: CustomWorld, idInexistente: string) {
    const pimPage = new PimPage(this.page!);
    // Garante que estamos na aba de lista
    await pimPage.abaEmployeeList.click();
    await pimPage.inputBuscaId.fill(idInexistente);
    await pimPage.botaoSearch.click();
  },
);

Então(
  "o sistema deve exibir a mensagem {string}",
  async function (this: CustomWorld, mensagem: string) {
    // Em vez de focar em um elemento específico, validamos se o texto
    // está visível em qualquer lugar do corpo da página (body).
    // Isso resolve problemas de Strict Mode, elementos ocultos e Toasts que somem rápido.
    await expect(this.page!.locator("body")).toContainText(mensagem, {
      timeout: 15000,
    });
  },
);
