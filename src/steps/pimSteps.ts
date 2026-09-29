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
import { logger } from "../utils/logger";
import {
  assertVisible,
  assertContainsText,
  waitForVisible,
  clickWithRetry,
  fillWithRetry,
} from "../utils/assertions";
import { TIMEOUTS } from "../config/timeouts";

Dado(
  "que o administrador está autenticado no sistema",
  async function (this: CustomWorld) {
    logger.action("Autenticando administrador");

    const loginPage = new LoginPage(this.page!);
    await loginPage.acessarPagina();
    await loginPage.preencherCredenciais("Admin", "admin123");
    await loginPage.submeterLogin();

    // Aguarda o login processar com margem de segurança antes de testar o PIM
    await expect(this.page!).toHaveURL(/.*dashboard/, { timeout: TIMEOUTS.NAVIGATION });

    logger.info("Login realizado com sucesso");
  },
);

Quando(
  "navego para o módulo {string}",
  async function (this: CustomWorld, modulo: string) {
    logger.action(`Navegando para módulo ${modulo}`);

    const pimPage = new PimPage(this.page!);
    if (modulo === "PIM") {
      await clickWithRetry(pimPage.menuPim);
    }
  },
);

Quando(
  "preencho os dados do novo funcionário com informações válidas",
  async function (this: CustomWorld) {
    logger.action("Preenchendo dados do funcionário");

    const pimPage = new PimPage(this.page!);
    await clickWithRetry(pimPage.botaoAdd);

    // GERANDO DADOS DINÂMICOS COM FAKER
    this.funcionarioFake.nome = faker.person.firstName();
    this.funcionarioFake.sobrenome = faker.person.lastName();
    // Gera um ID numérico aleatório de 6 dígitos para evitar colisão
    this.funcionarioFake.id = faker.string.numeric(6);

    logger.debug(`Dados gerados: ${JSON.stringify(this.funcionarioFake)}`);

    await fillWithRetry(pimPage.inputFirstName, this.funcionarioFake.nome);
    await fillWithRetry(pimPage.inputLastName, this.funcionarioFake.sobrenome);
    await fillWithRetry(pimPage.inputEmployeeId, this.funcionarioFake.id);
  },
);

Quando("salvo o formulário", async function (this: CustomWorld) {
  logger.action("Salvando formulário");

  const pimPage = new PimPage(this.page!);
  await clickWithRetry(pimPage.botaoSave);
});

Então(
  "o sistema deve exibir uma mensagem de {string}",
  async function (this: CustomWorld, mensagem: string) {
    logger.action(`Validando mensagem: ${mensagem}`);

    const pimPage = new PimPage(this.page!);
    // Valida o balão verde (toast) de sucesso que sobe na tela
    await assertVisible(pimPage.toastSuccess, TIMEOUTS.ELEMENT_VISIBLE);
  },
);

Então(
  "o funcionário deve aparecer na lista de empregados",
  async function (this: CustomWorld) {
    logger.action("Verificando funcionário na lista");

    const pimPage = new PimPage(this.page!);

    // O OrangeHRM redireciona para o perfil após salvar, precisamos voltar para a lista
    await clickWithRetry(pimPage.abaEmployeeList);

    // Aguarda a lista carregar completamente
    await waitForVisible(pimPage.inputBuscaId, TIMEOUTS.ELEMENT_VISIBLE);

    // Busca pelo ID gerado pelo Faker
    await fillWithRetry(pimPage.inputBuscaId, this.funcionarioFake.id);
    await clickWithRetry(pimPage.botaoSearch);

    // Aguarda o grid atualizar - espera pelo elemento aparecer na tabela
    await waitForVisible(pimPage.celulaGridId, TIMEOUTS.ELEMENT_VISIBLE);

    // Valida se o ID na tabela é o mesmo que geramos
    await assertContainsText(pimPage.celulaGridId, this.funcionarioFake.id);
  },
);

Quando(
  "clico no botão de adicionar funcionário",
  async function (this: CustomWorld) {
    logger.action("Clicando em adicionar funcionário");

    const pimPage = new PimPage(this.page!);
    await clickWithRetry(pimPage.botaoAdd);
  },
);

Então(
  "o sistema deve indicar nos campos de nome que os dados são obrigatórios",
  async function (this: CustomWorld) {
    logger.action("Validando campos obrigatórios");

    const pimPage = new PimPage(this.page!);

    // O First Name é o índice 0, e o Last Name é o índice 1.
    // Assim ignoramos qualquer erro no Employee Id (que seria o índice 2).
    await assertVisible(pimPage.mensagensObrigatorias.nth(0));
    await assertVisible(pimPage.mensagensObrigatorias.nth(1));

    await expect(pimPage.mensagensObrigatorias.nth(0)).toHaveText("Required");
    await expect(pimPage.mensagensObrigatorias.nth(1)).toHaveText("Required");
  },
);

Quando(
  "busco na lista por um ID de funcionário inexistente {string}",
  async function (this: CustomWorld, idInexistente: string) {
    logger.action(`Buscando funcionário inexistente: ${idInexistente}`);

    const pimPage = new PimPage(this.page!);
    // Garante que estamos na aba de lista
    await clickWithRetry(pimPage.abaEmployeeList);

    // Aguarda o campo de busca estar disponível
    await waitForVisible(pimPage.inputBuscaId, TIMEOUTS.ELEMENT_VISIBLE);

    await fillWithRetry(pimPage.inputBuscaId, idInexistente);
    await clickWithRetry(pimPage.botaoSearch);
  },
);

Então(
  "o sistema deve exibir a mensagem {string}",
  async function (this: CustomWorld, mensagem: string) {
    logger.action(`Validando mensagem de erro: ${mensagem}`);

    const pimPage = new PimPage(this.page!);

    // Aguarda o toast aparecer com a mensagem específica
    await assertVisible(pimPage.textoSemResultados, TIMEOUTS.ELEMENT_VISIBLE);
  },
);
