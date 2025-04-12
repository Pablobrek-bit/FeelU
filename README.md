# Tindaria API 🚀

[![Node.js](https://img.shields.io/badge/Node.js-20.17.0-brightgreen)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-red)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.5.0-blue)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-UNLICENSED-lightgrey)](LICENSE)
[![Swagger](https://img.shields.io/badge/Documentação-Swagger-%2385EA2D)](http://localhost:3000/api)

Uma API RESTful para um aplicativo de relacionamentos, focada em conexões universitárias. Gerencie usuários, perfis, filtros de preferência, swipes, matches e muito mais!

---

## 📋 Tabela de Conteúdos

- [Funcionalidades](#-funcionalidades)
- [Endpoints da API](#-endpoints-da-api)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Comandos Disponíveis](#-comandos-disponíveis)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🌟 Funcionalidades

### **Funcionalidades Principais**

- **Usuários**: CRUD de usuários com autenticação JWT e verificação de e-mail.
- **Perfis**: Criação e atualização de perfis detalhados (idade, bio, curso, instituição, etc.).
- **Filtros**: Definição e atualização de preferências de gênero e orientação sexual para busca.
- **Swipe**: Mecanismo de "like" ou "dislike" em perfis.
- **Matches**: Criação automática de matches quando dois usuários se curtem mutuamente.
- **Autenticação**: JWT para login seguro e controle de acesso baseado em roles (USER, VIP, ADMIN).

### **Recursos Adicionais**

- 📷 Upload e armazenamento de avatares com Firebase Storage.
- 📧 Envio de e-mail para verificação de conta.
- 🔒 Soft delete para usuários.
- ✨ Funcionalidades VIP (ex: ver quem curtiu seu perfil) com controle de acesso por role e data de liberação.

---

## 🔌 Endpoints da API

A API oferece os seguintes grupos de endpoints:

### User

- `POST /user/create` - Registro de novos usuários com perfil, filtros e avatar.
- `POST /user/login` - Login de usuários existentes.
- `PUT /user/update` - Atualizar dados do usuário (senha, perfil, filtros).
- `GET /user` - Obter perfil completo do usuário atual (inclui contagem de likes).
- `GET /user/verify-email` - Verificar e-mail do usuário via token.
- `DELETE /user/delete` - Desativar (soft delete) conta do usuário.

### Swipe

- `GET /swipe/profiles` - Obter lista de perfis potenciais para swipe.
- `POST /swipe/profile` - Registrar swipe (like/dislike) em um perfil.
- `GET /swipe/matches` - Obter lista de usuários com quem houve match.
- `GET /swipe/liked-profiles` - (VIP/ADMIN) Obter lista de usuários que curtiram o perfil do usuário atual.

Para detalhes completos, consulte a documentação Swagger em `/api`.

---

## 🛠️ Tecnologias Utilizadas

| Categoria          | Tecnologias                                             |
| ------------------ | ------------------------------------------------------- |
| **Backend**        | Node.js 20.17.0, NestJS 11.x                            |
| **Banco de Dados** | PostgreSQL, Prisma ORM 6.5.0                            |
| **Autenticação**   | JWT (@nestjs/jwt 11.0.0), bcryptjs 3.0.2                |
| **Storage**        | Firebase Storage (firebase-admin 13.2.0)                |
| **Documentação**   | Swagger (@nestjs/swagger 11.1.2)                        |
| **Validação**      | class-validator 0.14.1, class-transformer 0.5.1         |
| **Testes**         | Jest 29.7.0, Supertest 7.0.0, ts-jest 29.2.5            |
| **DevOps**         | Docker, Docker Compose                                  |
| **Linting**        | ESLint 9.18.0, Prettier 3.4.2, TypeScript ESLint 8.20.0 |
| **Tooling**        | TypeScript 5.7.3, ts-node 10.9.2, dotenv 16.5.0         |
| **Email**          | Nodemailer 6.10.0 (para verificação de e-mail)          |
| **Upload**         | Multer 1.4.5-lts.2                                      |

---

## 🏗️ Estrutura do Projeto

O projeto segue uma arquitetura modular inspirada em Clean Architecture / Ports and Adapters:

```
src
├── application         # Lógica de negócio, DTOs, services, ports (interfaces)
│   ├── dto             # Data Transfer Objects (validação de entrada/saída)
│   ├── ports           # Interfaces (contratos) para repositórios
│   └── service         # Services contendo a lógica de aplicação
├── domain              # Modelos de domínio (entidades)
│   └── model
├── infrastructure      # Implementações concretas (frameworks, libs externas)
│   ├── config          # Configuração (Prisma, Firebase Admin)
│   ├── controller      # Controladores HTTP (NestJS)
│   ├── http            # Middlewares, Filters, Guards HTTP
│   └── persistence     # Implementação dos repositórios (Prisma), converters
├── modules             # Módulos NestJS (agrupamento de funcionalidades)
├── shared              # Utilitários e exceções compartilhadas
│   ├── exception
│   └── utils
├── types               # Definições de tipos globais (ex: Express Request)
├── app.controller.ts   # Controlador raiz
├── app.module.ts       # Módulo raiz
├── app.service.ts      # Serviço raiz
└── main.ts             # Ponto de entrada da aplicação (bootstrap)
prisma                  # Schema, migrações e seed do banco de dados
test                    # Testes E2E
```

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 20.17.0 ou superior
- Docker
- Docker Compose
- NPM ou Yarn

### Passo a Passo

1.  **Clone o repositório**
    ```bash
    git clone <url-do-repositorio>
    cd tindaria
    ```
2.  **Configure as variáveis de ambiente**
    - Copie `.env.example` para `.env`.
    - Preencha as variáveis no arquivo `.env` (veja [Variáveis de Ambiente](#-variáveis-de-ambiente)).
    - **Importante:** Atualize `FIREBASE_CREDENTIALS` com o caminho correto para o seu arquivo de credenciais do Firebase.
3.  **Inicie os containers do Docker (Banco de Dados)**
    ```bash
    docker-compose up -d tindaria_db
    ```
    Aguarde o banco de dados ficar saudável (verifique com `docker ps` ou logs).
4.  **Instale as dependências**
    ```bash
    npm install
    ```
5.  **Execute as migrações do Prisma**
    ```bash
    npx prisma migrate dev
    ```
6.  **Popule o banco de dados com os dados iniciais (Roles)**
    ```bash
    npx prisma db seed
    ```
7.  **Inicie o servidor NestJS**
    ```bash
    npm run start:dev
    ```
8.  **Acesse a documentação da API em `http://localhost:3000/api`**
9.  **Pronto! A API está rodando em `http://localhost:<PORTA_DEFINIDA_NO_ENV>` (padrão 3000)**

---

## 📜 Comandos Disponíveis

Os seguintes comandos `npm` estão disponíveis:

| Comando                  | Descrição                                                             |
| ------------------------ | --------------------------------------------------------------------- |
| `npm run build`          | Compila o código TypeScript para JavaScript no diretório `dist`       |
| `npm run format`         | Formata o código usando Prettier                                      |
| `npm start`              | Inicia a aplicação em modo de produção (requer build prévio)          |
| `npm run start:dev`      | Inicia a aplicação em modo de desenvolvimento com watch               |
| `npm run start:debug`    | Inicia a aplicação em modo de debug com watch                         |
| `npm run start:prod`     | Inicia a aplicação em modo de produção a partir do `dist`             |
| `npm run lint`           | Executa o ESLint para verificar e corrigir problemas de código        |
| `npm test`               | Executa os testes unitários (definidos no `package.json` jest config) |
| `npm run test:watch`     | Executa os testes unitários em modo watch                             |
| `npm run test:cov`       | Executa os testes unitários e gera relatório de cobertura             |
| `npm run test:debug`     | Executa os testes unitários em modo debug                             |
| `npm run test:e2e`       | Executa os testes end-to-end                                          |
| `npx prisma migrate dev` | Cria e aplica migrações no banco de dados                             |
| `npx prisma studio`      | Abre a interface visual do Prisma para o banco de dados               |
| `npx prisma db seed`     | Executa o script de seed do Prisma                                    |

---

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis (baseado no `.env` fornecido e `env.utils.ts`):

```properties
# Ambiente
NODE_ENV=dev # ou prod, test

# Configurações do Servidor
PORT=3000

# Configurações do Banco de Dados PostgreSQL
DB_NAME=tindaria_db
DB_USER=tindaria_user
DB_PASSWORD=sua_senha_db
DB_HOST=localhost # ou o host do container docker (ex: tindaria_db)
DB_PORT=5432
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

# Configurações do JWT
JWT_SECRET="seu_segredo_super_secreto_para_jwt"
JWT_EXPIRATION_TIME=2592000s # Tempo de expiração (ex: 30d)

# Configurações de Email (Nodemailer - opcional, se for usar verificação)
# EMAIL_HOST=smtp.example.com
# EMAIL_PORT=587
# EMAIL_USER=seu_email@example.com
# EMAIL_PASSWORD=sua_senha_email
# EMAIL_FROM='"Nome Remetente" <seu_email@example.com>'
# APP_URL=http://localhost:3000 # URL base para links de verificação

# Configurações do Firebase Storage
FIREBASE_CREDENTIALS=/caminho/para/seu/arquivo/serviceAccountKey.json # Caminho absoluto ou relativo para as credenciais
FIREBASE_BUCKET_URL=gs://seu-bucket-name.appspot.com # URL do seu bucket no Firebase Storage
# FIREBASE_API_KEY=sua_api_key_firebase (Se necessário para outras integrações)

```

**Observação:** Certifique-se de que o caminho para `FIREBASE_CREDENTIALS` esteja correto no seu ambiente.

---

## 🌐 Deployment

### Preparando para Produção

1.  **Atualize as variáveis de ambiente para produção** no seu servidor ou serviço de hospedagem (não comite o `.env` de produção no Git). Defina `NODE_ENV=prod`.
2.  **Construa a aplicação**:
    ```bash
    npm run build
    ```
3.  **Execute as migrações no banco de dados de produção**:
    ```bash
    npx prisma migrate deploy
    ```
4.  **Inicie a aplicação**:
    ```bash
    npm run start:prod
    ```

### Opções de Deploy

- **Docker**: Utilize o `Dockerfile` e `docker-compose.yml` (ajustado para produção) para buildar e rodar a imagem em um servidor.
- **Plataformas de Nuvem (AWS, Google Cloud, Azure, Heroku, etc.)**: Configure serviços como EC2, App Engine, Azure App Service ou utilize containers (ECS, Kubernetes, Cloud Run). Certifique-se de configurar corretamente as variáveis de ambiente e o acesso ao banco de dados e Firebase.

---

## 🔍 Troubleshooting

### Problemas Comuns e Soluções

1.  **Erro de conexão com o banco de dados (`Can't reach database server`)**:

    - Verifique se o container `tindaria_db` está rodando (`docker ps`).
    - Confirme se as variáveis `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` no `.env` estão corretas e correspondem à configuração do `docker-compose.yml`. Se rodando localmente fora do docker-compose, `DB_HOST` deve ser `localhost`. Se rodando dentro do docker-compose, `DB_HOST` deve ser o nome do serviço (`tindaria_db`).
    - Verifique se a porta `5432` não está sendo usada por outro processo.
    - Tente conectar-se manualmente ao banco de dados usando `psql` ou uma ferramenta de GUI.

2.  **Erro de Autenticação JWT (`Unauthorized`, `Invalid token`)**:

    - Verifique se o `JWT_SECRET` no `.env` é o mesmo usado para gerar e verificar os tokens.
    - Certifique-se de que o token não expirou (`JWT_EXPIRATION_TIME`).
    - Verifique se o token está sendo enviado corretamente no header `Authorization: Bearer <token>`.

3.  **Erro no Upload de Arquivos (Firebase Storage)**:

    - Verifique se o caminho em `FIREBASE_CREDENTIALS` no `.env` está correto e se o arquivo existe e tem as permissões adequadas.
    - Confirme se `FIREBASE_BUCKET_URL` está correto.
    - Verifique as permissões de escrita no bucket do Firebase Storage.
    - Analise os logs de erro do Firebase Admin SDK.

4.  **Erros de Validação (`BadRequestException`)**:

    - Verifique os dados enviados na requisição e compare com os DTOs (Data Transfer Objects) e suas regras de validação (decorators `class-validator`). A mensagem de erro geralmente indica qual campo falhou na validação.

5.  **Migrações do Prisma falhando**:
    - Verifique os logs de erro da migração.
    - Pode ser necessário resolver conflitos manualmente ou resetar o banco de dados de desenvolvimento (`npx prisma migrate reset`). **Cuidado ao fazer isso em produção!**

---

## 🤝 Contribuição

Contribuições são bem-vindas! Siga estes passos:

1.  Faça um fork do projeto.
2.  Crie uma nova branch (`git checkout -b feature/sua-feature`).
3.  Faça commit das suas mudanças (`git commit -m 'Adiciona sua feature'`).
4.  Faça push para a branch (`git push origin feature/sua-feature`).
5.  Abra um Pull Request.

Por favor, certifique-se de que seu código segue os padrões de linting (`npm run lint`) e adicione testes para novas funcionalidades.

---

## 📝 Licença

Este projeto é distribuído sob a licença UNLICENSED. Veja o arquivo `package.json` para mais detalhes.
