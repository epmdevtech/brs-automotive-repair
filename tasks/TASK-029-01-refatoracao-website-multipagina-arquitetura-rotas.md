# TASK-029-01 — Refatoração Canônica: Website Multipágina com Arquitetura de Rotas Dedicadas

## Metadados

| Campo       | Valor                                                                                                                        |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ID          | `TASK-029-01`                                                                                                                |
| Status      | Done (Concluído)                                                                                                             |
| Responsável | Software Architect & Staff Frontend Engineer EPM DevTech                                                                     |
| Refs:       | SPEC: [`SPEC-029`](../specs/SPEC-029-refatoracao-website-multipagina-arquitetura-rotas.md); Critérios: AC-029-01 a AC-029-05 |

---

## 1. Objetivo

Refatorar todas as diretrizes de governança, regras de agentes, escopos de proposta comercial e testes do projeto BRS para consolidar canonicamente que o projeto é um **Website Institucional Multipágina Estruturado com Rotas Dedicadas (TanStack Router)**, eliminando qualquer vestígio de "landing page de página única".

---

## 2. Checklist de Execução

- [x] Atualizar [`AGENTS.md`](../AGENTS.md) com diretriz obrigatória de Website Multipágina com Rotas Especializadas.
- [x] Atualizar [`PROJECT.md`](../PROJECT.md) com metadados e seção de arquitetura definindo o ecossistema multipágina com rotas.
- [x] Refatorar [`src/lib/proposta.ts`](../src/lib/proposta.ts):
  - EPM Web com discriminação dos entregáveis das 10 rotas do site (`/`, `/servicos`, `/servicos/funilaria`, `/servicos/pintura-automotiva`, `/servicos/martelinho-de-ouro`, `/trabalhos`, `/para-corretores`, `/sobre`, `/contato`, `/privacidade`);
  - Pacotes estratégicos (bundles) e FAQ destacando a autonomia do website multipágina;
  - Escopo da proposta piloto atualizado de landing page para Website Institucional Multipágina & Arquitetura de Rotas.
- [x] Atualizar testes unitários (`src/test/proposta-route.test.tsx`, `src/test/header.test.tsx`, `src/test/proposta.test.ts`).
- [x] Executar testes ponta a ponta Playwright (`e2e/proposal-route.spec.ts`) com 100% de sucesso.
- [x] Validar Quality Gates (`bun run test`, `bun run lint`, `bun run build`).
- [x] Emitir `REVIEW-029` e atualizar `PROJECT.md` e `CHANGELOG.md`.
