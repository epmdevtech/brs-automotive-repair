/**
 * etapas.config.ts — Fonte única da verdade para regras, papéis e semântica
 * da Linha do Tempo Operacional da Master Chapeação e Pinturas (SPEC-057).
 * Nenhuma regra de papel ou sequência pode ficar dispersa em componentes.
 */

export type Papel = "admin" | "tecnico" | "atendimento";

export type EtapaId =
  | "agendamento_confirmado"
  | "veiculo_recebido"
  | "vistoria_diagnostico"
  | "aprovacao_orcamento"
  | "execucao_pdr"
  | "qualidade_entrega";

export type TipoEtapa = "marco" | "atividade";

export type AcaoEtapa6 = "aprovar_qualidade" | "registrar_entrega";

export interface AcaoSequencialConfig {
  acao: AcaoEtapa6;
  rotulo: string;
  responsaveis: Papel[];
}

export interface ConfiguracaoEtapa {
  id: EtapaId;
  ordem: number; // 1 a 6
  tituloCompleto: string; // Em sentence case rigoroso
  tituloCurto: string; // Título compacto para mobile / mini-stepper
  subtitulo?: string; // Subtítulo secundário opcional
  tipo: TipoEtapa; // 'marco' (evento pontual) vs 'atividade' (processo com duração)
  responsaveisConclusao: Papel[]; // Papéis com autoridade para concluir
  permiteSistema: boolean; // Se o sistema pode emitir conclusão automática
  rotuloQuandoAtual: string; // Rótulo em tempo de execução
  rotuloConcluido: string; // Rótulo após conclusão
  acoesSequenciais?: AcaoSequencialConfig[]; // Sub-ações para etapa 6
}

export const LIMITE_SEM_ATUALIZACAO_MIN = 120; // 2 horas de limite em atividades atuais
export const JANELA_DESFAZER_MS = 10_000; // 10 segundos para desfazer a própria ação
export const COOLDOWN_PEDIDO_ATUALIZACAO_MS = 15 * 60 * 1000; // 15 minutos entre pedidos

export const ETAPAS_OPERACIONAIS: readonly ConfiguracaoEtapa[] = [
  {
    id: "agendamento_confirmado",
    ordem: 1,
    tituloCompleto: "Cadastro e agendamento confirmado",
    tituloCurto: "Agendamento",
    tipo: "marco",
    responsaveisConclusao: ["atendimento", "admin"],
    permiteSistema: true,
    rotuloQuandoAtual: "Atual",
    rotuloConcluido: "Confirmado",
  },
  {
    id: "veiculo_recebido",
    ordem: 2,
    tituloCompleto: "Veículo recebido na oficina",
    tituloCurto: "Recebimento",
    tipo: "marco",
    responsaveisConclusao: ["atendimento", "tecnico", "admin"],
    permiteSistema: false,
    rotuloQuandoAtual: "Aguardando recebimento",
    rotuloConcluido: "Recebido",
  },
  {
    id: "vistoria_diagnostico",
    ordem: 3,
    tituloCompleto: "Vistoria técnica e diagnóstico",
    tituloCurto: "Vistoria",
    tipo: "atividade",
    responsaveisConclusao: ["tecnico", "admin"],
    permiteSistema: false,
    rotuloQuandoAtual: "Em andamento",
    rotuloConcluido: "Vistoriado",
  },
  {
    id: "aprovacao_orcamento",
    ordem: 4,
    tituloCompleto: "Aprovação do orçamento",
    tituloCurto: "Orçamento",
    tipo: "atividade",
    responsaveisConclusao: ["atendimento", "admin"],
    permiteSistema: false,
    rotuloQuandoAtual: "Aguardando cliente",
    rotuloConcluido: "Aprovado",
  },
  {
    id: "execucao_pdr",
    ordem: 5,
    tituloCompleto: "Execução: desamassamento PDR (preservação da pintura)",
    tituloCurto: "Execução",
    subtitulo: "preservação da pintura",
    tipo: "atividade",
    responsaveisConclusao: ["tecnico", "admin"],
    permiteSistema: false,
    rotuloQuandoAtual: "Em execução",
    rotuloConcluido: "Executado",
  },
  {
    id: "qualidade_entrega",
    ordem: 6,
    tituloCompleto: "Controle de qualidade e entrega",
    tituloCurto: "Qualidade e entrega",
    tipo: "atividade",
    responsaveisConclusao: ["atendimento", "admin"], // Conclusão final ocorre após entrega
    permiteSistema: false,
    rotuloQuandoAtual: "Em andamento",
    rotuloConcluido: "Entregue",
    acoesSequenciais: [
      {
        acao: "aprovar_qualidade",
        rotulo: "Aprovar qualidade",
        responsaveis: ["tecnico", "admin"],
      },
      {
        acao: "registrar_entrega",
        rotulo: "Registrar entrega",
        responsaveis: ["atendimento", "admin"],
      },
    ],
  },
] as const;

export const ETAPA_CONFIG_MAP: Record<EtapaId, ConfiguracaoEtapa> = ETAPAS_OPERACIONAIS.reduce(
  (acc, etapa) => {
    acc[etapa.id] = etapa;
    return acc;
  },
  {} as Record<EtapaId, ConfiguracaoEtapa>,
);

/**
 * Normaliza qualquer string de papel da autenticação legada para o enum Papel.
 */
export function normalizarPapel(role?: string | null): Papel {
  if (!role) return "atendimento";
  const r = role
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (r.includes("admin") || r.includes("oficina") || r.includes("gerente")) return "admin";
  if (
    r.includes("tecnic") ||
    r.includes("avaliador") ||
    r.includes("funileir") ||
    r.includes("pintor") ||
    r.includes("mecanic")
  ) {
    return "tecnico";
  }
  return "atendimento";
}

/**
 * Retorna o nome amigável do papel em português para exibição institucional.
 */
export function rotuloPapel(papel: Papel | "sistema"): string {
  switch (papel) {
    case "admin":
      return "Administrador";
    case "tecnico":
      return "Técnico avaliador";
    case "atendimento":
      return "Recepção / Atendimento";
    case "sistema":
      return "Sistema";
  }
}
