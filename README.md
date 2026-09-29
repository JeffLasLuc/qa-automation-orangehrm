# QA Automation - OrangeHRM

Projeto de automação de testes E2E para o OrangeHRM usando Cucumber, Playwright e TypeScript.

## 🚀 Recursos Principais

- ✅ **Configuração Centralizada** - Timeouts ajustáveis em um único arquivo
- 🔄 **Retry Automático** - Reduz flakiness em operações instáveis
- 📝 **Sistema de Logging** - Logs estruturados para debugging
- 📸 **Screenshots Automáticos** - Captura em falhas com contexto completo
- 🎯 **Assertions Robustos** - Funções customizadas com waits explícitos
- 🔧 **Hooks Inteligentes** - Setup/teardown automático com detecção de ambiente
- 🌐 **CI/CD Ready** - Configurado para GitHub Actions
- 📚 **Documentação Completa** - Guia detalhado de uso e troubleshooting

## 📊 Status do Projeto

- **Testes Ativos**: 8 cenários, 50 steps
- **Taxa de Sucesso**: 100% (local)
- **Compatibilidade**: Node.js 22+
- **Última Atualização**: Setembro 2026
- **Status**: ✅ Produção Ready

## Pré-requisitos

- Node.js 22 ou superior
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd qa-automation-orangehrm
```

2. Instale as dependências:
```bash
npm install
```

3. Instale os navegadores do Playwright:
```bash
npx playwright install chromium
```

## Configuração

O projeto está configurado para funcionar tanto localmente quanto no CI:

- **Local**: O navegador abre em modo headed (com interface gráfica)
- **CI (GitHub Actions)**: O navegador abre em modo headless (sem interface gráfica)

### Variáveis de Ambiente

- `CI=true`: Ativa modo headless (automático no GitHub Actions)
- `DEBUG=true`: Ativa logs de debug detalhados

## Executando os Testes

### Execução padrão (local)
```bash
npm test
```

### Execução com logs de debug
```bash
npm run test:debug
```

### Execução com retry de falhas
```bash
npm run test:failed
```

### Execução em paralelo
```bash
npm run test:parallel
```

## Estrutura do Projeto

```
qa-automation-orangehrm/
├── src/
│   ├── config/
│   │   └── timeouts.ts          # Configuração centralizada de timeouts
│   ├── features/
│   │   └── cadastro_funcionario.feature  # Cenários de teste
│   ├── pages/
│   │   ├── loginPage.ts         # Page Object para Login
│   │   └── pimPage.ts           # Page Object para PIM
│   ├── steps/
│   │   └── pimSteps.ts          # Implementação dos steps
│   ├── support/
│   │   ├── hooks.ts             # Hooks do Cucumber (Before/After)
│   │   └── world.ts             # Contexto dos testes
│   └── utils/
│       ├── assertions.ts        # Funções de assert customizadas
│       ├── logger.ts            # Sistema de logging
│       └── retry.ts             # Utilitários de retry
├── .github/
│   └── workflows/
│       └── e2e.yml              # Workflow do GitHub Actions
├── reports/                     # Relatórios HTML (gerados após execução)
├── screenshots/                 # Screenshots de falhas (gerados automaticamente)
└── package.json
```

## Recursos Implementados

### 1. Configuração Centralizada
- Timeouts configuráveis em `src/config/timeouts.ts`
- Fácil ajuste para diferentes ambientes
- Timeouts por tipo de operação (navegação, elemento visível, rede, clique, preenchimento)

**Exemplo de uso:**
```typescript
import { TIMEOUTS } from "../config/timeouts";

await element.waitFor({ state: "visible", timeout: TIMEOUTS.ELEMENT_VISIBLE });
```

### 2. Retry Automático
- Funções de clique e preenchimento com retry integrado
- Reduz flakiness em operações instáveis
- Configurável número de tentativas e delay

**Funções disponíveis em `src/utils/retry.ts`:**
- `retryOperation<T>()` - Retry genérico para qualquer operação
- `retryWithIgnoreErrors()` - Retry ignorando erros específicos

**Exemplo de uso:**
```typescript
import { retryOperation } from "../utils/retry";

await retryOperation(
  async () => await element.click(),
  3, // maxRetries
  1000, // delay
  "Clique no botão salvar"
);
```

### 3. Sistema de Logging
- Logs estruturados para debugging
- Níveis: DEBUG, INFO, WARN, ERROR
- Ativado com `DEBUG=true`
- Métodos específicos para ações, navegação e validações

**Funções disponíveis em `src/utils/logger.ts`:**
- `logger.debug()` - Logs de debug (só com DEBUG=true)
- `logger.info()` - Logs informativos
- `logger.warn()` - Logs de aviso
- `logger.error()` - Logs de erro
- `logger.action()` - Logs de ações do usuário
- `logger.navigation()` - Logs de navegação
- `logger.validation()` - Logs de validações

**Exemplo de uso:**
```typescript
import { logger } from "../utils/logger";

logger.info("Iniciando teste");
logger.action("Preenchendo formulário", "Dados do usuário");
logger.validation("Elemento visível", true);
```

### 4. Screenshots Automáticos
- Captura automática em caso de falha
- Salvos em `screenshots/` com nome do cenário e timestamp
- Anexados ao relatório HTML
- Full page screenshots para contexto completo

**Configuração em `src/support/hooks.ts`:**
```typescript
After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const screenshotPath = path.join(
      screenshotsDir,
      `${scenarioName}_${Date.now()}.png`
    );
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
  }
});
```

### 5. Assertions Robustos
- Funções de assert customizadas em `src/utils/assertions.ts`
- Wits explícitos baseados em estado (visible, hidden, attached)
- Opções avançadas (ignoreCase, timeout)
- Retry automático em cliques e preenchimentos

**Funções disponíveis:**
- `waitForVisible()` - Espera elemento ficar visível
- `waitForHidden()` - Espera elemento ficar oculto
- `waitForAttached()` - Espera elemento ser anexado ao DOM
- `assertContainsText()` - Verifica se elemento contém texto
- `assertHasText()` - Verifica se elemento tem texto exato
- `assertVisible()` - Verifica se elemento está visível
- `assertHidden()` - Verifica se elemento está oculto
- `assertEnabled()` - Verifica se elemento está habilitado
- `assertDisabled()` - Verifica se elemento está desabilitado
- `clickWithRetry()` - Clica com retry automático
- `fillWithRetry()` - Preenche campo com retry automático

**Exemplo de uso:**
```typescript
import {
  assertVisible,
  assertContainsText,
  clickWithRetry,
  fillWithRetry
} from "../utils/assertions";

await assertVisible(element);
await assertContainsText(element, "Texto esperado");
await clickWithRetry(button);
await fillWithRetry(input, "valor");
```

### 6. Hooks Melhorados
- Setup e teardown automático em `src/support/hooks.ts`
- Nome do cenário para debugging e screenshots
- Configuração de timeout por cenário
- Detecção automática de ambiente (CI vs local)
- Logging estruturado do ciclo de vida

**Funcionalidades:**
- `BeforeAll` - Inicia navegador (headless no CI, headed local)
- `AfterAll` - Fecha navegador
- `Before` - Cria contexto e página, configura timeout
- `After` - Captura screenshots em falhas, limpa contexto

### 7. Detecção Automática de Ambiente
- Navegador em modo headed localmente
- Navegador em modo headless no CI
- Detecção via variável `CI=true`
- Argumentos específicos por ambiente

**Configuração:**
```typescript
const isCI = process.env.CI === "true";
browser = await chromium.launch({
  headless: isCI,
  args: isCI ? ["--no-sandbox", "--disable-setuid-sandbox"] : ["--start-maximized"],
});
```

### 8. World Customizado
- Contexto compartilhado entre steps
- Armazenamento de dados de teste (funcionarioFake)
- Nome do cenário para debugging
- Timeouts configuráveis via `TIMEOUTS`

## Guia de Uso das Funcionalidades

### Ajustando Timeouts

Edite `src/config/timeouts.ts` para ajustar timeouts conforme seu ambiente:

```typescript
export const TIMEOUTS = {
  DEFAULT: 60 * 1000,          // Aumente se tests forem lentos
  ELEMENT_VISIBLE: 15 * 1000,  // Aumente se elementos demoram a carregar
  NAVIGATION: 30 * 1000,       // Aumente se navegação for lenta
  NETWORK: 30 * 1000,          // Aumente se API for lenta
  CLICK: 10 * 1000,            // Aumente se cliques falharem
  FILL: 10 * 1000,             // Aumente se preenchimento falhar
  STABLE: 5 * 1000,            // Aumente se animações demoram
};
```

### Debugando com Logs

Ative logs detalhados para ver cada ação:

```bash
npm run test:debug
```

Output exemplo:
```
[Test] INFO: Iniciando navegador...
[Test] INFO: === Iniciando cenário: Cadastro de funcionário ===
[Test] INFO: Action: Autenticando administrador
[Test] INFO: Action: Preenchendo dados do funcionário
[Test] DEBUG: Dados gerados: {"nome":"João","sobrenome":"Silva","id":"123456"}
[Test] INFO: Validation: ✓ Elemento contém "123456"
```

### Analisando Screenshots de Falha

Quando um teste falha, screenshots são salvos em `screenshots/`:

```
screenshots/
├── Cadastro_de_funcionario_1699123456789.png
├── Busca_funcionario_inexistente_1699123456790.png
└── Login_invalido_1699123456791.png
```

### Criando Novos Steps com Funcionalidades

Exemplo de step usando todas as funcionalidades:

```typescript
import { logger } from "../utils/logger";
import { assertVisible, clickWithRetry, fillWithRetry } from "../utils/assertions";
import { TIMEOUTS } from "../config/timeouts";

Quando("preencho o campo {string} com {string}", async function (this: CustomWorld, campo: string, valor: string) {
  logger.action(`Preenchendo campo ${campo}`, valor);

  const element = this.page!.getByPlaceholder(campo);
  await assertVisible(element, TIMEOUTS.ELEMENT_VISIBLE);
  await fillWithRetry(element, valor);
});
```

### Adicionando Retry em Operações Customizadas

```typescript
import { retryOperation } from "../utils/retry";

async function operacaoInstavel() {
  // Sua operação que pode falhar
  await element.click();
}

// Usa com retry
await retryOperation(
  operacaoInstavel,
  3,    // 3 tentativas
  1000  // 1 segundo entre tentativas
);
```

## Solução de Problemas

### Timeout nos testes
**Sintoma:** Testes falham com "timeout exceeded"

**Solução:** Aumente os valores em `src/config/timeouts.ts`
```typescript
export const TIMEOUTS = {
  DEFAULT: 90 * 1000,  // Aumentou de 60s para 90s
  ELEMENT_VISIBLE: 20 * 1000,  // Aumentou de 15s para 20s
};
```

### Elementos não encontrados
**Sintoma:** "Element not found" ou "Element not visible"

**Solução 1:** Ative o debug para ver mais detalhes
```bash
npm run test:debug
```

**Solução 2:** Verifique se o locator está correto no Page Object
```typescript
// Verifique em src/pages/pimPage.ts
this.seuElemento = page.getByRole("button", { name: "Seu Botão" });
```

**Solução 3:** Aumente o timeout específico
```typescript
await assertVisible(element, 30000); // 30 segundos
```

### Flakiness nos testes
**Sintoma:** Testes passam às vezes, falham outras

**Solução 1:** Use funções com retry
```typescript
await clickWithRetry(button);  // Já tem retry integrado
await fillWithRetry(input, "valor");  // Já tem retry integrado
```

**Solução 2:** Aumente o número de retries
```typescript
// Em src/utils/assertions.ts
export async function clickWithRetry(
  locator: Locator,
  maxRetries: number = 5  // Aumentou de 3 para 5
): Promise<void> {
  // ...
}
```

### Navegador não abre
**Sintoma:** Erro ao iniciar navegador

**Solução:** Verifique se o Node.js é v22 ou superior
```bash
node --version  # Deve ser v22.x.x ou superior
```

### Screenshots não são gerados
**Sintoma:** Pasta screenshots/ fica vazia

**Solução 1:** Verifique se o teste está falhando (screenshots só em falhas)
```bash
# Force uma falha para testar
```

**Solução 2:** Verifique permissões da pasta
```bash
# No Windows: Verifique se tem permissão de escrita
# No Linux/Mac: chmod 755 screenshots/
```

### Logs não aparecem
**Sintoma:** Não vê logs no console

**Solução:** Ative DEBUG
```bash
# Linux/Mac
DEBUG=true npm test

# Windows (PowerShell)
$env:DEBUG="true"; npm test

# Windows (CMD)
set DEBUG=true && npm test
```

## Arquitetura e Boas Práticas

### Separação de Responsabilidades

**Page Objects (`src/pages/`):**
- Encapsulam seletores e lógica de página
- Sem asserts ou lógica de teste
- Reutilizáveis entre cenários

**Steps (`src/steps/`):**
- Implementam asserções e lógica de teste
- Usam Page Objects
- Focados em comportamento do usuário

**Utils (`src/utils/`):**
- Funções reutilizáveis (logging, retry, assertions)
- Sem dependência de domínio
- Testáveis independentemente

**Config (`src/config/`):**
- Configurações centralizadas
- Valores ajustáveis sem mudar código
- Específico por ambiente

### Anti-Patterns Evitados

❌ **Não use:**
```typescript
// waitForTimeout é anti-pattern
await page.waitForTimeout(5000);

// Seletores frágeis
await page.click("div > div > button");

// Hardcoded values
await input.fill("Teste123");
```

✅ **Use:**
```typescript
// waitFor explícito
await element.waitFor({ state: "visible" });

// Seletores robustos
await page.getByRole("button", { name: "Salvar" });

// Dados dinâmicos
await input.fill(faker.person.firstName());
```

### Padrões Implementados

**1. Page Object Pattern**
- Separação entre lógica de página e testes
- Reutilização de seletores
- Manutenção facilitada

**2. Data-Driven Testing**
- Uso de Faker para dados dinâmicos
- Evita colisões de dados
- Testes independentes

**3. Retry Pattern**
- Retry automático em operações instáveis
- Reduz flakiness
- Configurável

**4. Logging Pattern**
- Logs estruturados
- Facilita debugging
- Níveis de severidade

**5. Screenshot Pattern**
- Captura automática em falhas
- Contexto completo (full page)
- Anexado ao relatório

## CI/CD

O projeto está configurado para rodar automaticamente no GitHub Actions:

**Workflow: `.github/workflows/e2e.yml`**
- Node.js 22 (compatível com Cucumber)
- Playwright em modo headless
- Upload de relatórios como artifacts (retenção 7 dias)
- Timeout de 60 minutos por job

**Variáveis de ambiente no CI:**
- `CI=true` - Ativa modo headless automaticamente
- Timeout padrão: 60s (configurável em `timeouts.ts`)

**Execução manual no CI:**
```bash
# Push para main/master
git push origin main

# Pull request
git push origin feature-branch
```

## Melhorias Futuras

### Curto Prazo
- [ ] Implementar Page Object Factory para instanciação consistente
- [ ] Adicionar wait for network response para operações assíncronas
- [ ] Implementar data cleanup automático via API
- [ ] Adicionar mais cenários de teste (edição, exclusão, busca avançada)

### Médio Prazo
- [ ] Adicionar testes de API complementares
- [ ] Implementar paralelização avançada com sharding
- [ ] Adicionar cobertura de código (Istanbul/nyc)
- [ ] Implementar test data management com banco dedicado

### Longo Prazo
- [ ] Integração com ferramentas de report (Allure, ReportPortal)
- [ ] Implementar visual regression testing
- [ ] Adicionar testes de performance
- [ ] Implementar testes de acessibilidade (a11y)
- [ ] Integração com ferramentas de qualidade (SonarQube)

## Contribuindo

### Adicionando Novo Cenário

1. Crie o arquivo `.feature` em `src/features/`:
```gherkin
# language: pt
Funcionalidade: Nova Funcionalidade
  Como um usuário
  Quero realizar uma ação
  Para obter um resultado

  Cenário: Cenário de teste
    Dado que estou na página X
    Quando realizo ação Y
    Então vejo resultado Z
```

2. Implemente os steps em `src/steps/`:
```typescript
import { Dado, Quando, Então } from "@cucumber/cucumber";
import { logger } from "../utils/logger";
import { assertVisible } from "../utils/assertions";

Dado("que estou na página X", async function (this: CustomWorld) {
  logger.action("Navegando para página X");
  // Implementação
});

Quando("realizo ação Y", async function (this: CustomWorld) {
  logger.action("Realizando ação Y");
  // Implementação
});

Então("vejo resultado Z", async function (this: CustomWorld) {
  logger.action("Validando resultado Z");
  await assertVisible(element);
});
```

3. Execute os testes:
```bash
npm test
```

### Adicionando Nova Page Object

1. Crie o arquivo em `src/pages/`:
```typescript
import { Page, Locator } from "@playwright/test";

export class NovaPage {
  readonly page: Page;
  readonly elemento: Locator;

  constructor(page: Page) {
    this.page = page;
    this.elemento = page.getByRole("button", { name: "Botão" });
  }

  async clicar() {
    await this.elemento.click();
  }
}
```

2. Use nos steps:
```typescript
import { NovaPage } from "../pages/novaPage";

Quando("clico no botão", async function (this: CustomWorld) {
  const novaPage = new NovaPage(this.page!);
  await novaPage.clicar();
});
```

### Adicionando Nova Utilidade

1. Crie o arquivo em `src/utils/`:
```typescript
export function novaUtilidade(param: string): string {
  // Lógica
  return param.toUpperCase();
}
```

2. Importe e use onde necessário:
```typescript
import { novaUtilidade } from "../utils/novaUtilidade";

const resultado = novaUtilidade("teste");
```

## Exemplos de Uso Avançado

### Teste com Múltiplas Páginas
```typescript
Dado("que navego entre páginas", async function (this: CustomWorld) {
  const page1 = new Page1(this.page!);
  const page2 = new Page2(this.page!);

  await page1.navegar();
  await page2.navegar();
});
```

### Teste com Dados Complexos
```typescript
Quando("preencho formulário complexo", async function (this: CustomWorld) {
  const dados = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    telefone: faker.phone.number(),
    endereco: faker.location.streetAddress()
  };

  this.dadosTeste = dados;
  // Preencher campos...
});
```

### Teste com Validação de API
```typescript
Então("os dados são salvos corretamente", async function (this: CustomWorld) {
  const response = await this.page!.request.get(`/api/funcionario/${this.id}`);
  expect(response.ok()).toBeTruthy();
});
```

### Teste com Multiplas Abas
```typescript
Quando("abro nova aba", async function (this: CustomWorld) {
  const newPage = await this.context!.newPage();
  await newPage.goto("https://exemplo.com");
});
```

## Recursos Adicionais

### Documentação Oficial
- [Cucumber.js](https://cucumber.io/docs/cucumber/)
- [Playwright](https://playwright.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Faker.js](https://fakerjs.dev/)

### Comunidade
- [Playwright Community](https://github.com/microsoft/playwright/discussions)
- [Cucumber Support](https://cucumber.io/support/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/playwright+cucumber)

## Licença

Este projeto é destinado para fins educacionais e de demonstração.
