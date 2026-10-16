# TASK-066-01 — Rota de Execução e Ingestão de Briefing Multinicho EPM DevTech

| Campo       | Valor                                                      |
| ----------- | ---------------------------------------------------------- |
| ID          | `TASK-066-01`                                              |
| SPEC        | `SPEC-066`                                                 |
| Status      | Completed                                                  |
| Data        | 2026-10-16                                                 |
| Responsável | Engenheiro de Integrações & Arquiteto Frontend EPM DEVTECH |

---

## 1. Objetivo

Criar a rota confidencial `/briefing` no TanStack Router com interface moderna Awwwards Dark Industrial para execução, validação, persistência e exportação determinística do briefing do cliente (com suporte nativo ao nicho de reparação automotiva da BRS), sem inclusão em menus públicos de navegação, respeitando estritamente o Universal SDD.

---

## 2. Passos de Execução

1. **Módulo de Domínio e Schemas (`src/lib/briefing.ts`)**:
   - Implementar schemas Zod estritos e tipos TypeScript: `BriefingCompletoSchema`, `ItemServicoSchema`, `MembroEquipeSchema`, `UnidadeAtendimentoSchema`, etc.
   - Implementar validador de CNPJ canônico.
   - Implementar cálculo de contraste WCAG 2.2 AA (`getContrastRatio`, `isWCAGCompliant`).
   - Implementar gerador de configuração de agendamento `buildBookingConfig(dados, nomeNegocio)`.
   - Implementar seed canônico padrão da BRS (`brsDefaultBriefing`).
   - Implementar gerador de mensagem estruturada para envio de briefing `generateBriefingSummaryMessage`.

2. **Componentes da Interface de Execução do Briefing (`src/components/brs/briefing/`)**:
   - `briefing-stepper.tsx`: Navegação lateral ou superior entre as 9 etapas com progresso percentual e contagem de pendências.
   - `briefing-step-contratante.tsx`: Formulário da Etapa 1 (Razão Social, CNPJ, Contatos, Endereço de Faturamento).
   - `briefing-step-identidade.tsx`: Formulário da Etapa 2 (Cores Primária e Secundária com visualizador e badge WCAG em tempo real, Logo, Referências).
   - `briefing-step-equipe.tsx`: Formulário da Etapa 3 (Membros da equipe, especialidades automotivas, certificações).
   - `briefing-step-servicos.tsx`: Formulário da Etapa 4 (Catálogo de serviços, tempos de execução, intervalos e regras de preços).
   - `briefing-step-agenda.tsx`: Formulário da Etapa 5 (Regras de agendamento de box, antecedência mínima/máxima, exigência de veículo/placa/sintoma, emergência de guincho).
   - `briefing-step-unidades.tsx`: Formulário da Etapa 6 (Unidades físicas, acessibilidade, estacionamento).
   - `briefing-step-conteudo.tsx`: Formulário da Etapa 7 (Missão, diferenciais, público-alvo, cidades atendidas, FAQ).
   - `briefing-step-tecnico.tsx`: Formulário da Etapa 8 (Domínio, sistema de gestão, prazos).
   - `briefing-step-revisao.tsx`: Formulário da Etapa 9 (Revisão de pendências, botões de download `briefing-completo.json` e `booking-config.json`, cópia para clipboard e envio via canal de atendimento).
   - `briefing-container.tsx`: Container mestre com estado reativo, persistência em `localStorage`, importação e exportação de JSON.

3. **Rota TanStack Router (`src/routes/briefing.tsx`)**:
   - Registrar rota `/briefing` com `buildRouteHead({ noindex: true, title: "Portal de Briefing | EPM DevTech & BRS" })`.
   - Garantir que não seja adicionada a `primaryNavigation` em `src/lib/brs.ts` nem em nenhum menu do site.

4. **Suíte de Testes Automatizados**:
   - `src/test/briefing-domain.test.ts`: Testar validações Zod, cálculo de contraste WCAG, formatação de CNPJ, mapeamento de `buildBookingConfig`.
   - `src/test/briefing-route.test.tsx`: Testar isolamento da rota fora do menu, renderização do container de briefing, navegação entre abas, restauração de dados da BRS e exportação.

5. **Quality Gates e Auditoria**:
   - Executar `bun run test` (todos os testes passando: 54 arquivos e 390 testes).
   - Executar `bun run lint` (ESLint sem erros, 0 errors).
   - Executar `bun run build` (build do Vite + SSR passando em 1.70s).
   - Gerar Relatório de Ingestão e Handover.

---

## 3. Evidências de Validação

- `bun vitest run src/test/briefing-domain.test.ts src/test/briefing-route.test.tsx`: 2 arquivos, 14 testes passando.
- `bun run test`: 54 arquivos de teste, 390 testes passando (100% de sucesso).
- `bun run lint`: 0 erros no ESLint.
- `bun run build`: Chunks `briefing-*.js` cliente e SSR gerados com sucesso pelo TanStack Start.
