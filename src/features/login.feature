# language: pt
Funcionalidade: Autenticação no OrangeHRM
  Como um usuário do sistema OrangeHRM
  Quero poder acessar minha conta
  Para gerenciar informações de recursos humanos e acessar o painel principal

  Contexto:
    Dado que estou na página de login do OrangeHRM

  Cenário: Login com credenciais válidas (Caminho Feliz)
    Quando insiro o usuário "Admin" e a senha "admin123"
    E clico no botão de entrar
    Então devo ser redirecionado para o painel principal (Dashboard)

  Esquema do Cenário: Tentativas de login com credenciais inválidas
    Quando insiro o usuário "<usuario>" e a senha "<senha>"
    E clico no botão de entrar
    Então o sistema deve exibir a mensagem de erro "Invalid credentials"

    Exemplos:
      | usuario | senha        |
      | Admin   | senha_errada |
      | errado  | admin123     |
      | errado  | senha_errada |

  Cenário: Tentativa de login com campos em branco
    Quando clico no botão de entrar sem preencher os dados
    Então o sistema deve indicar que os campos são obrigatórios
