import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isBriefingAuthorized, revokeBriefingAccess } from "../domain/access";
import {
  canAdvanceStep,
  getMissingRequiredFields,
  getMissingRequiredFieldsAll,
  getProgress,
} from "../domain/progress";
import { BRIEFING_STEPS, PHOTO_CATEGORIES } from "../domain/steps";
import type { BriefingValue } from "../domain/types";
import { BriefingAccessGate } from "./briefing-access-gate";
import { BriefingPhotosPanel } from "./briefing-photos-panel";
import { BriefingReview } from "./briefing-review";
import { BriefingStepPanel } from "./briefing-step-panel";
import { BriefingStepper } from "./briefing-stepper";
import { useBriefingDraft } from "./use-briefing-draft";

export function BriefingOperacionalContainer() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [activeStepNumber, setActiveStepNumber] = useState(1);
  const [showReview, setShowReview] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const {
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
    resetDraft,
  } = useBriefingDraft();

  useEffect(() => {
    setAuthorized(isBriefingAuthorized());
  }, []);

  const progress = useMemo(() => getProgress(draft), [draft]);
  const currentStep =
    BRIEFING_STEPS.find((step) => step.number === activeStepNumber) ?? BRIEFING_STEPS[0]!;
  const missingForCurrentStep = getMissingRequiredFields(currentStep, draft);
  const missingRequired = getMissingRequiredFieldsAll(draft);

  function focusField(fieldId: string) {
    window.setTimeout(() => {
      document.getElementById(fieldId)?.focus();
    }, 0);
  }

  function handleNext() {
    if (!canAdvanceStep(currentStep, draft)) {
      setShowErrors(true);
      if (missingForCurrentStep[0]) focusField(missingForCurrentStep[0].id);
      return;
    }

    setShowErrors(false);
    if (activeStepNumber >= BRIEFING_STEPS.length) {
      setShowReview(true);
      return;
    }
    setActiveStepNumber((step) => step + 1);
  }

  function handlePrevious() {
    setShowErrors(false);
    if (showReview) {
      setShowReview(false);
      return;
    }
    setActiveStepNumber((step) => Math.max(1, step - 1));
  }

  function handleSelectStep(stepNumber: number) {
    setShowReview(false);
    setShowErrors(false);
    setActiveStepNumber(stepNumber);
  }

  function handleComplete() {
    if (missingRequired.length > 0) {
      const firstMissing = missingRequired[0]!;
      const step = BRIEFING_STEPS.find((item) =>
        item.fields.some((field) => field.id === firstMissing.id),
      );
      setShowReview(false);
      if (step) setActiveStepNumber(step.number);
      setShowErrors(true);
      focusField(firstMissing.id);
      return;
    }

    markCompleted();
    setShowReview(true);
  }

  function handleConfirmReset() {
    resetDraft();
    setActiveStepNumber(1);
    setShowReview(false);
    setShowErrors(false);
    setShowResetDialog(false);
  }

  function handleRevokeAccess() {
    revokeBriefingAccess();
    setAuthorized(false);
    setShowReview(false);
  }

  function handleAddFiles(files: File[], categoryId: string) {
    const category = PHOTO_CATEGORIES.find((item) => item.id === categoryId);
    if (!category) return { added: 0, skipped: files.length };
    return addPhotos(files, category);
  }

  if (authorized === null) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm text-neutral-500">Verificando acesso…</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <BriefingAccessGate onAuthorized={() => setAuthorized(true)} />
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm text-neutral-500">Carregando rascunho local…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--brand-text-accent)]">
            EPM DevTech · Briefing privado
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
            Briefing operacional e credenciamento
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-400">
            Master Chapeação e Pinturas. Preencha o que souber e marque como pendente o que ainda
            precisa confirmar. Nada é publicado automaticamente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowReview((value) => !value)}
          >
            {showReview ? "Voltar ao formulário" : "Revisar"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleRevokeAccess}
            className="text-neutral-400 hover:text-white"
          >
            <LockKeyhole aria-hidden="true" />
            Bloquear acesso
          </Button>
        </div>
      </header>

      <div className="mt-5 border border-white/10 bg-white/[0.02] p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldCheck className="size-4 text-[var(--brand-text-accent)]" aria-hidden="true" />
            Rascunho salvo apenas neste navegador. Nenhum dado é enviado automaticamente.
          </p>
          <p
            role="status"
            aria-live="polite"
            className={storageError ? "text-xs text-red-300" : "text-xs text-neutral-500"}
          >
            {storageError
              ? "Não foi possível salvar automaticamente. Verifique o armazenamento do navegador."
              : lastSavedAt
                ? `Salvo localmente às ${formatTime(lastSavedAt)}`
                : "Salvamento automático ativo"}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div
            role="progressbar"
            aria-label="Progresso do briefing"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress.percent}
            className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
          >
            <div
              className="h-full rounded-full bg-[var(--brand-primary)] transition-[width] duration-300"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <span className="shrink-0 font-mono text-xs text-neutral-400">{progress.percent}%</span>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
          <span>
            {progress.answeredFields} de {progress.totalFields} campos respondidos ou pendentes
          </span>
          <span>{progress.completedSteps.length} de 15 etapas completas</span>
          <span className={progress.pendingCount > 0 ? "text-amber-200" : undefined}>
            {progress.pendingCount} pendência(s)
          </span>
          {draft.completed ? (
            <span className="flex items-center gap-1 text-emerald-200">
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
              concluído localmente
            </span>
          ) : null}
        </div>
      </div>

      {!showReview ? (
        <>
          <div className="mt-5">
            <BriefingStepper
              steps={BRIEFING_STEPS}
              activeNumber={activeStepNumber}
              completedSteps={progress.completedSteps}
              onSelect={handleSelectStep}
            />
          </div>

          {showErrors && missingForCurrentStep.length > 0 ? (
            <div
              role="alert"
              className="mt-4 border border-red-400/30 bg-red-400/5 p-3 text-sm text-red-100"
            >
              <p className="font-medium">Para avançar, informe ou marque como pendente:</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs">
                {missingForCurrentStep.map((field) => (
                  <li key={field.id}>{field.label}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-4">
            <BriefingStepPanel
              step={currentStep}
              draft={draft}
              showErrors={showErrors}
              onValueChange={(fieldId: string, value: BriefingValue) => setValue(fieldId, value)}
              onPendingChange={(fieldId: string, pending: boolean) => setPending(fieldId, pending)}
            >
              {currentStep.kind === "photos" ? (
                <BriefingPhotosPanel
                  photos={draft.photos}
                  onAddFiles={handleAddFiles}
                  onUpdatePhoto={updatePhoto}
                  onRemovePhoto={removePhoto}
                />
              ) : null}
            </BriefingStepPanel>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={handlePrevious}
              disabled={activeStepNumber === 1}
            >
              <ArrowLeft aria-hidden="true" />
              Etapa anterior
            </Button>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="mr-1 font-mono text-xs text-neutral-500">
                {String(activeStepNumber).padStart(2, "0")} / 15
              </span>
              <Button type="button" variant="primary" onClick={handleNext}>
                {activeStepNumber >= BRIEFING_STEPS.length ? "Revisar respostas" : "Próxima etapa"}
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5">
          <BriefingReview
            draft={draft}
            onEditStep={handleSelectStep}
            onComplete={handleComplete}
            onReset={() => setShowResetDialog(true)}
          />
        </div>
      )}

      {showResetDialog ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="briefing-reset-title"
          aria-describedby="briefing-reset-description"
          onKeyDown={(event) => {
            if (event.key === "Escape") setShowResetDialog(false);
          }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4"
        >
          <div className="w-full max-w-sm border border-white/15 bg-neutral-950 p-5 shadow-2xl">
            <h2 id="briefing-reset-title" className="font-display text-lg font-semibold text-white">
              Limpar rascunho?
            </h2>
            <p
              id="briefing-reset-description"
              className="mt-2 text-sm leading-relaxed text-neutral-400"
            >
              Todas as respostas, pendências e metadados de imagens salvos neste navegador serão
              removidos. Esta ação não pode ser desfeita.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                autoFocus
                onClick={() => setShowResetDialog(false)}
              >
                Cancelar
              </Button>
              <Button type="button" variant="destructive" onClick={handleConfirmReset}>
                Limpar rascunho
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "agora";
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
