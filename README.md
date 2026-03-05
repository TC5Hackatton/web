# FIAP - Hackaton - Web

Este repositório é referente ao desenvolvimento web do hackaton. Aqui você encontrará tudo que precisa pra executar o projeto, instalar novos módulos, etc.

## Primeiros passos

### Pré Requisitos

Antes de iniciar o projeto, certifique-se de ter as seguintes tecnologias instaladas:

- **Node.js** (>= 20.x) – runtime JavaScript/TypeScript.
- **npm** (>= 10.x) – gerenciador de pacotes.
- **Angular CLI** (>= 20.x) – instalado globalmente com `npm install -g @angular/cli`.
- **Git** – controle de versão.

> 💡 Versões acima são as recomendadas durante o desenvolvimento. Pode funcionar com versões mais novas, mas verifique a compatibilidade.

### Tecnologias utilizadas

Esta aplicação web é construída com as seguintes principais tecnologias:

- **Angular** (>= 20.x) – framework frontend com arquitetura componentizada.
- **TypeScript** para tipagem estática.
- **Firebase** para autenticação, persistência de dados e backend.
- **Jest** e **Testing Library** para testes unitários e de integração.
- **SCSS** para estilos com suporte a variáveis e mix-ins.
- **ESLint** para qualidade de código.
- Arquitetura limpa (Domain, Data, Infrastructure, Presentation).

### Passo a passo para instalação em nova máquina

1. Clone o repositório:

   ```bash
   git clone git@github.com:TC5Hackatton/web.git web
   cd web
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente. Duplique o arquivo `.env.example`, renomeie para `.env` e cole as credenciais do Firebase que foram enviadas junto com a entrega do projeto:

   ```env
   # Exemplo
   NG_APP_FIREBASE_API_KEY=
   NG_APP_FIREBASE_AUTH_DOMAIN=
   NG_APP_FIREBASE_PROJECT_ID=
   NG_APP_FIREBASE_STORAGE_BUCKET=
   NG_APP_FIREBASE_MESSAGING_SENDER_ID=
   NG_APP_FIREBASE_APP_ID=
   NG_APP_FIREBASE_MEASUREMENT_ID=
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm start
   # Ou com o Angular CLI diretamente:
   ng serve
   ```

5. Acesse a aplicação em `http://localhost:4200/`.

6. Comece a desenvolver editando os arquivos em `src/app/`.

### Estrutura do Projeto

A aplicação segue a Clean Architecture com separação clara entre camadas:

```
src/
├── app/                              ← Raiz da aplicação
│   ├── app.config.ts                 ← Configurações globais
│   ├── app.ts                        ← Componente raiz
│   ├── app.routes.ts                 ← Definição de rotas
│   ├── data/                         ← Camada de dados
│   │   ├── dtos/                     ← Data Transfer Objects
│   │   │   ├── task-dto.ts
│   │   │   └── user-dto.ts
│   │   ├── mappers/                  ← Conversão entre DTOs e Models
│   │   │   ├── task-mapper.ts
│   │   │   └── user-mapper.ts
│   │   ├── repositories/             ← Implementação concreta dos repositórios
│   │   │   ├── firebase-task.repository.ts
│   │   │   ├── firebase-auth.repository.ts
│   │   │   └── firebase-settings.repository.ts
│   │   └── sources/                  ← Fontes de dados externas
│   ├── domain/                       ← Camada de domínio (regras de negócio)
│   │   ├── models/                   ← Entidades do domínio
│   │   │   ├── user.model.ts
│   │   │   ├── task.model.ts
│   │   │   ├── user-settings.model.ts
│   │   │   └── user-task-statistics.model.ts
│   │   ├── repositories/             ← Contratos (interfaces) dos repositórios
│   │   │   ├── auth.repository.ts
│   │   │   ├── task.repository.ts
│   │   │   └── settings.repository.ts
│   │   └── usecases/                 ← Casos de uso (lógica de negócio)
│   │       ├── sign-in.usecase.ts
│   │       ├── sign-up.usecase.ts
│   │       ├── sign-out.usecase.ts
│   │       ├── get-current-user.usecase.ts
│   │       ├── settings/
│   │       └── tasks/
│   ├── infrastructure/               ← Camada de infraestrutura
│   │   ├── config/                   ← Configurações do Firebase
│   │   │   └── firebase.config.ts
│   │   ├── guards/                   ← Guards de rotas
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/             ← Interceptadores HTTP
│   │   └── utils/                    ← Utilitários
│   │       └── auth-state.util.ts
│   └── presentation/                 ← Camada de apresentação (UI)
│       ├── components/               ← Componentes reutilizáveis
│       │   ├── add-task-dialog/
│       │   ├── breadcrumb/
│       │   ├── card/
│       │   ├── horizontal-logo/
│       │   ├── running-timer/
│       │   └── vertical-logo/
│       ├── layouts/                  ← Layouts principais
│       │   ├── drawer/
│       │   └── header/
│       ├── pages/                    ← Páginas/Telas
│       │   ├── dashboard/
│       │   ├── home/
│       │   ├── login/
│       │   ├── settings/
│       │   ├── signup/
│       │   └── tasks/
│       ├── services/                 ← Serviços da aplicação
│       │   └── app-settings.service.ts
│       └── validators/               ← Validadores customizados
│           └── password-match.validator.ts
├── environments/                     ← Configurações por ambiente
├── styles.scss                       ← Estilos globais
├── main.ts                           ← Entry point da aplicação
├── index.html                        ← HTML principal
└── setup-jest.ts                     ← Configuração do Jest

```

#### Onde Adicionar novos componentes

Seguindo as normas da Clean Architecture, cada tipo de serviço, componente ou utilitário tem seu lugar definido.
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

#### Extra - Comandos Úteis

```bash
# Inicia o servidor de desenvolvimento
npm start
# ou
ng serve

# Executar testes unitários
npm test

# Executar linting
npm run lint

# Build para produção
ng build --configuration production

# Rodar um teste específico em watch mode
npm test -- --include='**/*auth.spec.ts'
```

### Estilos e Temas

O projeto utiliza **SCSS** com variáveis customizadas para gerenciar temas. Os estilos globais estão em `src/styles.scss` e cada componente pode ter seu próprio arquivo SCSS.

Para alternar entre modo claro/escuro, o projeto utiliza componentes Angular com binding de classes dinâmicas. O estado do tema é gerenciado através de serviços Angular que persistem a preferência do usuário.

As fontes customizadas e configurações de tema devem ser ajustadas em `src/styles.scss`. A lógica de modo claro/escuro também leva em conta a preferência do sistema do usuário quando disponível.

O modo escuro foi aplicado não apenas como uma preferência estética, mas como uma ferramenta de acessibilidade cognitiva e conforto sensorial. A implementação justifica-se pelos seguintes pilares:

<ul>
  <li>Redução de Sobrecarga Sensorial: Para usuários com TEA (Autismo) ou Burnout, o excesso de luminosidade e o contraste agressivo de telas brancas podem causar fadiga visual e irritabilidade. O modo escuro minimiza a emissão de luz azul, proporcionando um ambiente digital mais acolhedor e menos estimulante.</li>
  <li>Controle de Ansiedade e Foco: Ambientes com cores mais sóbrias ajudam a reduzir a "poluição visual", permitindo que usuários com TDAH consigam manter a atenção no conteúdo central (como as tarefas e cronogramas) sem se distraírem com o brilho excessivo da interface.</li>
  <li>Leitura Facilitada: Em casos de fotofobia (comum em enxaquecas crônicas e alguns perfis neurodivergentes), o tema escuro reduz o ofuscamento, tornando a retenção de informações mais fluida e menos exaustiva.</li>
</ul>

#### Implementação Técnica de Acessibilidade

Para garantir que o MindEase seja verdadeiramente inclusivo, a alternância de temas segue diretrizes específicas:

<ol>
  <li>Contraste Otimizado: Diferente do "preto absoluto", utilizamos as variações de cinza profundo e azul marinho do nosso manual de identidade, o que evita o efeito de "halo" (borrão) que algumas pessoas com Dislexia sentem ao ler texto branco sobre fundo 100% preto.</li>
  <li>Consistência Sistêmica: Através do Angular binding e data services, garantimos que a transição de cores seja atômica em toda a aplicação, evitando flashes de luz branca durante o carregamento de telas, o que poderia desencadear gatilhos sensoriais.</li>
  <li>Persistência de Preferência: A escolha do usuário é armazenada no Firebase para que a aplicação respeite o "espaço seguro" configurado pelo usuário desde o primeiro acesso à aplicação.</li>
</ol>

### Gerenciamento de estado e Injeção de Dependências

O projeto utiliza Angular Services e Dependency Injection para gerenciar o estado da aplicação:

- **Auth Service** – gerencia autenticação, login, logout e estado de sessão do usuário.
- **Task Service** – gerencia operações de tarefas (criar, listar, atualizar, deletar).
- **Settings Service** – gerencia preferências e configurações do usuário.
- **Firebase Config** – centraliza a configuração do Firebase e é injetado nos serviços.

Os serviços são injetados nos componentes via `constructor` ou `inject()` function (Angular 14+). Toda lógica de estado deve residir nos serviços, mantendo os componentes focados apenas na apresentação.

Use a injeção de dependências do Angular em vez de instanciar classes diretamente. Isso facilita testes unitários e substituição de implementações.

### Navegação

A navegação é implementada via **Angular Router** e é definida em `src/app/app.routes.ts`.

As rotas estão organizadas por páginas:

- `/login` e `/signup` – fluxo de autenticação público
- `/dashboard` – tela inicial privada (protegida por `auth.guard`)
- `/tasks` – gerenciamento de tarefas
- `/settings` – configurações do usuário

O componente raiz (`app.ts`) contém o `<router-outlet>` que renderiza o componente correspondente à rota ativa.

Para proteger rotas, use o `auth.guard.ts` que verifica se o usuário está autenticado antes de permitir acesso. Qualquer rota privada deve incluir `canActivate: [authGuard]` em sua configuração.

Para adicionar uma nova página/rota:

1. Crie a página em `src/app/presentation/pages/`
2. Adicione a rota em `src/app/app.routes.ts`
3. Se a página for privada, inclua o guard de autenticação

### Qualidade e Confiabilidade (Jest & Testing)

Para um aplicativo focado em saúde mental e neurodiversidade, a previsibilidade é uma regra de ouro. Falhas inesperadas ou comportamentos inconsistentes na interface podem gerar ansiedade e frustração no nosso público-alvo. Por isso, adotamos uma cultura de testes rigorosa.

O conjunto de testes usa **Jest** (configurado em `jest.config.ts` e `setup-jest.ts`) e cobre todas as camadas:

- **Domínio** – modelos e casos de uso (`SignInUseCase`, `SignOutUseCase`, etc.) têm specs em `src/app/domain`.
- **Infraestrutura** – guards de rota, interceptadores HTTP e utilitários possuem testes que garantem seu funcionamento correto.
- **Apresentação** – componentes, serviços e validadores customizados são exercitados com testes de UI.

Para rodar os testes execute:

```bash
npm test
```

Novas specs devem ficar próximas ao código testado e utilizar o padrão `*.spec.ts` ou `*.spec.tsx`.

#### Por que escolhemos o Jest?

Escolhemos o Jest pela sua velocidade e isolamento de testes. Em um ambiente de desenvolvimento ágil como um hackathon, a capacidade de rodar testes em paralelo e o modo watch nos permitiram iterar rápido sem quebrar funcionalidades críticas de acessibilidade.

Não testamos apenas o "caminho feliz". Nossa suíte de testes abrange:

<ul>
  <li>Domínio e Lógica de Negócio: Garantimos que as regras de criação de tarefas e gerenciamento de sessões sejam funcionais.</li>
  <li>Consistência de Interface (UI): Testamos componentes e serviços para garantir que a transição entre diferentes estados da aplicação nunca falhe, mantendo o conforto visual e a acessibilidade.</li>
</ul>

#### Resultado de testes com o Jest

Como evidenciado, alcançamos uma cobertura significativa em testes unitários através do Jest, cobrindo todas as camadas da arquitetura:

- **Domínio**: Testes de modelos e casos de uso
- **Infraestrutura**: Testes de guards, interceptadores e utilitários
- **Apresentação**: Testes de componentes e serviços

**Destaque do Time**: Conseguimos validar componentes complexos de UI, como o `RunningTimer` e os componentes de listagem, garantindo que funcionalidades críticas funcionem com precisão — algo muito importante para usuários com TDAH que dependem de indicadores visuais de tempo.
