import type {
  Appointment,
  AppointmentEvent,
  AppointmentEventType,
  AppointmentStatus,
  CustomerTrackingMilestone,
  CustomerTrackingView,
} from "./types";
import { MASTER_BOOKING_CONFIG } from "../config/booking.config";
import { formatDate, formatTime, formatDateTime } from "./time";
import { company } from "@/lib/brs";

/**
 * Lê todos os eventos persistidos no localStorage.
 */
export function readEventsFromStorage(): AppointmentEvent[] {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(MASTER_BOOKING_CONFIG.eventsStorageKey);
    if (!raw) return [];
    return JSON.parse(raw) as AppointmentEvent[];
  } catch {
    return [];
  }
}

/**
 * Escreve a lista completa de eventos no localStorage de forma append-only / atômica.
 */
export function writeEventsToStorage(events: AppointmentEvent[]): boolean {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return false;
  }
  try {
    localStorage.setItem(MASTER_BOOKING_CONFIG.eventsStorageKey, JSON.stringify(events));
    return true;
  } catch {
    return false;
  }
}

/**
 * Retorna os eventos associados a um agendamento específico, ordenados cronologicamente.
 */
export function getEventsForAppointment(appointmentId: string): AppointmentEvent[] {
  const all = readEventsFromStorage();
  return all
    .filter((e) => e.appointmentId === appointmentId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Registra um novo evento append-only no histórico do agendamento.
 * Garante idempotência: se um evento do mesmo tipo já foi criado nos últimos 2 segundos, evita duplicações.
 */
export function recordAppointmentEvent(
  data: Omit<AppointmentEvent, "id"> & { id?: string },
): AppointmentEvent {
  const all = readEventsFromStorage();
  const now = new Date();

  // Prevenção de duplo disparo imediato para o mesmo agendamento e tipo
  const duplicate = all.find(
    (e) =>
      e.appointmentId === data.appointmentId &&
      e.type === data.type &&
      Math.abs(now.getTime() - new Date(e.createdAt).getTime()) < 2000,
  );

  if (duplicate) {
    return duplicate;
  }

  const newEvent: AppointmentEvent = {
    id: data.id ?? `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    appointmentId: data.appointmentId,
    type: data.type,
    fromStatus: data.fromStatus,
    toStatus: data.toStatus,
    createdAt: data.createdAt ?? now.toISOString(),
    actorId: data.actorId,
    actorName: data.actorName,
    note: data.note,
    visibleToCustomer: data.visibleToCustomer,
    metadata: data.metadata,
  };

  const updated = [...all, newEvent];
  writeEventsToStorage(updated);
  return newEvent;
}

/**
 * Garante que agendamentos existentes possuam eventos mínimos correspondentes ao seu estado histórico.
 */
export function ensureInitialEvents(appointment: Appointment): AppointmentEvent[] {
  const existing = getEventsForAppointment(appointment.id);
  if (existing.length > 0) {
    return existing;
  }

  const createdTime = appointment.createdAt || new Date().toISOString();
  const eventsToCreate: AppointmentEvent[] = [];

  // Evento 1: Criação do cadastro
  const createdEvent: AppointmentEvent = {
    id: `evt_init_${appointment.id}_created`,
    appointmentId: appointment.id,
    type: "CREATED",
    fromStatus: undefined,
    toStatus: "PENDING",
    createdAt: createdTime,
    actorId: "customer",
    actorName: appointment.customer.name,
    note: "Cadastro de Pré-OS realizado pelo portal do cliente",
    visibleToCustomer: true,
  };
  eventsToCreate.push(createdEvent);

  // Evento 2: Confirmação do horário
  if (appointment.status !== "PENDING") {
    const confirmTime = new Date(new Date(createdTime).getTime() + 1000 * 60 * 2).toISOString();
    eventsToCreate.push({
      id: `evt_init_${appointment.id}_confirmed`,
      appointmentId: appointment.id,
      type: "CONFIRMED",
      fromStatus: "PENDING",
      toStatus: "CONFIRMED",
      createdAt: confirmTime,
      actorId: "system",
      actorName: "Master Sistema de Agenda",
      note: "Horário reservado com sucesso na grade operacional",
      visibleToCustomer: true,
    });
  }

  // Evento 3: Se já estiver concluído
  if (appointment.status === "COMPLETED") {
    const completeTime = new Date(
      new Date(createdTime).getTime() + 1000 * 60 * 60 * 3,
    ).toISOString();
    eventsToCreate.push({
      id: `evt_init_${appointment.id}_completed`,
      appointmentId: appointment.id,
      type: "COMPLETED",
      fromStatus: "CONFIRMED",
      toStatus: "COMPLETED",
      createdAt: completeTime,
      actorId: appointment.professionalId,
      actorName: "Técnico Master",
      note: "Serviço finalizado com checklist de qualidade aprovado",
      visibleToCustomer: true,
    });
  }

  // Evento 4: Se cancelado
  if (appointment.status === "CANCELLED") {
    const cancelTime = new Date(new Date(createdTime).getTime() + 1000 * 60 * 30).toISOString();
    eventsToCreate.push({
      id: `evt_init_${appointment.id}_cancelled`,
      appointmentId: appointment.id,
      type: "CANCELLED",
      fromStatus: "CONFIRMED",
      toStatus: "CANCELLED",
      createdAt: cancelTime,
      actorId: "admin",
      actorName: "Atendimento Master",
      note: "Agendamento cancelado no painel administrativo",
      visibleToCustomer: true,
    });
  }

  const all = readEventsFromStorage();
  writeEventsToStorage([...all, ...eventsToCreate]);
  return eventsToCreate;
}

/**
 * Mascara placa de veículo conforme LGPD (ex: RHZ4E91 -> RHZ-***1).
 */
export function maskPlate(plate?: string): string {
  if (!plate) return "Placa não informada";
  const clean = plate
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  if (clean.length < 4) return clean;
  const prefix = clean.slice(0, 3);
  const suffix = clean.slice(-1);
  return `${prefix}-***${suffix}`;
}

/**
 * Constrói a lista de etapas da jornada técnica personalizada para o agendamento.
 */
export function buildServiceMilestones(
  appointment: Appointment,
  events: AppointmentEvent[],
): CustomerTrackingMilestone[] {
  const isCancelled = appointment.status === "CANCELLED";
  const isCompleted = appointment.status === "COMPLETED";
  const isLeva = appointment.logistics.type === "leva-e-traz";
  const isInsurance = appointment.intake.isInsurance;

  const eventMap = new Map<AppointmentEventType, AppointmentEvent>();
  events.forEach((e) => {
    eventMap.set(e.type, e);
  });

  const milestones: CustomerTrackingMilestone[] = [];

  // 1. Cadastro & Pré-OS
  const createdEvt = eventMap.get("CREATED");
  milestones.push({
    id: "m_created",
    title: "1. Cadastro & Agendamento Confirmado",
    description: `Protocolo ${appointment.protocol} emitido em ${formatDateTime(
      new Date(appointment.createdAt),
    )}.`,
    timestamp: appointment.createdAt,
    status: isCancelled ? "cancelled" : "completed",
  });

  // 2. Coleta ou Recepção
  const receivedEvt = eventMap.get("VEHICLE_RECEIVED");
  const isReceivedDone = Boolean(receivedEvt || isCompleted);
  milestones.push({
    id: "m_received",
    title: isLeva ? "2. Remoção com Guincho (Toledo-PR)" : "2. Veículo Recebido na Oficina",
    description: isLeva
      ? `Agendado para coleta no bairro ${appointment.logistics.neighborhood ?? "Toledo-PR"}.`
      : `Recepção direta no box de entrada da Master Chapeação.`,
    timestamp: receivedEvt?.createdAt,
    status: isCancelled ? "cancelled" : isReceivedDone ? "completed" : "current",
  });

  // 3. Vistoria Técnica
  const inspectionEvt = eventMap.get("INSPECTION_COMPLETED");
  const isInspectionDone = Boolean(inspectionEvt || isCompleted);
  milestones.push({
    id: "m_inspection",
    title: "3. Vistoria Técnica & Diagnóstico",
    description:
      "Mapeamento minucioso de avarias com iluminação técnica e conferência de alinhamento.",
    timestamp: inspectionEvt?.createdAt,
    status: isCancelled
      ? "cancelled"
      : isInspectionDone
        ? "completed"
        : isReceivedDone
          ? "current"
          : "upcoming",
  });

  // 4. Aprovação Comercial / Seguradora
  const insuranceEvt = eventMap.get("INSURANCE_APPROVED");
  const isApprovalDone = Boolean(insuranceEvt || isCompleted);
  milestones.push({
    id: "m_approval",
    title: isInsurance ? "4. Regulação da Seguradora / Sinistro" : "4. Aprovação do Orçamento",
    description: isInsurance
      ? "Alinhamento com perito e liberação de ordem de serviço pela companhia parceira."
      : "Validação de insumos, peças e autorização formal do proprietário.",
    timestamp: insuranceEvt?.createdAt,
    status: isCancelled
      ? "cancelled"
      : isApprovalDone
        ? "completed"
        : isInspectionDone
          ? "current"
          : "upcoming",
  });

  // 5. Execução do Reparo Técnico
  const repairEvt =
    eventMap.get("REPAIR_STARTED") ||
    eventMap.get("PAINT_PREPARATION") ||
    eventMap.get("BOOTH_CURING") ||
    eventMap.get("QUALITY_CHECK");
  const isRepairDone = Boolean(repairEvt || isCompleted);
  const serviceTitle = appointment.serviceId.includes("martelinho")
    ? "Desamassamento PDR (Preserva Pintura)"
    : appointment.serviceId.includes("pintura")
      ? "Pintura em Estufa & Cura Térmica"
      : "Funilaria Estrutural & Alinhamento";

  milestones.push({
    id: "m_repair",
    title: `5. Execução: ${serviceTitle}`,
    description: "Trabalho técnico executado em conformidade com as normas das montadoras.",
    timestamp: repairEvt?.createdAt,
    status: isCancelled
      ? "cancelled"
      : isRepairDone
        ? "completed"
        : isApprovalDone
          ? "current"
          : "upcoming",
  });

  // 6. Controle de Qualidade & Entrega
  const completedEvt = eventMap.get("COMPLETED");
  milestones.push({
    id: "m_completed",
    title: "6. Controle de Qualidade & Entrega",
    description: "Inspeção final de acabamento, higienização de entrega e liberação do veículo.",
    timestamp: completedEvt?.createdAt,
    status: isCancelled
      ? "cancelled"
      : isCompleted
        ? "completed"
        : isRepairDone
          ? "current"
          : "upcoming",
  });

  return milestones;
}

/**
 * Constrói a visualização pública sanitizada (LGPD) para a rota `/acompanhar/$token`.
 */
export function buildCustomerTrackingView(
  appointment: Appointment,
  events: AppointmentEvent[],
): CustomerTrackingView {
  const service = MASTER_BOOKING_CONFIG.services.find((s) => s.id === appointment.serviceId);
  const professional = MASTER_BOOKING_CONFIG.professionals.find(
    (p) => p.id === appointment.professionalId,
  );
  const slotDate = new Date(appointment.startTime);

  return {
    protocol: appointment.protocol,
    serviceTitle: service?.title ?? appointment.serviceId,
    technicianName: professional?.name ?? "Equipe Técnica Master",
    status: appointment.status,
    maskedPlate: maskPlate(appointment.intake.vehicle.plate),
    vehicleSummary: `${appointment.intake.vehicle.make} ${appointment.intake.vehicle.model}${
      appointment.intake.vehicle.year ? ` (${appointment.intake.vehicle.year})` : ""
    }`,
    scheduledTime: `${formatDate(slotDate)} às ${formatTime(slotDate)}`,
    isLevaETraz: appointment.logistics.type === "leva-e-traz",
    createdAt: appointment.createdAt,
    events: buildServiceMilestones(appointment, events),
  };
}

/**
 * Gera mensagens pré-formatadas para comunicação de marcos sem custos de API externa.
 */
export interface MilestoneMessageOption {
  id: string;
  label: string;
  stageName: string;
  generateText: (appointment: Appointment) => string;
}

export const MILESTONE_MESSAGES: MilestoneMessageOption[] = [
  {
    id: "marco_1_agendamento",
    label: "Marco 1: Confirmação do Agendamento",
    stageName: "Agendamento Confirmado",
    generateText: (app) => {
      const slot = new Date(app.startTime);
      return (
        `Olá, ${app.customer.name}! 👋\n\n` +
        `Confirmamos o agendamento da sua avaliação na *Master Chapeação e Pinturas*.\n\n` +
        `📌 *Protocolo:* ${app.protocol}\n` +
        `🚗 *Veículo:* ${app.intake.vehicle.make} ${app.intake.vehicle.model}\n` +
        `📅 *Data e Horário:* ${formatDate(slot)} às ${formatTime(slot)}\n` +
        `📍 *Local:* ${company.address.full}\n\n` +
        `Caso precise de algo antes do horário, estamos à disposição!\n` +
        `*Master Chapeação e Pinturas* • Toledo-PR`
      );
    },
  },
  {
    id: "marco_2_recebido",
    label: "Marco 2: Veículo Recebido na Oficina",
    stageName: "Veículo Recebido",
    generateText: (app) => {
      return (
        `Olá, ${app.customer.name}! 🚘\n\n` +
        `Informamos que o seu veículo *${app.intake.vehicle.make} ${app.intake.vehicle.model}* já foi recebido no pátio da *Master Chapeação* (Protocolo: ${app.protocol}).\n\n` +
        `Realizamos o checklist de entrada e o veículo foi encaminhado para a vistoria técnica.\n\n` +
        `Qualquer atualização avisaremos por aqui!\n` +
        `*Master Chapeação e Pinturas*`
      );
    },
  },
  {
    id: "marco_3_vistoria",
    label: "Marco 3: Vistoria Técnica Concluída",
    stageName: "Vistoria Concluída",
    generateText: (app) => {
      return (
        `Olá, ${app.customer.name}! 🔍\n\n` +
        `A vistoria técnica detalhada do seu *${app.intake.vehicle.make} ${app.intake.vehicle.model}* foi concluída com sucesso.\n\n` +
        `📋 *Protocolo:* ${app.protocol}\n` +
        `O laudo técnico de avarias e a listagem de insumos/reparos estão prontos para prosseguimento.\n\n` +
        `Estamos à disposição para esclarecer qualquer detalhe técnico.\n` +
        `*Master Chapeação e Pinturas*`
      );
    },
  },
  {
    id: "marco_4_reparo",
    label: "Marco 4: Reparo / Pintura em Andamento",
    stageName: "Reparo em Andamento",
    generateText: (app) => {
      const isMartelinho = app.serviceId.includes("martelinho");
      const serviceName = isMartelinho
        ? "desamassamento técnico (PDR) preservando a pintura original"
        : "processo de funilaria e pintura técnica em cabine térmica";

      return (
        `Olá, ${app.customer.name}! ⚙️\n\n` +
        `Atualização do seu atendimento (Protocolo: ${app.protocol}):\n\n` +
        `O seu veículo *${app.intake.vehicle.make} ${app.intake.vehicle.model}* já está na fase de *${serviceName}*.\n\n` +
        `Seguimos os mais rigorosos padrões de alinhamento e acabamento automotivo.\n\n` +
        `*Master Chapeação e Pinturas*`
      );
    },
  },
  {
    id: "marco_5_pronto",
    label: "Marco 5: Veículo Pronto para Retirada",
    stageName: "Pronto para Retirada",
    generateText: (app) => {
      return (
        `Excelente notícia, ${app.customer.name}! 🎉✨\n\n` +
        `O seu veículo *${app.intake.vehicle.make} ${app.intake.vehicle.model}* está com todos os reparos concluídos e passou com sucesso pelo nosso controle de qualidade!\n\n` +
        `📌 *Protocolo:* ${app.protocol}\n` +
        `📍 *Endereço para Retirada:* ${company.address.full}\n` +
        `⏰ *Horário de Atendimento:* ${company.openingHours}\n\n` +
        `Agradecemos a confiança no trabalho da equipe Master!\n` +
        `*Master Chapeação e Pinturas*`
      );
    },
  },
];

/**
 * Constrói link direto wa.me com mensagem codificada para o WhatsApp do cliente.
 */
export function buildMilestoneWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const targetPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}
