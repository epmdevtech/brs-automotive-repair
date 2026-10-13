# TASK-028-01 — Implementação da Proposta Comercial Modular EPM DevTech para BRS Reparações Automotivas

## Metadados

| Campo        | Valor                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| ID           | `TASK-028-01`                                                                                                     |
| Status       | Done (Concluído)                                                                                                  |
| Responsável  | Software Architect & Staff Frontend Engineer EPM DevTech                                                          |
| Refs:        | SPEC: [`SPEC-028`](../specs/SPEC-028-proposta-comercial-modular-epm-devtech.md); Critérios: AC-028-01 a AC-028-08 |
| Dependências | TASK-027-01, TASK-027-02                                                                                          |

---

## 1. Objetivo

Implementar a rota exclusiva `/proposta/brs-reparacoes` apresentando o portfólio comercial modular de 6 produtos digitais da EPM DevTech para a BRS Reparações Automotivas, com seletor interativo de módulos, matriz comparativa responsiva, 5 pacotes sugeridos, segregação de custos recorrentes, fluxo visual de 9 etapas de execução, perguntas frequentes e modal de manifestação de interesse com resumo dinâmico do orçamento.

---

## 2. Checklist de Execução

- [x] **Etapa 1**: Elaboração e aprovação da `SPEC-028`.
- [x] **Etapa 2**: Expansão do modelo de dados e catálogo central em `src/lib/proposta.ts` (6 módulos com preços, escopos, exclusões, pacotes, funções de cálculo monetário seguro `calculateSelectedModulesTotal` e `generateModularAcceptanceMessage`).
- [x] **Etapa 3**: Implementação dos componentes de apresentação modulares em `src/components/brs/proposal/`:
  - `proposal-hero.tsx` (Seção A: Abertura personalizada BRS + EPM DevTech)
  - `proposal-opportunity.tsx` (Seção B: Diagnóstico e oportunidades do setor)
  - `proposal-modules-catalog.tsx` (Seção C: Catálogo dos 6 módulos com seletor interativo)
  - `proposal-comparison-matrix.tsx` (Seção D: Matriz comparativa responsiva com tabela desktop e cards mobile)
  - `proposal-bundles.tsx` (Seção E: 5 combinações sugeridas com seleção em 1 clique)
  - `proposal-recurring-costs.tsx` (Seção F: Custos recorrentes e despesas de terceiros segregadas)
  - `proposal-execution-steps.tsx` (Seção H: Fluxo visual das 9 etapas de execução numeradas)
  - `proposal-faq.tsx` (Seção I: 9 perguntas frequentes do setor automotivo com Accordions acessíveis)
  - `proposal-modular-acceptance.tsx` (Seção J: Resumo dinâmico em tempo real e modal de interesse comercial com WhatsApp e E-mail)
  - `proposal-nav.tsx` (Atualização da barra adesiva para navegação modular rápida)
  - `proposal-view.tsx` (Orquestrador da proposta modular e compatibilidade com propostas legadas)
- [x] **Etapa 4**: Registro e roteamento no TanStack Router (`src/routes/proposta/$slug.tsx` e `src/routes/proposta/index.tsx`).
- [x] **Etapa 5**: Suíte de testes unitários (`src/test/proposta.test.ts` com 17 testes cobrindo validação, 6 módulos, 5 pacotes, custos, 9 etapas, cálculos e mensagem).
- [x] **Etapa 6**: Testes ponta a ponta Playwright (`e2e/proposal-route.spec.ts`) com validação de responsividade mobile/tablet/desktop e screenshots visuais.
- [x] **Etapa 7**: Quality Gates (173/173 testes unitários no Vitest, 0 erros no ESLint, Prettier formatado, Nitro SSR build 100% aprovado).
- [x] **Etapa 8**: Revisão `REVIEW-028`, sincronização do `PROJECT.md` e `CHANGELOG.md`.

---

## 3. Evidências de Validação

- **Testes Unitários:** 173 testes passando com 100% de sucesso em 24 arquivos de teste (`bun run test`).
- **Linter & Formatador:** ESLint e Prettier executados sem erros (`bun run lint`).
- **Build de Produção:** Vite + Nitro SSR compilado com sucesso (`bun run build`).
- **Testes E2E:** 3/3 testes Playwright aprovados com screenshots capturados em desktop e mobile (`e2e-screenshots/modular-proposal-desktop.png` e `e2e-screenshots/modular-proposal-mobile.png`).
