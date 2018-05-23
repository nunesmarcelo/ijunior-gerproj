PROJETO FEITO POR RAFAEL E JOÃO - APENAS TESTES

# Sistema de gestão de projetos e clientes
entregue
## Resumo
Sistema que exibe uma lista dos projetos aceitos pela empresa, relacionando-os com os respectivos clientes.
## Especificações
#### Tela Inicial
O sistema deve exibir na tela inicial a lista com os projetos já aceitos pela empresa, com os seguintes detalhes:
* Codinome (opcional)
* Nome
* Cliente que pediu
* Data de assinatura do contrato
* Previsão de entrega
* Data de finalização

Cada item da lista deve possuir um botão para editar e um botão para excluir. Além disso, nesta página também deve haver um botão para adicionar novos projetos.

Ao clicar num projeto da lista, o sistema vai para uma página onde mostra o projeto detalhadamente.

Na página inicial também deve haver um botão para acessar a lista de clientes cadastrados.

#### Gerenciamento de clientes
Praticamente igual a tela inicial, porém listando os clientes, com as seguintes informações:
* Nome
* Empresa do cliente
* Telefones (fixo/celular)
* Email

Cada item da lista deve possuir um botão para editar e um botão para excluir. Além disso, nesta página também deve haver um botão para adicionar novos clientes.

Ao clicar num cliente da lista, o sistema vai para uma página onde mostra o cliente com mais detalhes.

#### Páginas de detalhes
Página que mostra as informações detalhadas de um projeto ou cliente. São elas:
##### Projeto
* Codinome (opcional)
* Nome
* Cliente que pediu
* Data de assinatura do contrato
* Previsão de entrega
* Data de finalização
* Descrição detalhada

##### Cliente
* Nome
* Empresa do cliente
* Telefones (fixo/celular)
* Endereço completo
* Email
* Observações

#### Página de adicionar e modificar projetos e clientes

##### Projetos

* Seleção de clientes por dropdown

---
# TODO
* Pensar em colocar os clientes num _dropdown_ na tela inicial, retirando assim a página de gerenciamento de clientes, e transformando a tela de detalhes sobre ele em um modal.
* Pensar no visual
* 