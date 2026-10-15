import type { Professional, ServiceDefinition, WorkingHours } from "../domain/types";
import { company } from "@/lib/brs";

export interface BookingConfig {
  projectName: string;
  nicheName: string;
  businessName: string;
  timezone: string;
  minNoticeMinutes: number;
  maxAdvanceDays: number;
  slotIntervalMinutes: number;
  allowAnyProfessional: boolean;
  showPrices: boolean;
  services: ServiceDefinition[];
  professionals: Professional[];
  workingHours: WorkingHours;
  levaETraz: {
    enabled: boolean;
    city: string;
    additionalBufferMinutes: number;
  };
  storageKey: string;
  lockName: string;
  syncChannelName: string;
}

export const BRS_BOOKING_CONFIG: BookingConfig = {
  projectName: "BRS Reparações Automotivas",
  nicheName: "Reparações Automotivas, Funilaria, Pintura e Martelinho de Ouro",
  businessName: `${company.name} (${company.legalName})`,
  timezone: "America/Sao_Paulo",
  minNoticeMinutes: 120, // 2 horas de aviso prévio para organização do pátio
  maxAdvanceDays: 30, // Janela de até 30 dias
  slotIntervalMinutes: 45, // Avaliação técnica minuciosa
  allowAnyProfessional: true,
  showPrices: false, // Funilaria/Pintura exigem vistoria prévia

  services: [
    {
      id: "avaliacao-funilaria",
      title: "Avaliação Técnica de Funilaria & Colisão",
      short: "Funilaria",
      durationMinutes: 45,
      bufferMinutes: 15,
      category: "Reparação",
      requiresVehicleData: true,
      allowsLevaETraz: true,
      description:
        "Inspeção estrutural, alinhamento de painéis e avaliação de danos em lataria decorrentes de colisões.",
    },
    {
      id: "avaliacao-pintura",
      title: "Avaliação Colorimétrica & Pintura em Estufa",
      short: "Pintura",
      durationMinutes: 45,
      bufferMinutes: 15,
      category: "Reparação",
      requiresVehicleData: true,
      allowsLevaETraz: true,
      description:
        "Análise de camada de verniz, tonalidade de cor e preparo para aplicação em estufa térmica.",
    },
    {
      id: "martelinho-express",
      title: "Vistoria / Martelinho de Ouro (PDR)",
      short: "Martelinho de Ouro",
      durationMinutes: 45,
      bufferMinutes: 15,
      category: "Reparação Especializada",
      requiresVehicleData: true,
      allowsLevaETraz: true,
      description:
        "Mapeamento com luminária de linhas para desamassamento sem agressão à pintura original.",
    },
    {
      id: "avaliacao-estetica",
      title: "Avaliação de Espelhamento & Vitrificação Cerâmica",
      short: "Estética & Proteção",
      durationMinutes: 30,
      bufferMinutes: 15,
      category: "Estética",
      requiresVehicleData: true,
      allowsLevaETraz: true,
      description:
        "Inspeção óptica de microrriscos, swirls e espessura do verniz para correção e blindagem SiO2.",
    },
    {
      id: "polimento-parabrisa",
      title: "Polimento Técnico de Para-brisa",
      short: "Polimento de Para-brisa",
      durationMinutes: 60,
      bufferMinutes: 15,
      category: "Vidros",
      requiresVehicleData: true,
      allowsLevaETraz: true,
      description:
        "Remoção de marcas de palheta e chuva ácida para restauração da transparência óptica original.",
    },
  ],

  professionals: [
    {
      id: "bruno-tecnico",
      name: "Bruno (Funilaria & Vistoria)",
      role: "Fundador e Avaliador Técnico",
      sortOrder: 1,
    },
    {
      id: "tecnico-martelinho",
      name: "Técnico Martelinho de Ouro",
      role: "Especialista em PDR / Desamassamento",
      sortOrder: 2,
    },
    {
      id: "tecnico-pintura",
      name: "Técnico Pintura em Estufa",
      role: "Colorimetria e Cabine Térmica",
      sortOrder: 3,
    },
  ],

  workingHours: {
    weekdays: [
      { start: "08:00", end: "12:00" },
      { start: "13:30", end: "18:00" },
    ],
    saturdays: [{ start: "08:00", end: "12:00" }],
    sundays: [],
  },

  levaETraz: {
    enabled: true,
    city: "Toledo-PR",
    additionalBufferMinutes: 30,
  },

  storageKey: "brs_appointments_v1",
  lockName: "brs_booking_lock",
  syncChannelName: "brs_booking_sync",
};
