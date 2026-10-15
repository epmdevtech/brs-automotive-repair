import { TZDate } from "@date-fns/tz";
import { format } from "date-fns";

export const DEFAULT_TIMEZONE = "America/Sao_Paulo";

/**
 * Cria ou converte uma data para a timezone oficial (America/Sao_Paulo).
 */
export function createTZDate(
  date: Date | string | number = new Date(),
  tz: string = DEFAULT_TIMEZONE,
): TZDate {
  return new TZDate(date, tz);
}

/**
 * Algoritmo Anti-Colisão em intervalos semiabertos [start, end).
 * Dois intervalos colidem se: max(startA, startB) < min(endA, endB)
 */
export function intervalsOverlap(startA: Date, endA: Date, startB: Date, endB: Date): boolean {
  return Math.max(startA.getTime(), startB.getTime()) < Math.min(endA.getTime(), endB.getTime());
}

/**
 * Adiciona minutos a uma data preservando a timezone.
 */
export function addMinutesToDate(date: Date, minutes: number): TZDate {
  const result = new TZDate(date.getTime() + minutes * 60 * 1000, DEFAULT_TIMEZONE);
  return result;
}

/**
 * Constrói uma data combinando o dia de `baseDate` com um horário "HH:mm".
 */
export function parseTimeOnDate(
  baseDate: Date,
  timeStr: string,
  tz: string = DEFAULT_TIMEZONE,
): TZDate {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const tzDate = new TZDate(baseDate, tz);
  tzDate.setHours(hours, minutes, 0, 0);
  return tzDate;
}

/**
 * Formata um horário para exibição (ex: "08:30").
 */
export function formatTime(date: Date, tz: string = DEFAULT_TIMEZONE): string {
  const tzDate = new TZDate(date, tz);
  return format(tzDate, "HH:mm");
}

/**
 * Formata uma data para exibição (ex: "15/10/2026").
 */
export function formatDate(date: Date, tz: string = DEFAULT_TIMEZONE): string {
  const tzDate = new TZDate(date, tz);
  return format(tzDate, "dd/MM/yyyy");
}

/**
 * Formata data e horário completos (ex: "15/10/2026 às 08:30").
 */
export function formatDateTime(date: Date, tz: string = DEFAULT_TIMEZONE): string {
  const tzDate = new TZDate(date, tz);
  return format(tzDate, "dd/MM/yyyy 'às' HH:mm");
}

/**
 * Verifica se duas datas correspondem ao mesmo dia civil na timezone informada.
 */
export function isSameCivilDay(dateA: Date, dateB: Date, tz: string = DEFAULT_TIMEZONE): boolean {
  const a = new TZDate(dateA, tz);
  const b = new TZDate(dateB, tz);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
