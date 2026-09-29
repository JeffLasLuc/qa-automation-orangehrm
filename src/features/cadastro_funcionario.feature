# language: pt
Funcionalidade: Gestão de Funcionários (PIM)
  Como um administrador do sistema
  Quero gerenciar o cadastro de funcionários
  Para que a base de talentos esteja sempre atualizada

  Contexto:
    Dado que o administrador está autenticado no sistema
    E navego para o módulo "PIM"

  Cenário: Cadastro de um novo funcionário com sucesso
    Quando preencho os dados do novo funcionário com informações válidas
    E salvo o formulário
    Então o sistema deve exibir uma mensagem de "Successfully Saved"
    E o funcionário deve aparecer na lista de empregados

  Cenário: Tentativa de cadastro sem preencher os campos obrigatórios
    Quando clico no botão de adicionar funcionário
    E salvo o formulário
    Então o sistema deve indicar nos campos de nome que os dados são obrigatórios

  Cenário: Busca por um funcionário que não existe
    Quando busco na lista por um ID de funcionário inexistente "9909987918"
    Então o sistema deve exibir a mensagem "No Records Found"
