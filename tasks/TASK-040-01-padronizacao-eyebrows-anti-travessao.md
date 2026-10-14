# TASK-040-01 — Execução da Padronização Tipográfica dos Eyebrows e Remoção de Travessões

## Metadados

| Campo         | Valor                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| Task ID       | `TASK-040-01`                                                                                        |
| Spec Ref      | `SPEC-040`                                                                                           |
| Título        | Padronização Tipográfica dos Eyebrows e Remoção de Travessões e Pseudo-elementos                     |
| Status        | Completed                                                                                            |
| Responsável   | Engenheiro Frontend Sênior & Especialista em UX/UI Design                                            |
| Data Início   | 2026-10-14                                                                                           |
| Data Conclusão| 2026-10-14                                                                                           |

---

## 1. Escopo de Trabalho

1. **Remoção de `.eyebrow::before` e Ajuste Tipográfico em `src/styles.css`**:
   - Remover regra `.eyebrow::before` que insere linha horizontal decorativa de 20px.
   - Atualizar `--tracking-eyebrow: 0.2em`.
   - Calibrar `.eyebrow` com `font-size: 0.75rem`, `letter-spacing: 0.2em`, `text-transform: uppercase`, `font-weight: var(--weight-semibold)` e alinhamento flush.
2. **Varredura e Limpeza nos Componentes**:
   - Em `src/components/brs/media-expand.tsx`, remover o marcador de ponto dentro de `.eyebrow`.
   - Verificar títulos e rótulos de seção em `Hero`, `Services`, `Philosophy`, `HomeBeforeAfter`, `ProcessTimeline`, `Contact`, `PageHero`, etc.
3. **Testes e Validação**:
   - Criar `src/test/eyebrows-standardization.test.tsx`.
   - Executar `bun run test`, `bun run lint` e `bun run build`.

---

## 2. Checklist de Execução

- [x] Atualizar `src/styles.css` (remover `.eyebrow::before` e atualizar propriedades de `.eyebrow`)
- [x] Atualizar `src/components/brs/media-expand.tsx` (remover marcador interno do eyebrow)
- [x] Criar `src/test/eyebrows-standardization.test.tsx`
- [x] Executar suíte completa de testes (`bun run test`)
- [x] Executar linter (`bun run lint`)
- [x] Executar build de produção (`bun run build`)
- [x] Criar `reviews/REVIEW-040-padronizacao-eyebrows-anti-travessao.md` e atualizar `PROJECT.md`
