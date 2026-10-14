# REVIEW-042 — Refinamento Visual da Hero/Intro de Serviços (/servicos), Remoção de Mini-Cards Redundantes e Otimização de CTA

## 1. Sumário Executivo

- **SPEC Associada**: SPEC-042
- **TASK Associada**: TASK-042-01
- **Status do Review**: APROVADO
- **Data da Avaliação**: 2026-10-14
- **Avaliador**: Engenheiro Frontend Sênior & Especialista em UX/UI

---

## 2. Validação dos Critérios de Aceitação

| Critério de Aceitação | Descrição | Status | Evidência |
| --- | --- | --- | --- |
| **AC-042-01** | Remoção total dos 3 mini-cards compactos de resumo no Hero de `/servicos` | **APROVADO** | `telemetryBadges` removido de `<PageHero>` em `src/routes/servicos/index.tsx`; nenhum card duplicado no Hero; validado por teste automatizado em `src/test/servicos-intro-refinement.test.tsx`. |
| **AC-042-02** | Otimização do CTA do Hero para exploração de portfólio e resultados | **APROVADO** | Botão primário "Solicitar avaliação técnica" removido do Hero para evitar concorrência com o Header fixo; ação exclusiva "Ver trabalhos concluídos" mantida em estilo `.btn--secondary` com tap target mínimo de 44px; seção subsequente marcada com `id="lista-servicos"` e respiro `py-16 lg:py-20`. |
| **AC-042-03** | Espaçamento, hierarquia tipográfica e limpeza de código | **APROVADO** | `PageHero` ajusta automaticamente margem para `mt-6 sm:mt-8` na ausência de telemetria; suporte a smooth scrolling via `useSmoothScroll` integrado para âncoras locais; remoção completa de imports não utilizados (`Wrench`, `Paintbrush`, `Car`) e do mapa `serviceIcons`. |

---

## 3. Resumo dos Arquivos Alterados

- `specs/SPEC-042-refinamento-hero-intro-servicos.md`: Especificação técnica formal.
- `tasks/TASK-042-01-refinamento-hero-intro-servicos.md`: Rastreabilidade de execução.
- `src/components/brs/page-hero.tsx`: Ajuste responsivo de margens, integração de `useSmoothScroll`, tap target mínimo de 44px e atributo semântico `data-page-hero-actions`.
- `src/routes/servicos/index.tsx`: Remoção de `telemetryBadges`, de CTA duplicado de avaliação, inclusão de `id="lista-servicos"`, ajuste de respiro `py-16 lg:py-20` e limpeza de imports.
- `src/test/servicos-intro-refinement.test.tsx`: Suíte de testes dedicada cobrindo os 3 critérios de aceitação.
