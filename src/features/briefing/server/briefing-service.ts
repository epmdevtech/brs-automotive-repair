import type { SupabaseClient } from "@supabase/supabase-js";
import {
  estimateSectionBytes,
  getStepBySectionKey,
  validateSectionPayload,
  type BriefingSectionPending,
  type BriefingSectionValues,
} from "../domain/section-schemas";
import { BRIEFING_SECTION_KEYS } from "../domain/section-keys";
import { assertTransition, type BriefingStatus } from "../domain/status";
import { isOwner } from "../domain/roles";
import { requireBriefingAdmin, requireBriefingSession, type BriefingSession } from "./auth-service";
import type {
  BriefingActivityRow,
  BriefingAnswerRow,
  BriefingFileRow,
  BriefingRow,
} from "./db-types";
import { createBriefingError } from "./errors";

const COMPANY_SECTION = "company_identification";

export interface BriefingSummary {
  id: string;
  companyName: string;
  status: BriefingStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  completedAt: string | null;
  clientMessage: string | null;
}

export interface BriefingDetail {
  briefing: BriefingSummary;
  sections: Record<string, { values: BriefingSectionValues; pending: BriefingSectionPending }>;
  files: BriefingFileRow[];
  activity: BriefingActivityRow[];
}

export interface BriefingListParams {
  search?: string | undefined;
  status?: BriefingStatus | undefined;
  from?: string | undefined;
  to?: string | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
}

export interface BriefingListResult {
  items: BriefingSummary[];
  total: number;
  page: number;
  pageSize: number;
}

function toSummary(row: BriefingRow): BriefingSummary {
  return {
    id: row.id,
    companyName: row.company_name,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    submittedAt: row.submitted_at,
    completedAt: row.completed_at,
    clientMessage: row.client_message,
  };
}

export async function ensureBriefing(
  client: SupabaseClient,
  session: BriefingSession,
): Promise<BriefingRow> {
  const { data, error } = await client
    .from("briefings")
    .select("*")
    .eq("owner_user_id", session.userId)
    .order("updated_at", { ascending: false })
    .limit(1);

  if (error) {
    throw createBriefingError("unavailable", "Não foi possível consultar o briefing no banco.");
  }

  const existing = data?.[0] as BriefingRow | undefined;
  if (existing && existing.status !== "completed") return existing;

  const { data: created, error: insertError } = await client
    .from("briefings")
    .insert({ owner_user_id: session.userId, company_name: "", status: "draft" })
    .select("*")
    .single();

  if (insertError || !created) {
    throw createBriefingError("unavailable", "Não foi possível iniciar o briefing no banco.");
  }

  await logActivity(client, created.id, "briefing_created", {});

  return created as BriefingRow;
}

export async function loadOwnBriefing(
  client: SupabaseClient,
  session: BriefingSession,
): Promise<BriefingDetail> {
  const briefing = await ensureBriefing(client, session);
  return loadBriefingDetailById(client, session, briefing.id);
}

export async function loadBriefingDetailById(
  client: SupabaseClient,
  session: BriefingSession,
  briefingId: string,
): Promise<BriefingDetail> {
  const { data: briefingRow, error: briefingError } = await client
    .from("briefings")
    .select("*")
    .eq("id", briefingId)
    .maybeSingle();

  if (briefingError) {
    throw createBriefingError("unavailable", "Não foi possível consultar o briefing.");
  }
  if (!briefingRow) {
    throw createBriefingError("not_found", "Briefing não encontrado.");
  }

  const briefing = briefingRow as BriefingRow;
  if (session.role !== "admin" && !isOwner(briefing.owner_user_id, session.userId)) {
    throw createBriefingError("forbidden", "Este briefing pertence a outro usuário.");
  }

  const { data: answerRows, error: answersError } = await client
    .from("briefing_answers")
    .select("*")
    .eq("briefing_id", briefingId);

  if (answersError) {
    throw createBriefingError("unavailable", "Não foi possível consultar as respostas.");
  }

  const { data: fileRows, error: filesError } = await client
    .from("briefing_files")
    .select("*")
    .eq("briefing_id", briefingId)
    .order("created_at", { ascending: true });

  if (filesError) {
    throw createBriefingError("unavailable", "Não foi possível consultar os arquivos.");
  }

  const activity = session.role === "admin" ? await listActivity(client, session, briefingId) : [];

  const sections: BriefingDetail["sections"] = {};
  for (const row of (answerRows ?? []) as BriefingAnswerRow[]) {
    sections[row.section_key] = {
      values: row.answers?.values ?? {},
      pending: row.answers?.pending ?? {},
    };
  }

  return {
    briefing: toSummary(briefing),
    sections,
    files: (fileRows ?? []) as BriefingFileRow[],
    activity,
  };
}

export async function saveSection(
  client: SupabaseClient,
  session: BriefingSession,
  input: { sectionKey: string; values: BriefingSectionValues; pending: BriefingSectionPending },
): Promise<{ savedAt: string; sectionKey: string }> {
  const step = getStepBySectionKey(input.sectionKey);
  if (!step) {
    throw createBriefingError("validation", "Etapa inválida.");
  }

  const payload = { values: input.values ?? {}, pending: input.pending ?? {} };

  if (estimateSectionBytes(payload) > 200 * 1024) {
    throw createBriefingError("validation", "O tamanho da etapa excede o limite permitido.");
  }

  const validation = validateSectionPayload(step, payload);
  if (!validation.ok) {
    throw createBriefingError("validation", `${validation.message} (${validation.fieldId})`);
  }

  const briefing = await ensureBriefing(client, session);

  if (briefing.status !== "draft" && session.role !== "admin") {
    throw createBriefingError(
      "conflict",
      "Este briefing não está mais em rascunho e não aceita novas respostas.",
    );
  }

  const { error } = await client.from("briefing_answers").upsert(
    {
      briefing_id: briefing.id,
      section_key: input.sectionKey,
      answers: { values: validation.values, pending: validation.pending },
    },
    { onConflict: "briefing_id,section_key" },
  );

  if (error) {
    throw createBriefingError("unavailable", "Não foi possível salvar a etapa no banco de dados.");
  }

  if (input.sectionKey === COMPANY_SECTION) {
    const companyName =
      typeof validation.values["empresa.razaoSocial"] === "string"
        ? validation.values["empresa.razaoSocial"]
        : typeof validation.values["empresa.nomeFantasia"] === "string"
          ? validation.values["empresa.nomeFantasia"]
          : briefing.company_name;

    await client.from("briefings").update({ company_name: companyName }).eq("id", briefing.id);
  }

  await logActivity(client, briefing.id, "section_saved", { section_key: input.sectionKey });

  return { savedAt: new Date().toISOString(), sectionKey: input.sectionKey };
}

export async function submitBriefing(
  client: SupabaseClient,
  session: BriefingSession,
): Promise<{ briefingId: string; status: BriefingStatus; submittedAt: string | null }> {
  const briefing = await ensureBriefing(client, session);

  if (briefing.status === "submitted" || briefing.status === "in_review") {
    return {
      briefingId: briefing.id,
      status: briefing.status,
      submittedAt: briefing.submitted_at,
    };
  }

  if (briefing.status !== "draft") {
    throw createBriefingError("conflict", "Este briefing não pode ser enviado no estado atual.");
  }

  const { data: answerRows, error } = await client
    .from("briefing_answers")
    .select("*")
    .eq("briefing_id", briefing.id);

  if (error) {
    throw createBriefingError("unavailable", "Não foi possível validar as respostas do briefing.");
  }

  const stored = new Map(
    ((answerRows ?? []) as BriefingAnswerRow[]).map((row) => [row.section_key, row]),
  );

  for (const sectionKey of BRIEFING_SECTION_KEYS) {
    const row = stored.get(sectionKey);
    const step = getStepBySectionKey(sectionKey);
    if (!step) continue;

    const validation = validateSectionPayload(step, {
      values: row?.answers?.values ?? {},
      pending: row?.answers?.pending ?? {},
    });

    if (!validation.ok) {
      throw createBriefingError(
        "validation",
        `Etapa "${step.title}" incompleta: ${validation.message} (${validation.fieldId}).`,
      );
    }
  }

  const { data: updated, error: updateError } = await client
    .from("briefings")
    .update({ status: "submitted", submitted_at: new Date().toISOString() })
    .eq("id", briefing.id)
    .eq("owner_user_id", session.userId)
    .eq("status", "draft")
    .select("*")
    .maybeSingle();

  if (updateError) {
    throw createBriefingError("unavailable", "Não foi possível registrar o envio do briefing.");
  }

  if (!updated) {
    const { data: current } = await client
      .from("briefings")
      .select("*")
      .eq("id", briefing.id)
      .maybeSingle();

    const currentStatus = (current as BriefingRow | null)?.status ?? briefing.status;
    if (currentStatus === "submitted" || currentStatus === "in_review") {
      return {
        briefingId: briefing.id,
        status: currentStatus,
        submittedAt: (current as BriefingRow | null)?.submitted_at ?? null,
      };
    }

    throw createBriefingError("conflict", "O briefing mudou de estado durante o envio.");
  }

  await logActivity(client, briefing.id, "submitted", {});

  const row = updated as BriefingRow;
  return { briefingId: row.id, status: row.status, submittedAt: row.submitted_at };
}

export async function listBriefings(
  client: SupabaseClient,
  session: BriefingSession,
  params: BriefingListParams,
): Promise<BriefingListResult> {
  await requireBriefingAdmin(client);

  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));

  let query = client
    .from("briefings")
    .select("*", { count: "exact" })
    .order("updated_at", { ascending: false });

  if (params.status) {
    query = query.eq("status", params.status);
  }
  if (params.search && params.search.trim().length > 0) {
    const safe = params.search
      .trim()
      .replace(/[%,()]/g, " ")
      .slice(0, 80);
    query = query.ilike("company_name", `%${safe}%`);
  }
  if (params.from) {
    query = query.gte("created_at", params.from);
  }
  if (params.to) {
    query = query.lte("created_at", params.to);
  }

  const { data, error, count } = await query.range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    throw createBriefingError("unavailable", "Não foi possível listar os briefings.");
  }

  return {
    items: ((data ?? []) as BriefingRow[]).map(toSummary),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function listActivity(
  client: SupabaseClient,
  session: BriefingSession,
  briefingId: string,
): Promise<BriefingActivityRow[]> {
  if (session.role !== "admin") {
    throw createBriefingError("forbidden", "Acesso restrito a administradores.");
  }

  const { data, error } = await client
    .from("briefing_activity")
    .select("*")
    .eq("briefing_id", briefingId)
    .order("created_at", { ascending: false });

  if (error) {
    throw createBriefingError("unavailable", "Não foi possível consultar o histórico.");
  }

  return (data ?? []) as BriefingActivityRow[];
}

export async function changeBriefingStatus(
  client: SupabaseClient,
  session: BriefingSession,
  input: { briefingId: string; to: BriefingStatus; clientMessage?: string | null },
): Promise<BriefingSummary> {
  await requireBriefingAdmin(client);

  const { data, error } = await client
    .from("briefings")
    .select("*")
    .eq("id", input.briefingId)
    .maybeSingle();

  if (error) {
    throw createBriefingError("unavailable", "Não foi possível consultar o briefing.");
  }
  if (!data) {
    throw createBriefingError("not_found", "Briefing não encontrado.");
  }

  const briefing = data as BriefingRow;
  assertTransition(briefing.status, input.to, "admin");

  const update: Record<string, unknown> = { status: input.to };
  if (input.to === "completed") update["completed_at"] = new Date().toISOString();
  if (typeof input.clientMessage === "string") {
    update["client_message"] = input.clientMessage.slice(0, 2000);
  }

  const { data: updated, error: updateError } = await client
    .from("briefings")
    .update(update)
    .eq("id", briefing.id)
    .select("*")
    .single();

  if (updateError || !updated) {
    throw createBriefingError("unavailable", "Não foi possível alterar o status do briefing.");
  }

  await logActivity(client, briefing.id, "status_changed", {
    from: briefing.status,
    to: input.to,
  });

  return toSummary(updated as BriefingRow);
}

export async function requestComplement(
  client: SupabaseClient,
  session: BriefingSession,
  input: { briefingId: string; message: string },
): Promise<BriefingSummary> {
  await requireBriefingAdmin(client);

  const message = input.message.trim();
  if (message.length === 0) {
    throw createBriefingError("validation", "Descreva a informação complementar solicitada.");
  }

  return changeBriefingStatus(client, session, {
    briefingId: input.briefingId,
    to: "awaiting_information",
    clientMessage: message,
  });
}

export async function addInternalNote(
  client: SupabaseClient,
  session: BriefingSession,
  input: { briefingId: string; note: string },
): Promise<void> {
  await requireBriefingAdmin(client);

  const note = input.note.trim();
  if (note.length === 0) {
    throw createBriefingError("validation", "A nota interna não pode ficar vazia.");
  }

  await logActivity(client, input.briefingId, "internal_note", { note: note.slice(0, 2000) });
}

export async function logActivity(
  client: SupabaseClient,
  briefingId: string,
  action: string,
  metadata: Record<string, unknown>,
): Promise<void> {
  const { error } = await client.rpc("log_briefing_activity", {
    p_briefing_id: briefingId,
    p_action: action,
    p_metadata: metadata,
  });

  if (error) {
    console.error("[briefing] falha ao registrar atividade", { action, code: error.code });
  }
}

export async function requireOwnBriefing(
  client: SupabaseClient,
  session: BriefingSession,
  briefingId: string,
): Promise<BriefingRow> {
  const { data, error } = await client
    .from("briefings")
    .select("*")
    .eq("id", briefingId)
    .maybeSingle();

  if (error) {
    throw createBriefingError("unavailable", "Não foi possível consultar o briefing.");
  }
  if (!data) {
    throw createBriefingError("not_found", "Briefing não encontrado.");
  }

  const briefing = data as BriefingRow;
  if (session.role !== "admin" && !isOwner(briefing.owner_user_id, session.userId)) {
    throw createBriefingError("forbidden", "Este briefing pertence a outro usuário.");
  }

  return briefing;
}

export async function requireSession(client: SupabaseClient): Promise<BriefingSession> {
  return requireBriefingSession(client);
}
