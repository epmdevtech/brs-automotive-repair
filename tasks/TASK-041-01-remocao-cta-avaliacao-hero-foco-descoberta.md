# TASK-041-01 — Execução da Remoção do CTA de Avaliação da Hero Section

## Metadados

| Campo         | Valor                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| Task ID       | `TASK-041-01`                                                                                        |
| Spec Ref      | `SPEC-041`                                                                                           |
| Título        | Remoção do CTA de Avaliação da Hero Section e Foco na Descoberta de Serviços                         |
| Status        | Completed                                                                                            |
| Responsável   | Engenheiro Frontend Sênior & Especialista em UI/UX Design                                            |
| Data Início   | 2026-10-14                                                                                           |
| Data Conclusão| 2026-10-14                                                                                           |

---

## 1. Escopo de Trabalho

1. **Remoção do CTA de Avaliação em `src/components/brs/hero.tsx`**:
   - Remover `ctaButton` de `Hero`.
   - Manter `secondaryCta={{ text: "Ver especialidades", href: "#especialidades" }}` como ação principal.
2. **Refinamento do Botão em `src/components/brs/animated-hero.tsx`**:
   - Ajustar container `hero-cta-group` para eliminar `gap` quando houver apenas um botão.
   - Adicionar ícone de indicação de descida (`ArrowDown`) com animação no hover (`group-hover:translate-y-0.5`).
   - Garantir tap target mínimo de 44px (`min-h-[44px]`).
3. **Testes e Atualizações Legadas**:
   - Atualizar suítes de teste que antes buscavam "Solicitar avaliação" dentro de `Hero` (`hero-colors.test.tsx`, `ux-ui-refinement.test.tsx`, `hero-especialidades-refinement.test.tsx`, `motion-system.test.tsx`).
   - Criar `src/test/hero-single-cta-discovery.test.tsx`.
   - Rodar `bun run test`, `bun run lint` e `bun run build`.

---

## 2. Checklist de Execução

- [x] Atualizar `src/components/brs/hero.tsx` (remover ctaButton)
- [x] Atualizar `src/components/brs/animated-hero.tsx` (estilização, ícone de rolagem e tap target)
- [x] Atualizar asserções de testes legados
- [x] Criar `src/test/hero-single-cta-discovery.test.tsx`
- [x] Validar testes (`bun run test`)
- [x] Validar linter (`bun run lint`)
- [x] Validar build (`bun run build`)
- [x] Criar `reviews/REVIEW-041-remocao-cta-avaliacao-hero-foco-descoberta.md` e atualizar `PROJECT.md`
