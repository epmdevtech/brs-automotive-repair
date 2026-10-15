/**
 * tracking-public.ts — DTO Público, Projeção Segura e Contato para a Página do Cliente (SPEC-058).
 * Isola estritamente dados internos (LGPD) e projeta as 6 etapas canônicas da SPEC-057.
 */

import { ETAPAS_OPERACIONAIS, type EtapaId } from "../config/etapas.config";
import {
  estadoEtapas,
  etapaAtual,
  progresso,
  formatarTimestampEtapa,
  formatarTempoRelativo,
  type EventoEtapa,
  type EstadoEtapa,
} from "./etapas";
import type { Appointment } from "./types";
import { company } from "@/lib/brs";
import { BRS_BOOKING_CONFIG } from "../config/booking.config";

export const CONTATO_OFICINA = {
  telefoneFormatado: company.phone || "(45) 2035-9440",
  telefoneHref: company.phoneHref || "tel:+554520359440",
  // Número comercial de WhatsApp (a confirmar formalmente com o negócio)
  whatsappNumero: "554520359440",
  construirLinkWhatsApp: (protocolo: string) => {
    const texto = encodeURIComponent(`Olá! Gostaria de saber sobre o protocolo ${protocolo}.`);
    return `https://wa.me/554520359440?text=${texto}`;
  },
  construirLinkWhatsAppAprovacao: (protocolo: string) => {
    const texto = encodeURIComponent(
      `Olá! Recebi a notificação do protocolo ${protocolo} e gostaria de aprovar o orçamento da reparação.`,
    );
    return `https://wa.me/554520359440?text=${texto}`;
  },
};

export interface PublicCustomerStepDto {
  ordem: number; // 1 a 6
  id: EtapaId;
  titulo: string; // Título público em sentence case
  subtitulo?: string;
  descricaoPublica: string; // Descrição pública acolhedora
  estado: "concluida" | "atual" | "pendente";
  concluidaEm?: string; // ISO 8601
  concluidaEmFormatado?: string; // "15/10 às 07:42" ou "Hoje · 07:42"
  requerAcaoCliente?: boolean;
}

export interface PublicCustomerTrackingDto {
  protocolo: string; // Ex: "#BRS-7391"
  protocoloLimpo: string; // Ex: "BRS-7391"
  statusGeral: "em_andamento" | "concluido" | "cancelado";
  etapaAtualOrdem: number; // 1 a 6
  etapasConcluidasQtd: number; // 0 a 6
  etapaAtualTitulo: string; // Ex: "Veículo recebido na oficina"
  proximaEtapaTitulo?: string; // Ex: "Vistoria técnica e diagnóstico"
  porcentagemProgresso: number; // 0 a 100
  veiculoResumo: string; // Ex: "Honda Civic G10 Touring (2021)"
  placaMascarada: string; // Ex: "BCX-***4"
  servicoTitulo: string; // Ex: "Martelinho de ouro (PDR)"
  tecnicoPrimeiroNome?: string; // Primeiro nome se for pessoa real; omitido se for cargo genérico
  previsaoEntrega?: string; // Previsão SOMENTE se informada no cadastro
  ultimaAtualizacaoIso?: string;
  ultimaAtualizacaoRelativa: string; // "Atualizado agora", "Atualizado há 2 min"
  requerAcaoCliente: boolean; // True na etapa 4 (orçamento)
  etapas: PublicCustomerStepDto[];
}

/**
 * Mascara placa de veículo conforme LGPD (ex: BCX-2A34 -> BCX-***4).
 */
export function mascararPlacaPublica(placa?: string): string {
  if (!placa) return "Placa não informada";
  const clean = placa
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  if (clean.length < 4) return clean;
  const prefix = clean.slice(0, 3);
  const suffix = clean.slice(-1);
  return `${prefix}-***${suffix}`;
}

/**
 * Extrai apenas o primeiro nome se houver nome pessoal legítimo.
 * Evita repetir placeholders de cargo (ex: "Técnico Martelinho de Ouro").
 */
export function extrairPrimeiroNomeTecnico(nomeOuCargo?: string | null): string | undefined {
  if (!nomeOuCargo) return undefined;
  const clean = nomeOuCargo.trim();
  if (
    clean.toLowerCase().startsWith("tecnico") ||
    clean.toLowerCase().startsWith("técnico") ||
    clean.toLowerCase().includes("oficina") ||
    clean.toLowerCase().includes("administrador") ||
    clean.toLowerCase().includes("avaliador")
  ) {
    return undefined;
  }
  const primeiroNome = clean.split(" ")[0].trim();
  return primeiroNome.length > 1 ? primeiroNome : undefined;
}

/**
 * Gera texto público empático e seguro para cada uma das 6 etapas (F7).
 */
function gerarDescricaoPublica(etapaId: EtapaId, estado: EstadoEtapa): string {
  switch (etapaId) {
    case "agendamento_confirmado":
      if (estado.concluidaEm) {
        const hora = formatarTimestampEtapa(estado.concluidaEm);
        return `Confirmado${hora ? ` às ${hora}` : ""}.`;
      }
      return "Agendamento confirmado no sistema da oficina.";

    case "veiculo_recebido":
      return "Seu veículo foi recebido no box de entrada da oficina.";

    case "vistoria_diagnostico":
      return "Mapeamos cada avaria com iluminação técnica e conferimos o alinhamento.";

    case "aprovacao_orcamento":
      return "Apresentamos o orçamento (peças e insumos) para a sua autorização.";

    case "execucao_pdr":
      return "Desamassamos a lataria preservando a pintura original, conforme as normas das montadoras.";

    case "qualidade_entrega":
      return "Revisão final do reparo e entrega do veículo a você.";
  }
}

/**
 * Projeta o log interno de eventos e o agendamento em um DTO Público seguro.
 * Elimina dados confidenciais, notas internas e IDs sensíveis.
 */
export function toPublicCustomerTrackingDto(
  appointment: Appointment,
  eventos: EventoEtapa[],
): PublicCustomerTrackingDto {
  const estados = estadoEtapas(eventos);
  const infoProgresso = progresso(eventos);
  const numEtapaAtual = Math.min(etapaAtual(eventos), 6);
  const isCancelado = appointment.status === "CANCELLED";
  const isConcluido = infoProgresso.concluidas === 6 || appointment.status === "COMPLETED";

  // Identificar última atualização cronológica
  const eventosOrdenados = [...eventos].sort(
    (a, b) => new Date(b.em).getTime() - new Date(a.em).getTime(),
  );
  const ultimoEvento = eventosOrdenados[0];
  const ultimaAtualizacaoIso = ultimoEvento?.em || appointment.createdAt;

  const etapaAtualAtiva = estados.find((e) => e.estado === "atual");
  const proximaEtapa = estados.find(
    (e) => e.ordem === (etapaAtualAtiva ? etapaAtualAtiva.ordem + 1 : 7),
  );

  const requerAcaoCliente = Boolean(
    etapaAtualAtiva?.etapaId === "aprovacao_orcamento" && !isCancelado,
  );

  const etapasPublicas: PublicCustomerStepDto[] = ETAPAS_OPERACIONAIS.map((cfg) => {
    const estado = estados.find((e) => e.etapaId === cfg.id);
    const estadoValor: "concluida" | "atual" | "pendente" = isCancelado
      ? "pendente"
      : estado?.estado === "concluida"
        ? "concluida"
        : estado?.estado === "atual"
          ? "atual"
          : "pendente";

    let concluidaEmFormatado: string | undefined;
    if (estado?.concluidaEm && estadoValor === "concluida") {
      const hora = formatarTimestampEtapa(estado.concluidaEm);
      concluidaEmFormatado = hora;
    }

    return {
      ordem: cfg.ordem,
      id: cfg.id,
      titulo: cfg.tituloCompleto,
      subtitulo: cfg.subtitulo,
      descricaoPublica: gerarDescricaoPublica(cfg.id, estado || ({} as EstadoEtapa)),
      estado: estadoValor,
      concluidaEm: estado?.concluidaEm,
      concluidaEmFormatado,
      requerAcaoCliente: cfg.id === "aprovacao_orcamento" && estadoValor === "atual",
    };
  });

  // Título e resumo de veículo
  const veic = appointment.intake.vehicle;
  const veiculoResumo = `${veic.make} ${veic.model}${veic.year ? ` (${veic.year})` : ""}`;
  const placaMascarada = mascararPlacaPublica(veic.plate);

  // Mapear serviço
  let servicoTitulo = "Reparação Automotiva";
  if (appointment.serviceId.includes("martelinho")) {
    servicoTitulo = "Martelinho de ouro (PDR)";
  } else if (appointment.serviceId.includes("pintura")) {
    servicoTitulo = "Pintura automotiva em estufa";
  } else if (appointment.serviceId.includes("funilaria")) {
    servicoTitulo = "Funilaria técnica & colisão";
  }

  // Previsão de entrega somente se explicitamente informada (nunca inventar)
  const previsaoEntrega = (appointment.intake as { deliveryEstimate?: string })?.deliveryEstimate;

  const prof = BRS_BOOKING_CONFIG.professionals.find((p) => p.id === appointment.professionalId);
  const tecnicoPrimeiroNome = extrairPrimeiroNomeTecnico(prof?.name || appointment.professionalId);

  return {
    protocolo: appointment.protocol,
    protocoloLimpo: appointment.protocol.replace("#", ""),
    statusGeral: isCancelado ? "cancelado" : isConcluido ? "concluido" : "em_andamento",
    etapaAtualOrdem: numEtapaAtual,
    etapasConcluidasQtd: isCancelado ? 0 : infoProgresso.concluidas,
    etapaAtualTitulo: etapaAtualAtiva?.tituloCompleto || "Reparo concluído",
    proximaEtapaTitulo: proximaEtapa?.tituloCompleto,
    porcentagemProgresso: isCancelado ? 0 : isConcluido ? 100 : infoProgresso.porcentagem,
    veiculoResumo,
    placaMascarada,
    servicoTitulo,
    tecnicoPrimeiroNome,
    previsaoEntrega,
    ultimaAtualizacaoIso,
    ultimaAtualizacaoRelativa: formatarTempoRelativo(ultimaAtualizacaoIso),
    requerAcaoCliente,
    etapas: etapasPublicas,
  };
}
