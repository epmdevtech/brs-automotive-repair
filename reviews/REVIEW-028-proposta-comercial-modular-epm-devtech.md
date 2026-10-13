# REVIEW-028 — Revisão da Proposta Comercial Modular EPM DevTech para BRS Reparações Automotivas

## Metadados

| Campo       | Valor                                                                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID          | `REVIEW-028`                                                                                                                                                           |
| Status      | Approved (Aprovado)                                                                                                                                                    |
| Data        | 13/10/2026                                                                                                                                                             |
| Responsável | Staff Software Engineer & Solutions Architect EPM DevTech                                                                                                              |
| Refs:       | SPEC: [`SPEC-028`](../specs/SPEC-028-proposta-comercial-modular-epm-devtech.md); TASK: [`TASK-028-01`](../tasks/TASK-028-01-proposta-comercial-modular-epm-devtech.md) |

---

## 1. Resumo da Entrega

Foi projetada, implementada e validada com sucesso a nova rota comercial exclusiva `/proposta/brs-reparacoes`, apresentando um portfólio completo de **6 módulos de software especializados para reparação automotiva**, desenvolvidos sob medida pela **EPM DevTech** para a **BRS Reparações Automotivas**.

A experiência comercial substitui a abordagem tradicional de proposta estática por uma experiência interativa, editorial e transparente, permitindo que a direção da oficina compreenda com clareza o valor de cada ferramenta, seus custos e limitações, e simule em tempo real as combinações mais assertivas para sua operação.

---

## 2. Escopo Entregue

1. **Abertura e Contexto Estratégico (Seções A e B):**
   - Hero personalizado com identificação discreta de autoria da EPM DevTech, referência canônica `brs-reparacoes`, validade e status comercial.
   - Diagnóstico estratégico com 6 objetivos claros focados no setor de reparação e estética automotiva.
2. **Catálogo de 6 Módulos Sob Medida (Seção C):**
   - **EPM Web** (R$ 2.490): Presença digital de alta fidelidade e autoridade regional.
   - **EPM Booking Auto** (R$ 3.990): Formulário estruturado de avaliação e triagem de agendamento.
   - **EPM CRM Auto** (R$ 4.990): Funil comercial de orçamentos e relacionamento com corretores de seguros.
   - **EPM Oficina** (R$ 7.490): Gestão de pátio, checklist de fotos e ordens de serviço digitais.
   - **EPM Connect** (A partir de R$ 1.990): Notificações automáticas via WhatsApp/SMS por etapa de reparo.
   - **EPM Insights** (R$ 2.490): Painel executivo de indicadores, ticket médio e volume por serviço.
   - Cada módulo explicita: problema que resolve, escopo-base incluído, exclusões fora do escopo, dependências e nota de custos recorrentes.
3. **Matriz Comparativa Responsiva (Seção D):**
   - Tabela analítica completa para desktop/tablet e cartões otimizados para telas móveis.
4. **5 Combinações / Pacotes Estratégicos (Seção E):**
   - Alternativas 1 a 5 com badges de maturidade digital e botão de seleção em 1 clique que atualiza instantaneamente o simulador de orçamento.
5. **Transparência em Infraestrutura e Custos Recorrentes (Seção F):**
   - Discriminação de custos de terceiros (Domínio .com.br no Registro.br, Hospedagem Cloud/CDN, Storage de fotos de OS, Provedor oficial WhatsApp API) e suporte sob demanda, garantindo titularidade da BRS e ausência de lock-in ou mensalidades obrigatórias ocultas.
6. **Ciclo de Execução em 9 Etapas (Seção H):**
   - Da apresentação à publicação oficial e capacitação, com destaque para a Manifestação de Interesse como próximo passo da BRS.
7. **Perguntas Frequentes (Seção I):**
   - 9 dúvidas comuns com respostas claras sobre escopo, pagamentos e integrações utilizando accordions acessíveis.
8. **Simulador em Tempo Real & Manifestação de Interesse (Seção J):**
   - Resumo dinâmico dos módulos selecionados com investimento total de implantação atualizado.
   - Modal Radix Dialog com prévia da mensagem gerada, botão de cópia rápida com feedback visual e envio direto por WhatsApp e E-mail.
9. **Roteamento e Acesso:**
   - Rota `/proposta/brs-reparacoes` ativa com cabeçalho `<meta name="robots" content="noindex, nofollow">`.
   - Portal `/proposta` atualizado com atalho proeminente para a proposta modular.

---

## 3. Conformidade com os Quality Gates

| Gate                    | Critério                                  | Resultado                                                                     |
| ----------------------- | ----------------------------------------- | ----------------------------------------------------------------------------- |
| **Testes Unitários**    | Vitest (`bun run test`)                   | **Aprovado** (173/173 testes passando, 24 arquivos)                           |
| **Linter & Formatação** | ESLint + Prettier (`bun run lint`)        | **Aprovado** (0 erros)                                                        |
| **Compilação SSR**      | Vite + Nitro (`bun run build`)            | **Aprovado** (Sucesso total, 0 falhas)                                        |
| **Testes E2E**          | Playwright (`e2e/proposal-route.spec.ts`) | **Aprovado** (3/3 testes passando em Desktop e Mobile)                        |
| **Evidência Visual**    | Screenshots fullPage                      | **Aprovado** (`modular-proposal-desktop.png` e `modular-proposal-mobile.png`) |

---

## 4. Decisões Arquiteturais e Mitigações

- **Prevenção de Hydration Mismatch (`client:525`):** A proposta modular não utiliza `<ScrollReveal>` inline nas seções, garantindo renderização 100% visível e estável no SSR do TanStack React Start / React 19.
- **Transparência de Preços Flexíveis:** O módulo EPM Connect e a Alternativa 5 ("Ecossistema Expandido") explicitam na interface e na mensagem pré-formatada o prefixo "A partir de", evitando qualquer ambiguidade comercial.
- **Fluxo de Contato Honesto:** Não há simulação de assinatura de contrato ou persistência invisível; o fechamento orienta a diretoria da BRS a alinhar escopo em reunião técnica antes de qualquer compromisso formal.
