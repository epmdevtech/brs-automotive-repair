/**
 * Estados do briefing e transições permitidas.
 *
 * A regra é aplicada em dois níveis: pelo servidor (antes de gravar) e por
 * gatilho no banco (`enforce_briefing_status_transition`), de modo que a
 * interface não é mecanismo de segurança.
 */
export const BRIEFING_STATUSES = [
  "draft",
  "submitted",
  "in_review",
  "awaiting_information",
  "completed",
] as const;

export type BriefingStatus = (typeof BRIEFING_STATUSES)[number];

export const ADMIN_TRANSITIONS: Record<BriefingStatus, BriefingStatus[]> = {
  draft: ["submitted", "awaiting_information"],
  submitted: ["in_review", "awaiting_information"],
  in_review: ["awaiting_information", "completed"],
  awaiting_information: ["draft", "in_review"],
  completed: [],
};

/** Transições que o próprio cliente pode solicitar. */
export const CLIENT_TRANSITIONS: Record<BriefingStatus, BriefingStatus[]> = {
  draft: ["submitted"],
  submitted: [],
  in_review: [],
  awaiting_information: ["draft"],
  completed: [],
};

export function isBriefingStatus(value: unknown): value is BriefingStatus {
  return typeof value === "string" && (BRIEFING_STATUSES as readonly string[]).includes(value);
}

export function canTransition(
  from: BriefingStatus,
  to: BriefingStatus,
  role: "client" | "admin",
): boolean {
  const allowed = role === "admin" ? ADMIN_TRANSITIONS[from] : CLIENT_TRANSITIONS[from];
  return allowed.includes(to);
}

export function assertTransition(
  from: BriefingStatus,
  to: BriefingStatus,
  role: "client" | "admin",
): void {
  if (!canTransition(from, to, role)) {
    throw new Error(`Transição de status não permitida: ${from} → ${to}`);
  }
}

export const BRIEFING_STATUS_LABELS: Record<BriefingStatus, string> = {
  draft: "Rascunho",
  submitted: "Enviado",
  in_review: "Em análise",
  awaiting_information: "Aguardando complementação",
  completed: "Concluído",
};
