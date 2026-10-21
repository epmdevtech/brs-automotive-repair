import type { SupabaseClient } from "@supabase/supabase-js";
import { requireBriefingAdmin } from "./auth-service";
import { buildBriefingPdf, type BriefingPdfOutput } from "./pdf/briefing-document";
import type { BriefingActivityRow, BriefingAnswerRow, BriefingRow } from "./db-types";
import { createBriefingError } from "./errors";

export interface BriefingPdfExport {
  fileName: string;
  base64: string;
  pageCount: number;
  sizeBytes: number;
}

/**
 * Gera a evidência em PDF de um briefing. A leitura e a montagem acontecem no
 * servidor, somente para administradores, a partir do mesmo registro exibido
 * no painel.
 */
export async function exportBriefingPdf(
  client: SupabaseClient,
  session: Awaited<ReturnType<typeof requireBriefingAdmin>>,
  briefingId: string,
): Promise<BriefingPdfExport> {
  await requireBriefingAdmin(client);

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

  const { data: answerRows } = await client
    .from("briefing_answers")
    .select("*")
    .eq("briefing_id", briefing.id);

  const { data: activityRows } = await client
    .from("briefing_activity")
    .select("*")
    .eq("briefing_id", briefing.id)
    .order("created_at", { ascending: true });

  const { data: profileRow } = await client
    .from("profiles")
    .select("display_name")
    .eq("id", briefing.owner_user_id)
    .maybeSingle();

  const companyName =
    briefing.company_name ||
    (typeof profileRow?.["display_name"] === "string" ? String(profileRow["display_name"]) : "");

  const document: BriefingPdfOutput = buildBriefingPdf({
    briefing,
    answers: (answerRows ?? []) as BriefingAnswerRow[],
    activity: (activityRows ?? []) as BriefingActivityRow[],
    companyName,
  });

  return {
    fileName: document.fileName,
    base64: document.bytes.toString("base64"),
    pageCount: document.pageCount,
    sizeBytes: document.bytes.length,
  };
}
