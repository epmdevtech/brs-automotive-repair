/**
 * Destinos permitidos após o login.
 *
 * O parâmetro `redirect` chega da query string e não pode ser usado para
 * levar o usuário a outro site. Apenas caminhos internos conhecidos são
 * aceitos; qualquer outro valor cai no destino padrão.
 */

export const DEFAULT_POST_LOGIN_PATH = "/briefing";

export const ALLOWED_POST_LOGIN_PATHS = ["/briefing", "/admin/briefings"] as const;

export function sanitizeRedirectTarget(
  value: string | undefined | null,
  allowed: readonly string[] = ALLOWED_POST_LOGIN_PATHS,
): string {
  if (typeof value !== "string") return DEFAULT_POST_LOGIN_PATH;

  const candidate = value.trim();
  if (candidate.length === 0) return DEFAULT_POST_LOGIN_PATH;

  // Rejeita URLs absolutas, esquemas dangerousos e caminhos que escapem da
  // raiz do site (incluindo o prefixo "//" de URLs protocol-relative).
  if (!candidate.startsWith("/")) return DEFAULT_POST_LOGIN_PATH;
  if (candidate.startsWith("//") || candidate.startsWith("/\\")) return DEFAULT_POST_LOGIN_PATH;
  if (candidate.includes("\\") || candidate.includes("://")) return DEFAULT_POST_LOGIN_PATH;
  if (candidate.includes("\n") || candidate.includes("\r") || candidate.includes("\t")) {
    return DEFAULT_POST_LOGIN_PATH;
  }

  const normalized = candidate.split("#")[0]!.split("?")[0]!;
  const isAllowed = allowed.some(
    (path) => normalized === path || normalized.startsWith(`${path}/`),
  );

  return isAllowed ? candidate : DEFAULT_POST_LOGIN_PATH;
}
