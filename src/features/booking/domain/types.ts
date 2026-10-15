export type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export type FinishType = "solida" | "metalica" | "perolizada" | "nao-informada";

export interface VehicleData {
  make: string;
  model: string;
  year?: string;
  plate?: string;
  color?: string;
  finishType?: FinishType;
}

export type DamageArea =
  | "para-choque-dianteiro"
  | "para-choque-traseiro"
  | "capo"
  | "teto"
  | "tampa-traseira"
  | "lateral-esquerda"
  | "lateral-direita"
  | "porta-dianteira-esq"
  | "porta-dianteira-dir"
  | "porta-traseira-esq"
  | "porta-traseira-dir"
  | "para-lama-esq"
  | "para-lama-dir"
  | "para-brisa"
  | "carroceria-inteira";

export type DamageType =
  | "amassado-sem-risco" // Martelinho de Ouro
  | "colisao-com-vinco" // Funilaria
  | "risco-profundo-descascamento" // Pintura
  | "granizo" // Martelinho em lote
  | "verniz-opaco-micro-riscos" // Espelhamento / Vitrificação
  | "manchas-vidro" // Polimento Para-brisa
  | "outros";

export interface DamageIntake {
  vehicle: VehicleData;
  affectedAreas: DamageArea[];
  damageType: DamageType;
  description?: string;
  isInsurance?: boolean;
}

export type LogisticsType = "presencial" | "leva-e-traz";

export interface LogisticsData {
  type: LogisticsType;
  address?: string;
  neighborhood?: string;
  city?: string;
  referencePoint?: string;
  vehicleDrivable?: boolean;
  contactPerson?: string;
}

export interface CustomerData {
  name: string;
  phone: string; // E.164 canonical
  rawPhone?: string;
  notes?: string;
  consentLgpd: boolean;
}

export interface ServiceDefinition {
  id: string;
  title: string;
  short: string;
  durationMinutes: number;
  bufferMinutes: number;
  category: "Reparação" | "Reparação Especializada" | "Estética" | "Vidros";
  requiresVehicleData: boolean;
  allowsLevaETraz: boolean;
  description?: string;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  sortOrder: number;
}

export interface Shift {
  start: string; // "HH:mm"
  end: string; // "HH:mm"
}

export interface WorkingHours {
  weekdays: Shift[];
  saturdays: Shift[];
  sundays: Shift[];
}

export interface TimeSlot {
  start: Date;
  end: Date;
  serviceId: string;
  professionalId?: string;
  isLevaETraz?: boolean;
}

export interface Appointment {
  id: string;
  protocol: string; // e.g. #BRS-7492
  serviceId: string;
  professionalId: string;
  startTime: string; // ISO string em UTC/TZ
  endTime: string; // ISO string em UTC/TZ
  status: AppointmentStatus;
  customer: CustomerData;
  intake: DamageIntake;
  logistics: LogisticsData;
  createdAt: string;
  idempotencyKey: string;
}
