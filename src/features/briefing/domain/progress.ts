import { BRIEFING_STEPS, TOTAL_BRIEFING_FIELDS } from "./steps";
import type { BriefingDraft, BriefingField, BriefingStep, PendingItem } from "./types";

export type StepCompletionStatus = "empty" | "in_progress" | "complete";

export function isFieldAnswered(field: BriefingField, draft: BriefingDraft): boolean {
  if (draft.pending[field.id]) return true;

  const value = draft.values[field.id];
  if (field.type === "checkbox") return value === true;
  return typeof value === "string" && value.trim().length > 0;
}

export function getMissingRequiredFields(
  step: BriefingStep,
  draft: BriefingDraft,
): BriefingField[] {
  return step.fields.filter((field) => field.required && !isFieldAnswered(field, draft));
}

export function getMissingRequiredFieldsAll(draft: BriefingDraft): BriefingField[] {
  return BRIEFING_STEPS.flatMap((step) => getMissingRequiredFields(step, draft));
}

export function getAnsweredCount(step: BriefingStep, draft: BriefingDraft): number {
  return step.fields.filter((field) => isFieldAnswered(field, draft)).length;
}

export function getStepCompletion(step: BriefingStep, draft: BriefingDraft): StepCompletionStatus {
  const answered = getAnsweredCount(step, draft);
  const missing = getMissingRequiredFields(step, draft);

  if (missing.length > 0) return "in_progress";
  if (answered === 0) return "empty";
  return "complete";
}

export function getPendingItems(draft: BriefingDraft): PendingItem[] {
  return BRIEFING_STEPS.flatMap((step) =>
    step.fields
      .filter((field) => draft.pending[field.id])
      .map((field) => ({
        stepNumber: step.number,
        stepTitle: step.title,
        fieldId: field.id,
        label: field.label,
      })),
  );
}

export function getPendingCount(draft: BriefingDraft): number {
  return getPendingItems(draft).length;
}

export function getProgress(draft: BriefingDraft) {
  const answeredFields = BRIEFING_STEPS.reduce(
    (total, step) => total + getAnsweredCount(step, draft),
    0,
  );
  const completedSteps = BRIEFING_STEPS.filter(
    (step) => getStepCompletion(step, draft) === "complete",
  ).map((step) => step.number);
  const percent =
    TOTAL_BRIEFING_FIELDS === 0 ? 0 : Math.round((answeredFields / TOTAL_BRIEFING_FIELDS) * 100);

  return {
    answeredFields,
    totalFields: TOTAL_BRIEFING_FIELDS,
    completedSteps,
    percent,
    pendingCount: getPendingCount(draft),
    missingRequiredCount: getMissingRequiredFieldsAll(draft).length,
  };
}

export function canAdvanceStep(step: BriefingStep, draft: BriefingDraft): boolean {
  return getMissingRequiredFields(step, draft).length === 0;
}
