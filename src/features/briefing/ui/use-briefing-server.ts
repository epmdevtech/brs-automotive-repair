import { useCallback, useState } from "react";
import {
  createBriefingFileUrl,
  deleteBriefingFile,
  loadOwnBriefing,
  saveBriefingSection,
  submitBriefing,
  uploadBriefingFile,
} from "../server/functions";
import type { BriefingSectionPending, BriefingSectionValues } from "../domain/section-schemas";
import type { BriefingFileMetadata } from "../server/file-service";

export type BriefingSyncStatus =
  "idle" | "loading" | "ready" | "saving" | "saved" | "error" | "unavailable";

export interface BriefingServerState {
  status: BriefingSyncStatus;
  errorMessage: string | null;
  briefingId: string | null;
  savedAt: string | null;
}

async function fileToBase64(file: File): Promise<string> {
  if (typeof file.arrayBuffer === "function") {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 8192;
    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }
    return btoa(binary);
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo selecionado."));
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const commaIndex = result.indexOf(",");
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.readAsDataURL(file);
  });
}

export function useBriefingServer() {
  const [state, setState] = useState<BriefingServerState>({
    status: "idle",
    errorMessage: null,
    briefingId: null,
    savedAt: null,
  });

  const load = useCallback(async () => {
    setState((previous) => ({ ...previous, status: "loading", errorMessage: null }));

    const result = await loadOwnBriefing();

    if (!result.ok) {
      const status = result.error.code === "not_configured" ? "unavailable" : "error";
      setState((previous) => ({
        ...previous,
        status,
        errorMessage: result.error.message,
      }));
      return null;
    }

    setState({
      status: "ready",
      errorMessage: null,
      briefingId: result.data.briefing.id,
      savedAt: result.data.briefing.updatedAt,
    });

    return result.data;
  }, []);

  const saveSection = useCallback(
    async (sectionKey: string, values: BriefingSectionValues, pending: BriefingSectionPending) => {
      setState((previous) => ({ ...previous, status: "saving" }));

      const result = await saveBriefingSection({ data: { sectionKey, values, pending } });

      if (!result.ok) {
        setState((previous) => ({
          ...previous,
          status: "error",
          errorMessage: result.error.message,
        }));
        return { ok: false as const, message: result.error.message };
      }

      setState((previous) => ({
        ...previous,
        status: "saved",
        errorMessage: null,
        savedAt: result.data.savedAt,
      }));

      return { ok: true as const, savedAt: result.data.savedAt };
    },
    [],
  );

  const submit = useCallback(async () => {
    const result = await submitBriefing();

    if (!result.ok) {
      setState((previous) => ({
        ...previous,
        status: "error",
        errorMessage: result.error.message,
      }));
      return { ok: false as const, message: result.error.message };
    }

    setState((previous) => ({ ...previous, status: "saved", errorMessage: null }));

    return { ok: true as const, data: result.data };
  }, []);

  const uploadFile = useCallback(async (briefingId: string, category: string, file: File) => {
    const contentBase64 = await fileToBase64(file);

    const result = await uploadBriefingFile({
      data: {
        briefingId,
        category,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        contentBase64,
      },
    });

    if (!result.ok) {
      return { ok: false as const, message: result.error.message };
    }

    return { ok: true as const, data: result.data as BriefingFileMetadata };
  }, []);

  const createFileUrl = useCallback(async (fileId: string) => {
    const result = await createBriefingFileUrl({ data: { fileId } });

    if (!result.ok) {
      return { ok: false as const, message: result.error.message };
    }

    return { ok: true as const, data: result.data };
  }, []);

  const removeFile = useCallback(async (fileId: string) => {
    const result = await deleteBriefingFile({ data: { fileId } });

    if (!result.ok) {
      return { ok: false as const, message: result.error.message };
    }

    return { ok: true as const };
  }, []);

  return {
    ...state,
    load,
    saveSection,
    submit,
    uploadFile,
    createFileUrl,
    removeFile,
  };
}
