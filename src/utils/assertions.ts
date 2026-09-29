/**
 * Utilitários para assertions mais robustas
 */

import { expect, Locator } from "@playwright/test";
import { TIMEOUTS } from "../config/timeouts";
import { logger } from "./logger";

/**
 * Espera elemento ficar visível com timeout configurável
 */
export async function waitForVisible(
  locator: Locator,
  timeout: number = TIMEOUTS.ELEMENT_VISIBLE
): Promise<void> {
  await locator.waitFor({ state: "visible", timeout });
  logger.debug(`Elemento visível: ${locator}`);
}

/**
 * Espera elemento ficar oculto
 */
export async function waitForHidden(
  locator: Locator,
  timeout: number = TIMEOUTS.ELEMENT_VISIBLE
): Promise<void> {
  await locator.waitFor({ state: "hidden", timeout });
  logger.debug(`Elemento oculto: ${locator}`);
}

/**
 * Espera elemento ficar anexado ao DOM
 */
export async function waitForAttached(
  locator: Locator,
  timeout: number = TIMEOUTS.ELEMENT_VISIBLE
): Promise<void> {
  await locator.waitFor({ state: "attached", timeout });
  logger.debug(`Elemento anexado: ${locator}`);
}

/**
 * Verifica se elemento contém texto com opções avançadas
 */
export async function assertContainsText(
  locator: Locator,
  text: string,
  options: { ignoreCase?: boolean; timeout?: number } = {}
): Promise<void> {
  const { ignoreCase = false, timeout = TIMEOUTS.ELEMENT_VISIBLE } = options;

  await waitForVisible(locator, timeout);

  if (ignoreCase) {
    const actualText = await locator.textContent();
    expect(actualText?.toLowerCase()).toContain(text.toLowerCase());
  } else {
    await expect(locator).toContainText(text);
  }

  logger.validation(`Elemento contém "${text}"`, true);
}

/**
 * Verifica se elemento tem texto exato
 */
export async function assertHasText(
  locator: Locator,
  text: string,
  options: { ignoreCase?: boolean; timeout?: number } = {}
): Promise<void> {
  const { ignoreCase = false, timeout = TIMEOUTS.ELEMENT_VISIBLE } = options;

  await waitForVisible(locator, timeout);

  if (ignoreCase) {
    const actualText = await locator.textContent();
    expect(actualText?.toLowerCase()).toBe(text.toLowerCase());
  } else {
    await expect(locator).toHaveText(text);
  }

  logger.validation(`Elemento tem texto "${text}"`, true);
}

/**
 * Verifica se elemento está visível
 */
export async function assertVisible(
  locator: Locator,
  timeout: number = TIMEOUTS.ELEMENT_VISIBLE
): Promise<void> {
  await expect(locator).toBeVisible({ timeout });
  logger.validation(`Elemento está visível`, true);
}

/**
 * Verifica se elemento está oculto
 */
export async function assertHidden(
  locator: Locator,
  timeout: number = TIMEOUTS.ELEMENT_VISIBLE
): Promise<void> {
  await expect(locator).toBeHidden({ timeout });
  logger.validation(`Elemento está oculto`, true);
}

/**
 * Verifica se elemento está habilitado
 */
export async function assertEnabled(
  locator: Locator,
  timeout: number = TIMEOUTS.ELEMENT_VISIBLE
): Promise<void> {
  await expect(locator).toBeEnabled({ timeout });
  logger.validation(`Elemento está habilitado`, true);
}

/**
 * Verifica se elemento está desabilitado
 */
export async function assertDisabled(
  locator: Locator,
  timeout: number = TIMEOUTS.ELEMENT_VISIBLE
): Promise<void> {
  await expect(locator).toBeDisabled({ timeout });
  logger.validation(`Elemento está desabilitado`, true);
}

/**
 * Clica em elemento com retry automático
 */
export async function clickWithRetry(
  locator: Locator,
  maxRetries: number = 3
): Promise<void> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await locator.click({ timeout: TIMEOUTS.CLICK });
      logger.action(`Clique em elemento`);
      return;
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Tentativa ${attempt + 1}/${maxRetries} falhou: ${lastError.message}`);

      if (attempt < maxRetries - 1) {
        await locator.page().waitForTimeout(500);
      }
    }
  }

  throw lastError;
}

/**
 * Preenche campo com retry automático
 */
export async function fillWithRetry(
  locator: Locator,
  value: string,
  maxRetries: number = 3
): Promise<void> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await locator.fill(value, { timeout: TIMEOUTS.FILL });
      logger.action(`Preenchimento de campo`, value);
      return;
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Tentativa ${attempt + 1}/${maxRetries} falhou: ${lastError.message}`);

      if (attempt < maxRetries - 1) {
        await locator.page().waitForTimeout(500);
      }
    }
  }

  throw lastError;
}
