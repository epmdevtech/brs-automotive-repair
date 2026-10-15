import type { AppointmentStatus, Result } from "./types";

const VALID_TRANSITIONS: Record<AppointmentStatus, readonly AppointmentStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
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
 * Retorna o rótulo humanizado de cada status.
 */
export function getStatusLabel(status: AppointmentStatus): string {
  switch (status) {
    case "PENDING":
      return "Pendente";
    case "CONFIRMED":
      return "Confirmado";
    case "COMPLETED":
      return "Concluído";
    case "CANCELLED":
      return "Cancelado";
    case "NO_SHOW":
      return "Não Compareceu";
  }
}

/**
 * Retorna classes Tailwind CSS semânticas para exibição de badges de status.
 */
export function getStatusBadgeClass(status: AppointmentStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-900 border border-amber-300";
    case "CONFIRMED":
      return "bg-emerald-100 text-emerald-900 border border-emerald-300";
    case "COMPLETED":
      return "bg-blue-100 text-blue-900 border border-blue-300";
    case "CANCELLED":
      return "bg-slate-100 text-slate-700 border border-slate-300";
    case "NO_SHOW":
      return "bg-red-100 text-red-900 border border-red-300";
  }
}
