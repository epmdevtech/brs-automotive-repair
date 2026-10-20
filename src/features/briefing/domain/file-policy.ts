/**
 * Política de arquivos do briefing: formatos aceitos, limite de tamanho e
 * construção do caminho de armazenamento.
 *
 * O caminho é sempre derivado no servidor a partir do usuário autenticado e do
 * briefing; caminhos enviados pelo cliente são ignorados.
 */
export const MAX_BRIEFING_FILE_BYTES = 10 * 1024 * 1024;

export const ALLOWED_BRIEFING_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
] as const;

export type AllowedBriefingMimeType = (typeof ALLOWED_BRIEFING_MIME_TYPES)[number];

export const ACCEPTED_FILE_EXTENSIONS = ".jpg,.jpeg,.png,.webp,.heic,.pdf";

export interface FileValidationInput {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export type FileValidationResult =
  | { ok: true }
  | { ok: false; reason: string; code: "too_large" | "mime_not_allowed" | "invalid_name" };

export function validateBriefingFile(input: FileValidationInput): FileValidationResult {
  const name = input.fileName.trim();
  if (name.length === 0 || name.length > 255 || name.includes("/") || name.includes("\\")) {
    return { ok: false, code: "invalid_name", reason: "Nome de arquivo inválido" };
  }

  if (input.sizeBytes <= 0) {
    return { ok: false, code: "invalid_name", reason: "Arquivo vazio ou inválido" };
  }

  if (input.sizeBytes > MAX_BRIEFING_FILE_BYTES) {
    return {
      ok: false,
      code: "too_large",
      reason: `Arquivo acima do limite de ${Math.floor(MAX_BRIEFING_FILE_BYTES / (1024 * 1024))} MB`,
    };
  }

  if (!(ALLOWED_BRIEFING_MIME_TYPES as readonly string[]).includes(input.mimeType)) {
    return { ok: false, code: "mime_not_allowed", reason: "Formato de arquivo não aceito" };
  }

  return { ok: true };
}

function sanitizeExtension(fileName: string, mimeType: string): string {
  const fromName = fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() : undefined;
  const fallback: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "application/pdf": "pdf",
  };
  const candidate = fromName && /^[a-z0-9]{1,8}$/.test(fromName) ? fromName : fallback[mimeType];
  return candidate && candidate.length > 0 ? candidate : "bin";
}

export function buildBriefingStoragePath(params: {
  userId: string;
  briefingId: string;
  category: string;
  fileName: string;
  mimeType: string;
  token: string;
}): string {
  const category = params.category
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 40);
  const safeCategory = category.length > 0 ? category : "geral";
  const extension = sanitizeExtension(params.fileName, params.mimeType);

  return `${params.userId}/${params.briefingId}/${safeCategory}/${params.token}.${extension}`;
}
