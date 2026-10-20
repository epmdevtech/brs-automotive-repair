import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildBriefingStoragePath,
  validateBriefingFile,
  type FileValidationResult,
} from "../domain/file-policy";
import { isOwner } from "../domain/roles";
import { requireBriefingSession, type BriefingSession } from "./auth-service";
import type { BriefingFileRow } from "./db-types";
import { createBriefingError } from "./errors";
import { logActivity, requireOwnBriefing } from "./briefing-service";

export const SIGNED_URL_TTL_SECONDS = 300;

export interface BriefingFileInput {
  briefingId: string;
  category: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  contentBase64: string;
}

export interface BriefingFileMetadata {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  category: string;
  createdAt: string;
}

function toMetadata(row: BriefingFileRow): BriefingFileMetadata {
  return {
    id: row.id,
    originalName: row.original_name,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    category: row.category,
    createdAt: row.created_at,
  };
}

function base64ToBytes(contentBase64: string): Uint8Array {
  const clean = contentBase64.includes(",")
    ? contentBase64.slice(contentBase64.indexOf(",") + 1)
    : contentBase64;
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

export async function uploadBriefingFile(
  client: SupabaseClient,
  session: BriefingSession,
  input: BriefingFileInput,
): Promise<BriefingFileMetadata> {
  await requireBriefingSession(client);

  const validation: FileValidationResult = validateBriefingFile({
    fileName: input.fileName,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
  });

  if (!validation.ok) {
    throw createBriefingError("validation", validation.reason);
  }

  const briefing = await requireOwnBriefing(client, session, input.briefingId);
  if (session.role !== "admin" && !isOwner(briefing.owner_user_id, session.userId)) {
    throw createBriefingError("forbidden", "Este briefing pertence a outro usuário.");
  }

  const token = crypto.randomUUID();
  const storagePath = buildBriefingStoragePath({
    userId: session.userId,
    briefingId: briefing.id,
    category: input.category,
    fileName: input.fileName,
    mimeType: input.mimeType,
    token,
  });

  const bucket = process.env["SUPABASE_BRIEFING_BUCKET"] ?? "master-briefing-private";
  const bytes = base64ToBytes(input.contentBase64);

  const { error: uploadError } = await client.storage
    .from(bucket)
    .upload(storagePath, bytes, { contentType: input.mimeType, upsert: false });

  if (uploadError) {
    throw createBriefingError("unavailable", "Não foi possível enviar o arquivo ao armazenamento.");
  }

  const { data: row, error: insertError } = await client
    .from("briefing_files")
    .insert({
      briefing_id: briefing.id,
      uploaded_by: session.userId,
      storage_path: storagePath,
      original_name: input.fileName.slice(0, 255),
      mime_type: input.mimeType,
      size_bytes: input.sizeBytes,
      category: input.category.slice(0, 40),
    })
    .select("*")
    .single();

  if (insertError || !row) {
    await client.storage.from(bucket).remove([storagePath]);
    throw createBriefingError("unavailable", "Não foi possível registrar o arquivo enviado.");
  }

  await logActivity(client, briefing.id, "file_uploaded", { file_id: row.id });

  return toMetadata(row as BriefingFileRow);
}

export async function listBriefingFiles(
  client: SupabaseClient,
  session: BriefingSession,
  briefingId: string,
): Promise<BriefingFileMetadata[]> {
  await requireOwnBriefing(client, session, briefingId);

  const { data, error } = await client
    .from("briefing_files")
    .select("*")
    .eq("briefing_id", briefingId)
    .order("created_at", { ascending: true });

  if (error) {
    throw createBriefingError("unavailable", "Não foi possível consultar os arquivos.");
  }

  return ((data ?? []) as BriefingFileRow[]).map(toMetadata);
}

export async function createBriefingFileUrl(
  client: SupabaseClient,
  session: BriefingSession,
  fileId: string,
): Promise<{ url: string; expiresInSeconds: number }> {
  const { data, error } = await client
    .from("briefing_files")
    .select("*")
    .eq("id", fileId)
    .maybeSingle();

  if (error) {
    throw createBriefingError("unavailable", "Não foi possível consultar o arquivo.");
  }
  if (!data) {
    throw createBriefingError("not_found", "Arquivo não encontrado.");
  }

  const file = data as BriefingFileRow;
  await requireOwnBriefing(client, session, file.briefing_id);

  const bucket = process.env["SUPABASE_BRIEFING_BUCKET"] ?? "master-briefing-private";
  const { data: signed, error: signError } = await client.storage
    .from(bucket)
    .createSignedUrl(file.storage_path, SIGNED_URL_TTL_SECONDS);

  if (signError || !signed?.signedUrl) {
    throw createBriefingError(
      "unavailable",
      "Não foi possível gerar o link temporário do arquivo.",
    );
  }

  return { url: signed.signedUrl, expiresInSeconds: SIGNED_URL_TTL_SECONDS };
}

export async function deleteBriefingFile(
  client: SupabaseClient,
  session: BriefingSession,
  fileId: string,
): Promise<void> {
  const { data, error } = await client
    .from("briefing_files")
    .select("*")
    .eq("id", fileId)
    .maybeSingle();

  if (error) {
    throw createBriefingError("unavailable", "Não foi possível consultar o arquivo.");
  }
  if (!data) {
    throw createBriefingError("not_found", "Arquivo não encontrado.");
  }

  const file = data as BriefingFileRow;
  const briefing = await requireOwnBriefing(client, session, file.briefing_id);

  if (session.role !== "admin" && !isOwner(briefing.owner_user_id, session.userId)) {
    throw createBriefingError("forbidden", "Este briefing pertence a outro usuário.");
  }

  const bucket = process.env["SUPABASE_BRIEFING_BUCKET"] ?? "master-briefing-private";
  await client.storage.from(bucket).remove([file.storage_path]);

  const { error: deleteError } = await client
    .from("briefing_files")
    .delete()
    .eq("id", file.id)
    .eq("briefing_id", file.briefing_id);

  if (deleteError) {
    throw createBriefingError("unavailable", "Não foi possível remover o arquivo.");
  }

  await logActivity(client, file.briefing_id, "file_removed", { file_id: file.id });
}
