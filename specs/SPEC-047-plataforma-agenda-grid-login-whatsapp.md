# SPEC-047: Plataforma Integrada de Gestão de Agenda, Grid Diária por Mecânico, Autenticação e WhatsApp

## Status

- **Status**: APROVADO
- **Data**: 2026-10-15
- **Autor**: Arquiteto Especialista em Agendamento & TanStack Fullstack
- **Task Ref**: TASK-047-01
- **Spec Ref**: SPEC-047

---

## 1. Contexto e Motivação

Com base no layout canônico demonstrado nos benchmarks operacionais (`Captura de tela de 2026-10-15 09-37-25.png` e `09-37-37.png`), a BRS Reparações Automotivas requer uma experiência de gestão operacional completa e profissional.

A plataforma administrativa precisa de:

1. **Portal de Login Seguro e Demonstrativo (`/agendamentos`)**:
   - Tela de login com preenchimento em 1 clique de credenciais demo (`admin@brsreparacoes.com.br` / `demo123`).
   - Gestão de sessão no navegador com proteção contra acessos não autorizados.
2. **Plataforma de Agenda Visual em Grade (Grid Horário x Profissionais/Mecânicos)**:
   - Colunas divididas pelos especialistas técnicos da BRS:
     - Bruno (Fundador e Avaliador Técnico / Funilaria);
     - Técnico Martelinho de Ouro (Especialista PDR);
     - Técnico Pintura em Estufa (Colorimetria e Acabamento).
   - Linhas temporais de cada turno operacional (08:00 às 18:00), com sinalização explícita de _"Fora do expediente"_ nos intervalos de almoço (12:00 às 13:30).
   - Slots livres com botão `+ Livre`, permitindo agendamento rápido direto na baia/horário desejado.
   - Slots ocupados com cards de atendimento ricos: Protocolo da OS, Cliente, Veículo (Marca, Modelo, Placa), Serviço e botão direto para **Conversar no WhatsApp**.
3. **Métricas Rápidas & Visões Integradas**:
   - KPIs: Total de Atendimentos, Confirmados, Leva e Traz / Pendentes, Profissionais Ativos.
   - Alternância de visão: Dia (Grid), Semana, Lista e Solicitações (Leva e Traz).
   - Bloqueio de horários (`🚫 Bloquear Período`) e gestão de expediente.

---

## 2. Escopo Técnico e Arquitetura

```text
src/features/booking/
├── domain/
│   ├── auth.ts              # Gerenciador de sessão, credenciais demo e guarda de rotas
│   ├── blocks.ts            # Bloqueios temporais manuais (férias, treinamento, manutenção)
│   └── ... (types, availability, time, phone, intake, schemas)
├── ui/
│   └── admin/
│       ├── admin-login.tsx       # Tela de login estilizada idêntica à referência visual
│       ├── admin-grid-view.tsx   # Grid diária Horário x Técnicos com cards e ações
│       ├── block-slot-dialog.tsx # Modal de bloqueio de horário por profissional
│       └── manual-booking-dialog.tsx # Modal de abertura rápida de agendamento na baia
```

---

## 3. Critérios de Aceitação (AC)

- **AC-047-01**: A rota `/agendamentos` deve exibir a tela de Login Administrativo com opção de preenchimento demo em 1 clique (`admin@brsreparacoes.com.br` / `demo123`).
- **AC-047-02**: Ao autenticar, a plataforma deve carregar a barra superior com sincronização Web Locks, métricas de KPI e alternador de visões (Dia, Semana, Lista, Solicitações).
- **AC-047-03**: A visão de Dia deve exibir a grade matricial completa de Horários (linhas) por Profissionais Técnicos da BRS (colunas), destacando slots livres (`+ Livre`), intervalos de almoço (_Fora do expediente_) e slots ocupados.
- **AC-047-04**: Cards de agendamento na grade devem exibir o protocolo da Pré-OS, dados do veículo, modalidade Leva e Traz e botão para **Conversar no WhatsApp** com o cliente.
- **AC-047-05**: Deve permitir bloquear períodos (`Bloquear Período`) e criar agendamentos manuais em slots livres.
- **AC-047-06**: Validação rigorosa via Vitest, zero erros de ESLint e build compilado com sucesso.
