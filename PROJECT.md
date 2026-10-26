# PROJECT: Master Chapeação e Pinturas

## Metadados

| Campo                   | Valor                                                           |
| ----------------------- | --------------------------------------------------------------- |
| Nome do Projeto         | Master Chapeação e Pinturas (`brs`)                             |
| Organização             | EPMDEVTECH Clientes                                             |
| Responsável             | Engenharia & Produto EPMDEVTECH                                 |
| Estado                  | Ativo / Website Institucional Multipágina Estruturado com Rotas |
| Versão ou release       | `0.6.0` (Universal SDD Compliant)                               |
| Última revisão          | 2026-10-26                                                      |
| Framework de Governança | Universal SDD (Spec-Driven Development)                         |
| Revisores               | Equipe Técnica EPMDEVTECH                                       |

---

## 1. Visão Geral e Domínio

- **Problema e resultado principal**: Prover uma presença digital institucional de alta credibilidade para a **Master Chapeação e Pinturas**, localizada em Toledo-PR. O projeto é um website institucional multipágina completo com rotas dedicadas para cada especialidade (Funilaria, Pintura em Estufa e Martelinho de Ouro), galeria de trabalhos concluídos com comparador Antes/Depois, área exclusiva para corretores de seguros, apresentação institucional da oficina e canal de contato e avaliação técnica.
- **Usuários e partes interessadas**:
  - _Clientes Particulares (Proprietários de Veículos)_: Buscam restauração estética, recuperação de colisões ou martelinho de ouro sem danificar a pintura original, com agilidade e clareza no contato.
  - _Corretores de Seguros e Parceiros_: Buscam oficina de confiança em Toledo-PR com padrão de acabamento para encaminhamento de sinistros e atendimento a segurados.
  - _Proprietário da Master_: Deseja consolidação da marca na região, centralização de contatos no canal oficial e posicionamento honesto no mercado.
- **Termos importantes do domínio**:
  - `Funilaria automotiva`: Reparação da lataria estrutural e alinhamento de painéis.
  - `Pintura automotiva`: Preparação, colorimetria e aplicação com acabamento uniforme e verniz de alta resistência.
  - `Martelinho de ouro`: Desamassamento técnico preservando a pintura original quando a integridade do verniz permite.
  - `Serviço Leva e Traz`: Comodidade opcional para clientes da cidade de Toledo-PR.
  - `Canal Oficial Confirmado`: Instagram (`@masterchapeacao2022`) e telefone fixo `(45) 99954-5442`.
  - `WhatsApp Não Confirmado`: Diretriz estrita de não divulgar WhatsApp até confirmação formal do número pelo proprietário.
  - `Mídia real da oficina`: fotografias do cliente publicadas apenas em `src/assets/cliente/`, com placas tratadas. Os originais ficam em `assets-originais/`, fora do Git. Inventário e política em [`docs/inventario-imagens-brs.md`](docs/inventario-imagens-brs.md).
  - `Mídia oficial da oficina`: as seis imagens oficiais fornecidas pelo cliente, com placas substituídas pela marca, publicadas em `src/assets/cliente/`. São a base dos registros da oficina, do hero e do Open Graph. A imagem sob céu nublado tem placas reais de veículos ao fundo tratadas.
  - `Mídia ilustrativa`: imagens de método, bancada e comparadores são identificadas como ilustrativas e nunca representam casos reais de clientes.

---

## 2. Arquitetura

- **Estilo e componentes**:
  - Aplicação moderna em **TanStack Start** com renderização híbrida SSR / Nitro e tipagem ponta a ponta com TypeScript.
  - **Website Multipágina com Rotas Especializadas** gerenciadas pelo `@tanstack/react-router`:
    - `/`: Página Inicial orientada à conversão e encaminhamento para as rotas especializadas;
    - `/servicos`: Catálogo geral e visão integrada de especialidades;
    - `/servicos/funilaria`: Rota dedicada da especialidade de Funilaria;
    - `/servicos/pintura-automotiva`: Rota dedicada da especialidade de Pintura em Estufa;
    - `/servicos/martelinho-de-ouro`: Rota dedicada da especialidade de Martelinho de Ouro;
    - `/trabalhos`: Portfólio completo de projetos e comparador interativo Antes/Depois;
    - `/para-corretores`: Rota voltada para corretores de seguros e parcerias de sinistro;
    - `/sobre`: Rota institucional sobre a história, valores e estrutura física da Master;
    - `/contato`: Rota dedicada de triagem de contato e avaliação técnica;
    - `/privacidade`: Políticas de privacidade e conformidade de dados;
    - `/proposta/$slug`: Rota de proposta comercial personalizada confidencial (`noindex, nofollow`);
    - `/proposta/masterchapeacao`: Proposta comercial modular da Master, com marca e narrativa próprias, catálogo dos 6 produtos automotivos em centavos inteiros, 5 combinações sugeridas, matriz comparativa e `noindex, nofollow`;
    - `/briefing`: Rota confidencial de briefing operacional da Master com 15 etapas validadas por React Hook Form e Zod, persistência real em PostgreSQL (Supabase) com Row Level Security, retomada de preenchimento e envio idempotente (`noindex, nofollow`, fora dos menus públicos);
    - `/briefing/confirmacao`: Confirmação exibida somente após o servidor confirmar a persistência do envio (`noindex, nofollow`);
    - `/login`: Autenticação segura por Supabase Auth (e-mail e senha, sessão por cookie SSR) para o briefing e o painel administrativo (`noindex, nofollow`);
    - `/admin/briefings` e `/admin/briefings/$briefingId`: Painel administrativo da EPM DevTech com listagem, busca, filtros, respostas por etapa, pendências, notas internas isoladas, solicitação de complemento, alteração controlada de status, arquivos autorizados e trilha de auditoria (`noindex, nofollow`).
  - Configuração canônica de dados da empresa centralizada em [`src/lib/brs.ts`](src/lib/brs.ts), compartilhada diretamente entre componentes visuais e suites de teste.
  - Componentes de interface baseados nas primitivas acessíveis do **Radix UI** estilizados via Tailwind CSS v4.
  - Roteamento com `@tanstack/react-router` e cache reativo com `@tanstack/react-query`.
- **ADRs vigentes**: Consultar diretório [`adr/`](adr/).

---

## 3. Stack Tecnológica Canônica

| Camada / Dependência                 | Versão                                      | Finalidade                                                   | Fonte Canônica   |
| ------------------------------------ | ------------------------------------------- | ------------------------------------------------------------ | ---------------- |
| **Linguagem**                        | TypeScript `5.8+`                           | Tipagem estrita e segurança em tempo de compilação           | `tsconfig.json`  |
| **Framework Fullstack**              | TanStack Start `1.168+`                     | Framework SSR/híbrido com Vite nativo                        | `package.json`   |
| **Biblioteca de UI**                 | React `19.2+`                               | Renderização reativa de componentes                          | `package.json`   |
| **Bundler / Server**                 | Vite `8.1+`                                 | Dev server ultrarrápido e bundling de produção               | `vite.config.ts` |
| **Estilização**                      | Tailwind CSS `4.3+`                         | Design system com CSS variables e suporte a modo escuro      | `src/styles.css` |
| **Primitivas UI**                    | Radix UI                                    | Componentes acessíveis (Accordion, Dialog, Drawer, Dropdown) | `package.json`   |
| **Ícones**                           | Lucide React `0.575+`                       | Iconografia vetorial responsiva e temática                   | `package.json`   |
| **Motion Design**                    | Framer Motion `14.1+`                       | Animações de entrada escalonadas, gestos e AnimatedHero      | `package.json`   |
| **Formulários e Validação**          | Zod `3.25+` / React Hook Form               | Validação declarativa e segura                               | `package.json`   |
| **Testes Unitários & Integração**    | Vitest `4.1+` / React Testing Library       | Testes automatizados das regras e rotas                      | `src/test/`      |
| **Dados e Autenticação do Briefing** | Supabase `2.118+` / `@supabase/ssr` `0.12+` | Auth por cookie SSR, PostgreSQL com RLS e Storage privado    | `package.json`   |
| **Gerenciador de Pacotes / Runtime** | Bun `1.4+`                                  | Execução de scripts, testes e resolução de dependências      | `bun.lock`       |

---

## 4. Estrutura do Repositório

```text
Master/
├── .github/
│   └── workflows/      # Esteiras de CI/CD (GitHub Actions: ci.yml)
├── agents/             # Definição e contratos dos agentes IA (Universal SDD)
├── workflows/          # Workflows canônicos (feature, verification)
├── standards/          # Padrões normativos (UX, acessibilidade, testes, segurança, etc.)
├── templates/          # Modelos executáveis de SPECs, Tasks, ADRs, Reviews e QA
├── specs/              # Especificações técnicas e funcionais aprovadas
├── tasks/              # Tarefas rastreadas e vinculadas a SPECs
├── reviews/            # Registros de revisões formais de aprovação
├── adr/                # Registros de Decisões Arquiteturais (ADRs)
├── knowledge/          # Base de conhecimento modular do projeto
├── profiles/           # Perfis de projeto reutilizáveis
├── docs/               # Manuais, guias operacionais e matriz de rastreabilidade
├── scripts/            # Scripts utilitários (matriz de rastreabilidade)
├── public/             # Arquivos públicos estáticos (favicon, robots.txt)
├── src/
│   ├── assets/         # Imagens ilustrativas e registros reais tratados (cliente/)
│   ├── components/
│   │   ├── brs/        # Componente orquestrador Website e 15 submódulos especializados
│   │   └── ui/         # Componentes Radix UI acessíveis (Accordion, Button, Dialog, etc.)
│   ├── hooks/          # Hooks reutilizáveis (use-mobile.tsx)
│   ├── lib/            # Fonte única de negócio (brs.ts), error-reporting.ts, utils.ts
│   ├── routes/         # Rotas TanStack Start (__root.tsx, index.tsx)
│   ├── test/           # Suítes de testes Vitest (brs.test.ts, app-routing.test.tsx)
│   ├── router.tsx      # Configuração do TanStack Router
│   ├── server.ts       # Entrypoint do servidor SSR Nitro
│   ├── start.ts        # Handlers do TanStack Start
│   └── styles.css      # Design tokens e variáveis de cores automotivas
├── Dockerfile          # Multi-stage build com oven/bun:1-slim
├── docker-compose.yml  # Orquestração do container de desenvolvimento
├── .dockerignore       # Exclusão de artefatos e node_modules
├── Makefile            # Automação de comandos e Quality Gates
├── AGENTS.md           # Protocolo unificado de engenharia e agentes IA (Universal SDD)
├── PROJECT.md          # Estado canônico atual do projeto (este documento)
├── README.md           # Visão geral, instruções de inicialização e documentação
├── ROADMAP.md          # Roadmap canônico e pré-requisitos para publicação
├── CHANGELOG.md        # Histórico de alterações e releases
└── UNIVERSAL_SDD_FRAMEWORK.md # Definição normativa do Universal SDD
```

---

## 5. Runtime, Portas e Comandos Canônicos

### Rede Local e Reverse Proxy

- **Porta Local Estrita**: `5210` (configurada em `vite.config.ts` com `server: { port: 5210, strictPort: true }` e `--port 5210` no script dev do `package.json`).
- **Registro no PORTS.md**: Registrado na linha `| 5210 | brs | front |`.
- **Domínio Local no Caddy**: `http://brs.localhost` configurado em `Caddyfile` apontando para `reverse_proxy localhost:5210`.

### Comandos de Operação via Makefile

- **Ajuda Interativa**: `make help` (exibe todos os comandos disponíveis)
- **Instalação de Dependências**: `make install` (`bun install`)
- **Servidor de Desenvolvimento**: `make dev` (executa na porta 5210)
- **Execução de Testes**: `make test` (`bun run test`, Vitest + jsdom)
- **Verificação de Lint**: `make lint` (`bun run lint`)
- **Formatação de Código**: `make format` (`bun run format`)
- **Build de Produção**: `make build` (`bun run build`)
- **Execução Completa de Quality Gates**: `make check` (lint, testes, build e matriz)

### Ciclo de Vida Docker & Docker Compose

- **Subir Containers em Background**: `make up` (ou `make docker-up`)
- **Parar Containers**: `make down` (ou `make docker-down`)
- **Subir Containers em Foreground**: `make docker-dev`
- **Construir Imagens Docker**: `make docker-build`
- **Visualizar Logs**: `make docker-logs`

---

## 6. APIs, Dados e Integrações

- **Backend do Site Institucional**: As páginas públicas continuam autocontidas no frontend, sem banco de dados ou APIs proprietárias.
- **Validação e UX do Briefing**: máscaras, validadores e regras condicionais vivem no domínio ([`src/features/briefing/domain/`](src/features/briefing/domain/)) e são compartilhados pela interface e pelo servidor; a auditoria das 15 etapas está em [`docs/auditoria-briefing-15-etapas.md`](docs/auditoria-briefing-15-etapas.md) e as decisões em `ADR-002`.
- **Backend do Briefing (Supabase)**: A rota `/briefing` usa Supabase (Auth + PostgreSQL + Storage) como camada de dados: sessão por cookie no servidor, `Row Level Security` em todas as tabelas, transições de status validadas no banco, auditoria por função `security definer` e arquivos em bucket privado com URL assinada curta. As migrações versionadas estão em [`supabase/migrations/`](supabase/migrations/) e a operação está documentada em [`docs/supabase-briefing.md`](docs/supabase-briefing.md).
- **Estado da Persistência**: O código, as migrações e a documentação estão prontos, mas a **persistência real ainda não foi validada**: o projeto Supabase de destino e as credenciais não foram fornecidos. Sem `SUPABASE_URL` e `SUPABASE_ANON_KEY`, a interface informa que a persistência está indisponível e não simula gravação nem envio.
- **Cache Local como Apoio**: O `localStorage` do navegador mantém apenas um cache de apoio do preenchimento; o banco de dados é a fonte de verdade e nenhuma resposta depende do cache local.
- **Canal de Contato**: O formulário gera uma mensagem formatada com os dados preenchidos (nome, telefone, veículo, serviço desejado e descrição) que o usuário copia com um clique para colar no Instagram `@masterchapeacao2022` ou ligar via `(45) 99954-5442`.
- **Dados Estruturados SEO**: Schema.org `AutoBodyShop` implementado na rota raiz (`src/routes/index.tsx`) com cidade, telefone e catálogo dos 3 serviços.

---

## 7. Experiência, Design e Acessibilidade

- **Identidade Visual**: Paleta escura industrial automotiva alinhada à logo oficial (preto, vermelho e branco):
  - Fundo: Preto automotivo (`#0b0d10`)
  - Acento Primário: Vermelho da logo (`#e01b24`, `--brand-primary`)
  - Acento de Texto: Vermelho claro para rótulos e ícones (`#f26b6f`, `--brand-text-accent`)
  - Tipografia: Display e Títulos em **Sora** (pesos 500 e 600, proporções técnicas e acabamento editorial de alta precisão) e corpo/controles em **Manrope** (pesos 400, 500 e 600, leitura técnica e confortável).
- **Acessibilidade**:
  - Conformidade com critérios WCAG 2.1 nível AA.
  - Navegação completa por teclado com anéis de foco visíveis (`outline: 2px solid var(--brand-focus)`).
  - Diálogos e modais com captura de foco e descrição acessível via Radix UI.
  - Suporte a `prefers-reduced-motion`.

---

## 8. Testes e Quality Gates

| Gate                               | Comando         | Critério de Aceitação                          |
| ---------------------------------- | --------------- | ---------------------------------------------- |
| **Testes de Regra de Negócio**     | `bun run test`  | 100% dos testes em `src/test/` devem passar    |
| **Linters e Estilo**               | `bun run lint`  | Zero erros ESLint e formatação Prettier válida |
| **Compilação de Tipos e Bundling** | `bun run build` | Compilação cliente e SSR Nitro sem erros       |

---

## 9. Governança e Rastreabilidade

Todas as entregas obedecem ao protocolo **Universal SDD**:

- `SPEC-001` / `TASK-001-01` / `REVIEW-001`: Estrutura da Landing Page Institucional Master, Design Tokens e Fluxo Honesto de Contato.
- `SPEC-002` / `TASK-002-01` / `REVIEW-002`: Infraestrutura Containerizada com Docker, Docker Compose e Automação via Makefile.
- `SPEC-003` / `TASK-003-01` / `REVIEW-003`: Auditoria Técnica, Remoção de Artefatos de IA, Modularização em 15 Submódulos e Refinamento Editorial.
- `SPEC-004` / `TASK-004-01` / `REVIEW-004`: Esteira de Integração Contínua (CI/CD) com GitHub Actions e Validação de Containers Docker.
- `SPEC-005` / `TASK-005-01` / `REVIEW-005`: Refinamento de UI, Motion Design Sóbrio, Transição Cinematográfica MediaExpand e Microinterações.
- `SPEC-006` / `TASK-006-01` / `REVIEW-006`: Seção Hero Animada com Framer Motion (21st.dev AnimatedHero), botões em Glassmorphism e variantes de entrada.
- `SPEC-007` / `TASK-007-01` / `REVIEW-007`: Galeria Interativa com Slider Antes/Depois e Lightbox Modal (@radix-ui/react-dialog) e Seção de Serviços com Efeito CardSpotlight.
- `SPEC-008` / `TASK-008-01` / `REVIEW-008`: Expurgar Vínculos Lovable, Configuração Nativa Vite, Unificação de Header Único e Redesign da Seção Hero.
- `SPEC-009` / `TASK-009-01` / `REVIEW-009`: Refinamento do Sistema Tipográfico com Sora e Manrope, Tokens Fluidos clamp() e Regras de Estabilidade Visual.
- `SPEC-010` / `TASK-010-01` / `REVIEW-010`: Auditoria e Implementação de Scroll Reveal Premium com Tokens Calibrados, Disparo Único via IntersectionObserver e Suporte a Acessibilidade.
- `SPEC-011` / `TASK-011-01` / `REVIEW-011`: Substituição do Favicon Lovable pelo Pacote Oficial de Favicons e Ícones da Master Chapeação e Pinturas.
- `SPEC-012` / `TASK-012-01` / `REVIEW-012`: Padronização Rigorosa das Cores de Tipografia e Botões da Seção Hero Alinhadas aos Tokens do Projeto.
- `SPEC-013` / `TASK-013-01` / `REVIEW-013`: Implementação de Footer Premium Minimal Inspirado no 21st.dev com Identidade Master, Canais Reais e Acessibilidade.
- `SPEC-014` / `TASK-014-01` / `REVIEW-014`: Refatoração Multipágina em TanStack Start, SEO Técnico Canônico e Otimização para LLMs com llms.txt.
- `SPEC-015` / `TASK-015-01` / `REVIEW-015`: Sistema Unificado de Motion Design e Scroll Reveal Premium com Tokens Normativos e Primitivos de Animação.
- `SPEC-016` / `TASK-016-01` / `REVIEW-016`: Refinamento Premium da Navbar com Cápsula Flutuante Centralizada, Glassmorphism Escuro e Botão Dourado com Cantos Arredondados.
- `SPEC-017` / `TASK-017-01` / `REVIEW-017`: Consolidação da Arquitetura SPA + Multi-Route, Home Resumida e Orientada à Conversão, Navegação Client-Side e Layout Unificado.
- `SPEC-018` / `TASK-018-01` / `REVIEW-018`: Motion Design de Luxo com Framer Motion (ScrollReveal & ImageReveal), Deslocamento Contido, Curva Suave [0.21, 0.47, 0.32, 0.98] e Zoom Reverso.
- `SPEC-019` / `TASK-019-01` / `REVIEW-019`: Automação Docker DevOps com Hot Reload Instantâneo, Execução em Segundo Plano (-d), Mitigação de Conflito de Porta 5210 e Resolução Nativa tsconfigPaths.
- `SPEC-020` / `TASK-020-01` / `REVIEW-020`: Sistema Global de Motion Design Premium para Todas as Rotas com Tokens Centralizados, PageTransition, ScrollReveal, ImageReveal e Acessibilidade Estrita.
- `SPEC-021` / `TASK-021-01` / `REVIEW-021`: Sistema Premium de CTAs, Conversão e Microinterações com Geometria Chanfrada Automotiva (btn-bevel-4), Hierarquia Comercial em 3 Níveis e Máquina de Estados no Formulário.
- `SPEC-022` / `TASK-022-01` / `REVIEW-022`: Padronização Global de Botões, Elementos de Forma (Dois Raios Normativos 4px e 12px, Zero Clip-Path) e Limpeza de Redundâncias no Hero (Remoção de CTA Duplicado e Selo Genérico).
- `SPEC-023` / `TASK-023-01` / `REVIEW-023`: Arquitetura Editorial Anti-Card Slop, matrizes com bordas compartilhadas e eliminação de caixas flutuantes repetitivas.
- `SPEC-024` / `TASK-024-01` / `REVIEW-024`: Correção do Menu Desktop, Remoção do CTA Flutuante Redundante e Adição de Botão Voltar ao Topo Acessível.
- `SPEC-025` / `TASK-025-01` / `REVIEW-025`: Comparador Interativo Antes/Depois na Home e na Galeria de Trabalhos com Controle Deslizante Acessível.
- `SPEC-026` / `TASK-026-01` / `REVIEW-026`: Pares de Imagens Genuinamente Distintos para o Antes e Depois das 3 Especialidades e Diversificação Fotográfica no Acervo Público.
- `SPEC-027` / `TASK-027-01` / `REVIEW-027`: Rota de Proposta Comercial Personalizada (`/proposta/$slug` e `/proposta`), Arquitetura de 10 Seções de Alta Conversão, Validação Comercial de Completude e Transição Honesta para Briefing.
- `SPEC-027` / `TASK-027-02` / `REVIEW-027-02`: Correção de Hidratação SSR e Visibilidade da Proposta Comercial, eliminação de wrappers bloqueantes de animação e restauração de 100% da visualização no navegador real.
- `SPEC-028` / `TASK-028-01` / `REVIEW-028`: Proposta Comercial Modular EPM DevTech para Master Chapeação e Pinturas (`/proposta/brs-reparacoes`), Portfólio de 6 Módulos Especializados com Escopos e Exclusões, Matriz Comparativa Responsiva, 5 Pacotes Sugeridos em 1 Clique, Segregação de Custos de Terceiros e Infraestrutura, Fluxo Visual em 9 Etapas e Simulador Dinâmico de Orçamento.
- `SPEC-029` / `TASK-029-01` / `REVIEW-029`: Refatoração Canônica: Website Multipágina com Arquitetura de Rotas Dedicadas (TanStack Router), eliminação de vestígios conceituais de landing page em `AGENTS.md`, `PROJECT.md`, proposta comercial (`src/lib/proposta.ts`) e suítes de teste.
- `SPEC-030` / `TASK-030-01` / `REVIEW-030`: Implementação da Linha de Estética Automotiva & Proteção de Superfícies (Espelhamento de Pintura, Vitrificação Cerâmica e Polimento Técnico de Para-brisa) com preservação dos 3 pilares estruturais canônicos de reparação.
- `SPEC-031` / `TASK-031-01` / `REVIEW-031`: Integração de Dados Cadastrais Oficiais (Razão Social: `LCL Chapeação LTDA`, CNPJ: `51.784.844/0001-01`, Fundação: `11/08/2023`) e Histórico de Experiência Prática da Equipe Técnica no Segmento Automotivo.
- `SPEC-032` / `TASK-032-01` / `REVIEW-032`: Redesign Awwwards Site of the Day da Home Landing Page (Hero e Showcase), Paleta de Cores de Luxo Automotivo, Tipografia Editorial de Alta Precisão, Lenis Smooth Scroll e Coreografia de Movimento GSAP.
- `SPEC-033` / `TASK-033-01` / `REVIEW-033`: Experiência Signature Interativa WebGL/Canvas de Partículas & Laser e Transições de Página Cinemáticas sem Quebra de Estado da UI.
- `SPEC-034` / `TASK-034-01` / `REVIEW-034`: Redesign Awwwards Standard dos Heroes em Todas as Rotas com Tipografia, Paleta de Cores, Lenis e Coreografia GSAP.
- `SPEC-035` / `TASK-035-01` / `REVIEW-035`: Criação do DESIGN.md, Reformulação da Escala Tipográfica Fluida e Ritmo de Layout (Anti-AI Genericness).
- `SPEC-036` / `TASK-036-01` / `REVIEW-036`: Integração do Motion Engine (Lenis + GSAP ScrollTrigger), Componentes Interativos (Before/After Slider, NumericCounter, ParallaxImage, microinterações refinadas) e Transições Suaves de Página.
- `SPEC-037` / `TASK-037-01` / `REVIEW-037`: Refinamento UX/UI, Consolidação Visual, Despoluição Editorial e Otimização da Hierarquia e Conversão da Home Page.
- `SPEC-038` / `TASK-038-01` / `REVIEW-038`: Remoção de Artefatos Genéricos de IA (OFICINA ATIVA, Badges LED Pulsantes e Botões All-Caps), restaurando sobriedade editorial e elegância institucional.
- `SPEC-039` / `TASK-039-01` / `REVIEW-039`: Refinamento da Hero Section e Transição Direta para Especialidades, remoção da barra de micro-benefícios (trust-strip), botão secundário com smooth scroll para #especialidades e incorporação orgânica dos diferenciais.
- `SPEC-040` / `TASK-040-01` / `REVIEW-040`: Padronização Tipográfica dos Rótulos de Seção (Eyebrows), remoção de pseudo-elementos decorativos (.eyebrow::before) e eliminação de travessões pré-fixados.
- `SPEC-041` / `TASK-041-01` / `REVIEW-041`: Remoção do CTA de Avaliação da Hero Section e Foco na Descoberta de Serviços, eliminando duplicidade com Header e destacando Ver Especialidades com ArrowDown e tap target mínimo de 44px.
- `SPEC-042` / `TASK-042-01` / `REVIEW-042`: Refinamento Visual da Hero/Intro de Serviços (/servicos), remoção dos 3 mini-cards compactos de resumo, CTA único de exploração (Ver Trabalhos Concluídos com tap target de 44px), id lista-servicos com respiro py-16 lg:py-20 e limpeza de código.
- `SPEC-043` / `TASK-043-01` / `REVIEW-043`: Refatoração Global de UX/UI: Despoluição de CTAs em Serviços (/servicos), Foco em Casos em Trabalhos (/trabalhos) e Atualização Editorial B2B em Para Corretores (/para-corretores).
- `SPEC-044` / `TASK-044-01` / `REVIEW-044`: Padronização da Hierarquia Tipográfica e Títulos Monocromáticos: eliminação de frases bicolores de IA em h1/h2, unificação em branco puro e preservação da cor primária/dourada para CTAs e eyebrows.
- `SPEC-045` / `TASK-045-01`: Módulo de Agendamento Online, Intake Técnico de Avarias (Pré-OS) e Serviço Leva e Traz em Toledo-PR com motor DDD, concorrência Web Locks API, sincronização multi-aba BroadcastChannel e dashboard administrativo.
- `SPEC-046` / `TASK-046-01`: Agendamento Auto-Confirmado pelo Cliente, Painel de Agenda Operacional com Métricas e Botão de Ação Direta para WhatsApp com Mensagem Formatada.
- `SPEC-047` / `TASK-047-01`: Plataforma de Agenda em Grade Diária dos Técnicos, Login Administrativo com Credenciais Demo 1-Clique, Gestão de Bloqueios e Ação Direta para WhatsApp da Pré-OS.
- `SPEC-048` / `TASK-048-01`: Carga Inicial de Dados Fictícios Realistas (Seed) para Demonstração da Agenda dos Técnicos e Botão de Restauração em 1 Clique.
- `SPEC-049` / `TASK-049-01`: Detalhe Expansível do Processo Completo do Cliente (Quando cadastrou, timeline e anamnese) e Garantia de Seed Ativo no Painel de Agendamentos.
- `SPEC-050` / `TASK-050-01`: Correção do Modal de Agendamentos, Sincronização Multi-Aba Estruturada, Histórico Append-Only de Eventos, Timeline Automotiva Dinâmica, Acompanhamento do Cliente e Comunicação WhatsApp Custo Zero.
- `SPEC-051` / `TASK-051-01`: Reformulação de UX/UI dos Status Operacionais, Badges Padronizados, Hierarquia Visual Neutra, Indicadores Dinâmicos e Filtros no Painel de Atendimentos.
- `SPEC-052` / `TASK-052-01`: Refatoração UX/UI do Botão WhatsApp com Affordance Real e Inclusão do Status "Fechados" nos KPIs e Filtros da Agenda.
- `SPEC-053` / `TASK-053-01`: Redesenho Visual Awwwards Dark Industrial para o Painel de Agendamentos e Gestão de Reparação Master (Aesthetic Dark Premium, tipografia técnica editorial e esteira linear de engenharia).
- `SPEC-054` / `TASK-054-01`: Redesenho do Painel Administrativo / ERP Master em Light Mode High-End (Linear / Vercel Dashboard / Apple Pro Apps, sobriedade operacional, Stepper horizontal limpo e metadados estruturados).
- `SPEC-055` / `TASK-055-01`: Arquitetura UX/UI de Autenticação Split-Screen (/login) e Agenda Operacional Despoluída (/agendamentos) com StatusTabs unificadas, Mini-stepper de reparo e Visão Kanban.
- `SPEC-056` / `TASK-056-01`: Refinamento de UX/UI, Isolamento de Layout e Acessibilidade Estrita (WCAG 2.2 AA) na Autenticação (/login) e Painel Administrativo Master.
- `SPEC-057` / `TASK-057-01`: Linha do Tempo Operacional com RBAC, Trilha de Auditoria Append-Only e Acessibilidade Estrita na Oficina Master.
- `SPEC-058` / `TASK-058-01`: Página Pública de Acompanhamento do Reparo Mobile-First (Hero Acima da Dobra, Header Isolado no Fluxo, WCAG 2.2 AA e Projeção Segura de Eventos).
- `SPEC-059` / `TASK-059-01` / `REVIEW-059`: Correção do Build e Servidor de Produção SSR TanStack Start (Remoção do plugin Nitro, compilação de pacotes cliente e SSR em dist/server/server.js, alinhamento do Dockerfile e resolução definitiva do erro 500 em produção).
- `SPEC-060` / `TASK-060-01` / `TASK-060-02` / `REVIEW-060`: Otimização de Code-Splitting de Rotas e Resolução de Erro de Hidratação SSR sob Reduced Motion (Remoção de export indevido em /acompanhar/$token, isomorfismo SSR de PageTransition e blindagem contra erros de hidratação no React 19).
- `SPEC-061` / `TASK-061-01` / `TASK-061-02` / `REVIEW-061`: Isomorfismo SSR e Resolução Definitiva de Hidratação nos Componentes de Motion com MotionConfig no TanStack Start (Eliminação de bifurcações manuais de JSX e hooks divergentes no SSR em ScrollReveal, ImageReveal, Reveal, MagneticButton e demais componentes, supressão de avisos warnOnce de acessibilidade e garantia de paridade absoluta com React 19).
- `SPEC-062` / `TASK-062-01` / `REVIEW-062`: Refinamento UX/UI Responsivo do CTA do Header e Menu Móvel Master (Ocultação do botão CTA na barra superior em telas móveis via hidden sm:inline-flex e simplificação do CTA no menu hambúrguer para o rótulo direto Avaliação).
- `SPEC-063` / `TASK-063-01` / `REVIEW-063`: Prevenção e Blindagem Contra Estouro de Layout e Overflow Horizontal no Modo Mobile (Aplicação de overflow-x: clip e max-width 100% em html, body, SiteLayout, PageTransition, AnimatedHero e flex-wrap responsivo na classe .eyebrow para eliminar rolagem lateral no mobile).
- `SPEC-064` / `TASK-064-01` / `REVIEW-064`: Auditoria e Refatoração UX/UI — Conversão, Integridade Editorial, Home em 6 Blocos, SEO Canônico de Produção (`https://master.epmdevtech.com.br`) e Dados Oficiais Confirmados (Endereço e Horário).
- `SPEC-065` / `TASK-065-01` / `REVIEW-065`: Sincronização Bidirecional da Linha do Tempo Operacional com o Status do Agendamento e Mini-Stepper em `/agendamentos` + Correção de Hidratação SSR.
- `SPEC-066` / `TASK-066-01`: Rota Confidencial de Execução e Ingestão de Briefing Multinicho EPM DevTech (`/briefing`), sem inclusão em menus públicos, suporte nativo ao nicho de reparação automotiva, persistência local, cálculo de contraste WCAG e exportação determinística de `briefing-completo.json` e `booking-config.json`.
- `SPEC-067` / `TASK-067-01` / `REVIEW-067`: Hero com Abertura Cinematográfica, Zoom Lento e Reflexo de Luz na Lataria (Sequência CSS pura, clareamento do veículo, antecipação por interação, flag de sessão SPA e compatibilidade estrita SSR).
- `SPEC-068` / `TASK-068-01` / `REVIEW-068`: Desacoplamento da Animação do Hero da Foto e Configuração Centralizada (Módulo tipado hero-config, perfis veiculo-inteiro/detalhe-lataria/oficina-equipe, picture com art direction, preload LCP, controle estrito de foto ilustrativa e guia de substituição).
- `SPEC-069` / `TASK-069-01` / `REVIEW-069`: Pipeline de Imagem Responsiva do Hero (AVIF/WebP + srcset/sizes, intrínsecos verídicos 1920×1088/1280×725, preload de LCP casado via imagesrcset/imagesizes, variantes versionadas em public/hero/ sem novas dependências e baseline visual Playwright anti-regressão).
- `SPEC-070` / `TASK-070-01` / `REVIEW-070`: Correção da Descontinuidade ("Pulo") no Zoom do Hero (causa-raiz: redefinição de `heroSlowZoom` sob `.hero-intro-complete` remapeava a linha do tempo; corrigido com animação única, easing contínuo `cubic-bezier(0.25,0.1,0.25,1)`, camada própria e trava Vitest de continuidade; prova de delta ≤ 4×10⁻⁵ no tempo da animação).
- `SPEC-071` / `TASK-071-01` / `REVIEW-071`: Rebranding para MASTER Chapeação e Pinturas (logo oficial, fotos reais, paleta preta/vermelha/branca e dados oficiais sincronizados).
- `SPEC-072` / `TASK-072-01` / `REVIEW-072`: Briefing Operacional e Preparação para Credenciamento da Master (`/briefing`) em 15 etapas, com pendências explícitas, rascunho local versionado, metadados de fotos sem upload e exportação manual em JSON/relatório.
- `SPEC-073` / `TASK-073-01` a `TASK-073-04` / `REVIEW-073`: Briefing da Master com persistência real em Supabase (Auth, PostgreSQL com RLS e Storage privado), schema Zod por etapa validado no cliente e no servidor, envio idempotente, arquivos privados com URL assinada, painel administrativo com isolamento de dados internos e degradação honesta sem backend configurado.
- `SPEC-074` / `TASK-074-01` a `TASK-074-04` / `REVIEW-074`: Auditoria e refatoração UX/UI das 15 etapas do briefing, com máscaras e validadores de domínio (CEP, CNPJ com dígitos verificadores, telefone com DDD, data civil com calendário, número pt-BR), consulta assistida de CEP com timeout e falha não bloqueante, perguntas condicionais com descarte explícito, agrupamento por assunto, radio groups acessíveis, resumo de erros focalizado, revisão final com pendências por etapa e confirmação explícita do envio.
- `SPEC-077` / `TASK-077-01`: Aproveitamento das fotos reais da oficina com tratamento de placas, galeria acessível em `/trabalhos`, integração em home e páginas institucionais, remoção dos derivados não tratados e testes de privacidade.
- `SPEC-078` / `TASK-078-01`: Substituição do acervo da oficina pelas seis imagens oficiais com placas da marca, novo hero/OG, galeria acessível em `/trabalhos`, rótulo "Imagem de divulgação" no hero e tratamento de placas reais remanescentes.
- `SPEC-079` / `TASK-079-01`: Proposta comercial modular da Master em `/proposta/masterchapeacao`, com catálogo de 6 produtos automotivos em centavos inteiros, 5 combinações calculadas, matriz comparativa responsiva, custos externos segregados, contato EPM DevTech apenas por e-mail e isolamento integral da proposta original.

---

## 10. Pré-requisitos para Publicação Definitiva

Conforme estipulado no [`ROADMAP.md`](ROADMAP.md):

1. **Fotografias, Logo e Imagens Oficiais**: Concluído na `SPEC-077` para o inventário inicial, na `SPEC-071` para o logo e na `SPEC-078` para as imagens oficiais com placas da marca. As imagens publicadas têm placas de terceiros substituídas ou tratadas; os originais permanecem fora do versionamento.
2. **Comparativo Antes/Depois**: Pendente de pares reais autorizados. Até lá, os comparadores permanecem explicitamente ilustrativos, sem atribuição a clientes.
3. **Confirmação de WhatsApp**: Obter autorização e número oficial verificado antes de disponibilizar botão ou link de WhatsApp.
4. **Alinhamento com Proprietário**: Validação formal de posicionamento e posterior geração de sitemap definitivo.

---

© 2026 EPM DEVTECH & Master Chapeação e Pinturas. Todos os direitos reservados.
