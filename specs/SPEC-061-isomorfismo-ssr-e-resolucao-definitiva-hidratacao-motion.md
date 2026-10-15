# SPEC-061: Isomorfismo SSR e Resolução Definitiva de Hidratação nos Componentes de Motion

## Metadados

| Campo       | Valor                                                                                                           |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| Spec ID     | SPEC-061                                                                                                        |
| Título      | Isomorfismo SSR e Resolução Definitiva de Hidratação nos Componentes de Motion com MotionConfig no TanStack Start |
| Status      | Aprovado                                                                                                        |
| Data        | 2026-10-15                                                                                                      |
| Autor       | Staff Frontend & Performance Engineer                                                                           |
| Módulo      | `components/ui/*` e `components/brs/*` (Motion Components)                                                      |
| Dependência | SPEC-020, SPEC-027, SPEC-033, SPEC-036, SPEC-060                                                                |

---

## 1. Visão Geral e Diagnóstico da Falha de Hidratação

Ao navegar pelo site (especialmente na rota `/contato` ou componentes que utilizam revelação de rolagem) com a opção `prefers-reduced-motion` ativada no sistema operacional ou navegador, o console emitia o aviso do React 19:

```text
scroll-reveal.tsx:72 A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up.
- will-change: "opacity, transform"
- opacity: "0"
- transform: "translateY(24px)"
+ --i: 0
```

Além disso, eram disparados avisos no console de desenvolvimento (`magnetic-button.tsx:29 You have Reduced Motion enabled on your device`) e violações de forced reflow decorrentes da destruição e recriação do nó DOM descompassado pelo React 19.

### 1.1 Causa Raiz
1. O hook `useReducedMotion()` do Framer Motion retorna `false` no servidor (Node/Bun SSR por ausência de `window.matchMedia`), mas retorna `true` no cliente quando o usuário possui acessibilidade ativada.
2. Componentes como `ScrollReveal`, `ImageReveal` e `Reveal` continham bifurcações manuais (`if (shouldReduceMotion) return ...` ou `if (shouldReduceMotion || !isObserverAvailable) return ...`):
   - No **servidor**, o componente executava o retorno com `initial={{ opacity: 0, y: distance }}` e serializava inline styles de animação no HTML estático (`style="opacity: 0; transform: translateY(24px)"`).
   - No **cliente** com movimento reduzido, o componente executava o retorno do branch de fallback (`style="--i: 0"`, sem `initial`).
   - O React 19 comparava os atributos e falhava com divergência de hidratação (Hydration Mismatch).
3. A aplicação já possui `<MotionConfig reducedMotion="user">` global em `src/routes/__root.tsx`. O Framer Motion gerencia nativa e declarativamente a preferência do usuário sem necessidade de desmembrar a árvore JSX nem quebrar a paridade de atributos entre SSR e hidratação.

---

## 2. Princípios de Engenharia e Arquitetura da Solução

1. **Eliminação de Bifurcações Manuais de JSX e Estilos no SSR**:
   - Remover os `early returns` condicionais baseados em `useReducedMotion()` de `ScrollReveal` (`src/components/ui/scroll-reveal.tsx`), `ImageReveal` (`src/components/ui/image-reveal.tsx` e `src/components/brs/image-reveal.tsx`) e `Reveal` (`src/components/brs/reveal.tsx`).
   - Delegar a supressão de movimento integralmente ao container raiz `<MotionConfig reducedMotion="user">`, garantindo que o servidor e o cliente gerem rigorosamente os mesmos nós e atributos no momento da hidratação.
2. **Isolamento de Hooks Client-Only em Efeitos (`useEffect`)**:
   - Em componentes como `MagneticButton` (`src/components/ui/magnetic-button.tsx`) e `BeforeAfterSlider` (`src/components/brs/before-after-slider.tsx`), avaliar `prefers-reduced-motion` e suporte a hover diretamente dentro de `useEffect` / listeners de eventos, eliminando o aviso ruidoso de desenvolvimento do Framer Motion (`warnOnce`).
   - Em `ProcessTimeline` (`src/components/brs/process-timeline.tsx`), unificar o estilo da timeline para eliminar ternários divergentes no SSR.
3. **Preservação Integral de Acessibilidade (WCAG 2.2 AA)**:
   - Usuários com `prefers-reduced-motion` continuam recebendo experiência 100% livre de animações indesejadas, sem saltos de layout ou travamentos.
4. **Performance e Zero Hydration Mismatch**:
   - Eliminação de reconstrução de nós pelo React 19, cessando as violações de latência em cliques e forced reflows.

---

## 3. Requisitos Funcionais e Critérios de Aceite

- [x] **AC-061-01**: Eliminar completamente o aviso de hidratação do React 19 (`A tree hydrated but some attributes of the server rendered HTML didn't match the client properties`) em `ScrollReveal`.
- [x] **AC-061-02**: Garantir paridade e isomorfismo absoluto de nós e atributos entre SSR e primeiro render do cliente em `ScrollReveal`, `ImageReveal`, `Reveal`, `ProcessTimeline` e `AnimatedHero`.
- [x] **AC-061-03**: Suprimir avisos de desenvolvimento de `useReducedMotion` em `MagneticButton` e `BeforeAfterSlider` através de verificação segura pós-montagem.
- [x] **AC-061-04**: Preservar 100% da acessibilidade (WCAG 2.2 AA) sob `prefers-reduced-motion`.
- [x] **AC-061-05**: 100% dos testes automatizados do Vitest aprovados (`bun run test`).
- [x] **AC-061-06**: Quality Gates e matriz de rastreabilidade Universal SDD aprovados sem lacunas.
