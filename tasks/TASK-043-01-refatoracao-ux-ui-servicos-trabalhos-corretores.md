# TASK-043-01 — Refatoração de UX/UI, Arquitetura de Conversão e Conteúdo Canônico em /servicos, /trabalhos e /para-corretores

## 1. Metadados e Rastreabilidade

- **Task ID**: TASK-043-01
- **Spec Ref**: SPEC-043
- **Responsável**: Engenheiro Frontend Sênior & Lead UX/UI Designer
- **Data de Atribuição**: 2026-10-14
- **Status**: CONCLUÍDO

---

## 2. Checklist de Execução

- [x] **Fase 1: Refatoração de `/servicos` (`src/routes/servicos/index.tsx`)**
  - [x] Atribuir âncoras locais `#funilaria-estrutural`, `#pintura-estufa`, `#martelinho-pdr` com `scroll-mt-28`
  - [x] Remover botão "Solicitar avaliação" dos 3 cards principais
  - [x] Substituir botão "Conhecer" por link inline contextual para `/trabalhos` com tracking
  - [x] Transformar links do Guia de Triagem em rolagem suave para as âncoras locais
  - [x] Remover botões de conversão dos 3 cards de Estética Automotiva
  - [x] Refatorar banner de Leva e Traz em Bottom CTA Banner dominante
- [x] **Fase 2: Refatoração de `/trabalhos` (`src/routes/trabalhos.tsx`)**
  - [x] Remover `telemetryBadges` e `actions` do topo
  - [x] Atualizar eyebrow para `PORTFÓLIO & COMPROVAÇÃO TÉCNICA` e título para `Casos de Reparação e Acabamento.`
  - [x] Atualizar descrição técnica de recuperação de vincos e tolerâncias
  - [x] Compactar aviso de Transparência Fotográfica
  - [x] Reduzir espaçamento vertical para a primeira comparação (`mt-8 sm:mt-10`)
- [x] **Fase 3: Refatoração de `/para-corretores` (`src/routes/para-corretores.tsx`)**
  - [x] Atualizar Hero com código `PAR.05 // RELACIONAMENTO TÉCNICO & SINISTROS`, coordenada `TOLEDO — PARANÁ | ATENDIMENTO PROFISSIONAL B2B` e título canônico
  - [x] Implementar seções: RELACIONAMENTO PROFISSIONAL (4 pilares), PRINCÍPIOS DE ATUAÇÃO (3 princípios) e CONEXÃO PROFISSIONAL (Bottom CTA)
  - [x] Atualizar asserção de código de rota em `src/test/awwwards-heroes-all-routes.test.tsx`
- [x] **Fase 4: Testes e Validação de Quality Gates**
  - [x] Criar suíte `src/test/ux-ui-consolidation-three-routes.test.tsx`
  - [x] Executar `bun run test` (100% de sucesso)
  - [x] Executar `bun run lint` (zero erros)
  - [x] Executar `bun run build` (build Nitro SSR concluído)
  - [x] Criar `reviews/REVIEW-043-refatoracao-ux-ui-servicos-trabalhos-corretores.md`
  - [x] Atualizar `PROJECT.md` e regenerar `docs/traceability-matrix.md`
