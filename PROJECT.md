# PROJECT: BRS Reparações Automotivas

## Metadados

| Campo                   | Valor                                           |
| ----------------------- | ----------------------------------------------- |
| Nome do Projeto         | BRS Reparações Automotivas (`brs`)              |
| Organização             | EPMDEVTECH Clientes                             |
| Responsável             | Engenharia & Produto EPMDEVTECH                 |
| Estado                  | Ativo / Landing Page Institucional Implementada |
| Versão ou release       | `0.1.0` (Universal SDD Compliant)               |
| Última revisão          | 2026-10-11                                      |
| Framework de Governança | Universal SDD (Spec-Driven Development)         |
| Revisores               | Equipe Técnica EPMDEVTECH                       |

---

## 1. Visão Geral e Domínio

- **Problema e resultado principal**: Prover uma presença digital institucional de alta credibilidade para a **BRS Reparações Automotivas**, localizada em Toledo-PR. O site apresenta com clareza os serviços especializados (Funilaria, Pintura e Martelinho de Ouro), atende demandas tanto de proprietários particulares quanto de corretores de seguros, e oferece um fluxo honesto de contato sem falsas alegações ou dependências desnecessárias.
- **Usuários e partes interessadas**:
  - _Clientes Particulares (Proprietários de Veículos)_: Buscam restauração estética, recuperação de colisões ou martelinho de ouro sem danificar a pintura original, com agilidade e clareza no contato.
  - _Corretores de Seguros e Parceiros_: Buscam oficina de confiança em Toledo-PR com padrão de acabamento para encaminhamento de sinistros e atendimento a segurados.
  - _Proprietário da BRS_: Deseja consolidação da marca na região, centralização de contatos no canal oficial e posicionamento honesto no mercado.
- **Termos importantes do domínio**:
  - `Funilaria automotiva`: Reparação da lataria estrutural e alinhamento de painéis.
  - `Pintura automotiva`: Preparação, colorimetria e aplicação com acabamento uniforme e verniz de alta resistência.
  - `Martelinho de ouro`: Desamassamento técnico preservando a pintura original quando a integridade do verniz permite.
  - `Serviço Leva e Traz`: Comodidade opcional para clientes da cidade de Toledo-PR.
  - `Canal Oficial Confirmado`: Instagram (`@brsreparacoes`) e telefone fixo `(45) 2035-9440`.
  - `WhatsApp Não Confirmado`: Diretriz estrita de não divulgar WhatsApp até confirmação formal do número pelo proprietário.

---

## 2. Arquitetura

- **Estilo e componentes**:
  - Aplicação moderna em **TanStack Start** com renderização híbrida SSR / Nitro e tipagem ponta a ponta com TypeScript.
  - Landing page institucional de página única (`src/routes/index.tsx`) com navegação por âncoras suaves:
    `#inicio` → `#servicos` → `#trabalho` → `#corretores` → `#sobre` → `#contato`.
  - Configuração canônica de dados da empresa centralizada em [`src/lib/brs.ts`](src/lib/brs.ts), compartilhada diretamente entre componentes visuais e suites de teste.
  - Componentes de interface baseados nas primitivas acessíveis do **Radix UI** estilizados via Tailwind CSS v4.
  - Roteamento com `@tanstack/react-router` e cache reativo com `@tanstack/react-query`.
- **ADRs vigentes**: Consultar diretório [`adr/`](adr/).

---

## 3. Stack Tecnológica Canônica

| Camada / Dependência                 | Versão                                | Finalidade                                                   | Fonte Canônica   |
| ------------------------------------ | ------------------------------------- | ------------------------------------------------------------ | ---------------- |
| **Linguagem**                        | TypeScript `5.8+`                     | Tipagem estrita e segurança em tempo de compilação           | `tsconfig.json`  |
| **Framework Fullstack**              | TanStack Start `1.168+`               | Framework SSR/híbrido com Vite e Nitro                       | `package.json`   |
| **Biblioteca de UI**                 | React `19.2+`                         | Renderização reativa de componentes                          | `package.json`   |
| **Bundler / Server**                 | Vite `8.1+`                           | Dev server ultrarrápido e bundling de produção               | `vite.config.ts` |
| **Estilização**                      | Tailwind CSS `4.3+`                   | Design system com CSS variables e suporte a modo escuro      | `src/styles.css` |
| **Primitivas UI**                    | Radix UI                              | Componentes acessíveis (Accordion, Dialog, Drawer, Dropdown) | `package.json`   |
| **Ícones**                           | Lucide React `0.575+`                 | Iconografia vetorial responsiva e temática                   | `package.json`   |
| **Motion Design**                    | Framer Motion `14.1+`                 | Animações de entrada escalonadas, gestos e AnimatedHero      | `package.json`   |
| **Formulários e Validação**          | Zod `3.25+` / React Hook Form         | Validação declarativa e segura                               | `package.json`   |
| **Testes Unitários & Integração**    | Vitest `4.1+` / React Testing Library | Testes automatizados das regras e rotas                      | `src/test/`      |
| **Gerenciador de Pacotes / Runtime** | Bun `1.4+`                            | Execução de scripts, testes e resolução de dependências      | `bun.lock`       |

---

## 4. Estrutura do Repositório

```text
BRS/
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
│   ├── assets/         # Imagens ilustrativas otimizadas (brs-hero, funilaria, martelinho, pintura)
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

- **Sem Backend Desnecessário**: O projeto é intencionalmente autocontido no frontend, dispensando banco de dados ou APIs proprietárias no estágio atual.
- **Canal de Contato**: O formulário gera uma mensagem formatada com os dados preenchidos (nome, telefone, veículo, serviço desejado e descrição) que o usuário copia com um clique para colar no Instagram `@brsreparacoes` ou ligar via `(45) 2035-9440`.
- **Dados Estruturados SEO**: Schema.org `AutoBodyShop` implementado na rota raiz (`src/routes/index.tsx`) com cidade, telefone e catálogo dos 3 serviços.

---

## 7. Experiência, Design e Acessibilidade

- **Identidade Visual**: Paleta escura industrial automotiva:
  - Fundo: Slate grafite profundo (`oklch(0.14 0.005 260)`)
  - Acento Primário: Âmbar metálico aquecido (`oklch(0.73 0.1 82)`)
  - Tipografia: Display e Títulos em **Sora** (pesos 500 e 600, proporções técnicas e acabamento editorial de alta precisão) e corpo/controles em **Manrope** (pesos 400, 500 e 600, leitura técnica e confortável).
- **Acessibilidade**:
  - Conformidade com critérios WCAG 2.1 nível AA.
  - Navegação completa por teclado com anéis de foco visíveis (`outline: 2px solid var(--primary)`).
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

- `SPEC-001` / `TASK-001-01` / `REVIEW-001`: Estrutura da Landing Page Institucional BRS, Design Tokens e Fluxo Honesto de Contato.
- `SPEC-002` / `TASK-002-01` / `REVIEW-002`: Infraestrutura Containerizada com Docker, Docker Compose e Automação via Makefile.
- `SPEC-003` / `TASK-003-01` / `REVIEW-003`: Auditoria Técnica, Remoção de Artefatos de IA, Modularização em 15 Submódulos e Refinamento Editorial.
- `SPEC-004` / `TASK-004-01` / `REVIEW-004`: Esteira de Integração Contínua (CI/CD) com GitHub Actions e Validação de Containers Docker.
- `SPEC-005` / `TASK-005-01` / `REVIEW-005`: Refinamento de UI, Motion Design Sóbrio, Transição Cinematográfica MediaExpand e Microinterações.
- `SPEC-006` / `TASK-006-01` / `REVIEW-006`: Seção Hero Animada com Framer Motion (21st.dev AnimatedHero), botões em Glassmorphism e variantes de entrada.
- `SPEC-007` / `TASK-007-01` / `REVIEW-007`: Galeria Interativa com Slider Antes/Depois e Lightbox Modal (@radix-ui/react-dialog) e Seção de Serviços com Efeito CardSpotlight.
- `SPEC-008` / `TASK-008-01` / `REVIEW-008`: Expurgar Vínculos Lovable, Configuração Nativa Vite, Unificação de Header Único e Redesign da Seção Hero.
- `SPEC-009` / `TASK-009-01` / `REVIEW-009`: Refinamento do Sistema Tipográfico com Sora e Manrope, Tokens Fluidos clamp() e Regras de Estabilidade Visual.
- `SPEC-010` / `TASK-010-01` / `REVIEW-010`: Auditoria e Implementação de Scroll Reveal Premium com Tokens Calibrados, Disparo Único via IntersectionObserver e Suporte a Acessibilidade.
- `SPEC-011` / `TASK-011-01` / `REVIEW-011`: Substituição do Favicon Lovable pelo Pacote Oficial de Favicons e Ícones da BRS Reparações Automotivas.
- `SPEC-012` / `TASK-012-01` / `REVIEW-012`: Padronização Rigorosa das Cores de Tipografia e Botões da Seção Hero Alinhadas aos Tokens do Projeto.
- `SPEC-013` / `TASK-013-01` / `REVIEW-013`: Implementação de Footer Premium Minimal Inspirado no 21st.dev com Identidade BRS, Canais Reais e Acessibilidade.

---

## 10. Pré-requisitos para Publicação Definitiva

Conforme estipulado no [`ROADMAP.md`](ROADMAP.md):

1. **Fotografias e Logo Reais**: Substituir as imagens ilustrativas atuais por fotos autorizadas das instalações da oficina e logotipo fornecido pelo proprietário.
2. **Comparativo Antes/Depois**: Incluir seção comparativa apenas mediante pares de fotos reais autorizadas.
3. **Confirmação de WhatsApp**: Obter autorização e número oficial verificado antes de disponibilizar botão ou link de WhatsApp.
4. **Alinhamento com Proprietário**: Validação formal de posicionamento e posterior geração de sitemap definitivo.

---

© 2026 EPM DEVTECH & BRS Reparações Automotivas. Todos os direitos reservados.
