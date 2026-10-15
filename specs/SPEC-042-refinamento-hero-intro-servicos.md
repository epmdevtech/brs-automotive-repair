# SPEC-042 — Refinamento Visual da Hero/Intro de Serviços (/servicos), Remoção de Mini-Cards Redundantes e Otimização de CTA

## 1. Metadados e Contexto

- **ID da SPEC**: SPEC-042
- **Título**: Refinamento Visual da Hero/Intro de Serviços (/servicos), Remoção de Mini-Cards Redundantes e Otimização de CTA
- **Status**: APROVADO
- **Data de Criação**: 2026-10-14
- **Autor / Agente**: Antigravity (Universal SDD)
- **Escopo**: `src/routes/servicos/index.tsx`, `src/components/brs/page-hero.tsx`, `src/test/servicos-intro-refinement.test.tsx`
- **Requisitos Vinculados**: PROMPT DE ENGENHARIA — REFINAMENTO UX/UI DO SITE BRS (Página de Serviços /servicos)

---

## 2. Motivação e Problema de Negócio

Na página de Serviços (`/servicos`), a seção Hero/Intro apresentava redundância visual e informacional:

1. Uma linha de 3 mini-cards compactos de resumo dos serviços ("Funilaria Estrutural", "Pintura em Estufa", "Martelinho de Ouro") que duplicava o conteúdo detalhado logo abaixo nas faixas editoriais da mesma página.
2. Dois botões inferiores onde o botão primário preenchido ("SOLICITAR AVALIAÇÃO TÉCNICA ↗") competia visualmente com o botão de avaliação já fixo no Header da aplicação.
3. Elementos e imports desnecessários (`Wrench`, `Paintbrush`, `Car` e `serviceIcons`) que geravam código inútil e ruído de manutenção.

---

## 3. Critérios de Aceitação (AC)

- **AC-042-01 (Remoção dos Mini-Cards Resumo)**:
  - A rota `/servicos` não deve renderizar os mini-cards de telemetria/resumo ("Funilaria Estrutural", "Pintura em Estufa", "Martelinho de Ouro") no Hero/Intro.
  - Eliminar qualquer elemento órfão ou container de grade decorativo associado.

- **AC-042-02 (Otimização do CTA para Exploração de Portfólio/Resultados)**:
  - O CTA primário de avaliação ("Solicitar avaliação técnica") é removido do Hero de `/servicos`, preservando o Header como ponto focal dominante de conversão comercial.
  - O botão de exploração ("Ver trabalhos concluídos") é preservado como CTA exclusivo em estilo outline/secondary (`.btn--secondary`), apontando para `/trabalhos`.
  - A seção detalhada de serviços abaixo recebe `id="lista-servicos"`, e `PageHero` ganha suporte nativo a rolagem suave via `useSmoothScroll` para quaisquer âncoras locais `#`.

- **AC-042-03 (Espaçamento, Hierarquia Tipográfica e Limpeza de Código)**:
  - Espaçamento vertical entre o parágrafo descritivo e a ação restante ajustado para `mt-6 sm:mt-8`.
  - Transição para a seção detalhada de serviços configurada com respiro adequado (`py-16 lg:py-20`).
  - Remoção total de imports não utilizados (`Wrench`, `Paintbrush`, `Car`) e do mapa `serviceIcons`.

---

## 4. Arquitetura e Decisões de Design

1. **`src/routes/servicos/index.tsx`**:
   - Remover `telemetryBadges` de `<PageHero>`.
   - Limpar lista de `actions` para manter apenas `Ver trabalhos concluídos` (`variant: "secondary"`, `to: "/trabalhos"`).
   - Adicionar `id="lista-servicos"` e `py-16 lg:py-20` na seção subsequente de especialidades.
   - Remover mapa não utilizado `serviceIcons` e imports órfãos.

2. **`src/components/brs/page-hero.tsx`**:
   - Ajustar espaçamento condicional em `PageHero`: quando `telemetryBadges` estiver ausente, `descRef` usa `mb-0` e `actionsRef` usa `mt-6 sm:mt-8`.
   - Implementar suporte a smooth scrolling em âncoras locais `#` nas ações via hook `useSmoothScroll`.
   - Ajustar container de ações com `gap-4` condicional (apenas quando houver múltiplos botões).

3. **Qualidade e Testabilidade**:
   - Criar suíte de testes `src/test/servicos-intro-refinement.test.tsx` cobrindo AC-042-01, AC-042-02 e AC-042-03.
