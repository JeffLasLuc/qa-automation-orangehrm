
## 🧪 Automação de Testes E2E - OrangeHRM

Projeto de automação de testes End-to-End (E2E) desenvolvido para validar fluxos críticos do sistema OrangeHRM. O foco da arquitetura é estabilidade, reutilização de código e prevenção de *flakiness* em pipelines de CI/CD.

### 🛠️ Stack Tecnológica

- **Motor de Navegação:** [Playwright](https://playwright.dev/)
- **Lignhagem / Runtime:** [TypeScript](https://www.typescriptlang.org/) (com execução via `tsx`)
- **BDD & Especificação:** [Cucumber](https://cucumber.io/) (Gherkin em Português)
- **Massa de Dados Dinâmica:** [Faker.js](https://fakerjs.dev/)
- **Padrão de Arquitetura:** Page Object Model (POM)

### 🏗️ Arquitetura e Boas Práticas

- **Geração de Dados Dinâmicos:** Uso do Faker.js para gerar Nomes e IDs aleatórios/únicos durante as execuções, garantindo a **idempotência** dos testes e evitando poluição de dados (*Data Pollution*) em ambientes compartilhados.
- **Resiliência (Waits):** Substituição de tempos fixos por esperas dinâmicas do Playwright e configuração de *timeouts* estendidos em gargalos de rede (ex: requisições de login e buscas).
- **Locators Semânticos:** Priorização de seletores baseados em acessibilidade (`getByRole`, `getByPlaceholder`, `getByText`) para evitar quebras por mudanças estruturais no DOM (*Strict Mode compliance*).

### 🚀 Como Executar Localmente

#### Pré-requisitos
- Node.js (versão 18 ou superior)
- Git

#### Instalação
1. Clone o repositório:
    ```bash
    git clone [https://github.com/JeffLasLuc/qa-automation-orangehrm.git](https://github.com/JeffLasLuc/qa-automation-orangehrm.git)
    
    cd qa-automation-orangehrm

2. Instale as dependências do projeto:
    ```bash
    npm install

3. Instale os binários dos navegadores do Playwright:
    ```bash
    npx playwright install

4. Execução dos Testes
Para rodar a suíte completa de testes e abrir o navegador em tempo real:
    ```bash
    npm test

## 📊 Relatórios e Evidências
Após a execução, um relatório detalhado é gerado automaticamente na pasta reports/.

Abra o arquivo reports/cucumber-report.html no seu navegador para visualizar os resultados, duração de cada passo e screenshots em caso de falhas.

## 🔄 CI/CD (Integração Contínua)
O projeto está configurado para rodar em modo headless a cada push ou pull request via GitHub Actions (configurado na pasta .github/workflows/e2e.yml).
Os relatórios HTML e JSON são exportados automaticamente como artefatos (Artifacts) ao final de cada execução do pipeline e ficam disponíveis para download por 7 dias.

Desenvolvido por Jefferson Lucena.