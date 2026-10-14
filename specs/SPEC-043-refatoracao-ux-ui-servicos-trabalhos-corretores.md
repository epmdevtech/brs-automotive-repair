# SPEC-043 — Refatoração Global de UX/UI: Despoluição de CTAs em Serviços (/servicos), Foco em Casos em Trabalhos (/trabalhos) e Atualização Editorial B2B em Para Corretores (/para-corretores)

## 1. Metadados e Contexto

- **ID da SPEC**: SPEC-043
- **Título**: Refatoração Global de UX/UI: Despoluição de CTAs em Serviços (/servicos), Foco em Casos em Trabalhos (/trabalhos) e Atualização Editorial B2B em Para Corretores (/para-corretores)
- **Status**: APROVADO
- **Data de Criação**: 2026-10-14
- **Autor / Agente**: Antigravity (Universal SDD)
- **Escopo**:
  - `src/routes/servicos/index.tsx`
  - `src/routes/trabalhos.tsx`
  - `src/routes/para-corretores.tsx`
  - `src/test/ux-ui-consolidation-three-routes.test.tsx`
  - `src/test/awwwards-heroes-all-routes.test.tsx`
- **Requisitos Vinculados**: PROMPT DE ENGENHARIA — Refatoração de CTAs e Navegação (/servicos), Casos e Microcopy (/trabalhos) e Cópia Canônica B2B (/para-corretores)

---

## 2. Motivação e Problemas de Negócio

1. **CTA Fatigue em `/servicos`**: A rota de serviços acumulava botões duplicados em cada card ("Solicitar avaliação" + "Conhecer"), CTAs externos redundantes no Guia de Triagem e botões individuais de avaliação em cada card de Estética Automotiva, competindo entre si e com o Header fixo.
2. **Redundância e Distração em `/trabalhos`**: O topo da galeria de trabalhos exibia mini-cards de instrução da ferramenta interativa e botão prematuro de avaliação antes de qualquer exibição de caso real, além de um disclaimer de transparência com altura excessiva.
3. **Alinhamento Editorial B2B em `/para-corretores`**: A rota de corretores e sinistros necessitava da consolidação da cópia técnica canônica, reforçando independência técnica, respeito à livre escolha da oficina pelo segurado, documentação de avarias e canal direto para profissionais do setor.

---

## 3. Critérios de Aceitação (AC)

- **AC-043-01 (Despoluição e Arquitetura de Conversão em `/servicos`)**:
  - Cada um dos 3 cards de especialidades técnicas (`funilaria`, `pintura-automotiva`, `martelinho-de-ouro`) não possui botão primário "Solicitar avaliação", contendo apenas link contextual inline para o portfólio (`/trabalhos?filtro=...`) com hover suave.
  - O Guia de Triagem utiliza links de rolagem suave (`useSmoothScroll`) apontando para as âncoras locais correspondentes na mesma página (`#martelinho-pdr`, `#funilaria-estrutural`, `#pintura-estufa`), com compensação `scroll-mt-28`.
  - Os 3 cards de Estética Automotiva funcionam como fichas técnicas/educativas, sem botões individuais de avaliação.
  - A conversão primária da página fica concentrada no Bottom CTA Banner de Leva e Traz em Toledo-PR com chamada direta para avaliação técnica.

- **AC-043-02 (Foco em Autoridade Técnica em `/trabalhos`)**:
  - Remoção dos mini-cards de telemetria e do botão de CTA do topo de `/trabalhos`.
  - Eyebrow padronizado (`PORTFÓLIO & COMPROVAÇÃO TÉCNICA`) e microcopy orientada à autoridade técnica e recuperação de tolerâncias de fábrica.
  - Disclaimer de transparência fotográfica compacto (`text-[11px]`, padding reduzido).
  - Espaçamento vertical encurtado (`mt-8 sm:mt-10`) para permitir visualização da primeira comparação interativa já na primeira dobra de rolagem.

- **AC-043-03 (Consolidação Editorial Canônica B2B em `/para-corretores`)**:
  - Hero com código `PAR.05 // RELACIONAMENTO TÉCNICO & SINISTROS`, coordenada `TOLEDO — PARANÁ | ATENDIMENTO PROFISSIONAL B2B` e título `Parceria técnica. Transparência operacional. Confiança em cada reparação.`.
  - Ações do Hero: "Conversar com a equipe técnica" (`/contato?audience=corretor`) e telefone oficial `(45) 2035-9440`.
  - Seções temáticas: "RELACIONAMENTO PROFISSIONAL" (4 pilares técnicos), "PRINCÍPIOS DE ATUAÇÃO" (Livre escolha, Documentação, Confiança sem falsos credenciamentos) e "CONEXÃO PROFISSIONAL" (Bottom CTA com agendamento e visita).

---

## 4. Decisões de Design e Qualidade

- **Universal SDD**: Zero classes CSS órfãs, preservação de `strictPort: 5210`, 100% de aprovação em testes automatizados e zero erros de linter.
- **Acessibilidade e Usabilidade**: Todas as âncoras locais preservam anéis de foco, tap target mínimo de 44px em botões e navegação acessível por teclado.
