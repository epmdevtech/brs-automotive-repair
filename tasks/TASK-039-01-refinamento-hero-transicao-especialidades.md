# TASK-039-01 — Execução do Refinamento da Hero Section e Transição para Especialidades

## Metadados

| Campo          | Valor                                                              |
| -------------- | ------------------------------------------------------------------ |
| Task ID        | `TASK-039-01`                                                      |
| Spec Ref       | `SPEC-039`                                                         |
| Título         | Refinamento da Hero Section e Transição Direta para Especialidades |
| Status         | Completed                                                          |
| Responsável    | Engenheiro Frontend Sênior & Especialista em UX/UI Design          |
| Data Início    | 2026-10-14                                                         |
| Data Conclusão | 2026-10-14                                                         |

---

## 1. Escopo de Trabalho

1. **Remoção da Faixa Redundante (`trust-strip`)**:
   - Remover `<div className="trust-strip">` de `src/components/brs/hero.tsx`.
   - Limpar classes `.trust-strip` e `.trust-item` em `src/styles.css`.
   - Remover imports não utilizados em `hero.tsx`.
2. **Hierarquia do Hero e Botão Secundário**:
   - Manter CTA primário ("Solicitar avaliação" -> `/contato`) como destaque visual dominante.
   - Configurar botão secundário do Hero para "Ver especialidades" com link `#especialidades`.
   - Adicionar suporte a rolagem suave via `useSmoothScroll` em `AnimatedHero` para links de âncora `#`.
   - Limpar duplicações de Toledo-PR e do botão "Ver especialidades" no rodapé interno do Hero.
3. **Conexão Direta e Incorporação dos Diferenciais**:
   - Em `src/components/brs/website.tsx`, conectar Hero diretamente à seção de Especialidades (`Services`).
   - Em `src/components/brs/services.tsx`, adicionar âncora `#especialidades` com respiro vertical `py-16 md:py-24`.
   - Em `src/components/brs/philosophy.tsx`, incorporar organicamente os diferenciais técnicos nos 3 pilares.
4. **Testes & Validação**:
   - Atualizar suítes existentes (`ux-ui-refinement.test.tsx`, `hero-colors.test.tsx`).
   - Criar `src/test/hero-especialidades-refinement.test.tsx`.
   - Executar `bun run test`, `bun run lint` e `bun run build`.

---

## 2. Checklist de Execução

- [x] Atualizar `src/components/brs/hero.tsx` (remover faixa redundante e duplicidades no rodapé)
- [x] Atualizar `src/styles.css` (remover regras CSS orfãs)
- [x] Atualizar `src/components/brs/animated-hero.tsx` (smooth scroll em links de âncora)
- [x] Atualizar `src/components/brs/services.tsx` (âncora `#especialidades` e espaçamento)
- [x] Atualizar `src/components/brs/philosophy.tsx` (incorporação orgânica dos diferenciais)
- [x] Atualizar `src/components/brs/website.tsx` (ordem de seções e transição direta)
- [x] Criar `src/test/hero-especialidades-refinement.test.tsx` e atualizar testes legados
- [x] Validar testes (`bun run test`)
- [x] Validar linter (`bun run lint`)
- [x] Validar build (`bun run build`)
- [x] Criar `reviews/REVIEW-039-refinamento-hero-transicao-especialidades.md` e sincronizar `PROJECT.md`
