# MindEase — FIAP Hackathon Fase 5 · Web

MindEase é uma aplicação web voltada para saúde mental e neurodiversidade, desenvolvida como entrega do Hackathon da FIAP Fase 5. O projeto ajuda usuários com TDAH, TEA, Burnout e outros perfis neurodivergentes a gerenciar tarefas, monitorar tempo de foco e manter uma rotina saudável.

> 🌐 **Acesso em produção:** [d146vb28pj7z8r.cloudfront.net](https://d146vb28pj7z8r.cloudfront.net)

---

## Primeiros Passos

### Pré-Requisitos

Antes de iniciar o projeto, certifique-se de ter as seguintes tecnologias instaladas:

- **Node.js** (>= 20.x) – runtime JavaScript/TypeScript.
- **npm** (>= 10.x) – gerenciador de pacotes.
- **Angular CLI** (>= 20.x) – instalado globalmente com `npm install -g @angular/cli`.
- **Git** – controle de versão.

> 💡 Versões acima são as recomendadas durante o desenvolvimento. Pode funcionar com versões mais novas, mas verifique a compatibilidade.

### Tecnologias Utilizadas

Esta aplicação web é construída com as seguintes tecnologias:

| Tecnologia                 | Finalidade                                                                |
| -------------------------- | ------------------------------------------------------------------------- |
| **Angular 18+**            | Framework frontend com arquitetura componentizada (Standalone Components) |
| **TypeScript**             | Tipagem estática e segurança em tempo de desenvolvimento                  |
| **Firebase**               | Autenticação, persistência de dados e backend                             |
| **Angular Material + CDK** | Componentes de UI e suporte a drag-and-drop                               |
| **Jest + Testing Library** | Testes unitários em todas as camadas                                      |
| **SCSS**                   | Estilos com variáveis, mixins e suporte a temas                           |
| **ESLint + Prettier**      | Qualidade e formatação de código                                          |
| **AWS S3**                 | Hospedagem do build de produção                                           |
| **GitHub Actions**         | CI/CD automatizado                                                        |

A arquitetura segue os princípios da **Clean Architecture** com separação clara entre Domain, Data, Infrastructure e Presentation.

---

## Instalação

### Passo a Passo para nova máquina

1. **Clone o repositório:**

   ```bash
   git clone git@github.com:TC5Hackatton/web.git web
   cd web
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente.** Duplique o arquivo `.env.example`, renomeie para `.env` e cole as credenciais do Firebase:

   ```env
   NG_APP_FIREBASE_API_KEY=
   NG_APP_FIREBASE_AUTH_DOMAIN=
   NG_APP_FIREBASE_PROJECT_ID=
   NG_APP_FIREBASE_STORAGE_BUCKET=
   NG_APP_FIREBASE_MESSAGING_SENDER_ID=
   NG_APP_FIREBASE_APP_ID=
   NG_APP_FIREBASE_MEASUREMENT_ID=
   ```

4. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm start
   # Ou diretamente com o Angular CLI:
   ng serve
   ```

5. Acesse a aplicação em `http://localhost:4200/`.

---

## Estrutura do Projeto

A aplicação segue a Clean Architecture com separação clara entre camadas:

```
src/
├── app/
│   ├── app.config.ts                 ← Configurações globais (providers, Firebase)
│   ├── app.routes.ts                 ← Definição de rotas
│   ├── app.ts                        ← Componente raiz
│   │
│   ├── data/                         ← Camada de dados
│   │   ├── dtos/                     ← Data Transfer Objects (task-dto, user-dto)
│   │   ├── mappers/                  ← Conversão entre DTOs e Models
│   │   └── repositories/             ← Implementações concretas (Firebase)
│   │       ├── firebase-auth.repository.ts
│   │       ├── firebase-task.repository.ts
│   │       └── firebase-settings.repository.ts
│   │
│   ├── domain/                       ← Camada de domínio (regras de negócio)
│   │   ├── models/                   ← Entidades do domínio
│   │   │   ├── task.model.ts
│   │   │   ├── user.model.ts
│   │   │   ├── user-settings.model.ts
│   │   │   └── user-task-statistics.model.ts
│   │   ├── repositories/             ← Contratos (interfaces)
│   │   └── usecases/                 ← Casos de uso (lógica de negócio)
│   │       ├── sign-in.usecase.ts
│   │       ├── sign-up.usecase.ts
│   │       ├── sign-out.usecase.ts
│   │       ├── get-current-user.usecase.ts
│   │       ├── settings/
│   │       │   ├── get-settings.usecase.ts
│   │       │   └── save-settings.usecase.ts
│   │       └── tasks/
│   │           ├── add-task.usecase.ts
│   │           ├── get-tasks.usecase.ts
│   │           ├── get-statistics.usecase.ts
│   │           ├── get-oldest-todo-task.usecase.ts
│   │           └── update-task-status.usecase.ts
│   │
│   ├── infrastructure/               ← Camada de infraestrutura
│   │   ├── config/firebase.config.ts
│   │   ├── guards/auth.guard.ts      ← Proteção de rotas
│   │   └── utils/auth-state.util.ts
│   │
│   └── presentation/                 ← Camada de apresentação (UI)
│       ├── components/               ← Componentes reutilizáveis
│       │   ├── add-task-dialog/
│       │   ├── breadcrumb/
│       │   ├── card/
│       │   ├── horizontal-logo/
│       │   ├── running-timer/        ← Timer em execução em tempo real
│       │   └── vertical-logo/
│       ├── layouts/
│       │   ├── drawer/               ← Menu lateral
│       │   └── header/
│       ├── pages/
│       │   ├── dashboard/            ← Estatísticas e visão geral
│       │   ├── focus/                ← Modo Foco (kanban)
│       │   ├── home/
│       │   ├── login/
│       │   ├── settings/             ← Configurações do usuário
│       │   ├── signup/
│       │   └── tasks/                ← Kanban de tarefas completo
│       ├── services/
│       │   └── app-settings.service.ts
│       └── validators/
│           └── password-match.validator.ts
│
├── environments/                     ← Configurações por ambiente
├── styles.scss                       ← Estilos globais e variáveis de tema
├── main.ts
├── index.html
└── setup-jest.ts                     ← Configuração do Jest
```

---

## Funcionalidades

### 🔐 Autenticação

- Cadastro e login com Firebase Authentication.
- Sessão persistida via `localStorage` — o usuário permanece logado após atualizar a página.
- Rotas privadas protegidas por `authGuard`.
- Validação de senha mínima (6 caracteres) no formulário de cadastro.

### 📋 Gerenciamento de Tarefas (Kanban)

- Criação de tarefas com título, descrição, tipo de timer e tempo estimado.
- Colunas Kanban: **A Fazer → Em Andamento → Concluído**.
- Drag-and-drop entre colunas com **Angular CDK**.
- Tarefas do tipo **Cronômetro** iniciam automaticamente no status "Em Andamento".
- Atualização de status via ação direta (botões Iniciar / Pausar / Concluir).

### ⏱️ Timer Automático

- Duas modalidades de timer por tarefa:
  - **Cronômetro** (`cronometro`) – conta o tempo gasto na tarefa.
  - **Tempo Fixo** (`tempo_fixo`) – define um tempo pré-determinado.
- O tempo gasto é calculado automaticamente ao mudar o status de "Em Andamento" para qualquer outro estado, usando `statusChangedAt`.
- O componente `RunningTimerComponent` exibe o timer em tempo real na interface.

### 🎯 Modo Foco (`/focus-mode`)

- Visão Kanban simplificada focada nas tarefas do momento.
- Filtragem conforme configurações de foco ativas do usuário:
  - **Ocultar tarefas concluídas** (`hide_done`)
  - **Exibir apenas a tarefa atual** (`only_current`)
- Permite adicionar novas tarefas diretamente pelo diálogo.

### 📊 Dashboard

- Visão geral com estatísticas das tarefas do usuário:
  - Progresso (concluídas / total)
  - Contagem por status (A Fazer, Em Andamento, Concluídas)
  - **Tempo total de foco** investido (em minutos ou horas)
  - Tarefa mais antiga ainda pendente

### ⚙️ Configurações do Usuário

Preferências organizadas em grupos e salvas no Firebase:

| Grupo         | Opções                                                |
| ------------- | ----------------------------------------------------- |
| **Aparência** | Modo escuro, alto contraste, tamanho de fonte (P/M/G) |
| **Timer**     | Tempo padrão                                          |
| **Foco**      | Ocultar concluídas, exibir apenas tarefa atual        |

---

## Navegação (Rotas)

| Rota          | Descrição                       | Privada |
| ------------- | ------------------------------- | ------- |
| `/login`      | Tela de login                   | ❌      |
| `/signup`     | Tela de cadastro                | ❌      |
| `/dashboard`  | Visão geral / estatísticas      | ✅      |
| `/tasks`      | Kanban de tarefas completo      | ✅      |
| `/focus-mode` | Modo foco (Kanban simplificado) | ✅      |
| `/settings`   | Configurações do usuário        | ✅      |

> Rotas privadas usam `canActivate: [authGuard]`, que redireciona para `/login` caso o usuário não esteja autenticado.

---

## Estilos e Temas

O projeto usa **SCSS** com variáveis customizadas para gerenciar temas. Os estilos globais estão em `src/styles.scss`.

### Modo Escuro como Acessibilidade

Para alternar entre modo claro/escuro, o projeto utiliza componentes Angular com binding de classes dinâmicas. O estado do tema é gerenciado através de serviços Angular que persistem a preferência do usuário.

As fontes customizadas e configurações de tema devem ser ajustadas em `src/styles.scss`. A lógica de modo claro/escuro também leva em conta a preferência do sistema do usuário quando disponível.

O modo claro/escuro foi pensado não apenas esteticamente, mas como ferramenta de **acessibilidade cognitiva** e **conforto sensorial**:

- **Redução de Sobrecarga Sensorial** – Para usuários com TEA (Autismo) ou Burnout, o excesso de luminosidade e o contraste agressivo de telas brancas podem causar fadiga visual e irritabilidade. O modo escuro minimiza a emissão de luz azul, proporcionando um ambiente digital mais acolhedor e menos estimulante.
- **Controle de Ansiedade e Foco** – Ambientes com cores mais sóbrias ajudam a reduzir a "poluição visual", permitindo que usuários com TDAH consigam manter a atenção no conteúdo central (como as tarefas e cronogramas) sem se distraírem com o brilho excessivo da interface.
- **Leitura Facilitada** – Em casos de fotofobia (comum em enxaquecas crônicas e alguns perfis neurodivergentes), o tema escuro reduz o ofuscamento, tornando a retenção de informações mais fluida e menos exaustiva.

#### Detalhes Técnicos

Para garantir que o MindEase seja verdadeiramente inclusivo, a alternância de temas segue diretrizes específicas:

<ol>
  <li>Contraste Otimizado: Diferente do "preto absoluto", utilizamos as variações de cinza profundo e azul marinho do nosso manual de identidade, o que evita o efeito de "halo" (borrão) que algumas pessoas com Dislexia sentem ao ler texto branco sobre fundo 100% preto.</li>
  <li>Consistência Sistêmica: Através do Angular binding e data services, garantimos que a transição de cores seja atômica em toda a aplicação, evitando flashes de luz branca durante o carregamento de telas, o que poderia desencadear gatilhos sensoriais.</li>
  <li>Persistência de Preferência: A escolha do usuário é armazenada no Firebase para que a aplicação respeite o "espaço seguro" configurado pelo usuário desde o primeiro acesso à aplicação.</li>
</ol>

---

## CI/CD — Integração e Deploy Contínuo

O pipeline de CI/CD está definido em `.github/workflows/ci.yml` com **dois jobs independentes**:

### `test` — Validação Automática

Executado em todo push e pull request para `main`:

1. Instala dependências com `npm ci`.
2. Roda os testes com `npm run test -- --ci`.
3. Executa o build de produção para validar a compilação.

### `deploy` — Deploy para AWS S3

Executado apenas em push direto para `main` (após aprovação do job `test`):

1. Injeta as credenciais Firebase via GitHub Secrets no arquivo de ambiente.
2. Gera o build de produção.
3. Faz deploy do bundle para o bucket **AWS S3** via `aws s3 sync`.

#### Secrets necessários no repositório

| Secret                         | Descrição                |
| ------------------------------ | ------------------------ |
| `FIREBASE_API_KEY`             | Chave da API do Firebase |
| `FIREBASE_AUTH_DOMAIN`         | Domínio de autenticação  |
| `FIREBASE_PROJECT_ID`          | ID do projeto Firebase   |
| `FIREBASE_STORAGE_BUCKET`      | Bucket do Storage        |
| `FIREBASE_MESSAGING_SENDER_ID` | Sender ID                |
| `FIREBASE_APP_ID`              | ID da aplicação Firebase |
| `AWS_ACCESS_KEY_ID`            | Credencial AWS           |
| `AWS_SECRET_ACCESS_KEY`        | Credencial AWS secreta   |
| `AWS_REGION`                   | Região do bucket S3      |
| `AWS_S3_BUCKET`                | Nome do bucket S3        |

---

## Qualidade e Testes

Para um aplicativo focado em saúde mental, a **previsibilidade é uma regra de ouro**. Falhas inesperadas podem gerar ansiedade e frustração. Por isso, adotamos testes rigorosos em todas as camadas.

### Stack de Testes

- **Jest** configurado em `jest.config.ts` e `setup-jest.ts`.
- **Testing Library** para testes de componentes Angular.

### Cobertura por Camada

| Camada             | O que é testado                                  |
| ------------------ | ------------------------------------------------ |
| **Domínio**        | Modelos (`Task`, `User`) e todos os casos de uso |
| **Infraestrutura** | Guards de rota e utilitários                     |
| **Apresentação**   | Componentes standalone, serviços e validadores   |

### Comandos

```bash
# Rodar todos os testes
npm test

# Rodar em modo watch
npm run test -- --watch

# Rodar com cobertura
npm run test -- --coverage

# Filtrar por arquivo específico
npm test -- --testPathPattern='auth'
```

### Por que Jest?

Velocidade e isolamento. A capacidade de rodar testes em paralelo e o modo watch nos permitiu iterar rápido sem quebrar funcionalidades críticas de acessibilidade durante o desenvolvimento do hackathon.

---

## Comandos Úteis

```bash
# Servidor de desenvolvimento
npm start
ng serve

# Testes
npm test

# Linting
npm run lint

# Build de produção
ng build --configuration production

# Gerar componente via CLI
ng generate component presentation/pages/nova-pagina --standalone
```

---

## Onde Adicionar Novos Recursos

Seguindo a Clean Architecture, cada tipo de artefato tem seu lugar definido:

| Tipo de artefato               | Onde adicionar                     |
| ------------------------------ | ---------------------------------- |
| Nova tela/página               | `src/app/presentation/pages/`      |
| Componente reutilizável        | `src/app/presentation/components/` |
| Serviço Angular                | `src/app/presentation/services/`   |
| Validador customizado          | `src/app/presentation/validators/` |
| Caso de uso (regra de negócio) | `src/app/domain/usecases/`         |
| Modelo de domínio              | `src/app/domain/models/`           |
| Interface de repositório       | `src/app/domain/repositories/`     |
| Implementação de repositório   | `src/app/data/repositories/`       |
| Guard de rota                  | `src/app/infrastructure/guards/`   |
| Configuração de infraestrutura | `src/app/infrastructure/config/`   |

Use os exemplos abaixo para entender onde as novas peças do sistema devem viver.

- **Apresentação (presentation)**
  - Responsável por tudo que está ligado à UI e à interação do usuário.
  - Exemplo: um novo componente Angular para a tela de perfil, serviços de formulário, ou componentes reutilizáveis.
  - Componentes devem ser auto-contidos e parametrizados via `@Input()` e `@Output()`.
  - Nesta camada também ficam estilos SCSS, templates HTML e validadores customizados.

- **Domínio (domain)**
  - Abriga as regras de negócio independentes de framework e de plataforma.
  - Adicione aqui modelos (por exemplo, `User`, `Task`), interfaces de repositório, casos de uso (`SignInUseCase.ts`) e enums.
  - Se você precisa modelar lógica ou validações que não dependem de Angular, coloque no domínio.

- **Infraestrutura (infrastructure)**
  - Implementações concretas para persistência, redes, armazenamento e serviços externos.
  - Exemplos: repositórios que usam Firebase (`FirebaseTaskRepository.ts`), guards de rota, interceptadores HTTP.
  - Esta camada sabe "como" fazer algo, enquanto o domínio apenas define "o que" precisa ser feito.

- **Data**
  - Implementa os contratos definidos no domínio.
  - Contém DTOs (Data Transfer Objects), mappers para conversão entre DTOs e Models, e as implementações concretas dos repositórios.
  - Responsável pela comunicação com APIs externas e transformação de dados.

> 💡 Ao criar um novo recurso, pense primeiro em sua responsabilidade e escolha a camada adequada. Isso mantém o código modular, testável e fácil de manter.
