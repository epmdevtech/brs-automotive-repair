import type { AppointmentStatus, Result } from "./types";

const VALID_TRANSITIONS: Record<AppointmentStatus, readonly AppointmentStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED", "NO_SHOW"],
  CONFIRMED: ["COMPLETED", "CANCELLED", "NO_SHOW"],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

/**
 * Avalia se a transição entre dois estados do agendamento é válida na FSM.
 */
export function canTransition(from: AppointmentStatus, to: AppointmentStatus): boolean {
  if (from === to) return true;
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Executa a transição de estado garantindo o contrato da máquina finita.
 */
export function transitionStatus(
  current: AppointmentStatus,
  target: AppointmentStatus,
): Result<AppointmentStatus, string> {
  if (!canTransition(current, target)) {
    return {
      ok: false,
      error: `Transição inválida de ${current} para ${target}.`,
    };
  }
  return { ok: true, value: target };
}

/**
 * Retorna o rótulo humanizado e preciso para analistas operacionais da oficina.
 * - PENDING: "Aberto" (Aguardando triagem técnica inicial)
 * - CONFIRMED: "Em Andamento" (Veículo em atendimento na grade)
 * - COMPLETED: "Concluído" (Reparação finalizada com checklist)
 * - CANCELLED: "Cancelado" (Desistência ou encerramento motivado)
 * - NO_SHOW: "Fechado" (Encerramento administrativo por não comparecimento)
 */
export function getStatusLabel(status: AppointmentStatus): string {
  switch (status) {
    case "PENDING":
      return "Aberto";
    case "CONFIRMED":
      return "Em Andamento";
    case "COMPLETED":
      return "Concluído";
    case "CANCELLED":
      return "Cancelado";
    case "NO_SHOW":
      return "Fechado";
  }
}

/**
 * Retorna classes Tailwind CSS semânticas com alto contraste (WCAG AA) para badges.
 * Reservando verde exclusivamente para Concluído.
 */
export function getStatusBadgeClass(status: AppointmentStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-sky-50 text-sky-800 border border-sky-300";
    case "CONFIRMED":
      return "bg-amber-50 text-amber-900 border border-amber-300";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-900 border border-emerald-300";
    case "CANCELLED":
      return "bg-red-50 text-red-800 border border-red-200";
    case "NO_SHOW":
      return "bg-neutral-100 text-neutral-700 border border-neutral-300";
  }
}

/**
 * Retorna classe de borda lateral semântica (border-l-4) para cartões de agendamento.
 */
export function getStatusBorderClass(status: AppointmentStatus): string {
  switch (status) {
    case "PENDING":
      return "border-l-sky-500";
    case "CONFIRMED":
      return "border-l-amber-500";
    case "COMPLETED":
      return "border-l-emerald-500";
    case "CANCELLED":
      return "border-l-red-400";
    case "NO_SHOW":
      return "border-l-neutral-400";
  }
}

/**
 * Retorna a classe de cor para o indicador pontual geométrico (dot) do status.
 */
export function getStatusDotClass(status: AppointmentStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-sky-500";
    case "CONFIRMED":
      return "bg-amber-500";
    case "COMPLETED":
      return "bg-emerald-500";
    case "CANCELLED":
      return "bg-red-500";
    case "NO_SHOW":
      return "bg-neutral-400";
  }
}
