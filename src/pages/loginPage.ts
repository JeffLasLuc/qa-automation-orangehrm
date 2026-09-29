import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly requiredMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Mapeamento centralizado dos elementos
    this.usernameInput = page.getByPlaceholder("Username");
    this.passwordInput = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: /login/i });
    this.errorMessage = page.locator(".oxd-alert-content-text");
    this.requiredMessage = page.locator(".oxd-input-group__message");
  }

  async acessarPagina() {
    await this.page.goto(
      "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    );
  }

  async preencherCredenciais(usuario: string, senha: string) {
    await this.usernameInput.fill(usuario);
    await this.passwordInput.fill(senha);
  }

  async submeterLogin() {
    await this.loginButton.click();
  }
}
