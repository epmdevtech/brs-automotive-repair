# SPEC-054: Redesenho do Painel Administrativo / ERP BRS em Light Mode High-End

## Metadados

| Campo       | Valor                                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------------- |
| Spec ID     | SPEC-054                                                                                                         |
| Título      | Redesenho do Painel Administrativo / ERP BRS em Light Mode High-End (Linear / Vercel Dashboard / Apple Pro Apps) |
| Status      | Aprovado                                                                                                         |
| Data        | 2026-10-15                                                                                                       |
| Autor       | Staff Product Designer & Engenheiro de Software Sênior                                                           |
| Módulo      | `features/booking`                                                                                               |
| Issue / Ref | Transição do visual dark/terminal para Sistema Operacional Administrativo / ERP Light Mode de Alta Precisão      |

---

## 1. Contexto e Justificativa de Engenharia

O painel de agendamentos (`/agendamentos`) foi previamente transformado para um modo escuro com forte apelo visual industrial/terminal. No entanto, para um **Sistema Operacional Administrativo / ERP Interno de Gestão de Oficina Premium**, a ergonomia diária dos operadores de funilaria, pintura e recepção técnica exige **Light Mode de Alta Legibilidade e Sobriedade**, inspirado em produtos de excelência em UX administrativa como _Linear.app_, _Vercel Dashboard_ e _Apple Pro Apps_.

Esta especificação define a refatoração completa da rota `/agendamentos` (Login Administrativo, Grade da Agenda, Lista, Leva e Traz, Modal de Processo do Cliente e Diálogos Operacionais) para um Design System Administrativo Light Mode High-End, mantendo **100% das regras de negócio, concorrência Web Locks, persistência local e reatividade**.

---

## 2. Diretrizes do Design System Administrativo (Light Mode High-End)

### 2.1 Paleta de Cores e Superfícies

- **Canvas Principal**: Fundo branco puro (`#FFFFFF`) e áreas de suporte em off-white sutil (`#F8F9FA` ou `#F4F5F6`).
- **Cards e Painéis**: Fundo branco puro (`#FFFFFF`) com bordas sutis e sólidas de 1px (`#E2E4E8` ou `#E5E7EB`).
- **Eliminação de Excessos**: Fim de sombras difusas exageradas, brilhos fluorescentes e gradientes pesados.
- **Hierarquia de Textos**:
  - Preto profundo (`#111827`) para títulos principais, nomes de clientes e métricas.
  - Cinza grafite (`#4B5563`) para textos de apoio e dados secundários.
  - Cinza claro neutro (`#9CA3AF`) para legendas, rótulos e metadados discretos.
- **Pills de Status Sóbrios**:
  - `COMPLETED` (Concluído): Fundo suave `bg-emerald-50 text-emerald-700 border-emerald-200`.
  - `CONFIRMED` (Em Andamento): Fundo suave `bg-amber-50 text-amber-700 border-amber-200`.
  - `PENDING` (Aberto): Fundo suave `bg-sky-50 text-sky-700 border-sky-200`.
  - `NO_SHOW` (Fechado): Fundo suave `bg-neutral-100 text-neutral-700 border-neutral-200`.
  - `CANCELLED` (Cancelado): Fundo suave `bg-rose-50 text-rose-700 border-rose-200`.

### 2.2 Tipografia e Hierarquia de Dados

- **Sans-serif de Sistema / Neutra (`font-sans`)**: Aplicada em todos os títulos, textos operacionais, rótulos, botões e nomes.
- **Monospace Restrita (`font-mono`)**: Usada estritamente onde agrega precisão técnica: identificadores de ordem de serviço (`#BRS-8412`), placas de veículos (`ABC-1234`), horários (`08:00`) e datas ISO.
- **Equilíbrio Tipográfico**: Destaque visual concentrado em Nome do Cliente, Modelo do Veículo e Técnico/Box responsável.

### 2.3 Matriz de Agenda e Tabela de Técnicos

- **Estrutura de Tabela Profissional**: Linhas horizontais finas (1px `border-slate-200`), cabeçalhos de colunas com fundo leve (`#F9FAFB`) e texto em caixa alta discreto (`text-xs font-semibold text-slate-500`).
- **Cards de Agendamento nos Slots**: Cards compactos brancos sobre fundo cinza-claro da grade, com borda sutil à esquerda (3px) indicando o status operacional (verde para concluído, âmbar para em andamento, azul para aberto, etc.), sem sufocar o slot.
- **Slots Livres**: Discretos, com linha fina ou hover sutil `+ Disponível`, mantendo a interface leve.

### 2.4 Modal de Processo do Cliente (`CustomerProcessDialog`) e Stepper Horizontal

- **Stepper Horizontal Linear**: Linha contínua fina conectando pequenos nós numerados (1 a 6).
  - Etapas concluídas: Marcador verde minimalista com checkmark.
  - Etapa ativa: Nó em destaque com anel sutil e indicador claro.
  - Etapas futuras: Nó translúcido e discreto em cinza claro.
- **Dados Técnicos & Auditoria**: Tabela de metadados compacta em pares Chave / Valor legíveis e estruturados, sem formato JSON cru.
- **Ação de WhatsApp**: Integrada como ação secundária elegante e funcional, com ícone e affordance clara sem poluir a barra de ações principais.

---

## 3. Plano de Implementação

1. **`AdminLogin`**: Tela limpa com cartão central branco, borda sólida 1px `#E2E4E8`, tipografia neutra e credenciais em card discreto.
2. **`AdminGridView`**: Refatoração do container, barra de navegação, 6 KPIs, seletor de data/filtros, grade de técnicos e visualizações em Lista e Leva e Traz para Light Mode.
3. **`RepairTimeline` & `CustomerProcessDialog`**: Stepper horizontal linear de 6 etapas, metadados em tabela limpa, cabeçalho sóbrio com código de OS e ações de Fechar, Concluir e Cancelar.
4. **Diálogos de Suporte**: `ManualBookingDialog` e `BlockSlotDialog` em superfícies brancas com bordas neutras.
5. **Quality Gates**: Vitest (100% aprovado), ESLint (zero erros), Build Vite + Nitro SSR e validação da matriz de rastreabilidade SDD.
