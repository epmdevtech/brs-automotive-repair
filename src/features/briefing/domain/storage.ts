import { z } from "zod";
import type { BriefingDraft, BriefingPhoto } from "./types";

export const BRIEFING_DRAFT_KEY = "master_briefing_operacional_draft_v1";
export const BRIEFING_DRAFT_VERSION = "1.0" as const;

const BriefingPhotoSchema = z.object({
  id: z.string().min(1).max(120),
  categoryId: z.string().min(1).max(80),
  categoryLabel: z.string().min(1).max(120),
  fileName: z.string().min(1).max(255),
  fileSize: z
    .number()
    .nonnegative()
    .max(50 * 1024 * 1024),
  fileType: z.string().max(120),
  description: z.string().max(2000),
  authorized: z.boolean(),
  identifiable: z.boolean(),
});

export const BriefingDraftSchema = z.object({
  schemaVersion: z.literal(BRIEFING_DRAFT_VERSION),
  updatedAt: z.string().min(1),
  values: z.record(z.string(), z.union([z.string().max(20000), z.boolean()])),
  pending: z.record(z.string(), z.boolean()),
  photos: z.array(BriefingPhotoSchema).max(60),
  completed: z.boolean(),
});

export function createEmptyDraft(now: Date = new Date()): BriefingDraft {
  return {
    schemaVersion: BRIEFING_DRAFT_VERSION,
    updatedAt: now.toISOString(),
    values: {},
    pending: {},
    photos: [],
    completed: false,
  };
}

export function loadBriefingDraft(): BriefingDraft | null {
  if (typeof window === "undefined" || typeof localStorage === "undefined") return null;

  try {
    const raw = localStorage.getItem(BRIEFING_DRAFT_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    const result = BriefingDraftSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function saveBriefingDraft(draft: BriefingDraft): boolean {
  if (typeof window === "undefined" || typeof localStorage === "undefined") return false;

  try {
    localStorage.setItem(BRIEFING_DRAFT_KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function clearBriefingDraft(): void {
  if (typeof window === "undefined" || typeof localStorage === "undefined") return;

  try {
    localStorage.removeItem(BRIEFING_DRAFT_KEY);
  } catch {
    return;
  }
}

export function createPhotoRecord(
  file: Pick<File, "name" | "size" | "type">,
  category: { id: string; label: string },
): BriefingPhoto {
  return {
    id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    categoryId: category.id,
    categoryLabel: category.label,
    fileName: file.name.slice(0, 255),
    fileSize: file.size,
    fileType: file.type.slice(0, 120),
    description: "",
    authorized: false,
    identifiable: false,
  };
}
