# TASK-042-01 — Refinamento Visual da Hero/Intro de Serviços (/servicos)

## 1. Metadados e Rastreabilidade

- **Task ID**: TASK-042-01
- **Spec Ref**: SPEC-042
- **Responsável**: Engenheiro Frontend Sênior & Especialista UX/UI
- **Data de Atribuição**: 2026-10-14
- **Status**: CONCLUÍDO

---

## 2. Checklist de Execução

- [x] **Fase 1: Refatoração de `src/components/brs/page-hero.tsx`**
  - [x] Condicionar margem inferior da descrição (`mb-0` quando sem `telemetryBadges`)
  - [x] Aplicar `mt-6 sm:mt-8` no bloco de ações quando sem `telemetryBadges`
  - [x] Condicionar `gap-4` no container de ações para aplicar apenas quando `actions.length > 1`
  - [x] Integrar `useSmoothScroll` para rolagem inercial quando `action.href` iniciar com `#`
- [x] **Fase 2: Refatoração de `src/routes/servicos/index.tsx`**
  - [x] Remover `telemetryBadges` de `<PageHero>`
  - [x] Remover botão primário "Solicitar avaliação técnica" mantendo apenas "Ver trabalhos concluídos" (`variant: "secondary"`)
  - [x] Adicionar `id="lista-servicos"` e respiro `py-16 lg:py-20` na seção de serviços detalhados
  - [x] Remover imports órfãos `Wrench`, `Paintbrush`, `Car` e mapa morto `serviceIcons`
- [x] **Fase 3: Testes Automatizados**
  - [x] Criar `src/test/servicos-intro-refinement.test.tsx` com testes de AC-042-01 a AC-042-03
  - [x] Validar todas as suítes existentes
- [x] **Fase 4: Quality Gates e Governança**
  - [x] `bun run test` (100% aprovados)
  - [x] `bun run lint` (zero erros)
  - [x] `bun run build` (build Nitro SSR concluído)
  - [x] Criar `reviews/REVIEW-042-refinamento-hero-intro-servicos.md`
  - [x] Atualizar `PROJECT.md` e gerar `docs/traceability-matrix.md`
