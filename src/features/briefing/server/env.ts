import { createBriefingError } from "./errors";

export interface BriefingServerEnv {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  bucket: string;
}

type EnvSource = Record<string, string | undefined>;

function runtimeEnv(): EnvSource {
  const runtime = globalThis as { process?: { env?: EnvSource } };
  return runtime.process?.env ?? {};
}

function clean(value: string | undefined): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Lê as variáveis de ambiente do servidor. Nenhuma chave privilegiada é
 * exposta ao cliente: a `service_role` existe apenas no ambiente do servidor
 * e não é usada nas operações do cliente da aplicação.
 */
export function readBriefingEnv(source: EnvSource = runtimeEnv()): BriefingServerEnv | null {
  const url = clean(source["SUPABASE_URL"]);
  const anonKey = clean(source["SUPABASE_ANON_KEY"]);

  if (!url || !anonKey) return null;

  const serviceRoleKey = clean(source["SUPABASE_SERVICE_ROLE_KEY"]);

  return {
    url,
    anonKey,
    ...(serviceRoleKey ? { serviceRoleKey } : {}),
    bucket: clean(source["SUPABASE_BRIEFING_BUCKET"]) ?? "master-briefing-private",
  };
}

export function requireBriefingEnv(source: EnvSource = runtimeEnv()): BriefingServerEnv {
  const env = readBriefingEnv(source);
  if (!env) {
    throw createBriefingError(
      "not_configured",
      "Persistência indisponível: configure SUPABASE_URL e SUPABASE_ANON_KEY no ambiente do servidor.",
    );
  }
  return env;
}

export function isBriefingPersistenceConfigured(source: EnvSource = runtimeEnv()): boolean {
  return readBriefingEnv(source) !== null;
}
