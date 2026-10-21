import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearBriefingDraft,
  createEmptyDraft,
  createPhotoRecord,
  loadBriefingDraft,
  saveBriefingDraft,
} from "../domain/storage";
import type {
  BriefingDraft,
  BriefingPhoto,
  BriefingPhotoCategory,
  BriefingValue,
} from "../domain/types";

export const MAX_BRIEFING_PHOTOS = 60;
export const MAX_PHOTO_SIZE_BYTES = 25 * 1024 * 1024;
const AUTOSAVE_DELAY_MS = 400;

export function useBriefingDraft() {
  const [draft, setDraft] = useState<BriefingDraft>(() => createEmptyDraft());
  const [hydrated, setHydrated] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [storageError, setStorageError] = useState(false);
  const hydratedRef = useRef(false);
  const latestDraftRef = useRef(draft);
  latestDraftRef.current = draft;

  useEffect(() => {
    const stored = loadBriefingDraft();
    if (stored) {
      setDraft(stored);
      setLastSavedAt(stored.updatedAt);
    }
    hydratedRef.current = true;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;

    const timer = window.setTimeout(() => {
      const updated = { ...latestDraftRef.current, updatedAt: new Date().toISOString() };
      const saved = saveBriefingDraft(updated);
      setStorageError(!saved);
      if (saved) setLastSavedAt(updated.updatedAt);
    }, AUTOSAVE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [draft]);

  useEffect(() => {
    return () => {
      if (!hydratedRef.current) return;
      saveBriefingDraft({ ...latestDraftRef.current, updatedAt: new Date().toISOString() });
    };
  }, []);

  const setValue = useCallback((fieldId: string, value: string | boolean) => {
    setDraft((previous) => {
      const pending = { ...previous.pending };
      const answered = typeof value === "string" ? value.trim().length > 0 : value === true;
      if (answered) delete pending[fieldId];

      return {
        ...previous,
        values: { ...previous.values, [fieldId]: value },
        pending,
        completed: false,
      };
    });
  }, []);

  const setPending = useCallback((fieldId: string, pending: boolean) => {
    setDraft((previous) => {
      const nextPending = { ...previous.pending };
      if (pending) nextPending[fieldId] = true;
      else delete nextPending[fieldId];

      return { ...previous, pending: nextPending, completed: false };
    });
  }, []);

  const addPhotos = useCallback(
    (files: File[], category: BriefingPhotoCategory) => {
      const remaining = Math.max(0, MAX_BRIEFING_PHOTOS - draft.photos.length);
      const eligible = files.filter((file) => file.size <= MAX_PHOTO_SIZE_BYTES);
      const accepted = eligible.slice(0, remaining);
      const skipped = files.length - accepted.length;

      if (accepted.length === 0) return { added: 0, skipped };

      const records = accepted.map((file) => createPhotoRecord(file, category));
      setDraft((previous) => ({
        ...previous,
        photos: [...previous.photos, ...records].slice(0, MAX_BRIEFING_PHOTOS),
        completed: false,
      }));
      return { added: records.length, skipped };
    },
    [draft.photos.length],
  );

  const updatePhoto = useCallback((photoId: string, updates: Partial<BriefingPhoto>) => {
    setDraft((previous) => ({
      ...previous,
      photos: previous.photos.map((photo) =>
        photo.id === photoId ? { ...photo, ...updates } : photo,
      ),
      completed: false,
    }));
  }, []);

  const removePhoto = useCallback((photoId: string) => {
    setDraft((previous) => ({
      ...previous,
      photos: previous.photos.filter((photo) => photo.id !== photoId),
    }));
  }, []);

  const markCompleted = useCallback(() => {
    setDraft((previous) => ({ ...previous, completed: true }));
  }, []);

  const hydrateFromServer = useCallback(
    (
      values: Record<string, BriefingValue>,
      pending: Record<string, boolean>,
      photos: BriefingPhoto[],
    ) => {
      setDraft((previous) => {
        const mergedValues = { ...previous.values, ...values };
        const mergedPending = { ...previous.pending, ...pending };
        const mergedPhotos = photos.length > 0 ? photos : previous.photos;

        return {
          ...previous,
          values: mergedValues,
          pending: mergedPending,
          photos: mergedPhotos,
          updatedAt: new Date().toISOString(),
        };
      });
    },
    [],
  );

  const addServerPhoto = useCallback((photo: BriefingPhoto) => {
    setDraft((previous) => ({
      ...previous,
      photos: [...previous.photos, photo].slice(0, MAX_BRIEFING_PHOTOS),
      completed: false,
    }));
  }, []);

  const replacePhotos = useCallback((photos: BriefingPhoto[]) => {
    setDraft((previous) => ({ ...previous, photos: photos.slice(0, MAX_BRIEFING_PHOTOS) }));
  }, []);

  const resetDraft = useCallback(() => {
    clearBriefingDraft();
    setDraft(createEmptyDraft());
    setLastSavedAt(null);
    setStorageError(false);
  }, []);

  return {
    draft,
    hydrated,
    lastSavedAt,
    storageError,
    setValue,
    setPending,
    addPhotos,
    updatePhoto,
    removePhoto,
    markCompleted,
    hydrateFromServer,
    addServerPhoto,
    replacePhotos,
    resetDraft,
  };
}
