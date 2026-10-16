# REVIEW-061: Isomorfismo SSR e Resolução Definitiva de Hidratação nos Componentes de Motion

## Metadados

| Campo   | Valor                                              |
| ------- | -------------------------------------------------- |
| ID      | REVIEW-061                                         |
| SPEC    | SPEC-061                                           |
| TASKS   | TASK-061-01, TASK-061-02                           |
| Status  | Aprovado                                           |
| Data    | 2026-10-15                                         |
| Revisor | Staff Frontend & Performance Engineer (EPMDEVTECH) |

---

## 1. Resumo da Entrega e Resolução dos Defeitos de Hidratação

A **SPEC-061** implementou o alinhamento definitivo de isomorfismo SSR e hidratação nos componentes de animação e microinterações da BRS, eliminando as advertências de divergência de atributos do React 19 e avisos ruidosos de acessibilidade do Framer Motion.

### 1.1 Resolução da Divergência de Atributos em `ScrollReveal` e `ImageReveal` (TASK-061-01)

- **Problema Detectado**:
  ```text
  scroll-reveal.tsx:72 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up.
  - will-change: "opacity, transform"
  - opacity: "0"
  - transform: "translateY(24px)"
  + --i: 0
  ```
  O React 19 entrava em recuperação de erro, destruindo e recriando subárvores DOM completas no cliente, resultando em avisos de performance (`[Violation] 'click' handler took 482ms` e forced reflows).
- **Causa Raiz**:
  O hook `useReducedMotion()` avaliava como `false` no SSR (Node/Bun sem `window`), gerando nós com estilos inline de animação (`will-change: opacity, transform; opacity: 0; transform: translateY(24px)`). No cliente com `prefers-reduced-motion` ativado, o hook retornava `true` no render síncrono e disparava um `early return` que removia as props de animação e gerava apenas `style="--i: 0"`.
- **Solução Implementada**:
  1. Remoção de `useReducedMotion()` e de bifurcações manuais de JSX em `ScrollReveal` (`src/components/ui/scroll-reveal.tsx`), `ImageReveal` (`src/components/ui/image-reveal.tsx` e `src/components/brs/image-reveal.tsx`) e `Reveal` (`src/components/brs/reveal.tsx`).
  2. Delegação integral da supressão de movimento ao `<MotionConfig reducedMotion="user">` global em `src/routes/__root.tsx`.
  3. Com isso, tanto o servidor SSR quanto a primeira hidratação do cliente geram rigorosamente os mesmos elementos e atributos inline, garantindo 100% de paridade e zero re-renderizações desnecessárias.

### 1.2 Isolamento Client-Side em `MagneticButton`, `BeforeAfterSlider` e Demais Componentes (TASK-061-02)

- **Problema Detectado**:
  Avisos repetidos no console:
  ```text
  magnetic-button.tsx:29 You have Reduced Motion enabled on your device. Animations may not appear as expected.. For more information and steps for solving, visit https://motion.dev/troubleshooting/reduced-motion-disabled
  ```
- **Causa Raiz**:
  A chamada direta a `useReducedMotion()` em componentes interativos acionava o `warnOnce` do Framer Motion a cada montagem sob modo reduzido.
- **Solução Implementada**:
  1. Em `MagneticButton` (`src/components/ui/magnetic-button.tsx`), eliminada a dependência do hook em tempo de renderização; a verificação foi migrada para `useEffect` em conjunto com a validação de capacidades de hardware (`(hover: hover) and (pointer: fine)` e `(prefers-reduced-motion: reduce)`). O render inicial permanece 100% estático e idêntico ao SSR (`<div className={className}>{children}</div>`), promovendo-se a `<motion.div>` após montagem apenas se o ambiente suportar hover fino e permitir animações.
  2. Em `BeforeAfterSlider` (`src/components/brs/before-after-slider.tsx`), movida a verificação para dentro do efeito de teaser automático.
  3. Em `CardSpotlight` (`src/components/brs/card-spotlight.tsx`), movida a verificação para o manipulador de ponteiro.
  4. Em `ProcessTimeline` (`src/components/brs/process-timeline.tsx`) e `AnimatedHero` (`src/components/brs/animated-hero.tsx`), unificados estilos e variantes estáticas, removendo ternários divergentes.

---

## 2. Evidências de Validação e Quality Gates

### 2.1 Testes Automatizados (Vitest)

- Testes específicos adicionados em `src/test/global-motion-system.test.tsx`:
  - `garante isomorfismo estrito no ScrollReveal durante SSR e hidratação com reduced-motion (AC-061-01, AC-061-02)` com validação de `renderToString` e `hydrateRoot` sem erros de hidratação.
  - `assegura que MagneticButton renderiza isomorficamente no SSR e suprime warnings de reduced-motion (AC-061-03)`.
- Suíte de regressão de movimento em `src/test/scroll-reveal.test.tsx` e `src/test/scroll-reveal-luxury.test.tsx` 100% verde.

### 2.2 Quality Gates

- Linter: `bun run lint` sem erros.
- Compilação / Build: `bun run build` gerando SSR e pacotes de cliente sem falhas.

---

## 3. Matriz de Conformidade de Critérios de Aceite

| Critério    | Descrição                                                                         | Status   |
| ----------- | --------------------------------------------------------------------------------- | -------- |
| `AC-061-01` | Eliminação do erro de hidratação de atributos no React 19 em `ScrollReveal`       | Aprovado |
| `AC-061-02` | Paridade estrita de atributos e nós DOM entre SSR e primeiro render de hidratação | Aprovado |
| `AC-061-03` | Ausência de avisos `warnOnce` do Framer Motion em `MagneticButton` e interações   | Aprovado |
| `AC-061-04` | Preservação das diretrizes WCAG 2.2 AA sob preferência de movimento reduzido      | Aprovado |
| `AC-061-05` | 100% dos testes do Vitest aprovados (`bun run test`)                              | Aprovado |
| `AC-061-06` | Quality gates e rastreabilidade Universal SDD aprovados sem pendências            | Aprovado |
