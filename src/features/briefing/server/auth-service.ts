import type { SupabaseClient } from "@supabase/supabase-js";
import type { BriefingRole } from "../domain/roles";
import { createBriefingError } from "./errors";

export interface BriefingSession {
  userId: string;
  email: string | null;
  role: BriefingRole;
}

export async function resolveBriefingRole(
  client: SupabaseClient,
  userId: string,
): Promise<BriefingRole> {
  const { data, error } = await client
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw createBriefingError(
      "unavailable",
      "Não foi possível validar o perfil do usuário no banco de dados.",
    );
  }

  return data?.role === "admin" ? "admin" : "client";
}

export async function getBriefingSession(client: SupabaseClient): Promise<BriefingSession | null> {
  const { data, error } = await client.auth.getUser();
  if (error || !data?.user) return null;

  return {
    userId: data.user.id,
    email: data.user.email ?? null,
    role: await resolveBriefingRole(client, data.user.id),
  };
}

export async function requireBriefingSession(client: SupabaseClient): Promise<BriefingSession> {
  const session = await getBriefingSession(client);
  if (!session) {
    throw createBriefingError(
      "unauthenticated",
      "Sessão ausente ou expirada. Faça login novamente para continuar.",
    );
  }
  return session;
}

export async function requireBriefingAdmin(client: SupabaseClient): Promise<BriefingSession> {
  const session = await requireBriefingSession(client);
  if (session.role !== "admin") {
    throw createBriefingError(
      "forbidden",
      "Acesso restrito a administradores autorizados da EPM DevTech.",
    );
  }
  return session;
}
