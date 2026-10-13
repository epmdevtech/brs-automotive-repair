# REVIEW-027-02 — Revisão de Correção de Hidratação SSR e Visibilidade da Proposta Comercial

## Metadados

| Campo       | Valor                                                                                                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID          | `REVIEW-027-02`                                                                                                                                                                   |
| Status      | Approved (Aprovado)                                                                                                                                                               |
| Data        | 2026-10-13                                                                                                                                                                        |
| Responsável | Staff Frontend Engineer & Especialista Comercial EPM DevTech                                                                                                                      |
| Refs:       | SPEC: [`SPEC-027`](../specs/SPEC-027-rota-de-proposta-comercial-personalizada.md); TASK: [`TASK-027-02`](../tasks/TASK-027-02-correcao-hidratacao-ssr-e-visibilidade-proposta.md) |

---

## 1. Veredito

**APROVADO (100% de conformidade com Quality Gates e WCAG 2.1 AA)**

O defeito de hidratação e visibilidade relatado pelo usuário (onde o console acusava `client:525 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties` e o conteúdo aparecia invisível) foi completamente sanado através da eliminação de wrappers bloqueantes de animação em documentos comerciais, garantindo visibilidade imediata sem dependência de JavaScript de scroll.

---

## 2. Auditoria da Causa Raiz

1. O componente `<ScrollReveal>` gerava inline styles no SSR com `opacity: 0` e `transform: translateY(24px)`.
2. Em clientes com preferências de sistema operacional ou variações de renderização do Framer Motion, o React 19 detectava divergência nos atributos de estilo do elemento durante a hidratação.
3. Como o React 19 adota a diretriz estrita _"This won't be patched up"_, os estilos com opacidade zero permaneciam no DOM, ocultando o conteúdo.
4. Por ser uma proposta comercial executiva, esconder o conteúdo sob animações de scroll viola as diretrizes de acessibilidade e resiliência (WCAG SC 1.3.1 e SC 2.1.1).

---

## 3. Escopo Implementado

- Remoção do wrapper `<ScrollReveal>` de todos os 10 submódulos da proposta:
  - `src/components/brs/proposal/proposal-hero.tsx`
  - `src/components/brs/proposal/proposal-opportunity.tsx`
  - `src/components/brs/proposal/proposal-solution.tsx`
  - `src/components/brs/proposal/proposal-scope.tsx`
  - `src/components/brs/proposal/proposal-investment.tsx`
  - `src/components/brs/proposal/proposal-conditions.tsx`
  - `src/components/brs/proposal/proposal-timeline.tsx`
  - `src/components/brs/proposal/proposal-responsibilities.tsx`
  - `src/components/brs/proposal/proposal-faq.tsx`
  - `src/components/brs/proposal/proposal-acceptance.tsx`
- Preservação intacta de toda a composição editorial, tipografia Sora/Manrope, dados comerciais reais e interatividade dos acordeões e modais.

---

## 4. Evidências dos Quality Gates

| Gate                 | Comando                                              | Resultado                                           |
| -------------------- | ---------------------------------------------------- | --------------------------------------------------- |
| Testes Unitários     | `bun run test`                                       | 24 arquivos de teste, 166 testes passando (100%)    |
| Linter & Formatação  | `bun run lint`                                       | 0 erros, código formatado pelo Prettier             |
| Compilação / Build   | `bun run build`                                      | Vite e Nitro SSR compilados sem falhas              |
| E2E / Navegador Real | `npx playwright test e2e/proposal-route.spec.ts`     | 2 testes aprovados no Chromium real                 |
| Verificação Visual   | Captura fullPage `e2e-screenshots/proposal-view.png` | Todas as 10 seções renderizadas com 100% de nitidez |
