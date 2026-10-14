# REVIEW-043 — Refatoração Global de UX/UI: Despoluição de CTAs em Serviços (/servicos), Foco em Casos em Trabalhos (/trabalhos) e Atualização Editorial B2B em Para Corretores (/para-corretores)

## 1. Sumário Executivo

- **SPEC Associada**: SPEC-043
- **TASK Associada**: TASK-043-01
- **Status do Review**: APROVADO
- **Data da Avaliação**: 2026-10-14
- **Avaliador**: Engenheiro Frontend Sênior & Lead UX/UI Designer

---

## 2. Validação dos Critérios de Aceitação

| Critério de Aceitação | Descrição | Status | Evidência |
| --- | --- | --- | --- |
| **AC-043-01** | Despoluição e Arquitetura de Conversão em `/servicos` | **APROVADO** | Âncoras `#funilaria-estrutural`, `#pintura-estufa` e `#martelinho-pdr` aplicadas com `scroll-mt-28`; botões duplicados "Solicitar avaliação" removidos dos 3 cards principais e substituídos por links inline contextuais para `/trabalhos?filtro=...`; Guia de Triagem transformado em rolagem suave interna via `useSmoothScroll`; cards de Estética Automotiva convertidos em fichas técnicas/educativas puras sem botões isolados; Bottom CTA Banner de Leva e Traz em Toledo-PR consolidado como único ponto focal de conversão da rota. |
| **AC-043-02** | Foco em Autoridade Técnica em `/trabalhos` | **APROVADO** | Mini-cards de telemetria e botão primário no topo do Hero removidos; eyebrow atualizado para `PORTFÓLIO & COMPROVAÇÃO TÉCNICA` e microcopy reescrita com foco em recuperação de vincos e padrão de fábrica; aviso de Transparência Fotográfica tornado compacto (`text-[11px]`, padding reduzido); espaçamento vertical encurtado (`pt-6 sm:pt-8`), trazendo a primeira comparação para a primeira dobra. |
| **AC-043-03** | Consolidação Editorial Canônica B2B em `/para-corretores` | **APROVADO** | Hero canônico com código `PAR.05 // RELACIONAMENTO TÉCNICO & SINISTROS`, coordenada `TOLEDO — PARANÁ | ATENDIMENTO PROFISSIONAL B2B`, título `Parceria técnica. Transparência operacional. Confiança em cada reparação.` e 2 ações (`/contato` com `audience=corretor` e telefone oficial `(45) 2035-9440`); seções "RELACIONAMENTO PROFISSIONAL" (4 pilares), "PRINCÍPIOS DE ATUAÇÃO" (Livre escolha, Documentação, Confiança sem alegações infundadas) e "CONEXÃO PROFISSIONAL" (Bottom CTA). |

---

## 3. Resumo dos Arquivos Alterados

- `specs/SPEC-043-refatoracao-ux-ui-servicos-trabalhos-corretores.md`: Especificação técnica aprovada.
- `tasks/TASK-043-01-refatoracao-ux-ui-servicos-trabalhos-corretores.md`: Rastreabilidade de execução.
- `src/routes/servicos/index.tsx`: Âncoras locais, link contextual de portfólio, smooth scroll no Guia de Triagem, remoção de botões na Estética e Bottom CTA Banner de Leva e Traz.
- `src/components/brs/project-gallery.tsx`: Suporte a `className` customizado para controle de respiro vertical.
- `src/routes/trabalhos.tsx`: Hero limpo, microcopy autoral, aviso compacto de transparência e aproximação vertical da galeria.
- `src/routes/para-corretores.tsx`: Cópia canônica institucional B2B, 4 pilares de sinistros, 3 princípios de integridade e banner de conexão profissional.
- `src/test/awwwards-heroes-all-routes.test.tsx`: Atualização do código esperado de rota para corretores.
- `src/test/ux-ui-consolidation-three-routes.test.tsx`: Suíte de testes dedicada cobrindo os 3 critérios de aceitação.
