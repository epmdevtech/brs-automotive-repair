import { z } from "zod";
import { company } from "./brs";

export const MAX_BRIEFING_JSON_BYTES = 512 * 1024; // 512 KB

/** Validação determinística de CNPJ com dígitos verificadores */
export function isValidCNPJ(val: string): boolean {
  if (!val) return false;
  const clean = val.replace(/\D/g, "");
  if (clean.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(clean)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum1 = 0;
  for (let i = 0; i < 12; i++) {
    sum1 += parseInt(clean[i], 10) * weights1[i];
  }
  const rest1 = sum1 % 11;
  const d1 = rest1 < 2 ? 0 : 11 - rest1;
  if (parseInt(clean[12], 10) !== d1) return false;

  let sum2 = 0;
  for (let i = 0; i < 13; i++) {
    sum2 += parseInt(clean[i], 10) * weights2[i];
  }
  const rest2 = sum2 % 11;
  const d2 = rest2 < 2 ? 0 : 11 - rest2;
  return parseInt(clean[13], 10) === d2;
}

export function formatCNPJ(value: string): string {
  const clean = value.replace(/\D/g, "").slice(0, 14);
  if (clean.length <= 2) return clean;
  if (clean.length <= 5) return `${clean.slice(0, 2)}.${clean.slice(2)}`;
  if (clean.length <= 8) return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5)}`;
  if (clean.length <= 12)
    return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8)}`;
  return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8, 12)}-${clean.slice(12, 14)}`;
}

/** Conversão de cor hex para RGB */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }
  return null;
}

/** Luminância relativa conforme WCAG 2.2 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/** Razão de contraste entre duas cores hexadecimais (ex: 4.5 para 4.5:1) */
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1;

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Number(ratio.toFixed(2));
}

/** Avaliação de conformidade WCAG */
export function evaluateWCAGContrast(ratio: number) {
  return {
    ratio,
    passesNormalAA: ratio >= 4.5,
    passesNormalAAA: ratio >= 7.0,
    passesLargeAA: ratio >= 3.0,
    passesLargeAAA: ratio >= 4.5,
  };
}

// ==========================================
// SCHEMAS ZOD PARA O BRIEFING MULTINICHO
// ==========================================

export const MembroEquipeSchema = z.object({
  id: z.string(),
  nome: z.string().min(2, "Informe o nome"),
  fotoArquivoId: z.string().optional(),
  miniBio: z.string().optional(),
  formacao: z.string().optional(),
  camposNicho: z
    .object({
      especialidade_tecnica: z.string().optional(),
      certificacoes_fabricante: z.string().optional(),
    })
    .passthrough()
    .optional()
    .default({}),
  unidadesIds: z.array(z.string()).default([]),
  diasHorarios: z.string().optional(),
  aceitaAgendamentoOnline: z.boolean().default(true),
  autorizacaoUsoImagem: z.boolean().default(false),
});

export type MembroEquipe = z.infer<typeof MembroEquipeSchema>;

export const ItemServicoSchema = z.object({
  id: z.string(),
  nome: z.string().min(2, "Informe o nome do serviço"),
  categoria: z.string().optional(),
  descricao: z.string().optional(),
  duracaoMinutos: z.number().min(5, "Duração mínima de 5 minutos"),
  profissionaisIds: z.array(z.string()).default([]),
  exigeAvaliacaoPrevia: z.boolean().default(false),
  intervaloAposAtendimentoMinutos: z.number().default(0),
  exibirValorNoSite: z.enum(["exibir", "a_partir_de", "sob_consulta"]).default("sob_consulta"),
  valorTexto: z.string().optional(),
  camposNicho: z
    .object({
      modalidade_execucao: z.string().optional(),
    })
    .passthrough()
    .optional()
    .default({}),
});

export type ItemServico = z.infer<typeof ItemServicoSchema>;

export const UnidadeAtendimentoSchema = z.object({
  id: z.string(),
  nomeIdentificador: z.string().min(2, "Informe a identificação da unidade"),
  enderecoCompleto: z.string().min(5, "Informe o endereço"),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  linkMapa: z.string().optional(),
  estacionamento: z.string().optional(),
  acessibilidadePcd: z.boolean().default(true),
  fotosArquivosIds: z.array(z.string()).default([]),
  camposNicho: z.record(z.string(), z.unknown()).optional().default({}),
});

export type UnidadeAtendimento = z.infer<typeof UnidadeAtendimentoSchema>;

export const ContratanteSchema = z.object({
  razao_social: z.string().min(3, "Razão social é obrigatória"),
  nome_fantasia: z.string().optional(),
  cnpj: z
    .string()
    .min(14, "CNPJ deve conter no mínimo 14 dígitos")
    .refine(isValidCNPJ, { message: "Número de CNPJ inválido" }),
  endereco_faturamento: z.string().min(5, "Endereço de faturamento é obrigatório"),
  email_financeiro: z.string().email("E-mail financeiro inválido"),
  responsavel_legal: z.string().min(3, "Nome do responsável legal é obrigatório"),
  contato_operacional: z.string().min(3, "Contato operacional é obrigatório"),
  aprovador_final: z.string().min(3, "Nome do aprovador final é obrigatório"),
});

export const IdentidadeVisualSchema = z.object({
  logo_arquivo_id: z.string().optional().default("logo-padrao.png"),
  manual_marca_id: z.string().optional(),
  cor_primaria_hex: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Cor primária inválida (ex: #D4AF37)"),
  cor_secundaria_hex: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Cor secundária inválida (ex: #1C1F26)")
    .optional()
    .or(z.literal("")),
  cor_fundo_hex: z.string().optional().default("#0B0D10"),
  sites_referencia_positivos: z.string().optional(),
  sites_referencia_negativos: z.string().optional(),
  percepcao_desejada: z.string().optional(),
  tom_de_voz: z.string().optional(),
});

export const RegrasAgendaSchema = z.object({
  antecedencia_minima_horas: z.number().min(0).default(4),
  antecedencia_maxima_dias: z.number().min(1).default(30),
  prazo_cancelamento_horas: z.number().min(0).default(12),
  tipo_confirmacao: z.enum(["automatica", "manual"]).default("manual"),
  limite_agendamentos_simultaneos: z.number().min(1).default(3),
  canais_aviso_novo_agendamento: z.array(z.string()).default(["whatsapp", "email"]),
  camposNicho: z
    .object({
      solicita_placa_modelo_reserva: z.boolean().default(true),
      atende_emergencia_guincho: z.boolean().default(false),
      oferece_leva_e_traz: z.boolean().default(true),
    })
    .passthrough()
    .optional()
    .default({}),
});

export const ConteudoSchema = z.object({
  problema_atual: z.string().optional(),
  publico_alvo_jornada: z.string().optional(),
  objetivos_indicadores_sucesso: z.string().optional(),
  texto_sobre: z.string().optional(),
  principais_diferenciais: z.string().optional(),
  cidades_bairros_atendidos: z.string().optional(),
  link_google_meu_negocio: z.string().optional(),
  redes_sociais: z.string().optional(),
});

export const TecnicoSchema = z.object({
  dominio_personalizado: z.string().optional(),
  onde_dominio_registrado: z.string().optional(),
  sistema_gestao_atual: z.string().optional(),
});

export const PrazosSchema = z.object({
  data_desejada_lancamento: z.string().optional(),
});

export const BriefingCompletoSchema = z.object({
  nicho: z.string().default("oficina_automotiva"),
  versao: z.literal("1.0").default("1.0"),
  contratante: ContratanteSchema,
  identidade_visual: IdentidadeVisualSchema,
  equipe: z.object({
    membros: z.array(MembroEquipeSchema).min(1, "Cadastre ao menos um membro na equipe"),
  }),
  servicos: z.object({
    itens: z.array(ItemServicoSchema).min(1, "Cadastre ao menos um serviço"),
    camposNicho: z.record(z.string(), z.unknown()).optional().default({}),
  }),
  regras_agenda: RegrasAgendaSchema,
  unidades: z.object({
    locais: z.array(UnidadeAtendimentoSchema).min(1, "Cadastre ao menos uma unidade"),
    camposNicho: z.record(z.string(), z.unknown()).optional().default({}),
  }),
  conteudo: ConteudoSchema.default({}),
  tecnico: TecnicoSchema.default({}),
  prazos: PrazosSchema.default({}),
  pendencias: z.record(z.string(), z.boolean()).default({}),
});

export type BriefingDadosCompletos = z.infer<typeof BriefingCompletoSchema>;

// ==========================================
// SCHEMAS E TIPOS DE EXPORT DO BOOKING
// ==========================================

export interface BookingUnitConfig {
  id: string;
  name: string;
  address: string;
  phone?: string;
  whatsapp?: string;
  maps_link?: string;
  parking?: string;
  accessible: boolean;
  niche_attributes?: Record<string, unknown>;
}

export interface BookingProfessionalConfig {
  id: string;
  name: string;
  specialties: string;
  registration_number?: string;
  online_booking: boolean;
  photo_file_id?: string;
  niche_attributes?: Record<string, unknown>;
}

export interface BookingServiceConfig {
  id: string;
  name: string;
  category?: string;
  description?: string;
  duration_minutes: number;
  professional_ids: string[];
  requires_prior_assessment: boolean;
  buffer_after_minutes: number;
  price_display: "exibir" | "a_partir_de" | "sob_consulta";
  price_text?: string;
  niche_attributes?: Record<string, unknown>;
}

export interface BookingRulesConfig {
  min_lead_time_hours: number;
  max_lead_time_days: number;
  cancellation_window_hours: number;
  confirmation_flow: "automatica" | "manual";
  max_active_bookings_per_user: number;
  requires_guardian_for_minors: boolean;
  differentiate_first_and_followup?: boolean;
  niche_rules?: Record<string, unknown>;
}

export interface BookingNotificationsConfig {
  channels: string[];
  operational_contact: string;
  financial_email: string;
}

export interface BookingDiscoveryContext {
  current_problem?: string;
  target_audience_journey?: string;
  success_kpis?: string;
}

export interface BookingConfig {
  version: "1.0";
  exported_at: string;
  business_name: string;
  niche: string;
  units: BookingUnitConfig[];
  professionals: BookingProfessionalConfig[];
  services: BookingServiceConfig[];
  booking_rules: BookingRulesConfig;
  notifications: BookingNotificationsConfig;
  discovery_context?: BookingDiscoveryContext;
}

/**
 * Constrói o booking-config.json estruturado a partir do briefing
 */
export function buildBookingConfig(
  dados: Partial<BriefingDadosCompletos>,
  nomeNegocio: string = "Master Chapeação e Pinturas",
): BookingConfig {
  const contratante = dados.contratante || {
    razao_social: nomeNegocio,
    cnpj: "",
    endereco_faturamento: "",
    email_financeiro: "",
    responsavel_legal: "",
    contato_operacional: "",
    aprovador_final: "",
  };

  const units: BookingUnitConfig[] = (dados.unidades?.locais || []).map((u) => ({
    id: u.id,
    name: u.nomeIdentificador,
    address: u.enderecoCompleto,
    phone: u.telefone || undefined,
    whatsapp: u.whatsapp || undefined,
    maps_link: u.linkMapa || undefined,
    parking: u.estacionamento || undefined,
    accessible: Boolean(u.acessibilidadePcd),
    niche_attributes: u.camposNicho,
  }));

  const professionals: BookingProfessionalConfig[] = (dados.equipe?.membros || []).map((m) => ({
    id: m.id,
    name: m.nome,
    specialties:
      m.camposNicho?.especialidade_tecnica || m.formacao || "Técnico Especialista em Reparação",
    registration_number: m.camposNicho?.certificacoes_fabricante || undefined,
    online_booking: Boolean(m.aceitaAgendamentoOnline),
    photo_file_id: m.fotoArquivoId || undefined,
    niche_attributes: m.camposNicho,
  }));

  const services: BookingServiceConfig[] = (dados.servicos?.itens || []).map((s) => ({
    id: s.id,
    name: s.nome,
    category: s.categoria || "Geral",
    description: s.descricao || undefined,
    duration_minutes: s.duracaoMinutos,
    professional_ids: s.profissionaisIds || [],
    requires_prior_assessment: Boolean(s.exigeAvaliacaoPrevia),
    buffer_after_minutes: s.intervaloAposAtendimentoMinutos || 0,
    price_display: s.exibirValorNoSite || "sob_consulta",
    price_text: s.valorTexto || undefined,
    niche_attributes: s.camposNicho,
  }));

  const booking_rules: BookingRulesConfig = {
    min_lead_time_hours: dados.regras_agenda?.antecedencia_minima_horas ?? 4,
    max_lead_time_days: dados.regras_agenda?.antecedencia_maxima_dias ?? 30,
    cancellation_window_hours: dados.regras_agenda?.prazo_cancelamento_horas ?? 12,
    confirmation_flow: dados.regras_agenda?.tipo_confirmacao ?? "manual",
    max_active_bookings_per_user: dados.regras_agenda?.limite_agendamentos_simultaneos ?? 2,
    requires_guardian_for_minors: false,
    differentiate_first_and_followup: false,
    niche_rules: dados.regras_agenda?.camposNicho || {},
  };

  const notifications: BookingNotificationsConfig = {
    channels: dados.regras_agenda?.canais_aviso_novo_agendamento || ["whatsapp", "email"],
    operational_contact: contratante.contato_operacional || "",
    financial_email: contratante.email_financeiro || "",
  };

  const discovery_context: BookingDiscoveryContext = {
    current_problem: dados.conteudo?.problema_atual || undefined,
    target_audience_journey: dados.conteudo?.publico_alvo_jornada || undefined,
    success_kpis: dados.conteudo?.objetivos_indicadores_sucesso || undefined,
  };

  return {
    version: "1.0",
    exported_at: new Date().toISOString(),
    business_name: contratante.razao_social || nomeNegocio,
    niche: dados.nicho || "oficina_automotiva",
    units,
    professionals,
    services,
    booking_rules,
    notifications,
    discovery_context,
  };
}

// ==========================================
// SEED CANÔNICO DA MASTER CHAPEAÇÃO E PINTURAS
// ==========================================

export const masterDefaultBriefing: BriefingDadosCompletos = {
  nicho: "oficina_automotiva",
  versao: "1.0",
  contratante: {
    razao_social: company.legalName,
    nome_fantasia: company.name,
    cnpj: company.cnpj,
    endereco_faturamento: company.address.full,
    email_financeiro: "oficynamastertoledo@gmail.com",
    responsavel_legal: "Equipe Master (Direção)",
    contato_operacional: company.phone,
    aprovador_final: "Equipe Master",
  },
  identidade_visual: {
    logo_arquivo_id: "logo-master.webp",
    manual_marca_id: "manual-identidade-master.pdf",
    cor_primaria_hex: "#D4AF37",
    cor_secundaria_hex: "#1C1F26",
    cor_fundo_hex: "#0B0D10",
    sites_referencia_positivos: "Estética refinada, estilo Awwwards Dark Luxury automotivo.",
    sites_referencia_negativos:
      "Sites poluídos, cores berrantes, estética genérica de oficina suja.",
    percepcao_desejada:
      "Precisão artesanal, confiança inabalável, alta tecnologia e transparência.",
    tom_de_voz: "Técnico, seguro, cortês e objetivo.",
  },
  equipe: {
    membros: [
      {
        id: "membro-equipe-tecnica",
        nome: "Equipe Técnica Master",
        miniBio: company.team.bio,
        formacao: "Especialista em Reparação Estrutural, Funilaria Fina e Pintura em Estufa",
        camposNicho: {
          especialidade_tecnica: "Funilaria & Pintura Automotiva de Alta Precisão",
          certificacoes_fabricante: "Certificação em Colorimetria e Alinhamento Técnico de Painéis",
        },
        unidadesIds: ["unidade-matriz-toledo"],
        diasHorarios: "Segunda a Sexta, 08h às 12h e das 13h30 às 18h30",
        aceitaAgendamentoOnline: true,
        autorizacaoUsoImagem: true,
      },
      {
        id: "membro-equipe-martelinho",
        nome: "Especialista em Martelinho de Ouro",
        miniBio:
          "Técnico dedicado à remoção de amassados sem agressão ou repintura do verniz original de fábrica.",
        formacao: "Técnico em Martelinho Americano e Reparação de Danos de Granizo",
        camposNicho: {
          especialidade_tecnica: "Desamassamento Fino e Martelinho de Ouro",
          certificacoes_fabricante: "Treinamento Técnico em Preservação de Pintura Original",
        },
        unidadesIds: ["unidade-matriz-toledo"],
        diasHorarios: "Segunda a Sexta, 08h às 12h e das 13h30 às 18h30",
        aceitaAgendamentoOnline: true,
        autorizacaoUsoImagem: true,
      },
    ],
  },
  servicos: {
    itens: [
      {
        id: "serv-funilaria",
        nome: "Funilaria Estrutural e Recuperação de Lataria",
        categoria: "Funilaria",
        descricao:
          "Alinhamento milimétrico de chapas, recuperação de vincos e soldagem técnica de segurança.",
        duracaoMinutos: 180,
        profissionaisIds: ["membro-equipe-tecnica"],
        exigeAvaliacaoPrevia: true,
        intervaloAposAtendimentoMinutos: 30,
        exibirValorNoSite: "sob_consulta",
        valorTexto: "Sob avaliação técnica prévia",
        camposNicho: {
          modalidade_execucao: "no_box",
        },
      },
      {
        id: "serv-pintura",
        nome: "Pintura em Estufa Pressurizada e Colorimetria Computadorizada",
        categoria: "Pintura",
        descricao:
          "Aplicação de tintas premium e vernizes de alto sólido com cura térmica em estufa pressurizada.",
        duracaoMinutos: 240,
        profissionaisIds: ["membro-equipe-tecnica"],
        exigeAvaliacaoPrevia: true,
        intervaloAposAtendimentoMinutos: 45,
        exibirValorNoSite: "sob_consulta",
        valorTexto: "Sob avaliação técnica prévia",
        camposNicho: {
          modalidade_execucao: "no_box",
        },
      },
      {
        id: "serv-martelinho",
        nome: "Martelinho de Ouro (Preservação da Pintura Original)",
        categoria: "Martelinho de Ouro",
        descricao:
          "Técnica artesanal para desamassar pequenas colisões, batidas de porta e danos de granizo.",
        duracaoMinutos: 90,
        profissionaisIds: ["membro-equipe-martelinho"],
        exigeAvaliacaoPrevia: true,
        intervaloAposAtendimentoMinutos: 15,
        exibirValorNoSite: "sob_consulta",
        valorTexto: "A partir de análise fotográfica",
        camposNicho: {
          modalidade_execucao: "no_box",
        },
      },
      {
        id: "serv-estetica",
        nome: "Estética Automotiva e Polimento Técnico Especializado",
        categoria: "Estética Automotiva",
        descricao:
          "Espelhamento, vitrificação cerâmica e remoção de micro-riscos preservando a espessura do verniz.",
        duracaoMinutos: 120,
        profissionaisIds: ["membro-equipe-tecnica"],
        exigeAvaliacaoPrevia: false,
        intervaloAposAtendimentoMinutos: 20,
        exibirValorNoSite: "a_partir_de",
        valorTexto: "Consulte opções por porte de veículo",
        camposNicho: {
          modalidade_execucao: "no_box",
        },
      },
    ],
    camposNicho: {
      nicho_setor: "Reparação e Estética Automotiva",
    },
  },
  regras_agenda: {
    antecedencia_minima_horas: 4,
    antecedencia_maxima_dias: 30,
    prazo_cancelamento_horas: 12,
    tipo_confirmacao: "manual",
    limite_agendamentos_simultaneos: 3,
    canais_aviso_novo_agendamento: ["whatsapp", "email"],
    camposNicho: {
      solicita_placa_modelo_reserva: true,
      atende_emergencia_guincho: true,
      oferece_leva_e_traz: true,
    },
  },
  unidades: {
    locais: [
      {
        id: "unidade-matriz-toledo",
        nomeIdentificador: "Master Toledo",
        enderecoCompleto: company.address.full,
        telefone: company.phone,
        whatsapp: company.phone,
        linkMapa:
          "https://www.google.com/maps/search/?api=1&query=Av.+Marip%C3%A1%2C+4138%2C+Centro%2C+Toledo+-+PR",
        estacionamento: "Pátio próprio seguro com monitoramento para clientes e peritos",
        acessibilidadePcd: true,
        fotosArquivosIds: ["fachada-master.webp", "box-estufa-master.webp"],
        camposNicho: {
          cidade: "Toledo",
          estado: "PR",
          area_cobertura_leva_traz: "Área urbana de Toledo-PR",
        },
      },
    ],
    camposNicho: {},
  },
  conteudo: {
    problema_atual:
      "Clientes buscam reparos estéticos e estruturais sem perder a originalidade do carro e sem orçamentos abusivos.",
    publico_alvo_jornada:
      "Proprietários de veículos particulares exigentes, segurados e corretores de seguros em Toledo e região.",
    objetivos_indicadores_sucesso:
      "Aumentar a taxa de orçamentos qualificados agendados pelo portal e consolidar autoridade regional.",
    texto_sobre:
      "A Master Chapeação e Pinturas nasceu da dedicação artesanal aliada à tecnologia em funilaria, pintura em estufa e martelinho de ouro.",
    principais_diferenciais:
      "Atendimento transparente, estufa profissional, colorimetria de precisão, preservação de pintura original e comodidade com Guincho.",
    cidades_bairros_atendidos: "Toledo-PR e municípios vizinhos do Oeste do Paraná.",
    link_google_meu_negocio:
      "https://www.google.com/maps/search/?api=1&query=Av.+Marip%C3%A1%2C+4138%2C+Centro%2C+Toledo+-+PR",
    redes_sociais:
      "Instagram: https://www.instagram.com/masterchapeacao2022/ | Facebook: https://www.facebook.com/1630662447189202",
  },
  tecnico: {
    dominio_personalizado: "masterchapeacao.com.br",
    onde_dominio_registrado: "Registro.br",
    sistema_gestao_atual: "Planilhas e WhatsApp comercial",
  },
  prazos: {
    data_desejada_lancamento: "Imediato / Fase 2 de Implantação EPM DevTech",
  },
  pendencias: {},
};

// ==========================================
// PERSISTÊNCIA EM LOCALSTORAGE E UTILITÁRIOS
// ==========================================

export const BRIEFING_STORAGE_KEY = "master_briefing_draft_v1";

export function saveBriefingDraft(dados: Partial<BriefingDadosCompletos>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BRIEFING_STORAGE_KEY, JSON.stringify(dados));
  } catch (err) {
    console.error("Falha ao salvar rascunho de briefing no localStorage:", err);
  }
}

export function loadBriefingDraft(): Partial<BriefingDadosCompletos> {
  if (typeof window === "undefined") return masterDefaultBriefing;
  try {
    const raw = localStorage.getItem(BRIEFING_STORAGE_KEY);
    if (!raw) return masterDefaultBriefing;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return masterDefaultBriefing;
  }
}

export function clearBriefingDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(BRIEFING_STORAGE_KEY);
  } catch (err) {
    console.error("Falha ao limpar rascunho de briefing:", err);
  }
}

/**
 * Gera mensagem estruturada para envio direto via WhatsApp ou Área de Transferência
 */
export function generateBriefingSummaryMessage(
  dados: Partial<BriefingDadosCompletos>,
  pendenciasCount: number,
): string {
  const c = dados.contratante;
  const numServicos = dados.servicos?.itens?.length || 0;
  const numEquipe = dados.equipe?.membros?.length || 0;
  const numUnidades = dados.unidades?.locais?.length || 0;

  return [
    `*📋 BRIEFING CONCLUÍDO — EPM DEVTECH*`,
    `----------------------------------------`,
    `*Empresa:* ${c?.nome_fantasia || c?.razao_social || company.name}`,
    `*CNPJ:* ${c?.cnpj || "Pendente"}`,
    `*Responsável:* ${c?.responsavel_legal || "Não informado"}`,
    `*Contato Operacional:* ${c?.contato_operacional || "Não informado"}`,
    `*E-mail Financeiro:* ${c?.email_financeiro || "Não informado"}`,
    ``,
    `*🛠️ Configurações Ingestadas:*`,
    `• Equipe: ${numEquipe} profissional(is) cadastrado(s)`,
    `• Serviços: ${numServicos} especialidade(s) registrada(s)`,
    `• Unidades: ${numUnidades} endereço(s) configurado(s)`,
    `• Cor Primária: ${dados.identidade_visual?.cor_primaria_hex || "#D4AF37"}`,
    `• Cor Secundária: ${dados.identidade_visual?.cor_secundaria_hex || "#1C1F26"}`,
    ``,
    `*⚠️ Pendências Notificadas:* ${pendenciasCount === 0 ? "Nenhuma (100% preenchido)" : `${pendenciasCount} item(ns) pendente(s)`}`,
    ``,
    `_Payload de dados estruturados gerado e pronto para ingestão automática via EPM DEVTECH Engine._`,
  ].join("\n");
}
