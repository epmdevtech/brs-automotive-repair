/**
 * Cabeçalhos de segurança aplicados a todas as respostas (HTML e Server
 * Functions).
 *
 * A política é restritiva o suficiente para bloquear carregamento de scripts
 * externos, incorporação em frames e objetos ativos, mantendo o que a
 * aplicação realmente usa: fontes do Google, imagens locais/dados e a API do
 * Supabase acessada pelo servidor.
 *
 * `script-src` mantém `'unsafe-inline'` porque o payload de hidratação do
 * TanStack Start é injetado como script inline. O endurecimento com `nonce`
 * por requisição depende do suporte a nonce do framework e está registrado
 * como pendência em `docs/security/remediation-plan.md`.
 */

export interface SecurityHeaderOptions {
  /** `true` quando a requisição chegou por HTTPS (habilita HSTS). */
  isSecureRequest: boolean;
  /** `true` em desenvolvimento, onde a CSP é relaxada para não quebrar o HMR. */
  isDevelopment: boolean;
}

type CspDirectives = Map<string, string[]>;

function withSource(directives: CspDirectives, name: string, source: string): void {
  const current = directives.get(name) ?? [];
  if (!current.includes(source)) current.push(source);
  directives.set(name, current);
}

export function buildContentSecurityPolicy(options: SecurityHeaderOptions): string {
  const directives: CspDirectives = new Map();

  withSource(directives, "default-src", "'self'");
  withSource(directives, "base-uri", "'self'");
  withSource(directives, "object-src", "'none'");
  withSource(directives, "frame-ancestors", "'none'");
  withSource(directives, "form-action", "'self'");
  withSource(directives, "manifest-src", "'self'");
  withSource(directives, "worker-src", "'self'");
  withSource(directives, "worker-src", "blob:");

  withSource(directives, "script-src", "'self'");
  withSource(directives, "script-src", "'unsafe-inline'");

  withSource(directives, "style-src", "'self'");
  withSource(directives, "style-src", "'unsafe-inline'");
  withSource(directives, "style-src", "https://fonts.googleapis.com");

  withSource(directives, "font-src", "'self'");
  withSource(directives, "font-src", "data:");
  withSource(directives, "font-src", "https://fonts.gstatic.com");

  withSource(directives, "img-src", "'self'");
  withSource(directives, "img-src", "data:");
  withSource(directives, "img-src", "blob:");

  withSource(directives, "media-src", "'self'");
  withSource(directives, "media-src", "blob:");

  withSource(directives, "connect-src", "'self'");
  withSource(directives, "connect-src", "https://*.supabase.co");
  withSource(directives, "connect-src", "wss://*.supabase.co");

  if (options.isDevelopment) {
    // O cliente de desenvolvimento do Vite usa `eval` e abre websocket de HMR.
    withSource(directives, "script-src", "'unsafe-eval'");
    withSource(directives, "connect-src", "ws:");
    withSource(directives, "connect-src", "wss:");
  }

  if (options.isSecureRequest) {
    withSource(directives, "upgrade-insecure-requests", "");
  }

  return [...directives.entries()]
    .map(([name, sources]) => {
      const value = sources.filter((source) => source.length > 0).join(" ");
      return value.length > 0 ? `${name} ${value}` : name;
    })
    .join("; ");
}

export function buildSecurityHeaders(options: SecurityHeaderOptions): Record<string, string> {
  const headers: Record<string, string> = {
    "content-security-policy": buildContentSecurityPolicy(options),
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    "cross-origin-opener-policy": "same-origin",
    "cross-origin-resource-policy": "same-origin",
  };

  if (options.isSecureRequest) {
    headers["strict-transport-security"] = "max-age=63072000; includeSubDomains";
  }

  return headers;
}
