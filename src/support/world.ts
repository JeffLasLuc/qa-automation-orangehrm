import {
  setWorldConstructor,
  World,
  IWorldOptions,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "@playwright/test";
import { TIMEOUTS } from "../config/timeouts";

setDefaultTimeout(TIMEOUTS.DEFAULT);

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  // Armazena os dados gerados pelo Faker no contexto do cenário
  funcionarioFake = { nome: "", sobrenome: "", id: "" };
  // Nome do cenário atual para logging e screenshots
  scenarioName?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
