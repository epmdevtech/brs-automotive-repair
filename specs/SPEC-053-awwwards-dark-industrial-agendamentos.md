# SPEC-053: Redesenho Visual Awwwards Dark Industrial da Rota de Agendamentos

## Metadados

| Campo       | Valor                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------- |
| Spec ID     | SPEC-053                                                                                           |
| Título      | Redesenho Visual Awwwards Dark Industrial para o Painel de Agendamentos e Gestão de Reparação BRS  |
| Status      | Aprovado                                                                                           |
| Data        | 2026-10-15                                                                                         |
| Autor       | Staff Product Designer & Engenheiro de Software Sênior                                             |
| Módulo      | `features/booking`                                                                                 |
| Issue / Ref | Awwwards Site of the Day Standard • Refactor Dark Industrial High-Contrast da Rota `/agendamentos` |

---

## 1. Contexto e Diagnóstico

O painel de agendamentos (`/agendamentos`), composto por tela de autenticação administrativa (`AdminLogin`), matriz de técnicos (`AdminGridView`) e modal de detalhe/processo do cliente (`CustomerProcessDialog`), apresentava um aspecto genérico, com excesso de tons pastéis claros e componentes arredondados típicos de geração padrão.

O objetivo desta especificação é elevar toda a experiência visual da rota `/agendamentos` ao nível de excelência editorial e precisão mecânica preconizado no manual **Awwwards Site of the Day** (`awwwards/SKILL.md`), mantendo rigorosamente 100% da lógica funcional, persistência local, controle de estados, abas operacionais e integridade dos testes automatizados.

---

## 2. Pilares de Design e Arquitetura Visual (Awwwards Standard)

### 2.1 Direção de Arte: Aesthetic Dark Premium & Engenharia Automotiva

1. **Paleta de Superfícies (Chassis Dark Mode)**:
   - Fundo base estrutural: Grafite profundo / Preto de chassis (`#0B0B0C`).
   - Cards elevados e painéis de controle: Grafite industrial acetinado (`#121214`).
   - Subcamadas e inputs: Grafite técnico (`#18181B`).
   - Separadores e bordas lineares: Fio de alta precisão 1px (`#1F1F23`), dispensando sombras genéricas borradas.
   - Destaque hover e linhas ativas: `#2E2E33`.

2. **Acentos Semânticos Industriais de Alto Contraste**:
   - **Em Andamento (`CONFIRMED`)**: Laranja Metálico / Amber Industrial (`#FF5A00`), com badge `bg-[#FF5A00]/10 border-[#FF5A00]/30 text-[#FF7A29]`.
   - **Concluídos (`COMPLETED`)**: Verde Ácido / Precision Green (`#00E599`), com badge `bg-[#00E599]/10 border-[#00E599]/30 text-[#00E599]`.
   - **Abertos (`PENDING`)**: Ciano Elétrico / Sky Técnico (`#38BDF8`), com badge `bg-[#38BDF8]/10 border-[#38BDF8]/30 text-[#38BDF8]`.
   - **Fechados (`NO_SHOW`)**: Carbono Fosco / Neutral Técnico (`#71717A`), com badge `bg-[#71717A]/10 border-[#71717A]/30 text-[#A1A1AA]`.
   - **Cancelados (`CANCELLED`)**: Carmesim de Alerta (`#EF4444`), com badge `bg-[#EF4444]/10 border-[#EF4444]/30 text-[#F87171]`.
   - **Gatilho WhatsApp**: Mantém autenticidade da marca (`#25D366`), com alto contraste, affordance tátil imediata e texto branco puro.

### 2.2 Tipografia: Visual Editorial e Registro Técnico de Fábrica

1. **Códigos de Chassis / Ordens de Serviço**:
   - Identificadores como `#BRS-8415` ganham tratamento gráfico similar a plaquetas de numeração de chassis automotivo: tipografia monoespaçada (`font-mono`), caixa alta, tracking expandido (`tracking-wider` / `tracking-widest`), contrastando com fundo escuro.
2. **Horários e Telemetria**:
   - Horários (`08:00`, `09:00`), datas e carimbos de auditoria formatados em `font-mono` com espaçamento preciso e cor metálica.
3. **Títulos e Métricas**:
   - Títulos em `font-display` com tracking editorial negativo (`tracking-tight`), e valores dos KPIs em exibição proeminente.

### 2.3 Refatoração da Matriz de Agenda e Linha do Tempo

1. **Agenda dos Técnicos (Timeline de Engenharia)**:
   - Substituição de caixas pesadas por divisórias lineares de 1px (`#1F1F23`).
   - Horários na coluna lateral com acabamento técnico.
   - Slots livres renderizados com borda técnica pontilhada/tracejada (`border-dashed border-zinc-800 hover:border-zinc-600 bg-transparent hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-200`).
   - Cards de atendimento com fundo escuro de alto contraste, borda sutil e acento lateral de status.
2. **Modal de Processo do Cliente & Linha do Tempo**:
   - Substituição de caixas volumosas infantis por uma esteira de progresso linear técnica com trilhos condutores e indicadores luminosos (dots acesos para concluídos/ativos, dots apagados para pendentes).
   - Agrupamento de metadados secundários repetitivos ("Cadastrado em...", "Idempotência", logs técnicos de evento) em seção retrátil / expansível discreta para despoluir a visualização primária da OS.
3. **Tela de Login Administrativo**:
   - Redesenho completo para o tema dark industrial, com cartão de comando centralizado em `#121214`, moldura de precisão 1px `#1F1F23`, formulário escuro e botão de preenchimento demo com acento industrial.

---

## 3. Arquivos Envolvidos

- `src/features/booking/ui/admin/admin-login.tsx`: Redesenho dark industrial da tela de login.
- `src/features/booking/ui/admin/admin-grid-view.tsx`: Redesenho dark premium da grade, cabeçalho, KPIs, filtros, lista e visão Leva e Traz.
- `src/features/booking/ui/admin/customer-process-dialog.tsx`: Redesenho dark do modal, esteira de progresso, seção retrátil de metadados e diálogo de cancelamento.
- `src/features/booking/ui/admin/repair-timeline.tsx`: Esteira de progresso linear técnica com indicadores luminosos e trilhos conectores.
- `src/features/booking/ui/admin/manual-booking-dialog.tsx` e `block-slot-dialog.tsx`: Harmonização das janelas modais com o tema escuro.
- `src/features/booking/ui/status-badge.tsx`: Suporte a badges de alto contraste para o tema dark industrial.

---

## 4. Critérios de Aceite e Quality Gates

- [x] O painel adota fundo escuro profundo (`#0B0B0C`, `#121214`) com bordas finas de 1px (`#1F1F23`).
- [x] IDs de protocolo aparecem com destaque tipográfico monoespaçado como códigos industriais de chassi.
- [x] A esteira de linha do tempo do reparo utiliza visual técnico de engenharia com pontos luminosos e divisores lineares.
- [x] Metadados secundários repetitivos estão organizados em área técnica expansível/limpa.
- [x] O botão de WhatsApp preserva sua identidade visual e legibilidade (`#25D366`).
- [x] Nenhuma funcionalidade de agendamento, mudança de status, filtros ou persistência é quebrada.
- [x] 100% dos testes unitários e de integração passam (`bun run test`).
- [x] Linter e compilação passam sem qualquer advertência ou erro (`bun run lint`, `bun run build`).
