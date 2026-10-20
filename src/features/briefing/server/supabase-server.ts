import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireBriefingEnv } from "./env";

interface SupabaseCookie {
  name: string;
  value: string;
  options?: {
    path?: string;
    maxAge?: number;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: boolean | "lax" | "strict" | "none";
  };
}

function parseCookieHeader(header: string): Record<string, string> {
  const jar: Record<string, string> = {};
  if (!header) return jar;

  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    const name = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (name.length === 0) continue;
    try {
      jar[name] = decodeURIComponent(value);
    } catch {
      jar[name] = value;
    }
  }

  return jar;
}

/**
 * Cria o cliente Supabase para uso no servidor, com sessão por cookie.
 * O cookie é lido da requisição e as respostas de autenticação são
 * repropagadas para o navegador pelo middleware de resposta.
 */
export async function createBriefingServerClient(): Promise<SupabaseClient> {
  const env = requireBriefingEnv();
  const { getRequestHeaders, setCookie, setResponseHeader } =
    await import("@tanstack/react-start/server");

  const headers = getRequestHeaders();
  const jar = parseCookieHeader(headers.get("cookie") ?? "");

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return Object.entries(jar).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet: SupabaseCookie[]) {
        for (const cookie of cookiesToSet) {
          jar[cookie.name] = cookie.value;

          const options = cookie.options ?? {};
          setCookie(cookie.name, cookie.value, {
            path: options.path ?? "/",
            ...(options.maxAge !== undefined ? { maxAge: options.maxAge } : {}),
            ...(options.domain !== undefined ? { domain: options.domain } : {}),
            ...(options.secure !== undefined ? { secure: options.secure } : {}),
            ...(options.httpOnly !== undefined ? { httpOnly: options.httpOnly } : {}),
            ...(options.sameSite !== undefined
              ? { sameSite: options.sameSite === true ? "strict" : options.sameSite }
              : {}),
          });
        }

        setResponseHeader("cache-control", "private, no-cache, no-store, must-revalidate");
      },
    },
  });
}
