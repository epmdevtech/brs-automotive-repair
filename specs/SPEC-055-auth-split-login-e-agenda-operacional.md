# SPEC-055: Arquitetura UX/UI de Autenticação Split-Screen e Agenda Operacional BRS

## Metadados

| Campo       | Valor                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| Spec ID     | SPEC-055                                                                                                          |
| Título      | Arquitetura UX/UI de Autenticação Split-Screen (/login) e Agenda Operacional Despoluída (/agendamentos)           |
| Status      | Aprovado                                                                                                          |
| Data        | 2026-10-15                                                                                                        |
| Autor       | Staff Product Designer & Engenheiro Front-end Sênior                                                              |
| Módulo      | `features/booking` & `routes/login`                                                                               |
| Issue / Ref | Split Screen Login com painel institucional, Tabs de Status unificadas, Mini-stepper de reparo e Visão Kanban BRS |

---

## 1. Contexto e Diagnóstico

A interface administrativa do BRS Reparações apresentava duas oportunidades críticas de otimização operacional e de produto:

1. **Autenticação Administrativa (`/login` e `AdminLogin`)**:
   - A senha demo era repetida 3 vezes na tela.
   - O card de login em telas desktop (≥1024px) deixava laterais vazias e o bloco demonstrativo empurrava o formulário para baixo.
   - Faltavam feedback de loading assíncrono, validação com formulário canônico, detecção de Caps Lock e proteção de rota via query param `?redirect=`.

2. **Agenda dos Técnicos (`/agendamentos` e `AdminGridView`)**:
   - Duplicação de dados entre os 6 cards de KPI e a barra de pílulas de filtro logo abaixo.
   - ~250px de altura de cabeçalhos empurravam a grade horária para fora da primeira dobra em 1080p.
   - O status era puramente declarativo sem indicar o estágio do processo de oficina (Recebido → Desmontagem → Reparo → Pintura → Entrega).
   - Ausência de uma visão em Quadro (Kanban) para acompanhamento do fluxo operacional da oficina.

---

## 2. Requisitos e Diretrizes Arquiteturais

### 2.1 Módulo 1: Rota `/login` e Componente `AdminLogin` / `AuthSplitLayout`

- **Layout Split-Screen (≥1024px)**:
  - Coluna esquerda: Formulário de login limpo, largura máxima ~420px, centralizado verticalmente.
  - Coluna direita: Painel institucional BRS em grafite profundo (`bg-slate-900`), logo "B", título "Gestão integrada de atendimentos" e linha de apoio: "Agenda, bloqueios e equipe técnica em um só lugar." Padrão geométrico suave em CSS puro, aceitando `imageSrc` opcional.
  - Mobile e Tablet (<1024px): Coluna direita oculta, formulário centrado em card com fundo branco e borda sutil.
- **Validação e Acessibilidade do Formulário**:
  - `react-hook-form` + `zod` com mensagens de validação em português.
  - E-mail institucional (`type="email"`, `autoComplete="username"`).
  - Senha com botão de alternância de visibilidade (`aria-pressed`, `aria-label`).
  - Alerta discreto de **Caps Lock ativado** (`role="status"`).
  - Estado de loading ("Entrando…", spinner, botão desabilitado, `aria-busy="true"`).
  - Alerta de erro inline unificado (`role="alert"`), preservando a opacidade de segurança (sem revelar se foi e-mail ou senha).
- **Banner de Demonstração Compacto**:
  - Faixa discreta de 1 linha (~40-44px) exibida apenas quando `demo.enabled = true` (ou ambiente demonstrativo ativo).
  - Botão "Preencher dados demo em 1 clique" mantido para compatibilidade total com os testes.
  - Credenciais e botão de cópia apresentados de forma elegante sem poluir o DOM de produção.
- **Contrato e Redirecionamento de Rotas**:
  - Nova rota dedicada `src/routes/login.tsx` com suporte a `?redirect=/agendamentos`.
  - `/agendamentos` verifica autenticação e redireciona para `/login?redirect=/agendamentos` quando desautenticado.
  - Ao clicar em "Sair", limpa a sessão e redireciona para `/login`.

### 2.2 Módulo 2: Rota `/agendamentos` e Agenda Operacional

- **Unificação de KPIs e Filtros em `StatusTabs`**:
  - Substitui os 6 cards de KPI e a barra de pílulas por uma barra de abas única com contadores integrados:
    `Todos (N)` · `Em Andamento (N)` · `Concluídos (N)` · `Abertos (N)` · `Fechados (N)` · `Cancelados (N)`.
  - Altura total ≤ 56px, liberando espaço para a grade aparecer na primeira dobra em 1080p.
  - Indicador pontual de cor de status em cada aba. Abas com contagem 0 mantêm opacidade atenuada, mas clicáveis.
  - `role="tablist"` e `role="tab"` acessíveis.
- **Mini-Stepper de Processo nos Cards de Agendamento**:
  - Cada card de agendamento na grade e na lista ganha uma mini-esteira horizontal compacta:
    `Recebido` → `Desmontagem` → `Reparo` → `Pintura` → `Entrega`.
  - Estados: Concluído (verde minimalista), Ativo (azul/âmbar em execução), Pendente (cinza suave).
  - Em telas menores (<640px), exibe resumo textual com barra fina (ex: "Pintura • 3 de 5").
- **Nova Visão em Quadro (Kanban Somente Leitura)**:
  - Adiciona aba `Quadro` no navegador de visões: `Dia` | `Lista` | `Quadro` | `Leva e Traz`.
  - 5 colunas por situação: Abertos, Em Andamento, Concluídos, Fechados, Cancelados.
  - Cards detalhados com protocolo, cliente, veículo, placa, serviço, horário e técnico responsável.

---

## 3. Matriz de Compatibilidade e Preservação

- Manter 100% dos testes existentes verdes (`booking-admin-grid.test.tsx`, `booking-status-ux.test.tsx`, etc.).
- Preservar ações funcionais: WhatsApp (`#25D366`), copiar resumo da Pré-OS, Bloquear Período, Novo Agendamento, Restaurar Dados Fictícios e Leva e Traz.
- Preservar concorrência Web Locks API e sincronização multi-abas via BroadcastChannel.
