import { Before, After, BeforeAll, AfterAll, Status } from "@cucumber/cucumber";
import { chromium, Browser } from "@playwright/test";
import { CustomWorld } from "./world";

let browser: Browser;

// Executa uma vez antes de toda a suíte de testes
BeforeAll(async function () {
  browser = await chromium.launch({
    headless: false, // Deixe false agora no início para ver o navegador abrindo
    args: ["--start-maximized"],
  });
});

// Executa uma vez após o término de toda a suíte
AfterAll(async function () {
  await browser.close();
});

// Executa ANTES de cada Cenário
Before(async function (this: CustomWorld) {
  this.context = await browser.newContext({ viewport: null });
  this.page = await this.context.newPage();
});

// Executa DEPOIS de cada Cenário
After(async function (this: CustomWorld, scenario) {
  // Captura de screenshot em caso de falha
  if (scenario.result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot();
    // Anexa a imagem ao relatório HTML do Cucumber
    this.attach(screenshot, "image/png");
  }

  // Limpa o ambiente fechando a aba
  await this.page?.close();
  await this.context?.close();
});
