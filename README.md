# BRS Reparações Automotivas

> 🚧 **Status:** Landing Page Institucional Implementada (Pré-Publicação Definitiva). Governança sob o **Universal SDD v1.0**.

> **Presença digital institucional da BRS Reparações Automotivas em Toledo-PR. Desenvolvimento orientado por especificações (Spec-Driven Development) para máxima qualidade, acessibilidade e transparência.**

---

## Sobre o Projeto

O site da **BRS Reparações Automotivas** foi desenvolvido para apresentar a oficina mecânica e de funilaria/pintura situada em Toledo, Paraná. Com uma identidade visual premium inspirada na precisão automotiva, a plataforma atende tanto proprietários de veículos particulares quanto corretores de seguros.

### Destaques da Solução

- **Transparência e Honestidade Comercial**: Nenhum canal não confirmado é prometido. O formulário de contato prepara uma mensagem completa para envio direto pelo canal oficial validado (Instagram `@brsreparacoes`).
- **Mídia Ilustrativa Clara**: Todas as fotos genéricas de serviços são declaradas como ilustrativas até a coleta e autorização das fotos reais da oficina.
- **Acessibilidade Completa**: Interface desenvolvida com primitivas Radix UI e suporte pleno a navegação por teclado (WCAG 2.1 AA).
- **Alta Performance**: Arquitetura híbrida SSR com TanStack Start, React 19 e Tailwind CSS v4.

---

## Documentação do Universal SDD

A governança do projeto é estruturada de forma modular para garantir rastreabilidade completa entre requisitos, tarefas e código.

| Documento                                                    | Objetivo                                                       |
| ------------------------------------------------------------ | -------------------------------------------------------------- |
| [`PROJECT.md`](PROJECT.md)                                   | Estado canônico atual do projeto, stack, portas e regras       |
| [`AGENTS.md`](AGENTS.md)                                     | Protocolo unificado para pessoas e agentes de IA               |
| [`UNIVERSAL_SDD_FRAMEWORK.md`](UNIVERSAL_SDD_FRAMEWORK.md)   | Definição normativa do núcleo do framework                     |
| [`ROADMAP.md`](ROADMAP.md)                                   | Planejamento, status e pré-requisitos para publicação          |
| [`CHANGELOG.md`](CHANGELOG.md)                               | Histórico de versões e mudanças implementadas                  |
| [`docs/getting-started.md`](docs/getting-started.md)         | Guia de primeiros passos no framework                          |
| [`docs/architecture.md`](docs/architecture.md)               | Arquitetura técnica e documental                               |
| [`docs/traceability-matrix.md`](docs/traceability-matrix.md) | Matriz de rastreabilidade entre SPECs, Tasks e Commits         |
| [`standards/ux-ui.md`](standards/ux-ui.md)                   | Padrões de interface e critérios de UX/UI                      |
| [`standards/accessibility.md`](standards/accessibility.md)   | Requisitos e validação de acessibilidade                       |
| [`standards/testing.md`](standards/testing.md)               | Estratégia de testes automatizados e evidências                |
| [`standards/quality-gates.md`](standards/quality-gates.md)   | Critérios de entrada, saída e release                          |
| [`specs/`](specs/)                                           | Especificações técnicas aprovadas (`SPEC-001`)                 |
| [`tasks/`](tasks/)                                           | Tarefas rastreadas derivadas de especificações (`TASK-001-01`) |
| [`reviews/`](reviews/)                                       | Registros formais de aprovação e evidências (`REVIEW-001`)     |
| [`knowledge/`](knowledge/)                                   | Base de conhecimento modular do negócio e arquitetura          |

---

## Primeiros Passos e Desenvolvimento Local

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v20+) ou [Bun](https://bun.sh/) (v1.2+)

### Instalação

```bash
bun install
# ou: npm install
```

### Automação via Makefile

O projeto conta com comandos unificados via `Makefile`:

```bash
make help               # Exibe a lista completa de comandos disponíveis
make install            # Instala as dependências do projeto
make dev                # Inicia o servidor local de desenvolvimento (porta 5210)
make build              # Executa o build de produção (Vite + Nitro SSR)
make preview            # Visualiza o build de produção localmente
make lint               # Executa o linter ESLint
make format             # Formata todo o código com Prettier
make test               # Executa a suíte de testes com Vitest
make check              # Executa todos os Quality Gates locais e matriz SDD
```

### Containerização (Docker & Docker Compose)

A aplicação está totalmente containerizada com imagem multi-estágio baseada em `oven/bun:1-slim`:

```bash
make docker-build       # Constrói a imagem Docker local
make up                 # Sobe os containers em segundo plano (docker compose up -d)
make down               # Para e remove os containers (docker compose down)
make docker-dev         # Sobe os containers em primeiro plano com logs
make docker-logs        # Exibe os logs em tempo real
```

Acesse em seu navegador:

- **Acesso direto**: `http://localhost:5210`
- **Via Caddy (Reverse Proxy)**: `http://brs.localhost`

---

## Princípios do Framework

1. A **SPEC aprovada** define o comportamento desejado da mudança.
2. O **PROJECT.md** registra o estado canônico do projeto.
3. Código e evidências de QA comprovam o comportamento entregue.
4. Toda implementação começa por uma SPEC.
5. Interfaces começam por discovery e design aprovados antes da implementação.
6. Toda SPEC precisa de aprovação humana.
7. A IA implementa apenas o escopo aprovado.
8. Toda implementação deve passar pelos quality gates aplicáveis.
9. Mudanças de interface exigem revisão de design e acessibilidade.
10. A documentação evolui junto com o código.

---

© 2026 EPM DEVTECH & BRS Reparações Automotivas.
