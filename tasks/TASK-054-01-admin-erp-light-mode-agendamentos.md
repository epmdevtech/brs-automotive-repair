# TASK-054-01: Redesenho do Painel Administrativo / ERP BRS em Light Mode High-End

## Metadados

| Campo       | Valor                                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| Task ID     | TASK-054-01                                                                                                      |
| Spec Ref    | SPEC-054                                                                                                         |
| Título      | Redesenho do Painel Administrativo / ERP BRS em Light Mode High-End (Linear / Vercel Dashboard / Apple Pro Apps) |
| Status      | Concluído                                                                                                        |
| Data        | 2026-10-15                                                                                                       |
| Responsável | Engenheiro Front-end Sênior / Product Designer                                                                   |
| Módulo      | `features/booking`                                                                                               |

---

## 1. Escopo de Trabalho

1. **Refatorar `AdminLogin`**:
   - Layout Light Mode clean com fundo off-white (`bg-slate-50` / `#F8F9FA`).
   - Card central branco (`bg-white`) com borda sólida 1px (`border-slate-200`).
   - Inputs refinados com foco suave e card de credenciais de demonstração limpo.
2. **Refatorar `AdminGridView`**:
   - Fundo principal da aplicação em off-white sutil (`#F8F9FA`) e canvas branco.
   - Cabeçalho e filtros em superfícies brancas com bordas 1px `border-slate-200`.
   - 6 KPIs superiores em cards brancos minimalistas, métricas em preto `#111827` e badges de status suaves.
   - Grade de técnicos em formato de tabela de agendamentos profissional: cabeçalho com fundo leve `#F9FAFB`, linhas de divisão 1px `border-slate-200`, slots com hover sutil `+ Livre`.
   - Cards de agendamento compactos brancos com borda lateral de 3px indicando o status operacional.
   - Refatoração das visões em Lista e Leva e Traz no mesmo padrão claro e sóbrio.
3. **Refatorar `CustomerProcessDialog` e `RepairTimeline`**:
   - Modal em fundo branco com borda sólida 1px.
   - Stepper horizontal linear de 6 etapas com linha contínua, checkmarks verdes minimalistas para etapas concluídas, etapa ativa em destaque e futuras translúcidas.
   - Apresentação de metadados técnicos e auditoria em tabela limpa Chave / Valor.
   - Ação secundária de WhatsApp elegante e integrada.
4. **Harmonizar diálogos operacionais**:
   - `ManualBookingDialog` e `BlockSlotDialog` em superfícies brancas e bordas neutras.
5. **Quality Gates & Rastreabilidade**:
   - Testes automatizados Vitest (100% de sucesso).
   - ESLint e Prettier (zero erros/warnings).
   - Compilação Vite + SSR Nitro.
   - Atualização da matriz de rastreabilidade SDD.

---

## 2. Checklists de Validação

- [x] Light Mode aplicado no login, cabeçalhos, filtros e grade de técnicos.
- [x] Fontes sans-serif neutras em títulos e rótulos; mono reservada a códigos, horários e placas.
- [x] Cards de agendamento compactos com borda lateral de status.
- [x] Stepper horizontal linear com nós numerados e checkmarks sutis.
- [x] Metadados de auditoria em tabela estruturada Chave / Valor.
- [x] Ação de WhatsApp sóbria e integrada.
- [x] Quality gates aprovados e matriz de rastreabilidade atualizada.
