import type { DamageArea, DamageType, DamageIntake, LogisticsData, CustomerData } from "./types";

export interface DamageAreaItem {
  id: DamageArea;
  label: string;
  category: "Dianteira" | "Traseira" | "Laterais" | "Vidros & Teto" | "Geral";
}

export const DAMAGE_AREAS_LIST: DamageAreaItem[] = [
  { id: "para-choque-dianteiro", label: "Para-choque Dianteiro", category: "Dianteira" },
  { id: "capo", label: "Capô do Motor", category: "Dianteira" },
  { id: "para-lama-esq", label: "Para-lama Dianteiro Esquerdo", category: "Dianteira" },
  { id: "para-lama-dir", label: "Para-lama Dianteiro Direito", category: "Dianteira" },

  { id: "porta-dianteira-esq", label: "Porta Dianteira Esquerda", category: "Laterais" },
  { id: "porta-dianteira-dir", label: "Porta Dianteira Direita", category: "Laterais" },
  { id: "porta-traseira-esq", label: "Porta Traseira Esquerda", category: "Laterais" },
  { id: "porta-traseira-dir", label: "Porta Traseira Direita", category: "Laterais" },
  { id: "lateral-esquerda", label: "Lateral Traseira Esquerda", category: "Laterais" },
  { id: "lateral-direita", label: "Lateral Traseira Direita", category: "Laterais" },

  { id: "para-choque-traseiro", label: "Para-choque Traseiro", category: "Traseira" },
  { id: "tampa-traseira", label: "Tampa do Porta-Malas", category: "Traseira" },

  { id: "teto", label: "Teto", category: "Vidros & Teto" },
  { id: "para-brisa", label: "Para-brisa (Vidro)", category: "Vidros & Teto" },
  { id: "carroceria-inteira", label: "Carroceria Completa (Estética)", category: "Geral" },
];

export interface DamageTypeItem {
  id: DamageType;
  label: string;
  recommendedService: string;
  description: string;
}

export const DAMAGE_TYPES_LIST: DamageTypeItem[] = [
  {
    id: "amassado-sem-risco",
    label: "Amassado sem quebra de tinta (Pequeno/Médio)",
    recommendedService: "Martelinho de Ouro",
    description: "Preserva a pintura original de fábrica sem necessidade de repintura.",
  },
  {
    id: "colisao-com-vinco",
    label: "Colisão com vinco profundo / Desalinhamento",
    recommendedService: "Funilaria Técnica",
    description: "Repuxamento estrutural milimétrico para retorno da geometria original.",
  },
  {
    id: "risco-profundo-descascamento",
    label: "Riscos profundos, raspadas ou tinta descascada",
    recommendedService: "Pintura em Estufa",
    description: "Preparação anticorrosiva e colorimetria com controle térmico.",
  },
  {
    id: "granizo",
    label: "Danos por chuva de granizo (Múltiplos amassados)",
    recommendedService: "Martelinho de Ouro em Lote",
    description: "Desamassamento artesanal em teto, capô e colunas.",
  },
  {
    id: "verniz-opaco-micro-riscos",
    label: "Pintura sem brilho, swirls ou micro-riscos circulares",
    recommendedService: "Espelhamento / Vitrificação",
    description: "Nivelamento óptico do verniz e proteção hidrofóbica SiO2.",
  },
  {
    id: "manchas-vidro",
    label: "Marcas de palheta ou manchas de chuva ácida no para-brisa",
    recommendedService: "Polimento de Para-brisa",
    description: "Restauração da clareza óptica sem troca do vidro original.",
  },
  {
    id: "outros",
    label: "Outra necessidade ou orientação geral",
    recommendedService: "Avaliação Geral",
    description: "Vistoria diagnóstica pelo especialista técnico Bruno.",
  },
];

/**
 * Gera um protocolo único curto e memorável no padrão #BRS-XXXXX.
 */
export function generateProtocol(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `#BRS-${result}`;
}

/**
 * Formata o resumo da Pré-OS em texto legível para o cliente ou para envio
 * no canal oficial confirmado (Instagram @brsreparacoes / Telefone).
 */
export function formatPreOsSummary(params: {
  protocol: string;
  serviceTitle: string;
  scheduledTime: string;
  customer: CustomerData;
  intake: DamageIntake;
  logistics: LogisticsData;
}): string {
  const { protocol, serviceTitle, scheduledTime, customer, intake, logistics } = params;
  const areasText =
    intake.affectedAreas.length > 0
      ? intake.affectedAreas
          .map((a) => DAMAGE_AREAS_LIST.find((item) => item.id === a)?.label ?? a)
          .join(", ")
      : "Não especificado";

  const damageTypeLabel =
    DAMAGE_TYPES_LIST.find((t) => t.id === intake.damageType)?.label ?? intake.damageType;

  const lines = [
    `🚘 *PRÉ-ORDEM DE SERVIÇO (PRÉ-OS)*: ${protocol}`,
    `----------------------------------------`,
    `🔧 *Serviço/Avaliação*: ${serviceTitle}`,
    `📅 *Horário Agendado*: ${scheduledTime}`,
    `👤 *Cliente*: ${customer.name.trim()}`,
    `📞 *Telefone*: ${customer.phone}`,
    ``,
    `🚗 *DADOS DO VEÍCULO*:`,
    `• Modelo: ${intake.vehicle.make} ${intake.vehicle.model} ${intake.vehicle.year ? `(${intake.vehicle.year})` : ""}`,
    intake.vehicle.plate ? `• Placa: ${intake.vehicle.plate.toUpperCase()}` : null,
    intake.vehicle.color ? `• Cor: ${intake.vehicle.color}` : null,
    `• Avarias Mapeadas: ${damageTypeLabel}`,
    `• Peças Afetadas: ${areasText}`,
    intake.description ? `• Queixa do Cliente: ${intake.description.trim()}` : null,
    intake.isInsurance ? `• Atendimento Relacionado a Seguradora/Sinistro: Sim` : null,
    ``,
    `📍 *LOGÍSTICA / ATENDIMENTO*:`,
    logistics.type === "leva-e-traz"
      ? `• Modalidade: Serviço Leva e Traz (Coleta em Toledo-PR)\n• Endereço: ${logistics.address ?? ""}, Bairro ${logistics.neighborhood ?? ""}\n• Veículo rodando?: ${logistics.vehicleDrivable ? "Sim" : "Não (requer guincho)"}`
      : `• Modalidade: Atendimento Presencial na Oficina BRS (Toledo-PR)`,
  ].filter((line): line is string => line !== null);

  return lines.join("\n");
}

/**
 * Constrói o link oficial do WhatsApp com mensagem pré-formatada para a oficina
 * entrar em contato direto com o cliente para confirmar o agendamento.
 */
export function buildCustomerWhatsAppLink(appointment: {
  protocol: string;
  customer: CustomerData;
  intake: DamageIntake;
  serviceTitle: string;
  scheduledTime: string;
  logistics: LogisticsData;
}): string {
  const digits = appointment.customer.phone.replace(/\D/g, "");
  const levaText =
    appointment.logistics.type === "leva-e-traz"
      ? `\n📍 *Modalidade*: Serviço Leva e Traz (Coleta em Toledo-PR no endereço: ${appointment.logistics.address ?? ""}, ${appointment.logistics.neighborhood ?? ""})`
      : `\n📍 *Modalidade*: Atendimento presencial na oficina BRS em Toledo-PR`;

  const message = [
    `Olá, ${appointment.customer.name.trim()}!`,
    `Aqui é da equipe da *BRS Reparações Automotivas* (Toledo-PR).`,
    ``,
    `Confirmamos o recebimento do seu agendamento na nossa agenda técnica! 🚗✨`,
    `• *Protocolo*: ${appointment.protocol}`,
    `• *Serviço / Vistoria*: ${appointment.serviceTitle}`,
    `• *Horário Agendado*: ${appointment.scheduledTime}`,
    `• *Veículo*: ${appointment.intake.vehicle.make} ${appointment.intake.vehicle.model}${appointment.intake.vehicle.plate ? ` (${appointment.intake.vehicle.plate.toUpperCase()})` : ""}`,
    levaText,
    ``,
    `Seu horário está garantido em nossa oficina. Se desejar nos adiantar fotos ou tiver qualquer dúvida, estamos à disposição por aqui!`,
  ].join("\n");

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
