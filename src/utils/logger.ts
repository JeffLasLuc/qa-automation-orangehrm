/**
 * Logger simples para testes
 * Usa console.log com prefixos para fácil filtragem
 */

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

class Logger {
  private prefix = "[Test]";

  debug(message: string, ...args: any[]) {
    if (process.env.DEBUG === "true") {
      console.log(`${this.prefix} ${LogLevel.DEBUG}: ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    console.log(`${this.prefix} ${LogLevel.INFO}: ${message}`, ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(`${this.prefix} ${LogLevel.WARN}: ${message}`, ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(`${this.prefix} ${LogLevel.ERROR}: ${message}`, ...args);
  }

  // Método para logging de ações do usuário
  action(action: string, details?: string) {
    this.info(`Action: ${action}${details ? ` - ${details}` : ""}`);
  }

  // Método para logging de navegação
  navigation(from: string, to: string) {
    this.info(`Navigation: ${from} → ${to}`);
  }

  // Método para logging de validações
  validation(assertion: string, result: boolean) {
    const status = result ? "✓" : "✗";
    this.info(`Validation: ${status} ${assertion}`);
  }
}

export const logger = new Logger();
