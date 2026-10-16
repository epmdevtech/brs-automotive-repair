# TASK-063-01: Blindagem de Layout Mobile Contra Estouro e Overflow Horizontal

## Metadados

| Campo       | Valor                                                                          |
| ----------- | ------------------------------------------------------------------------------ |
| Task ID     | TASK-063-01                                                                    |
| Spec Ref    | SPEC-063                                                                       |
| Título      | Aplicação de Contenção Estrita em html, body, Layout, Hero e Eyebrows          |
| Status     | Concluído                                                                      |
| Data        | 2026-10-15                                                                     |
| Responsável | Staff UX/UI Designer & Performance Engineer                                    |
| Módulo      | `styles.css`, `routes/__root.tsx`, `components/brs/*`, `components/ui/*`       |

---

## 1. Escopo de Implementação

1. **`src/styles.css`**:
   - Adicionar regras de contenção `overflow-x: clip; max-width: 100%;` em `html` e `overflow-x: clip; max-width: 100%; width: 100%;` em `body`.
   - Adicionar `flex-wrap: wrap; max-width: 100%; word-break: break-word;` na classe `.eyebrow`.
   - Adicionar `@media (max-width: 639px)` para `.eyebrow` reduzindo o tracking excessivo (`0.12em`) e font-size para `0.7rem`.
   - Adicionar `max-width: 100%;` em `.page-width` e ajustar largura para `calc(100% - 32px)` em telas `<= 767px`.
   - Calibrar `.brand strong` e `.brand span` no mobile para evitar pressão excessiva no header.
2. **`src/routes/__root.tsx`**:
   - Adicionar classes `overflow-x-clip max-w-full` em `<html>` e `<body>` no `RootShell`.
3. **`src/components/brs/site-layout.tsx` e `src/components/ui/page-transition.tsx`**:
   - Adicionar `w-full max-w-full overflow-x-clip` nos elementos estruturais de container e `main`.
4. **`src/components/brs/animated-hero.tsx` e `src/components/brs/hero.tsx`**:
   - Blindar contêineres e textos longos com `w-full max-w-full overflow-x-clip` e `flex-wrap`.
5. **Validação**:
   - Criar suíte de testes em `src/test/layout-overflow-mobile.test.tsx` garantindo a presença das regras de contenção e ausência de overflow.
   - Executar `bun run test`, `bun run lint` e `bun run build`.

---

## 2. Critérios de Aceite

- [x] **AC-063-01**: Inclusão de `overflow-x: clip; max-width: 100%` em `html` e `body` no CSS global.
- [x] **AC-063-02**: Flexibilidade e quebra de linha em `.eyebrow` com `flex-wrap: wrap; max-width: 100%`.
- [x] **AC-063-03**: Contenção em `SiteLayout`, `PageTransition`, `AnimatedHero` e `Header`.
- [x] **AC-063-04**: Testes automatizados cobrindo a blindagem contra overflow aprovados.
- [x] **AC-063-05**: Quality Gates verdes (test, lint, build).
