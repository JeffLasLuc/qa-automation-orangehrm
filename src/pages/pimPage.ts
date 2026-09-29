import { Page, Locator } from "@playwright/test";

export class PimPage {
  readonly page: Page;
  readonly menuPim: Locator;
  readonly botaoAdd: Locator;
  readonly inputFirstName: Locator;
  readonly inputLastName: Locator;
  readonly inputEmployeeId: Locator;
  readonly botaoSave: Locator;
  readonly toastSuccess: Locator;
  readonly abaEmployeeList: Locator;
  readonly inputBuscaId: Locator;
  readonly botaoSearch: Locator;
  readonly celulaGridId: Locator;

  // Novos elementos adicionados
  readonly mensagensObrigatorias: Locator;
  readonly textoSemResultados: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuPim = page.getByRole("link", { name: "PIM" });
    this.botaoAdd = page.getByRole("button", { name: /add/i });
    this.inputFirstName = page.getByPlaceholder("First Name");
    this.inputLastName = page.getByPlaceholder("Last Name");
    this.inputEmployeeId = page
      .locator("label")
      .filter({ hasText: "Employee Id" })
      .locator("..")
      .locator("..")
      .locator("input");
    this.botaoSave = page.getByRole("button", { name: "Save" });
    this.toastSuccess = page.getByText("Successfully Saved");
    this.abaEmployeeList = page.getByRole("link", { name: "Employee List" });
    this.inputBuscaId = page
      .locator("label")
      .filter({ hasText: "Employee Id" })
      .locator("..")
      .locator("..")
      .locator("input");
    this.botaoSearch = page.getByRole("button", { name: "Search" });
    // Locator mais específico para a célula de ID na tabela - busca dentro do grid de resultados
    this.celulaGridId = page.locator(".oxd-table-body .oxd-table-cell").nth(1);

    // Mapeamento dos novos elementos
    this.mensagensObrigatorias = page.locator(".oxd-input-group__message");
    this.textoSemResultados = page.locator('.oxd-toast-content-text').filter({ hasText: 'No Records Found' });
  }
}
