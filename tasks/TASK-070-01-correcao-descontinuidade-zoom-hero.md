# TASK-070-01 — Corrigir Continuidade do Zoom do Hero e Adicionar Trava Automatizada

| Campo       | Valor                                                     |
| ----------- | --------------------------------------------------------- |
| ID          | `TASK-070-01`                                             |
| SPEC        | `SPEC-070`                                                |
| Status      | Completed                                                 |
| Data        | 2026-10-16                                                |
| Responsável | Senior Frontend & Motion Design Engineer (Universal SDD) |

---

## 1. Objetivo

Eliminar o salto de escala no zoom do Hero removendo a redefinição da animação por estado (`hero-intro-complete`), adotar easing contínuo e promover o elemento a camada própria, comprovando continuidade por medição (antes/depois).

---

## 2. Passos de Execução

1. Medir o estado atual (Etapa 0) — feito: salto Δscale 0,0199 no desktop (t=10,15 s) e 0,0075 no mobile (t=8,85 s).
2. `@keyframes heroSlowZoom`: usar `translate3d(0,0,0) scale(...)`.
3. `.hero-photo-cinematic`: easing `cubic-bezier(0.25, 0.1, 0.25, 1)`, `backface-visibility: hidden`.
4. Remover a regra `.hero-intro-complete .hero-photo-cinematic` (causa-raiz).
5. Re-medir (Etapa 4): 0 descontinuidades; escala final mantida.
6. Adicionar teste Vitest de continuidade lendo `src/styles.css`.
7. Quality gates.

---

## 3. Validação

| Critério/risco | Teste, comando ou revisão | Evidência esperada |
| -------------- | ------------------------- | ------------------ |
| AC-070-01/02 | Script Playwright de amostragem | Sem Δscale > 0,002; escala final mantida |
| AC-070-03 | Playwright reduced-motion | Estático e visível |
| AC-070-04 | Listener de console/pageerror | 0 erros |
| AC-070-05 | `bun run lint`/`test`/`build` | Sem novas falhas |
| Regressão | `e2e/hero-visual-baseline.spec.ts` | Sem divergência visual |

---

## 4. Condição de conclusão

- [x] Escopo implementado sem expansão.
- [x] Testes e validações aplicáveis aprovados.
- [x] Documentação e rastreabilidade atualizadas.
- [x] Limitações e desvios registrados.
