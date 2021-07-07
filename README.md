# NixEmpresasWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## Configurações da ERP para gerenciar empresas e planos de taxa. ##

Para aparecer a imagem da ERP na tela de login deve-se seguir os seguintes passos:
- adicionar imagem com formato svg no diretório /src/assets e o arquivo da imagem deve ter o nome da empresa utilizado no link de acesso.
- O link de acesso ficará com o seguinte formato: http://URL/?empresa=NOME_DO_ARQUIVO -> ex: http://URL/?empresa=nexxera

Criação do usuário da ERP no keycloak
- O usuário criado deve ter as seguintes roles para ter acesso ao painel da ERP:
- client-manager e cnpj-CNPJDAEMPRESA, exemplo: cnpj-66749917000100

Criar cliente pro ERP (Backoffice)
- criar no nix-fee plano da nix onde nome o cnpj do parceiro é o nome do plano e o cnpj do plano (partner_document_number) é o da nix
- criar manualmente no keycloak
- colocar role com cnpj do parceiro cnpj-xxxxxxxxxxxxxx (caso nao exista a role, deve ser criada)
- adicionar role client-manager ao usuario criado

Consultar plano que a nix cobra do parceiro
- GET no nix-fee com os parametros a seguir == {{base_url}}/plan?partner_document_number={{NIX_CNPJ}}&plan_name={{plan_cnpj}}
