# TASK-055-01: Implementação de Autenticação Split-Screen (/login) e Agenda Operacional (/agendamentos)

## Metadados

| Campo       | Valor                                                                                    |
| ----------- | ---------------------------------------------------------------------------------------- |
| Task ID     | TASK-055-01                                                                              |
| Spec Ref    | SPEC-055                                                                                 |
| Título      | Implementação de Autenticação Split-Screen (/login) e Agenda Operacional (/agendamentos) |
| Status      | Concluído                                                                                |
| Data        | 2026-10-15                                                                               |
| Responsável | Staff Product Designer & Engenheiro Front-end Sênior                                     |
| Módulo      | `features/booking` & `routes/login`                                                      |

---

## 1. Escopo de Trabalho

1. **Módulo 1: Autenticação Administrativa**:
   - Criada rota dedicada `src/routes/login.tsx` com validação de search params `?redirect=/agendamentos`.
   - Implementado `AuthSplitLayout` com divisão desktop (≥1024px) e painel institucional escuro da marca BRS.
   - Implementado `LoginForm` com validação síncrona Zod, Caps Lock acessível, alternador de senha com `aria-pressed`, loading state e diálogo de recuperação de senha.
   - Implementado `DemoBanner` compacto de ~40px com popover de credenciais para não poluir o layout e botão "Preencher dados demo em 1 clique".
   - Rota `src/routes/agendamentos.tsx` protegida com redirecionamento para `/login?redirect=/agendamentos` e logout redirecionando para `/login`.

2. **Módulo 2: Agenda Operacional Despoluída**:
   - Implementado `StatusTabs` unificando KPIs e filtros em uma única barra compacta com contadores integrados (altura ≤ 56px).
   - Implementado `ProcessStepper` / mini-stepper horizontal nos cards de agendamento com as 5 etapas da oficina (`Recebido` → `Desmontagem` → `Reparo` → `Pintura` → `Entrega`).
   - Implementada visão em `Quadro` (Kanban somente leitura) na barra de visualizações (`Dia` | `Lista` | `Quadro` | `Leva e Traz`).
   - Cabeçalho otimizado para caber na primeira dobra visual em resoluções 1080p.

3. **Validação & Quality Gates**:
   - Suíte completa Vitest: 45/45 arquivos passaram (302/302 testes verdes).
   - Linter ESLint: 0 erros.
   - Build Vite + Nitro SSR: compilação com sucesso total em 1.87s.
   - Matriz de rastreabilidade SDD gerada e sincronizada.

---

## 2. Checklists de Validação

- [x] Layout Split-Screen no desktop (≥1024px) e card centralizado no mobile.
- [x] Validação com Zod, loading acessível, erro acessível (`role="alert"`) e detecção de Caps Lock.
- [x] Banner de demo compacto de 1 linha preservando compatibilidade de testes.
- [x] Rota `/login` dedicada e redirecionamento bidirecional com `/agendamentos`.
- [x] Barra unificada de abas com contadores substituindo os 6 cards de KPI e pílulas duplicadas.
- [x] Mini-stepper horizontal de processo automotivo nos cards.
- [x] Visão Kanban em Quadro somente leitura implementada.
- [x] 100% dos testes verdes e Quality Gates aprovados.
