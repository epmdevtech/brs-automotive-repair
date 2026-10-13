# TASK-027-02 — Correção de Hidratação SSR e Visibilidade da Rota de Proposta Comercial

## Metadados

| Campo        | Valor                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| ID           | `TASK-027-02`                                                                                                       |
| Status       | Done (Concluído)                                                                                                    |
| Responsável  | Staff Frontend Engineer & Especialista Comercial EPM DevTech                                                        |
| Refs:        | SPEC: [`SPEC-027`](../specs/SPEC-027-rota-de-proposta-comercial-personalizada.md); Critérios: AC-027-01 a AC-027-08 |
| Dependências | TASK-027-01                                                                                                         |

---

## 1. Problema Identificado

Ao acessar a rota `/proposta/$slug` em ambiente de navegação real, o console emite o aviso do React 19:

```text
client:525 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up.
```

A árvore afetada inclui os wrappers `<ScrollReveal>` de todas as seções da proposta (`ProposalHero`, `ProposalOpportunity`, `ProposalSolution`, `ProposalScope`, etc.). Como o React 19 não realiza patch automático de atributos com incompatibilidade de hidratação, os estilos de renderização inicial do servidor (`opacity: 0; transform: translateY(24px)`) permaneceram travados no DOM, tornando todo o conteúdo da proposta invisível para o usuário no navegador, restando visíveis apenas os menus de âncoras (`ProposalNav`).

A causa raiz consiste na divergência entre a renderização SSR (onde `useReducedMotion` retorna `false` e gera estilos de animação inicial com opacidade zero) e a hidratação no cliente do usuário (onde preferências de acessibilidade ou timings do Framer Motion alteram a árvore).

---

## 2. Solução Técnica e Escopo

1. **Remoção de `<ScrollReveal>` dos Componentes de Proposta (`src/components/brs/proposal/*`)**:
   - A proposta comercial é um instrumento de decisão empresarial de alta importância técnica e conversão.
   - Por princípio de resiliência e acessibilidade (WCAG SC 1.3.1, SC 2.1.1), o conteúdo da proposta deve ser imediatamente legível e renderizado com visibilidade total (`opacity: 1`), sem esconder parágrafos, tabelas de valores ou botões atrás de animações bloqueantes.
   - Remover o wrapper `<ScrollReveal>` de:
     - `proposal-hero.tsx`
     - `proposal-opportunity.tsx`
     - `proposal-solution.tsx`
     - `proposal-scope.tsx`
     - `proposal-investment.tsx`
     - `proposal-conditions.tsx`
     - `proposal-timeline.tsx`
     - `proposal-responsibilities.tsx`
     - `proposal-faq.tsx`
     - `proposal-acceptance.tsx`

2. **Blindagem de Hidratação SSR no `ScrollReveal` (`src/components/ui/scroll-reveal.tsx`)**:
   - Assegurar que `ScrollReveal` não gere divergência de atributos de estilo entre o servidor e o cliente durante a hidratação inicial do React 19.

3. **Validação e Evidências**:
   - **Testes Unitários / Integração**: `bun run test` aprovou 24 arquivos de teste e 166 testes (100%).
   - **Linter**: `bun run lint` com 0 erros.
   - **Build**: `bun run build` com Nitro SSR e Vite gerados com sucesso.
   - **Testes E2E (Playwright)**: `npx playwright test e2e/proposal-route.spec.ts` validou no Chromium real que todos os elementos e seções da proposta estão 100% visíveis, funcionais e sem hydration mismatch.
   - **Evidência Visual**: Captura de tela gerada em `e2e-screenshots/proposal-view.png` confirmando a renderização impecável de todas as 10 seções da proposta comercial da BRS.
