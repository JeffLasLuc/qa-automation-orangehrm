import {
  setWorldConstructor,
  World,
  IWorldOptions,
  setDefaultTimeout,
} from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "@playwright/test";

setDefaultTimeout(30 * 1000);

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  // Armazena os dados gerados pelo Faker no contexto do cenário
  funcionarioFake = { nome: "", sobrenome: "", id: "" };

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
