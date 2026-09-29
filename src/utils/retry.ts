/**
 * Utilitários para retry de operações que podem falhar esporadicamente
 */

/**
 * Executa uma operação com retry automático em caso de falha
 * @param operation - Função assíncrona a ser executada
 * @param maxRetries - Número máximo de tentativas (padrão: 3)
 * @param delay - Tempo de espera entre tentativas em ms (padrão: 1000)
 * @param operationName - Nome da operação para logging (opcional)
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  operationName: string = "operation"
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `[Retry] Attempt ${attempt + 1}/${maxRetries} failed for ${operationName}:`,
        lastError.message
      );

      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(
    `Operation "${operationName}" failed after ${maxRetries} attempts. Last error: ${lastError?.message}`
  );
}

/**
 * Executa uma operação com retry, mas ignora erros específicos
 * @param operation - Função assíncrona a ser executada
 * @param ignorableErrors - Array de mensagens de erro que devem ser ignoradas
 * @param maxRetries - Número máximo de tentativas
 */
export async function retryWithIgnoreErrors<T>(
  operation: () => Promise<T>,
  ignorableErrors: string[],
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      const errorMessage = lastError.message;

      // Se o erro for ignorável, retorna undefined ou valor padrão
      if (ignorableErrors.some((ignorable) => errorMessage.includes(ignorable))) {
        console.log(`[Retry] Ignoring error: ${errorMessage}`);
        return undefined as T;
      }

      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError;
}
