import {
  Given as Dado,
  When as Quando,
  Then as Então,
} from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/world";
import { LoginPage } from "../pages/loginPage";
import { DashboardPage } from "../pages/dashboardPage";

Dado(
  "que estou na página de login do OrangeHRM",
  async function (this: CustomWorld) {
    const loginPage = new LoginPage(this.page!);
    await loginPage.acessarPagina();
  },
);

Quando(
  "insiro o usuário {string} e a senha {string}",
  async function (this: CustomWorld, usuario: string, senha: string) {
    const loginPage = new LoginPage(this.page!);
    await loginPage.preencherCredenciais(usuario, senha);
  },
);

Quando("clico no botão de entrar", async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page!);
  await loginPage.submeterLogin();
});

Quando(
  "clico no botão de entrar sem preencher os dados",
  async function (this: CustomWorld) {
    const loginPage = new LoginPage(this.page!);
    await loginPage.submeterLogin();
  },
);

Então(
  /^devo ser redirecionado para o painel principal \(Dashboard\)$/,
  async function (this: CustomWorld) {
    const dashboardPage = new DashboardPage(this.page!);

    await expect(this.page!).toHaveURL(/.*dashboard/, { timeout: 15000 });
    await expect(dashboardPage.tituloCabecalho).toHaveText("Dashboard");
  },
);

Então(
  "o sistema deve exibir a mensagem de erro {string}",
  async function (this: CustomWorld, mensagemDeErro: string) {
    const loginPage = new LoginPage(this.page!);

    await expect(loginPage.errorMessage).toHaveText(mensagemDeErro, {
      timeout: 15000,
    });
  },
);

Então(
  "o sistema deve indicar que os campos são obrigatórios",
  async function (this: CustomWorld) {
    const loginPage = new LoginPage(this.page!);

    await expect(loginPage.requiredMessage).toHaveCount(2);
    await expect(loginPage.requiredMessage.first()).toHaveText("Required");
    await expect(loginPage.requiredMessage.last()).toHaveText("Required");
  },
);
