export const BRIEFING_ERROR_CODES = [
  "unauthenticated",
  "forbidden",
  "not_found",
  "validation",
  "conflict",
  "not_configured",
  "unavailable",
  "unknown",
] as const;

export type BriefingErrorCode = (typeof BRIEFING_ERROR_CODES)[number];

export class BriefingError extends Error {
  readonly code: BriefingErrorCode;
  readonly status: number;

  constructor(code: BriefingErrorCode, message: string, status = 400) {
    super(message);
    this.name = "BriefingError";
    this.code = code;
    this.status = status;
  }
}

const STATUS_BY_CODE: Record<BriefingErrorCode, number> = {
  unauthenticated: 401,
  forbidden: 403,
  not_found: 404,
  validation: 422,
  conflict: 409,
  not_configured: 503,
  unavailable: 503,
  unknown: 500,
};

export function createBriefingError(code: BriefingErrorCode, message: string): BriefingError {
  return new BriefingError(code, message, STATUS_BY_CODE[code]);
}

/**
 * Normaliza erros do Supabase (rede, autenticação, autorização, validação e
 * indisponibilidade) em categorias estáveis, sem expor a mensagem original
 * do provedor nem qualquer segredo.
 */
export function normalizeBriefingError(error: unknown): BriefingError {
  if (error instanceof BriefingError) return error;

  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code?: unknown }).code ?? "");
    const message = String((error as { message?: unknown }).message ?? "");

    if (code === "PGRST301" || code === "42501") {
      return createBriefingError("forbidden", "Operação não autorizada para este usuário.");
    }
    if (code === "PGRST116" || code === "PGRST204") {
      return createBriefingError("not_found", "Registro não encontrado.");
    }
    if (code === "23505") {
      return createBriefingError("conflict", "Registro já existente.");
    }
    if (code === "23503" || code === "23514" || code === "22P02") {
      return createBriefingError("validation", "Dados inválidos para persistência.");
    }
    if (code.startsWith("23")) {
      return createBriefingError("validation", "Dados inválidos para persistência.");
    }
    if (code === "PGRST301") {
      return createBriefingError("forbidden", "Operação não autorizada para este usuário.");
    }
    if (
      message.toLowerCase().includes("fetch failed") ||
      message.toLowerCase().includes("network")
    ) {
      return createBriefingError("unavailable", "Falha de comunicação com o serviço de dados.");
    }
  }

  return createBriefingError("unknown", "Não foi possível concluir a operação.");
}
