import { Before, After, BeforeAll, AfterAll, Status } from "@cucumber/cucumber";
import { chromium, Browser } from "@playwright/test";
import { CustomWorld } from "./world";
import { logger } from "../utils/logger";
import * as fs from "fs";
import * as path from "path";

let browser: Browser;

// Executa uma vez antes de toda a suíte de testes
BeforeAll(async function () {
  logger.info("Iniciando navegador...");

  // Detecta se está rodando no CI
  const isCI = process.env.CI === "true";

  browser = await chromium.launch({
    headless: isCI, // Headless no CI, headed localmente
    args: isCI ? ["--no-sandbox", "--disable-setuid-sandbox"] : ["--start-maximized"],
  });

  logger.info(`Navegador iniciado em modo ${isCI ? "headless" : "headed"}`);
});

// Executa uma vez após o término de toda a suíte
AfterAll(async function () {
  logger.info("Fechando navegador...");
  await browser.close();
  logger.info("Navegador fechado");
});

// Executa ANTES de cada Cenário
Before(async function (this: CustomWorld, scenario) {
  this.scenarioName = scenario.pickle.name;
  logger.info(`\n=== Iniciando cenário: ${this.scenarioName} ===`);

  this.context = await browser.newContext({ viewport: null });
  this.page = await this.context.newPage();

  // Configura timeout padrão para este cenário
  this.page.setDefaultTimeout(60000);
});

// Executa DEPOIS de cada Cenário
After(async function (this: CustomWorld, scenario) {
  const scenarioName = this.scenarioName || "unknown";

  // Captura de screenshot em caso de falha
  if (scenario.result?.status === Status.FAILED && this.page) {
    logger.error(`Cenário falhou: ${scenarioName}`);

    try {
      // Salva screenshot em arquivo
      const screenshotsDir = path.join(process.cwd(), "screenshots");
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      const screenshotPath = path.join(
        screenshotsDir,
        `${scenarioName.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}.png`
      );

      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      logger.info(`Screenshot salvo: ${screenshotPath}`);

      // Anexa a imagem ao relatório HTML do Cucumber
      const screenshot = await this.page.screenshot({ fullPage: true });
      this.attach(screenshot, "image/png");
    } catch (error) {
      logger.error(`Erro ao capturar screenshot: ${error}`);
    }
  } else {
    logger.info(`Cenário passou: ${scenarioName}`);
  }

  // Limpa o ambiente fechando a aba
  await this.page?.close();
  await this.context?.close();
});
