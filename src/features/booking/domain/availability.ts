import { TZDate } from "@date-fns/tz";
import type {
  Appointment,
  Professional,
  ServiceDefinition,
  TimeSlot,
  WorkingHours,
  Shift,
} from "./types";
import { DEFAULT_TIMEZONE, addMinutesToDate, intervalsOverlap, parseTimeOnDate } from "./time";

export interface ComputeSlotsParams {
  date: Date;
  service: ServiceDefinition;
  workingHours: WorkingHours;
  existingAppointments: Appointment[];
  professionals: Professional[];
  selectedProfessionalId?: string;
  isLevaETraz?: boolean;
  levaETrazBufferMinutes?: number;
  slotIntervalMinutes?: number;
  minNoticeMinutes?: number;
  now?: Date;
  timezone?: string;
}

export interface ComputeAvailableDaysParams {
  yearMonth: string; // "YYYY-MM"
  service: ServiceDefinition;
  workingHours: WorkingHours;
  existingAppointments: Appointment[];
  professionals: Professional[];
  selectedProfessionalId?: string;
  isLevaETraz?: boolean;
  levaETrazBufferMinutes?: number;
  slotIntervalMinutes?: number;
  minNoticeMinutes?: number;
  maxAdvanceDays?: number;
  now?: Date;
  timezone?: string;
}

/**
 * Retorna os turnos de trabalho aplicáveis para o dia da semana na timezone.
 */
function getShiftsForDay(date: Date, workingHours: WorkingHours, tz: string): Shift[] {
  const tzDate = new TZDate(date, tz);
  const day = tzDate.getDay(); // 0 = Domingo, 6 = Sábado
  if (day === 0) return workingHours.sundays;
  if (day === 6) return workingHours.saturdays;
  return workingHours.weekdays;
}

/**
 * Calcula a ocupação efetiva de um agendamento existente considerando duração e buffers.
 */
function getAppointmentEffectiveInterval(
  appointment: Appointment,
  servicesMap: Map<string, ServiceDefinition>,
  defaultLevaBuffer: number,
): { start: Date; end: Date } {
  const start = new Date(appointment.startTime);
  const rawEnd = new Date(appointment.endTime);
  const svc = servicesMap.get(appointment.serviceId);
  const bufferMinutes =
    (svc?.bufferMinutes ?? 15) +
    (appointment.logistics.type === "leva-e-traz" ? defaultLevaBuffer : 0);

  const effectiveEnd = new Date(rawEnd.getTime() + bufferMinutes * 60 * 1000);
  return { start, end: effectiveEnd };
}

/**
 * Motor Matemático Puro de Disponibilidade de Horários.
 * Opera em intervalos semiabertos [start, end) com algoritmo anti-colisão estrito.
 */
export function computeAvailableSlots(params: ComputeSlotsParams): TimeSlot[] {
  const {
    date,
    service,
    workingHours,
    existingAppointments,
    professionals,
    selectedProfessionalId,
    isLevaETraz = false,
    levaETrazBufferMinutes = 30,
    slotIntervalMinutes = 30,
    minNoticeMinutes = 120,
    now = new Date(),
    timezone = DEFAULT_TIMEZONE,
  } = params;

  const shifts = getShiftsForDay(date, workingHours, timezone);
  if (!shifts || shifts.length === 0) {
    return [];
  }

  const durationMinutes = service.durationMinutes;
  const bufferMinutes = service.bufferMinutes + (isLevaETraz ? levaETrazBufferMinutes : 0);
  const totalOccupancyMinutes = durationMinutes + bufferMinutes;

  const activeAppointments = existingAppointments.filter((app) => app.status !== "CANCELLED");

  const servicesMap = new Map<string, ServiceDefinition>([[service.id, service]]);

  // Profissionais aptos
  const candidateProfessionals = selectedProfessionalId
    ? professionals.filter((p) => p.id === selectedProfessionalId)
    : professionals;

  if (candidateProfessionals.length === 0) {
    return [];
  }

  const availableSlots: TimeSlot[] = [];
  const minNoticeThreshold = now.getTime() + minNoticeMinutes * 60 * 1000;

  for (const shift of shifts) {
    const shiftStart = parseTimeOnDate(date, shift.start, timezone);
    const shiftEnd = parseTimeOnDate(date, shift.end, timezone);

    let candidateStart = new TZDate(shiftStart, timezone);

    while (true) {
      const candidateSlotEnd = addMinutesToDate(candidateStart, durationMinutes);
      const candidateOccupancyEnd = addMinutesToDate(candidateStart, totalOccupancyMinutes);

      // O slot com seu buffer de resguardo DEVE caber integralmente dentro do turno
      if (candidateOccupancyEnd.getTime() > shiftEnd.getTime()) {
        break;
      }

      // Validação de antecedência mínima
      if (candidateStart.getTime() >= minNoticeThreshold) {
        // Encontra o profissional livre mais adequado
        const freeProfessionals: Professional[] = [];

        for (const prof of candidateProfessionals) {
          const profAppointments = activeAppointments.filter(
            (app) => app.professionalId === prof.id,
          );

          const hasCollision = profAppointments.some((app) => {
            const { start: appStart, end: appEnd } = getAppointmentEffectiveInterval(
              app,
              servicesMap,
              levaETrazBufferMinutes,
            );
            return intervalsOverlap(candidateStart, candidateOccupancyEnd, appStart, appEnd);
          });

          if (!hasCollision) {
            freeProfessionals.push(prof);
          }
        }

        if (freeProfessionals.length > 0) {
          // Atribuição Determinística:
          // 1. Menor número de atendimentos no dia
          // 2. Campo sortOrder
          // 3. ID alfabético determinístico
          freeProfessionals.sort((a, b) => {
            const countA = activeAppointments.filter((x) => x.professionalId === a.id).length;
            const countB = activeAppointments.filter((x) => x.professionalId === b.id).length;
            if (countA !== countB) return countA - countB;
            if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
            return a.id.localeCompare(b.id);
          });

          const assignedProf = freeProfessionals[0];

          availableSlots.push({
            start: new Date(candidateStart.getTime()),
            end: new Date(candidateSlotEnd.getTime()),
            serviceId: service.id,
            professionalId: assignedProf.id,
            isLevaETraz,
          });
        }
      }

      // Avança pelo intervalo de step do slot
      candidateStart = addMinutesToDate(candidateStart, slotIntervalMinutes);
    }
  }

  return availableSlots;
}

/**
 * Otimização de Calendário: computa quais dias de um mês possuem ao menos um slot livre.
 */
export function computeAvailableDays(params: ComputeAvailableDaysParams): string[] {
  const {
    yearMonth,
    service,
    workingHours,
    existingAppointments,
    professionals,
    selectedProfessionalId,
    isLevaETraz,
    levaETrazBufferMinutes,
    slotIntervalMinutes,
    minNoticeMinutes,
    maxAdvanceDays = 30,
    now = new Date(),
    timezone = DEFAULT_TIMEZONE,
  } = params;

  const [yearStr, monthStr] = yearMonth.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-based

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const availableDays: string[] = [];

  const maxAdvanceThreshold = addMinutesToDate(now, maxAdvanceDays * 24 * 60).getTime();

  for (let day = 1; day <= daysInMonth; day++) {
    const testDate = new TZDate(new Date(year, month, day, 12, 0, 0), timezone);

    // Se o dia ultrapassa a janela máxima de antecedência, ignora
    if (testDate.getTime() > maxAdvanceThreshold) {
      continue;
    }

    const slots = computeAvailableSlots({
      date: testDate,
      service,
      workingHours,
      existingAppointments,
      professionals,
      selectedProfessionalId,
      isLevaETraz,
      levaETrazBufferMinutes,
      slotIntervalMinutes,
      minNoticeMinutes,
      now,
      timezone,
    });

    if (slots.length > 0) {
      const formattedDay = `${yearStr}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      availableDays.push(formattedDay);
    }
  }

  return availableDays;
}
