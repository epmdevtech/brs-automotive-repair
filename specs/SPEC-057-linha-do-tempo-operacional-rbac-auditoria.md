# SPEC-057: Linha do Tempo Operacional com RBAC, Trilha de Auditoria e Acessibilidade (WCAG 2.2 AA)

## Metadados

| Campo       | Valor                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| Spec ID     | SPEC-057                                                                                                          |
| Título      | Linha do Tempo Operacional com RBAC, Trilha de Auditoria Append-Only e Acessibilidade Estrita na Oficina BRS      |
| Status      | Aprovado                                                                                                          |
| Data        | 2026-10-15                                                                                                        |
| Autor       | Staff Product Designer & Engenheiro Front-end Sênior                                                              |
| Módulo      | `features/booking`                                                                                                |
| Dependência | SPEC-050 (Eventos Append-Only), SPEC-054 (Light Mode ERP), SPEC-055 (Kanban/Split), SPEC-056 (Login & Isolamento) |

---

## 1. Visão Geral e Princípio de Negócio

No sistema operacional da **BRS Reparações Automotivas** (Toledo-PR), o detalhe de cada agendamento/Ordem de Serviço (OS) apresenta o bloco "Linha do Tempo Operacional".

### Princípio de Negócio

> **Quem executa ou conhece o fato primeiro registra a etapa; a recepção/atendimento consulta (e corrige com justificativa auditada).** Cada etapa tem papéis responsáveis rigidamente definidos em configuração centralizada (`etapas.config.ts`), eliminando ruídos de comunicação ("telefone sem fio") e interrupções desnecessárias aos técnicos.

### Problemas Solucionados

1. **Falta de controle de acesso (RBAC)**: Qualquer perfil podia clicar e alterar qualquer etapa.
2. **Falha de renderização de timestamp**: Fragmentos soltos ("às") sem horário e sem autor.
3. **Semântica imprecisa**: Etapa 2 (Recebimento) tratada como "Em Execução", quando é um marco instantâneo.
4. **Contraste insuficiente e desalinhamento**: Textos "Pendente" abaixo de 4.5:1 e alturas desiguais que quebravam o stepper desktop.
5. **Falta de trilha de auditoria e justificativa**: Reversões e correções não exigiam motivo auditável.

---

## 2. Configuração Canônica das 6 Etapas (`etapas.config.ts`)

| #   | ID (`EtapaId`)           | Título Completo (Sentence Case)                       | Título Curto (Mobile) | Tipo                | Quem Conclui (`Papel[]`)                                      | Rótulo Quando Atual      |
| --- | ------------------------ | ----------------------------------------------------- | --------------------- | ------------------- | ------------------------------------------------------------- | ------------------------ |
| 1   | `agendamento_confirmado` | Cadastro e agendamento confirmado                     | Agendamento           | marco               | sistema (automático ao confirmar); manual: atendimento, admin | "Atual"                  |
| 2   | `veiculo_recebido`       | Veículo recebido na oficina                           | Recebimento           | marco               | atendimento, tecnico, admin                                   | "Aguardando recebimento" |
| 3   | `vistoria_diagnostico`   | Vistoria técnica e diagnóstico                        | Vistoria              | atividade           | tecnico, admin                                                | "Em andamento"           |
| 4   | `aprovacao_orcamento`    | Aprovação do orçamento                                | Orçamento             | atividade           | atendimento, admin                                            | "Aguardando cliente"     |
| 5   | `execucao_pdr`           | Execução: desamassamento PDR (preservação da pintura) | Execução              | atividade           | tecnico, admin                                                | "Em execução"            |
| 6   | `qualidade_entrega`      | Controle de qualidade e entrega                       | Qualidade e entrega   | atividade (2 ações) | 6a: tecnico, admin<br>6b: atendimento, admin                  | "Em andamento"           |

---

## 3. Modelo de Dados e Log de Eventos Append-Only

### Tipos Primários

```ts
export type Papel = "admin" | "tecnico" | "atendimento";

export type EtapaId =
  | "agendamento_confirmado"
  | "veiculo_recebido"
  | "vistoria_diagnostico"
  | "aprovacao_orcamento"
  | "execucao_pdr"
  | "qualidade_entrega";

export type TipoEvento = "concluida" | "desfeita" | "revertida" | "pedido_atualizacao";

export interface EventoEtapa {
  id: string;
  agendamentoId: string;
  etapa: EtapaId;
  acao?: "aprovar_qualidade" | "registrar_entrega";
  tipo: TipoEvento;
  origem: "manual" | "automatico" | "desfazer" | "correcao";
  porUsuarioId: string | null;
  porNome: string;
  papel: Papel | "sistema";
  em: string; // ISO 8601 UTC
  observacao?: string;
  justificativa?: string; // Obrigatória em "revertida" (mín. 10 chars)
}
```

### Derivações Puras

- `estadoEtapas(eventos)`: Retorna array com estado (`concluida`, `atual`, `pendente`), timestamps e atores de cada uma das 6 etapas.
- `etapaAtual(eventos)`: Retorna a etapa ativa atual (1 a 6).
- `progresso(eventos)`: `{ atual: number; concluidas: number; total: 6 }`.
- `situacao(eventos, cancelado)`: `"aberto" | "em_andamento" | "concluido" | "cancelado"`.

---

## 4. Regras de Permissões (`podeExecutar`)

1. **Concluir**: Apenas os papéis configurados para a etapa atual.
2. **Desfazer**: Apenas quem executou a última ação, dentro da janela estrita de 10 segundos.
3. **Reverter**: Apenas `atendimento` e `admin`, somente a última etapa concluída, exigindo justificativa de pelo menos 10 caracteres. Técnico nunca reverte.
4. **Pedir Atualização**: Apenas `atendimento` e `admin`, restrito a etapas do tipo `atividade` atuais, com cooldown de 15 minutos por agendamento.
5. **Consulta**: Todos os papéis autenticados visualizam a linha do tempo completa.

---

## 5. Requisitos de Interface e Acessibilidade (WCAG 2.2 AA)

1. **Cabeçalho**: Sentence case ("Linha do tempo operacional"), contador "Etapa X de 6 · N concluída(s)" ou "6 de 6 · Entregue", barra de progresso fina de 4px.
2. **Stepper Responsivo**:
   - Desktop (≥1024px): 6 colunas proporcionais, círculos de 40px com nó e check/número, conector contínuo, alinhamento superior com altura mínima para 3 linhas e `text-balance`.
   - Mobile (<1024px): Lista vertical linear com conector lateral esquerdo, sem rolagem horizontal em nenhum breakpoint.
3. **Formatador de Timestamp**: Fuso horário `America/Sao_Paulo` com `pt-BR`. Hoje: "14:32"; outro dia: "14/10 14:32"; outro ano: "14/10/2025 14:32". NUNCA renderizar "às" ou "por" soltos.
4. **Alerta de Dado Desatualizado**: Para etapas de atividade atuais sem atualização há mais de 120 minutos (`LIMITE_SEM_ATUALIZACAO_MIN = 120`), exibir badge âmbar "Sem atualização há X h".
5. **Auditoria e Histórico**: Sheet com log append-only reverso e destaque em correções. Dialog para reversão com foco automático e tecla Escape.
6. **Acessibilidade**: `<ol aria-label="Linha do tempo operacional">`, `aria-current="step"`, `aria-live="polite"`, botões ≥44×44px, foco visível com anel 2px/offset 2px, contrastes ≥4.5:1.

---

## 6. Critérios de Aceitação

- [x] AC-057-01: Configuração única e centralizada em `src/features/booking/config/etapas.config.ts`.
- [x] AC-057-02: Derivações puras e testáveis sem efeito colateral para as 6 etapas.
- [x] AC-057-03: Função `podeExecutar` cobrindo todas as combinações de papéis, etapas e ações.
- [x] AC-057-04: Concorrência e idempotência com verificação de pré-condição `etapaEsperada`.
- [x] AC-057-05: Componente `TimelineOperacional` com stepper responsivo (horizontal desktop / vertical mobile).
- [x] AC-057-06: Formatador seguro de data/hora sem emissão de partículas isoladas.
- [x] AC-057-07: Sincronização dos consumidores (mini-stepper em cards, Kanban e abas de status).
- [x] AC-057-08: Suíte de testes automatizados com cobertura de 100% dos cenários normativos.
