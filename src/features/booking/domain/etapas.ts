/**
 * etapas.ts — Modelo de dados, log append-only e derivações puras da
 * Linha do Tempo Operacional com controle RBAC (SPEC-057).
 */

import {
  ETAPAS_OPERACIONAIS,
  ETAPA_CONFIG_MAP,
  JANELA_DESFAZER_MS,
  COOLDOWN_PEDIDO_ATUALIZACAO_MS,
  LIMITE_SEM_ATUALIZACAO_MIN,
  type EtapaId,
  type Papel,
  type AcaoEtapa6,
} from "../config/etapas.config";

export type TipoEvento = "concluida" | "desfeita" | "revertida" | "pedido_atualizacao";

export interface EventoEtapa {
  id: string;
  agendamentoId: string;
  etapa: EtapaId;
  acao?: AcaoEtapa6; // Apenas para sub-ações da etapa 6
  tipo: TipoEvento;
  origem: "manual" | "automatico" | "desfazer" | "correcao";
  porUsuarioId: string | null; // null quando automático
  porNome: string; // "Sistema" quando automático
  papel: Papel | "sistema";
  em: string; // ISO 8601 UTC
  observacao?: string; // Opcional ao concluir
  justificativa?: string; // Obrigatória em "revertida" (mín. 10 chars)
}

export type EstadoEtapaValor = "concluida" | "atual" | "pendente";

export interface SubAcaoEstado {
  acao: AcaoEtapa6;
  concluida: boolean;
  concluidaEm?: string;
  concluidaPor?: string;
  papel?: Papel | "sistema";
}

export interface EstadoEtapa {
  etapaId: EtapaId;
  ordem: number;
  tituloCompleto: string;
  tituloCurto: string;
  subtitulo?: string;
  tipo: "marco" | "atividade";
  estado: EstadoEtapaValor;
  concluidaEm?: string;
  concluidaPor?: string;
  papelConclusao?: Papel | "sistema";
  ultimaAtividadeEm?: string;
  observacao?: string;
  acoes?: SubAcaoEstado[];
  tempoInativoMinutos?: number;
  precisaAlertaInatividade?: boolean;
}

export interface ProgressoEtapas {
  atual: number; // 1 a 6 (ou 7 se todas concluídas)
  concluidas: number;
  total: 6;
  porcentagem: number;
}

export type SituacaoAgendamento = "aberto" | "em_andamento" | "concluido" | "cancelado";

/**
 * Derivação pura do estado de cada uma das 6 etapas a partir do log append-only.
 * Processa eventos em ordem cronológica respeitando desfazer e reversões.
 */
export function estadoEtapas(eventos: EventoEtapa[]): EstadoEtapa[] {
  // Ordenar cronologicamente
  const cronologicos = [...eventos].sort(
    (a, b) => new Date(a.em).getTime() - new Date(b.em).getTime(),
  );

  // Mapeamento de estado interno de cada etapa
  const conclusaoMap: Record<
    EtapaId,
    {
      concluida: boolean;
      concluidaEm?: string;
      concluidaPor?: string;
      papel?: Papel | "sistema";
      ultimaAtividadeEm?: string;
      observacao?: string;
      acao6a?: { concluida: boolean; em?: string; por?: string; papel?: Papel | "sistema" };
      acao6b?: { concluida: boolean; em?: string; por?: string; papel?: Papel | "sistema" };
    }
  > = {
    agendamento_confirmado: { concluida: false },
    veiculo_recebido: { concluida: false },
    vistoria_diagnostico: { concluida: false },
    aprovacao_orcamento: { concluida: false },
    execucao_pdr: { concluida: false },
    qualidade_entrega: {
      concluida: false,
      acao6a: { concluida: false },
      acao6b: { concluida: false },
    },
  };

  // Processar eventos acumulativamente
  for (const evt of cronologicos) {
    const alvo = conclusaoMap[evt.etapa];
    if (!alvo) continue;

    if (evt.tipo === "concluida") {
      if (evt.etapa === "qualidade_entrega") {
        if (evt.acao === "aprovar_qualidade") {
          alvo.acao6a = {
            concluida: true,
            em: evt.em,
            por: evt.porNome,
            papel: evt.papel,
          };
          alvo.ultimaAtividadeEm = evt.em;
        } else if (evt.acao === "registrar_entrega") {
          alvo.acao6b = {
            concluida: true,
            em: evt.em,
            por: evt.porNome,
            papel: evt.papel,
          };
          alvo.concluida = Boolean(alvo.acao6a?.concluida);
          alvo.concluidaEm = evt.em;
          alvo.concluidaPor = evt.porNome;
          alvo.papel = evt.papel;
          alvo.ultimaAtividadeEm = evt.em;
          alvo.observacao = evt.observacao;
        } else {
          // Conclusão direta da etapa 6 marca ambas as sub-ações
          alvo.concluida = true;
          alvo.concluidaEm = evt.em;
          alvo.concluidaPor = evt.porNome;
          alvo.papel = evt.papel;
          alvo.ultimaAtividadeEm = evt.em;
          alvo.observacao = evt.observacao;
          alvo.acao6a = { concluida: true, em: evt.em, por: evt.porNome, papel: evt.papel };
          alvo.acao6b = { concluida: true, em: evt.em, por: evt.porNome, papel: evt.papel };
        }
      } else {
        alvo.concluida = true;
        alvo.concluidaEm = evt.em;
        alvo.concluidaPor = evt.porNome;
        alvo.papel = evt.papel;
        alvo.ultimaAtividadeEm = evt.em;
        alvo.observacao = evt.observacao;
      }
    } else if (evt.tipo === "desfeita" || evt.tipo === "revertida") {
      if (evt.etapa === "qualidade_entrega") {
        if (evt.acao === "registrar_entrega") {
          alvo.concluida = false;
          alvo.concluidaEm = undefined;
          alvo.acao6b = { concluida: false };
        } else {
          alvo.concluida = false;
          alvo.concluidaEm = undefined;
          alvo.acao6a = { concluida: false };
          alvo.acao6b = { concluida: false };
        }
      } else {
        alvo.concluida = false;
        alvo.concluidaEm = undefined;
        alvo.concluidaPor = undefined;
        alvo.papel = undefined;
        alvo.observacao = undefined;
      }
      alvo.ultimaAtividadeEm = evt.em;
    } else if (evt.tipo === "pedido_atualizacao") {
      alvo.ultimaAtividadeEm = evt.em;
    }
  }

  // Se não houver nenhum evento para etapa 1, a etapa 1 começa como atual
  let encontrouAtual = false;
  const agora = Date.now();

  return ETAPAS_OPERACIONAIS.map((cfg, index) => {
    const dados = conclusaoMap[cfg.id];
    let estado: EstadoEtapaValor = "pendente";

    if (dados.concluida) {
      estado = "concluida";
    } else if (!encontrouAtual) {
      estado = "atual";
      encontrouAtual = true;
    } else {
      estado = "pendente";
    }

    // Cálculo de tempo de inatividade para etapas do tipo 'atividade'
    let tempoInativoMinutos = 0;
    let precisaAlertaInatividade = false;

    if (estado === "atual" && cfg.tipo === "atividade") {
      // Última atividade é a conclusão da etapa anterior ou evento nesta etapa
      const etapaAnterior = index > 0 ? conclusaoMap[ETAPAS_OPERACIONAIS[index - 1].id] : null;
      const refTimeStr = dados.ultimaAtividadeEm || etapaAnterior?.concluidaEm;
      if (refTimeStr) {
        const refTime = new Date(refTimeStr).getTime();
        if (!isNaN(refTime)) {
          tempoInativoMinutos = Math.max(0, Math.floor((agora - refTime) / (60 * 1000)));
          precisaAlertaInatividade = tempoInativoMinutos >= LIMITE_SEM_ATUALIZACAO_MIN;
        }
      }
    }

    const acoes: SubAcaoEstado[] | undefined =
      cfg.id === "qualidade_entrega"
        ? [
            {
              acao: "aprovar_qualidade",
              concluida: Boolean(dados.acao6a?.concluida),
              concluidaEm: dados.acao6a?.em,
              concluidaPor: dados.acao6a?.por,
              papel: dados.acao6a?.papel,
            },
            {
              acao: "registrar_entrega",
              concluida: Boolean(dados.acao6b?.concluida),
              concluidaEm: dados.acao6b?.em,
              concluidaPor: dados.acao6b?.por,
              papel: dados.acao6b?.papel,
            },
          ]
        : undefined;

    return {
      etapaId: cfg.id,
      ordem: cfg.ordem,
      tituloCompleto: cfg.tituloCompleto,
      tituloCurto: cfg.tituloCurto,
      subtitulo: cfg.subtitulo,
      tipo: cfg.tipo,
      estado,
      concluidaEm: dados.concluidaEm,
      concluidaPor: dados.concluidaPor,
      papelConclusao: dados.papel,
      ultimaAtividadeEm: dados.ultimaAtividadeEm,
      observacao: dados.observacao,
      acoes,
      tempoInativoMinutos,
      precisaAlertaInatividade,
    };
  });
}

/**
 * Retorna a etapa ativa atual (1 a 6). Se todas estiverem concluídas, retorna 7.
 */
export function etapaAtual(eventos: EventoEtapa[]): number {
  const estados = estadoEtapas(eventos);
  const atualIndex = estados.findIndex((e) => e.estado === "atual");
  if (atualIndex !== -1) return atualIndex + 1;
  const todasConcluidas = estados.every((e) => e.estado === "concluida");
  return todasConcluidas ? 7 : 1;
}

/**
 * Retorna o progresso numérico de etapas (1 a 6 e porcentagem).
 */
export function progresso(eventos: EventoEtapa[]): ProgressoEtapas {
  const estados = estadoEtapas(eventos);
  const concluidas = estados.filter((e) => e.estado === "concluida").length;
  const numAtual = etapaAtual(eventos);
  const atual = Math.min(numAtual, 6);
  const porcentagem = Math.round((concluidas / 6) * 100);

  return {
    atual,
    concluidas,
    total: 6,
    porcentagem,
  };
}

/**
 * Derivação da situação geral do agendamento para consumo no dashboard, kanban e abas.
 * Nota: "fechado" (financeiro/pós-pagamento) é mantido fora da esteira física e não é derivado aqui.
 */
export function situacao(eventos: EventoEtapa[], cancelado = false): SituacaoAgendamento {
  if (cancelado) return "cancelado";
  const estados = estadoEtapas(eventos);
  const etapa6 = estados.find((e) => e.etapaId === "qualidade_entrega");
  if (etapa6?.estado === "concluida") {
    return "concluido";
  }
  const etapa1 = estados.find((e) => e.etapaId === "agendamento_confirmado");
  const etapa2 = estados.find((e) => e.etapaId === "veiculo_recebido");

  // Aberto: até o momento anterior ao recebimento na oficina
  if (etapa1?.estado === "concluida" && etapa2?.estado === "atual") {
    return "aberto";
  }
  // Se ainda estiver na etapa 1 atual
  if (etapa1?.estado === "atual") {
    return "aberto";
  }
  return "em_andamento";
}

/**
 * Validação RBAC estrita de permissões. Retorna booleano e justificativa semântica.
 */
export function podeExecutar(
  papel: Papel,
  etapaId: EtapaId,
  acao?: AcaoEtapa6,
  eventos: EventoEtapa[] = [],
  usuarioId?: string | null,
): { pode: boolean; motivo?: string } {
  const estados = estadoEtapas(eventos);
  const etapaConfig = ETAPA_CONFIG_MAP[etapaId];
  if (!etapaConfig) {
    return { pode: false, motivo: "Etapa desconhecida." };
  }

  const estadoAtualEtapa = estados.find((e) => e.etapaId === etapaId);
  if (!estadoAtualEtapa) {
    return { pode: false, motivo: "Estado da etapa não encontrado." };
  }

  // Regra 1: Concluir etapa normal
  if (estadoAtualEtapa.estado === "atual") {
    // Caso especial: Etapa 6 com sub-ações sequenciais
    if (etapaId === "qualidade_entrega") {
      const subAcoes = estadoAtualEtapa.acoes;
      const acao6aConcluida = Boolean(
        subAcoes?.find((a) => a.acao === "aprovar_qualidade")?.concluida,
      );

      if (!acao6aConcluida) {
        // Primeira ação: 6a (aprovar_qualidade)
        if (acao === "aprovar_qualidade" || !acao) {
          const permitido = papel === "tecnico" || papel === "admin";
          return {
            pode: permitido,
            motivo: permitido
              ? undefined
              : "Apenas técnicos e administradores podem aprovar o controle de qualidade.",
          };
        }
        if (acao === "registrar_entrega") {
          return {
            pode: false,
            motivo: "A qualidade deve ser aprovada antes de registrar a entrega.",
          };
        }
      } else {
        // Segunda ação: 6b (registrar_entrega)
        if (acao === "registrar_entrega" || !acao) {
          const permitido = papel === "atendimento" || papel === "admin";
          return {
            pode: permitido,
            motivo: permitido
              ? undefined
              : "Apenas recepção/atendimento e administradores podem registrar a entrega técnica ao cliente.",
          };
        }
        return { pode: false, motivo: "O controle de qualidade já foi aprovado." };
      }
    }

    // Demais etapas: verificar se o papel está na lista de responsáveis
    const permitido = etapaConfig.responsaveisConclusao.includes(papel);
    return {
      pode: permitido,
      motivo: permitido
        ? undefined
        : `Ação restrita aos responsáveis: ${etapaConfig.responsaveisConclusao.join(", ")}.`,
    };
  }

  return {
    pode: false,
    motivo:
      estadoAtualEtapa.estado === "concluida"
        ? "Esta etapa já foi concluída."
        : "As etapas anteriores devem ser concluídas primeiro.",
  };
}

/**
 * Validação de permissão para a ação de Desfazer (janela estrita de 10 segundos).
 */
export function podeDesfazer(
  eventos: EventoEtapa[],
  usuarioId?: string | null,
  papel?: Papel,
): { pode: boolean; ultimoEvento?: EventoEtapa; motivo?: string } {
  if (eventos.length === 0) {
    return { pode: false, motivo: "Nenhum evento registrado." };
  }

  const concluidos = eventos.filter((e) => e.tipo === "concluida");
  if (concluidos.length === 0) {
    return { pode: false, motivo: "Nenhuma etapa concluída para desfazer." };
  }

  const ultimo = concluidos[concluidos.length - 1];
  const agora = Date.now();
  const tempoDecorrido = agora - new Date(ultimo.em).getTime();

  if (tempoDecorrido > JANELA_DESFAZER_MS) {
    return {
      pode: false,
      motivo: "O tempo limite de 10 segundos para desfazer expirou.",
      ultimoEvento: ultimo,
    };
  }

  // Só quem executou ou um admin pode desfazer imediatamente
  if (usuarioId && ultimo.porUsuarioId && ultimo.porUsuarioId !== usuarioId && papel !== "admin") {
    return {
      pode: false,
      motivo: "Apenas o autor da conclusão pode desfazê-la.",
      ultimoEvento: ultimo,
    };
  }

  return { pode: true, ultimoEvento: ultimo };
}

/**
 * Validação de permissão para Reverter (corrigir) etapa já concluída.
 * Requer atendimento ou admin, só pode ser a última etapa concluída, exige justificativa >= 10 chars.
 */
export function podeReverter(
  papel: Papel,
  eventos: EventoEtapa[],
): { pode: boolean; ultimaEtapaConcluida?: EstadoEtapa; motivo?: string } {
  // Técnico nunca reverte etapa concluída
  if (papel === "tecnico") {
    return {
      pode: false,
      motivo:
        "Técnicos não possuem permissão para reverter etapas. Contate a recepção ou gerência.",
    };
  }

  const estados = estadoEtapas(eventos);
  const concluidas = estados.filter((e) => e.estado === "concluida");
  if (concluidas.length === 0) {
    return { pode: false, motivo: "Nenhuma etapa concluída para reversão." };
  }

  const ultima = concluidas[concluidas.length - 1];
  return { pode: true, ultimaEtapaConcluida: ultima };
}

/**
 * Validação de permissão para Pedir Atualização.
 * Atendimento/admin em etapa do tipo atividade, com cooldown de 15 minutos.
 */
export function podePedirAtualizacao(
  papel: Papel,
  eventos: EventoEtapa[],
): { pode: boolean; cooldownRestanteMs?: number; motivo?: string } {
  if (papel !== "atendimento" && papel !== "admin") {
    return {
      pode: false,
      motivo: "Apenas atendimento e administradores podem solicitar atualizações.",
    };
  }

  const estados = estadoEtapas(eventos);
  const atual = estados.find((e) => e.estado === "atual");
  if (!atual) {
    return { pode: false, motivo: "Todas as etapas já foram concluídas." };
  }

  if (atual.tipo !== "atividade") {
    return {
      pode: false,
      motivo: "Pedidos de atualização só se aplicam a etapas de atividade em andamento.",
    };
  }

  // Verificar cooldown de 15 min do último pedido
  const ultimosPedidos = eventos
    .filter((e) => e.tipo === "pedido_atualizacao" && e.etapa === atual.etapaId)
    .sort((a, b) => new Date(b.em).getTime() - new Date(a.em).getTime());

  if (ultimosPedidos.length > 0) {
    const ultimo = ultimosPedidos[0];
    const decorrido = Date.now() - new Date(ultimo.em).getTime();
    if (decorrido < COOLDOWN_PEDIDO_ATUALIZACAO_MS) {
      const restante = COOLDOWN_PEDIDO_ATUALIZACAO_MS - decorrido;
      return {
        pode: false,
        cooldownRestanteMs: restante,
        motivo: `Aguarde ${Math.ceil(restante / (60 * 1000))} min para solicitar nova atualização.`,
      };
    }
  }

  return { pode: true };
}

// ---------------------------------------------------------------------------
// FORMATADORES DE DATA E HORA SEGUROS (Zero partículas órfãs "às" ou "por")
// ---------------------------------------------------------------------------

const TIMEZONE = "America/Sao_Paulo";

/**
 * Formata timestamp ISO em padrão brasileiro estrito sob o fuso de Toledo-PR.
 * Hoje: "14:32"
 * Outro dia do mesmo ano: "14/10 14:32"
 * Outro ano: "14/10/2025 14:32"
 * Nunca retorna partículas soltas. Em caso de data inválida, emite console.warn e retorna string vazia.
 */
export function formatarTimestampEtapa(isoDate?: string | null): string {
  if (!isoDate) return "";

  const data = new Date(isoDate);
  if (isNaN(data.getTime())) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[formatarTimestampEtapa] Data inválida recebida: "${isoDate}"`);
    }
    return "";
  }

  const agora = new Date();

  // Comparações de calendário sob o fuso da oficina
  const formatadorDataCurta = new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formatadorHora = new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const horaStr = formatadorHora.format(data);
  const dataEventoStr = formatadorDataCurta.format(data);
  const dataHojeStr = formatadorDataCurta.format(agora);

  if (dataEventoStr === dataHojeStr) {
    return horaStr;
  }

  // Verifica se é o mesmo ano
  const anoEvento = data.getFullYear();
  const anoAtual = agora.getFullYear();

  if (anoEvento === anoAtual) {
    // Ex: "14/10 14:32"
    const diaMes = dataEventoStr.slice(0, 5);
    return `${diaMes} ${horaStr}`;
  }

  // Ex: "14/10/2025 14:32"
  return `${dataEventoStr} ${horaStr}`;
}

/**
 * Formata descrição completa para título/tooltip (ex: "quarta-feira, 14 de outubro de 2026, 14:32").
 */
export function formatarDataHoraCompleta(isoDate?: string | null): string {
  if (!isoDate) return "";
  const data = new Date(isoDate);
  if (isNaN(data.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(data);
}

/**
 * Formata o rodapé do nó da etapa de forma atômica e robusta.
 * NUNCA renderiza "às" ou "por" soltos.
 */
export function formatarConclusaoEtapa(
  dataIso?: string | null,
  autor?: string | null,
): { textoVisual: string; titleAcessivel: string } {
  const hora = formatarTimestampEtapa(dataIso);
  const titleAcessivel = formatarDataHoraCompleta(dataIso);

  const partes: string[] = ["Concluído"];
  if (hora) partes.push(hora);
  if (autor && autor.trim()) partes.push(`por ${autor.trim()}`);

  return {
    textoVisual: partes.join(" · "),
    titleAcessivel: titleAcessivel
      ? `${partes.join(" · ")} (${titleAcessivel})`
      : partes.join(" · "),
  };
}

/**
 * Formata tempo decorrido relativo ("há 25 min", "há 3 h", "há 2 d").
 */
export function formatarTempoRelativo(isoDate?: string | null): string {
  if (!isoDate) return "";
  const data = new Date(isoDate);
  if (isNaN(data.getTime())) return "";

  const diffMs = Date.now() - data.getTime();
  if (diffMs < 0) return "agora";

  const minutos = Math.floor(diffMs / (60 * 1000));
  if (minutos < 1) return "agora mesmo";
  if (minutos < 60) return `há ${minutos} min`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;

  const dias = Math.floor(horas / 24);
  return `há ${dias} d`;
}

// ---------------------------------------------------------------------------
// CAMADA DE PERSISTÊNCIA, MUTRAÇÕES CONCORRENTES E SINCRONIZAÇÃO MULTI-ABA
// ---------------------------------------------------------------------------

const ETAPA_EVENTS_STORAGE_KEY = "brs_etapas_audit_log";
const SYNC_CHANNEL_NAME = "brs_booking_sync";
const APPOINTMENTS_STORAGE_KEY = "brs_appointments_v1";
export const ETAPA_SYNC_DOM_EVENT = "brs:etapas-updated";

/**
 * Lê todos os eventos de etapas do localStorage.
 */
export function readAllEtapaEvents(): EventoEtapa[] {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(ETAPA_EVENTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as EventoEtapa[];
  } catch {
    return [];
  }
}

/**
 * Grava a lista completa de eventos no localStorage de forma atômica.
 */
export function writeAllEtapaEvents(eventos: EventoEtapa[]): boolean {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return false;
  }
  try {
    localStorage.setItem(ETAPA_EVENTS_STORAGE_KEY, JSON.stringify(eventos));
    return true;
  } catch {
    return false;
  }
}

/**
 * Emite sinal de sincronização na mesma aba (CustomEvent) e multi-aba (BroadcastChannel).
 */
export function emitirSyncMultiAba(tipo: string, payload: unknown): void {
  const timestamp = Date.now();
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    try {
      window.dispatchEvent(
        new CustomEvent(ETAPA_SYNC_DOM_EVENT, {
          detail: { type: tipo, payload, timestamp },
        }),
      );
    } catch {
      // Fallback silencioso
    }
  }
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.postMessage({ type: tipo, payload, timestamp });
      channel.close();
    } catch {
      // Fallback silencioso
    }
  }
}

/**
 * Sincroniza o status do agendamento no localStorage ("brs_appointments_v1")
 * a partir da situação real derivada das etapas operacionais (SPEC-065).
 */
export function sincronizarStatusAgendamentoPorEtapas(agendamentoId: string): void {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return;
  }
  try {
    const eventos = getEtapaEventsForAppointment(agendamentoId);
    if (eventos.length === 0) return;

    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!raw) return;

    const list = JSON.parse(raw) as Array<{ id: string; status: string }>;
    const idx = list.findIndex((a) => a.id === agendamentoId);
    if (idx === -1) return;

    const current = list[idx];
    if (current.status === "CANCELLED" || current.status === "NO_SHOW") {
      return;
    }

    const novaSituacao = situacao(eventos);
    let targetStatus = current.status;

    if (novaSituacao === "concluido") {
      targetStatus = "COMPLETED";
    } else if (novaSituacao === "em_andamento") {
      targetStatus = "CONFIRMED";
    } else if (novaSituacao === "aberto") {
      if (current.status === "COMPLETED") {
        targetStatus = "CONFIRMED";
      }
    }

    if (current.status !== targetStatus) {
      list[idx] = { ...current, status: targetStatus };
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    // Fallback silencioso
  }
}

/**
 * Reconcilia uma lista de agendamentos com o histórico de etapas operacionais existente,
 * corrigindo divergências como agendamentos marcados como COMPLETED enquanto ainda possuem
 * etapas em andamento na linha do tempo operacional (SPEC-065).
 */
export function reconciliarStatusAgendamentosComEtapas<T extends { id: string; status: string }>(
  appointments: T[],
): { list: T[]; changed: boolean } {
  let changed = false;
  const todosEventos = readAllEtapaEvents();
  if (todosEventos.length === 0) {
    return { list: appointments, changed: false };
  }

  const nextList = appointments.map((app) => {
    if (app.status === "CANCELLED" || app.status === "NO_SHOW") {
      return app;
    }

    const eventos = todosEventos
      .filter((e) => e.agendamentoId === app.id)
      .sort((a, b) => new Date(a.em).getTime() - new Date(b.em).getTime());

    if (eventos.length === 0) {
      return app;
    }

    const novaSituacao = situacao(eventos);
    let targetStatus = app.status;

    if (novaSituacao === "concluido") {
      targetStatus = "COMPLETED";
    } else if (novaSituacao === "em_andamento") {
      targetStatus = "CONFIRMED";
    } else if (novaSituacao === "aberto") {
      const teveReversaoOuDesfazer = eventos.some(
        (e) => e.tipo === "revertida" || e.tipo === "desfeita",
      );
      if (app.status === "COMPLETED" && teveReversaoOuDesfazer) {
        targetStatus = "CONFIRMED";
      }
    }

    if (targetStatus !== app.status) {
      changed = true;
      return { ...app, status: targetStatus };
    }
    return app;
  });

  return { list: nextList, changed };
}

/**
 * Garante que todas as 6 etapas operacionais estejam registradas como concluídas
 * quando um agendamento é finalizado diretamente pela ação rápida de conclusão (SPEC-065).
 */
export function garantirTodasEtapasConcluidas(
  agendamentoId: string,
  autorNome = "Administrador BRS",
  createdAt?: string,
): EventoEtapa[] {
  const existentes = getEtapaEventsForAppointment(agendamentoId);
  const estados = estadoEtapas(existentes);
  const todasConcluidas = estados.every((e) => e.estado === "concluida");
  if (todasConcluidas && existentes.length > 0) {
    return existentes;
  }

  const baseMs = createdAt ? new Date(createdAt).getTime() : Date.now() - 3600_000;
  const agoraMs = Date.now();
  const novosEventos: EventoEtapa[] = [];

  for (let i = 0; i < estados.length; i++) {
    const st = estados[i];
    if (st.estado === "concluida") continue;

    const ts = new Date(Math.min(agoraMs, baseMs + (i + 1) * 60_000) + i).toISOString();

    if (st.etapaId === "qualidade_entrega") {
      const acao6aDone = Boolean(st.acoes?.find((a) => a.acao === "aprovar_qualidade")?.concluida);
      const acao6bDone = Boolean(st.acoes?.find((a) => a.acao === "registrar_entrega")?.concluida);

      if (!acao6aDone) {
        novosEventos.push({
          id: `evt_auto_6a_${agendamentoId}_${Date.now()}_${i}`,
          agendamentoId,
          etapa: "qualidade_entrega",
          acao: "aprovar_qualidade",
          tipo: "concluida",
          origem: "automatico",
          porUsuarioId: "admin",
          porNome: autorNome,
          papel: "admin",
          em: ts,
        });
      }
      if (!acao6bDone) {
        novosEventos.push({
          id: `evt_auto_6b_${agendamentoId}_${Date.now()}_${i}`,
          agendamentoId,
          etapa: "qualidade_entrega",
          acao: "registrar_entrega",
          tipo: "concluida",
          origem: "automatico",
          porUsuarioId: "admin",
          porNome: autorNome,
          papel: "admin",
          em: new Date(Date.now() + i + 1).toISOString(),
        });
      }
    } else {
      novosEventos.push({
        id: `evt_auto_${st.etapaId}_${agendamentoId}_${Date.now()}_${i}`,
        agendamentoId,
        etapa: st.etapaId,
        tipo: "concluida",
        origem: "automatico",
        porUsuarioId: st.etapaId === "agendamento_confirmado" ? null : "admin",
        porNome: st.etapaId === "agendamento_confirmado" ? "Sistema" : autorNome,
        papel: st.etapaId === "agendamento_confirmado" ? "sistema" : "admin",
        em: ts,
      });
    }
  }

  if (novosEventos.length > 0) {
    const todos = readAllEtapaEvents();
    writeAllEtapaEvents([...todos, ...novosEventos]);
    emitirSyncMultiAba("ETAPAS_SINCRONIZADAS", { agendamentoId });
  }

  return getEtapaEventsForAppointment(agendamentoId);
}

/**
 * Retorna todos os eventos associados a um agendamento específico.
 */
export function getEtapaEventsForAppointment(agendamentoId: string): EventoEtapa[] {
  const todos = readAllEtapaEvents();
  return todos
    .filter((e) => e.agendamentoId === agendamentoId)
    .sort((a, b) => new Date(a.em).getTime() - new Date(b.em).getTime());
}

/**
 * Garante que agendamentos sem histórico possuam ao menos o evento inicial da Etapa 1
 * (ou as 6 etapas caso o agendamento já tenha nascido concluído no seed).
 */
export function ensureInitialEtapaEvents(
  agendamentoId: string,
  clienteNome = "Cliente",
  createdAt?: string,
): EventoEtapa[] {
  const existentes = getEtapaEventsForAppointment(agendamentoId);
  if (existentes.length > 0) {
    sincronizarStatusAgendamentoPorEtapas(agendamentoId);
    return existentes;
  }

  // Verifica se o agendamento já está com status COMPLETED no armazenamento local (ex: seed)
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      const rawApps = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (rawApps) {
        const apps = JSON.parse(rawApps) as Array<{ id: string; status: string }>;
        const match = apps.find((a) => a.id === agendamentoId);
        if (match?.status === "COMPLETED") {
          return garantirTodasEtapasConcluidas(agendamentoId, "Sistema", createdAt);
        }
      }
    } catch {
      // Fallback
    }
  }

  const horaCriacao = createdAt || new Date().toISOString();
  const eventoInicial: EventoEtapa = {
    id: `evt_etapa1_${agendamentoId}_${Date.now()}`,
    agendamentoId,
    etapa: "agendamento_confirmado",
    tipo: "concluida",
    origem: "automatico",
    porUsuarioId: null,
    porNome: "Sistema",
    papel: "sistema",
    em: horaCriacao,
    observacao: `Agendamento confirmado no portal pelo cliente ${clienteNome}`,
  };

  const todos = readAllEtapaEvents();
  const atualizados = [...todos, eventoInicial];
  writeAllEtapaEvents(atualizados);
  return [eventoInicial];
}

/**
 * Notificador in-app para pedidos de atualização (interface de integração).
 */
export function notificarResponsavel(agendamentoId: string, etapaId: EtapaId): void {
  emitirSyncMultiAba("PEDIDO_ATUALIZACAO", { agendamentoId, etapaId });
}

export interface ConcluirEtapaParams {
  agendamentoId: string;
  etapa: EtapaId;
  acao?: AcaoEtapa6;
  etapaEsperada: EtapaId; // Pré-condição de concorrência
  autorId?: string | null;
  autorNome: string;
  papel: Papel;
  observacao?: string;
}

/**
 * Mutação atômica para concluir etapa com validação de pré-condição contra concorrência e idempotência.
 */
export function concluirEtapa(params: ConcluirEtapaParams): {
  sucesso: boolean;
  evento?: EventoEtapa;
  erro?: string;
} {
  const { agendamentoId, etapa, acao, etapaEsperada, autorId, autorNome, papel, observacao } =
    params;
  const eventosAtuais = getEtapaEventsForAppointment(agendamentoId);
  const estados = estadoEtapas(eventosAtuais);
  const etapaAtualAtiva = estados.find((e) => e.estado === "atual");

  // 1. Prevenção de clique duplo / idempotência imediata (chave: agendamentoId + etapa + acao dentro de 2s)
  const agoraMs = Date.now();
  const duplicado = eventosAtuais.find(
    (e) =>
      e.agendamentoId === agendamentoId &&
      e.etapa === etapa &&
      e.acao === acao &&
      e.tipo === "concluida" &&
      Math.abs(agoraMs - new Date(e.em).getTime()) < 2000,
  );
  if (duplicado) {
    return { sucesso: true, evento: duplicado };
  }

  // 2. Verificação de concorrência: a etapa esperada pelo usuário ainda é a atual?
  if (!etapaAtualAtiva || etapaAtualAtiva.etapaId !== etapaEsperada) {
    const etapaConcluida = estados.find((e) => e.etapaId === etapaEsperada);
    const autor = etapaConcluida?.concluidaPor || "outro usuário";
    const hora = formatarTimestampEtapa(etapaConcluida?.concluidaEm);
    return {
      sucesso: false,
      erro: `Esta etapa já foi atualizada por ${autor}${hora ? ` às ${hora}` : ""}. A tela foi sincronizada.`,
    };
  }

  // 3. Verificação de permissões RBAC
  const permissao = podeExecutar(papel, etapa, acao, eventosAtuais, autorId);
  if (!permissao.pode) {
    return { sucesso: false, erro: permissao.motivo || "Ação não permitida para o seu perfil." };
  }

  const novoEvento: EventoEtapa = {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    agendamentoId,
    etapa,
    acao,
    tipo: "concluida",
    origem: "manual",
    porUsuarioId: autorId || null,
    porNome: autorNome,
    papel,
    em: new Date().toISOString(),
    observacao: observacao?.trim() || undefined,
  };

  const todos = readAllEtapaEvents();
  writeAllEtapaEvents([...todos, novoEvento]);
  sincronizarStatusAgendamentoPorEtapas(agendamentoId);
  emitirSyncMultiAba("ETAPA_CONCLUIDA", { agendamentoId, evento: novoEvento });

  return { sucesso: true, evento: novoEvento };
}

/**
 * Desfaz a última ação de conclusão dentro da janela de 10 segundos.
 */
export function desfazerUltimaAcao(
  agendamentoId: string,
  autorId?: string | null,
  autorNome = "Usuário",
  papel: Papel = "atendimento",
): { sucesso: boolean; erro?: string } {
  const eventosAtuais = getEtapaEventsForAppointment(agendamentoId);
  const permissao = podeDesfazer(eventosAtuais, autorId, papel);

  if (!permissao.pode || !permissao.ultimoEvento) {
    return { sucesso: false, erro: permissao.motivo || "Não é possível desfazer esta ação." };
  }

  const ultimo = permissao.ultimoEvento;
  const eventoDesfazer: EventoEtapa = {
    id: `evt_undo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    agendamentoId,
    etapa: ultimo.etapa,
    acao: ultimo.acao,
    tipo: "desfeita",
    origem: "desfazer",
    porUsuarioId: autorId || null,
    porNome: autorNome,
    papel,
    em: new Date().toISOString(),
    observacao: `Ação desfeita pelo usuário em até 10 segundos.`,
  };

  const todos = readAllEtapaEvents();
  writeAllEtapaEvents([...todos, eventoDesfazer]);
  sincronizarStatusAgendamentoPorEtapas(agendamentoId);
  emitirSyncMultiAba("ETAPA_DESFEITA", { agendamentoId, evento: eventoDesfazer });

  return { sucesso: true };
}

export interface ReverterEtapaParams {
  agendamentoId: string;
  etapa: EtapaId;
  justificativa: string;
  autorId?: string | null;
  autorNome: string;
  papel: Papel;
}

/**
 * Reverte a última etapa concluída com justificativa auditável obrigatória (>= 10 caracteres).
 * Permitido apenas para atendimento e admin. Técnico não reverte.
 */
export function reverterEtapa(params: ReverterEtapaParams): { sucesso: boolean; erro?: string } {
  const { agendamentoId, etapa, justificativa, autorId, autorNome, papel } = params;

  if (papel === "tecnico") {
    return {
      sucesso: false,
      erro: "Técnicos não possuem permissão para reverter etapas.",
    };
  }

  const cleanJustificativa = (justificativa || "").trim();
  if (cleanJustificativa.length < 10) {
    return {
      sucesso: false,
      erro: "A justificativa para correção deve conter no mínimo 10 caracteres.",
    };
  }

  const eventosAtuais = getEtapaEventsForAppointment(agendamentoId);
  const permissao = podeReverter(papel, eventosAtuais);
  if (!permissao.pode || !permissao.ultimaEtapaConcluida) {
    return { sucesso: false, erro: permissao.motivo || "Não é possível reverter no momento." };
  }

  if (permissao.ultimaEtapaConcluida.etapaId !== etapa) {
    return {
      sucesso: false,
      erro: "Apenas a última etapa concluída pode ser revertida em sequência.",
    };
  }

  const eventoReversao: EventoEtapa = {
    id: `evt_rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    agendamentoId,
    etapa,
    tipo: "revertida",
    origem: "correcao",
    porUsuarioId: autorId || null,
    porNome: autorNome,
    papel,
    em: new Date().toISOString(),
    justificativa: cleanJustificativa,
  };

  const todos = readAllEtapaEvents();
  writeAllEtapaEvents([...todos, eventoReversao]);
  sincronizarStatusAgendamentoPorEtapas(agendamentoId);
  emitirSyncMultiAba("ETAPA_REVERTIDA", { agendamentoId, evento: eventoReversao });

  return { sucesso: true };
}

export interface PedirAtualizacaoParams {
  agendamentoId: string;
  autorId?: string | null;
  autorNome: string;
  papel: Papel;
}

/**
 * Registra solicitação de atualização do atendimento/admin para a equipe técnica.
 */
export function pedirAtualizacao(params: PedirAtualizacaoParams): {
  sucesso: boolean;
  erro?: string;
  horaFormatada?: string;
} {
  const { agendamentoId, autorId, autorNome, papel } = params;
  const eventosAtuais = getEtapaEventsForAppointment(agendamentoId);
  const permissao = podePedirAtualizacao(papel, eventosAtuais);

  if (!permissao.pode) {
    return { sucesso: false, erro: permissao.motivo || "Não é possível solicitar atualização." };
  }

  const estados = estadoEtapas(eventosAtuais);
  const atual = estados.find((e) => e.estado === "atual");
  if (!atual) {
    return { sucesso: false, erro: "Nenhuma etapa de atividade em andamento." };
  }

  const agoraIso = new Date().toISOString();
  const eventoPedido: EventoEtapa = {
    id: `evt_req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    agendamentoId,
    etapa: atual.etapaId,
    tipo: "pedido_atualizacao",
    origem: "manual",
    porUsuarioId: autorId || null,
    porNome: autorNome,
    papel,
    em: agoraIso,
    observacao: `Pedido de atualização operacional enviado pela recepção.`,
  };

  const todos = readAllEtapaEvents();
  writeAllEtapaEvents([...todos, eventoPedido]);
  notificarResponsavel(agendamentoId, atual.etapaId);
  emitirSyncMultiAba("PEDIDO_ATUALIZACAO", { agendamentoId, evento: eventoPedido });

  return {
    sucesso: true,
    horaFormatada: formatarTimestampEtapa(agoraIso),
  };
}
