import { Page, Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly tituloCabecalho: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tituloCabecalho = page.locator(".oxd-topbar-header-breadcrumb-module");
  }
}
