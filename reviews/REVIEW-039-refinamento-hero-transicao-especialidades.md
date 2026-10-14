# REVIEW-039 — Validação do Refinamento da Hero Section e Transição Direta para Especialidades

## 1. Metadados

| Campo   | Valor                                                                                                |
| ------- | ---------------------------------------------------------------------------------------------------- |
| SPEC    | [`SPEC-039`](../specs/SPEC-039-refinamento-hero-transicao-especialidades.md)                         |
| TASK    | [`TASK-039-01`](../tasks/TASK-039-01-refinamento-hero-transicao-especialidades.md)                   |
| Data    | 2026-10-14                                                                                           |
| Status  | Aprovado (100% dos Quality Gates Cumpridos)                                                          |
| Revisor | Quality Gate Lead & Senior Frontend/UX-UI Engineer EPM DevTech                                       |

---

## 2. Sumário da Entrega

Refatoração pontual e criteriosa da Hero Section e da transição para a seção de Especialidades na Home da **BRS Reparações Automotivas**, eliminando ruído visual, fragmentações e redundâncias artificiais:

1. **Remoção Completa da Faixa Redundante (`trust-strip`)**:
   - Excluído o elemento `<div className="trust-strip">` de `src/components/brs/hero.tsx` com seus micro-benefícios em lista solta.
   - Eliminadas as regras CSS correspondentes (`.trust-strip` e `.trust-item`) em `src/styles.css` (inclusive queries mobile), prevenindo estilos órfãos.
   - Eliminados imports não utilizados (`ArrowDown`, `MapPin`, `ShieldCheck`, `Wrench`, `Handshake`, `Truck`).
2. **Otimização da Hierarquia do Hero e Botão Secundário com Smooth Scroll**:
   - O CTA primário de conversão ("Solicitar avaliação" -> `/contato`) permanece como ponto focal dominante da Hero.
   - Botão secundário reestruturado com rótulo "Ver especialidades", peso visual secundário (estilo outline `.btn--secondary`) e destino `#especialidades`.
   - Adicionada rolagem suave inercial em `HeroLink` através do `useSmoothScroll` (Lenis/GSAP) para links de âncora `#`, com fallback gracioso e conformidade estrita com `prefers-reduced-motion`.
   - Limpeza de tags soltas sobre Toledo-PR no rodapé do Hero e remoção de âncora duplicada "Ver especialidades", mantendo a localização de forma elegante e sutil no eyebrow (`Oficina Técnica Especializada • Toledo, PR`) e microcopy de fotografia ilustrativa.
3. **Ajuste de Espaçamento e Transição Direta com Especialidades**:
   - A `HomePageContent` conecta a Hero Section diretamente à seção de Especialidades (`Services`), seguida pela evidência prática do `HomeBeforeAfter`.
   - A seção de Especialidades passa a responder à âncora `#especialidades` e `#servicos`, configurada com respiro vertical normativo (`py-16 md:py-24`).
   - Os 3 diferenciais técnicos essenciais ("Reparação e pintura técnica de precisão", "Diagnóstico honesto e transparente", "Serviço de leva e traz em Toledo-PR") foram incorporados organicamente nos pilares narrativos de `Philosophy`, evitando blocos intermediários vazios.

---

## 3. Matriz de Conformidade dos Critérios de Aceite

| Critério | Descrição | Status | Evidência |
| -------- | --------- | ------ | --------- |
| **AC-039-01** | Remoção da barra de micro-benefícios (`trust-strip`) e limpeza de CSS órfão | Aprovado | `hero.tsx` e `styles.css` atualizados; verificado em `hero-especialidades-refinement.test.tsx` |
| **AC-039-02** | Hierarquia do Hero: CTA dominante e botão secundário outline para `#especialidades` | Aprovado | `hero.tsx` e `animated-hero.tsx` atualizados; `useSmoothScroll` integrado |
| **AC-039-03** | Transição direta para Especialidades (`py-16 md:py-24`) e diferenciais orgânicos | Aprovado | `services.tsx`, `philosophy.tsx` e `website.tsx` atualizados |
| **AC-039-04** | Qualidade de código, acessibilidade e Quality Gates 100% verdes | Aprovado | Vitest (32 suítes, 218 testes passando), ESLint (0 erros) e Build Nitro SSR |

---

## 4. Evidências dos Quality Gates

- **Testes Automatizados (Vitest)**:
  - 32 arquivos de teste executados.
  - 218 testes aprovados com 100% de sucesso (`bun run test`).
- **Linter (ESLint + Prettier)**:
  - 0 erros e 0 avisos em todo o projeto (`bun run lint`).
- **Build de Produção (Vite + Nitro SSR)**:
  - Compilação concluída com sucesso sem erros de tipagem (`bun run build`).
