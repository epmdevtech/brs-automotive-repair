import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, CloudOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { canAdvanceStep, getMissingRequiredFields, getProgress } from "../domain/progress";
import { BRIEFING_STEPS, PHOTO_CATEGORIES } from "../domain/steps";
import type { BriefingDraft, BriefingPhoto, BriefingValue } from "../domain/types";
import { BriefingPhotosPanel } from "./briefing-photos-panel";
import { BriefingReview } from "./briefing-review";
import { BriefingStepForm, type BriefingStepFormHandle } from "./briefing-step-form";
import { BriefingStepper } from "./briefing-stepper";
import { applyCepLookup } from "../domain/address";
import type { CepLookupResult } from "../domain/cep-service";
import { useBriefingDraft } from "./use-briefing-draft";
import { useBriefingServer } from "./use-briefing-server";

const AUTOSAVE_DELAY_MS = 900;

export function BriefingOperacionalContainer() {
  const navigate = useNavigate();
  const [activeStepNumber, setActiveStepNumber] = useState(1);
  const [showReview, setShowReview] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [briefingStatus, setBriefingStatus] = useState<"draft" | "enviado">("draft");
  const [errorSummary, setErrorSummary] = useState<
    { fieldId: string; label: string; message: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const formRef = useRef<BriefingStepFormHandle>(null);

  const {
    draft,
    hydrated,
    lastSavedAt,
    storageError,
    setValue,
    setPending,
    updatePhoto,
    removePhoto,
    hydrateFromServer,
    addServerPhoto,
    resetDraft,
  } = useBriefingDraft();

  const server = useBriefingServer();

  const progress = useMemo(() => getProgress(draft), [draft]);
  const currentStep =
    BRIEFING_STEPS.find((step) => step.number === activeStepNumber) ?? BRIEFING_STEPS[0]!;
  const missingForCurrentStep = getMissingRequiredFields(currentStep, draft);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const data = await server.load();
      if (cancelled) return;

      if (!data) {
        setLoadError(server.errorMessage ?? "Falha ao consultar o serviço de dados.");
        return;
      }

      const values: Record<string, BriefingValue> = {};
      const pending: Record<string, boolean> = {};

      for (const section of Object.values(data.sections)) {
        Object.assign(values, section.values);
        Object.assign(pending, section.pending);
      }

      const photos: BriefingPhoto[] = data.files.map((file) => ({
        id: file.id,
        categoryId: file.category,
        categoryLabel:
          PHOTO_CATEGORIES.find((category) => category.id === file.category)?.label ??
          file.category,
        fileName: file.original_name,
        fileSize: file.size_bytes,
        fileType: file.mime_type,
        description: "",
        authorized: false,
        identifiable: false,
      }));

      hydrateFromServer(values, pending, photos);
      setSubmitted(data.briefing.status !== "draft");
      setBriefingStatus(data.briefing.status === "draft" ? "draft" : "enviado");
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistCurrentStep = useCallback(
    async (stepNumber: number) => {
      const step = BRIEFING_STEPS.find((item) => item.number === stepNumber);
      if (!step) return;

      const values: Record<string, string | boolean> = {};
      const pending: Record<string, boolean> = {};

      for (const field of step.fields) {
        const value = draft.values[field.id];
        if (value !== undefined) values[field.id] = value;
        if (draft.pending[field.id]) pending[field.id] = true;
      }

      // Etapas com obrigatórios em aberto não são gravadas: o servidor exigiria
      // a resposta ou a pendência declarada, e o salvamento só é retomado
      // quando a etapa estiver completa.
      const missingRequired = step.fields.some((field) => {
        if (!field.required || pending[field.id]) return false;
        const value = values[field.id];
        return typeof value === "string" ? value.trim().length === 0 : value !== true;
      });

      if (missingRequired) return;

      await server.saveSection(step.id, values, pending);
    },
    [draft.pending, draft.values, server],
  );

  const lastStepRef = useRef(activeStepNumber);
  useEffect(() => {
    if (lastStepRef.current === activeStepNumber) return;
    lastStepRef.current = activeStepNumber;
    void persistCurrentStep(activeStepNumber - 1);
  }, [activeStepNumber, persistCurrentStep]);

  const autosaveTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    if (server.status === "unavailable" || server.status === "error") return;
    if (briefingStatus === "enviado") return;

    if (autosaveTimerRef.current !== null) {
      window.clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = window.setTimeout(() => {
      void persistCurrentStep(activeStepNumber);
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (autosaveTimerRef.current !== null) {
        window.clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [
    activeStepNumber,
    briefingStatus,
    draft.pending,
    draft.values,
    hydrated,
    persistCurrentStep,
    server.status,
  ]);

  function focusField(fieldId: string) {
    window.setTimeout(() => {
      document.getElementById(fieldId)?.focus();
    }, 0);
  }

  async function handleNext() {
    const valid = await formRef.current?.validate();
    if (valid === false) {
      setShowErrors(true);
      const summary = formRef.current?.getErrorSummary() ?? [];
      setErrorSummary(summary);
      const firstInvalid = summary[0]?.fieldId ?? missingForCurrentStep[0]?.id;
      if (firstInvalid) focusField(firstInvalid);
      return;
    }

    setErrorSummary([]);

    if (!canAdvanceStep(currentStep, draft)) {
      setShowErrors(true);
      if (missingForCurrentStep[0]) focusField(missingForCurrentStep[0].id);
      return;
    }

    setShowErrors(false);
    await persistCurrentStep(currentStep.number);

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
    setErrorSummary([]);
    setActiveStepNumber(stepNumber);
  }

  function handleCepResolved(result: CepLookupResult) {
    const { values } = applyCepLookup(draft.values as Record<string, string | boolean>, result);
    for (const [fieldId, value] of Object.entries(values)) {
      if (draft.values[fieldId] === undefined) {
        setValue(fieldId, value as BriefingValue);
      }
    }
  }

  async function handleSubmit() {
    setSubmitState("submitting");
    setSubmitError(null);

    const result = await server.submit();

    if (!result.ok) {
      setSubmitState("error");
      setSubmitError(result.message);
      return;
    }

    setSubmitState("idle");
    setSubmitted(true);
    void navigate({ to: "/briefing/confirmacao" });
  }

  function handleConfirmReset() {
    resetDraft();
    setActiveStepNumber(1);
    setShowReview(false);
    setShowErrors(false);
    setShowResetDialog(false);
  }

  async function handleAddFiles(files: File[], categoryId: string) {
    const category = PHOTO_CATEGORIES.find((item) => item.id === categoryId);
    if (!category) return { added: 0, skipped: files.length };

    if (!server.briefingId) {
      setPhotoMessage(
        "Não foi possível anexar agora: o armazenamento ainda não está disponível nesta sessão.",
      );
      return { added: 0, skipped: files.length };
    }

    setUploading(true);
    let added = 0;
    const failures: string[] = [];

    for (const file of files) {
      const result = await server.uploadFile(server.briefingId, categoryId, file);

      if (!result.ok) {
        failures.push(`${file.name}: ${result.message}`);
        continue;
      }

      added += 1;
      addServerPhoto({
        id: result.data.id,
        categoryId: result.data.category,
        categoryLabel: category.label,
        fileName: result.data.originalName,
        fileSize: result.data.sizeBytes,
        fileType: result.data.mimeType,
        description: "",
        authorized: false,
        identifiable: false,
      });
    }

    setUploading(false);
    setPhotoMessage(
      [
        added > 0
          ? `${added} arquivo(s) enviado(s) ao armazenamento privado.`
          : "Nenhum arquivo foi enviado.",
        failures.length > 0 ? `Recusados: ${failures.join("; ")}` : "",
        "O envio de arquivos não autoriza publicação no site.",
      ]
        .filter(Boolean)
        .join(" "),
    );

    return { added, skipped: files.length - added };
  }

  if (server.status === "unavailable") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <div className="border border-amber-300/30 bg-amber-300/5 p-5">
          <h1 className="flex items-center gap-2 font-display text-xl font-semibold text-white">
            <CloudOff className="size-5 text-amber-300" aria-hidden="true" />
            Persistência indisponível
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-300">
            {server.errorMessage ??
              "O serviço de dados do briefing ainda não foi configurado neste ambiente."}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Nenhuma resposta será gravada enquanto a configuração não existir. Consulte a
            documentação de provisionamento do Supabase e configure as variáveis de ambiente do
            servidor antes de iniciar o preenchimento.
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <div role="alert" className="border border-red-400/30 bg-red-400/5 p-5">
          <h1 className="font-display text-xl font-semibold text-white">
            Não foi possível carregar o briefing
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-neutral-300">{loadError}</p>
          <Button
            type="button"
            variant="secondary"
            className="mt-4"
            onClick={() => void server.load()}
          >
            Tentar novamente
          </Button>
        </div>
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
            precisa confirmar. As respostas são gravadas no servidor e podem ser retomadas a partir
            de qualquer dispositivo autenticado.
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
        </div>
      </header>

      {briefingStatus === "enviado" ? (
        <div className="mt-5 border border-emerald-400/30 bg-emerald-400/5 p-4">
          <h2 className="font-display text-base font-semibold text-white">
            Briefing já enviado para análise
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-300">
            As respostas deste briefing já foram registradas pela EPM DevTech e não podem ser
            alteradas. Se for necessário complementar alguma informação, use a página de confirmação
            para acompanhar o pedido ou peça um novo envio à EPM DevTech.
          </p>
        </div>
      ) : null}

      <div className="mt-5 border border-white/10 bg-white/[0.02] p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldCheck className="size-4 text-[var(--brand-text-accent)]" aria-hidden="true" />
            Respostas gravadas no servidor da EPM DevTech. O cache local do navegador é apenas
            apoio.
          </p>
          <p
            role="status"
            aria-live="polite"
            className={
              server.status === "error" || storageError
                ? "text-xs text-red-300"
                : "text-xs text-neutral-500"
            }
          >
            {server.status === "error"
              ? (server.errorMessage ?? "Falha ao sincronizar com o servidor.")
              : server.status === "saving"
                ? "Salvando no servidor…"
                : server.status === "saved"
                  ? `Sincronizado às ${formatTime(server.savedAt ?? new Date().toISOString())}`
                  : storageError
                    ? "Cache local indisponível no navegador."
                    : lastSavedAt
                      ? `Cache local às ${formatTime(lastSavedAt)}`
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
          {submitted ? (
            <span className="flex items-center gap-1 text-emerald-200">
              <CheckCircle2 className="size-3.5" aria-hidden="true" />
              enviado para análise
            </span>
          ) : null}
        </div>
      </div>

      {!showReview ? (
        <>
          <p aria-live="polite" className="sr-only">
            Etapa {currentStep.number} de 15: {currentStep.title}.
          </p>

          <div className="mt-5">
            <BriefingStepper
              steps={BRIEFING_STEPS}
              activeNumber={activeStepNumber}
              completedSteps={progress.completedSteps}
              onSelect={handleSelectStep}
            />
          </div>

          {showErrors && (errorSummary.length > 0 || missingForCurrentStep.length > 0) ? (
            <div
              role="alert"
              tabIndex={-1}
              ref={(element) => {
                if (element && errorSummary.length > 0) element.focus();
              }}
              className="mt-4 border border-red-400/30 bg-red-400/5 p-3 text-sm text-red-100"
            >
              <p className="font-medium">Para avançar, corrija os campos abaixo:</p>
              {errorSummary.length > 0 ? (
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs">
                  {errorSummary.map((error) => (
                    <li key={error.fieldId}>
                      <button
                        type="button"
                        onClick={() => focusField(error.fieldId)}
                        className="text-left underline underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                      >
                        {error.label}: {error.message}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-1 list-disc space-y-0.5 pl-5 text-xs">
                  {missingForCurrentStep.map((field) => (
                    <li key={field.id}>{field.label}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

          <div className="mt-4">
            <section
              aria-labelledby={`briefing-step-${currentStep.number}-title`}
              className="border border-white/10 bg-white/[0.02] p-4 sm:p-6"
            >
              <div className="border-b border-white/10 pb-4">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--brand-text-accent)]">
                  Etapa {String(currentStep.number).padStart(2, "0")} de 15
                </p>
                <h2
                  id={`briefing-step-${currentStep.number}-title`}
                  className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl"
                >
                  {currentStep.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-400">
                  {currentStep.description}
                </p>
              </div>

              {currentStep.kind === "photos" ? (
                <div className="mt-4 rounded-md border border-amber-300/20 bg-amber-300/5 p-3 text-xs leading-relaxed text-amber-100/90">
                  Os arquivos são enviados para o armazenamento privado da EPM DevTech e só podem
                  ser acessados por você e pela equipe autorizada. O envio não autoriza publicação
                  no site.
                </div>
              ) : null}

              <BriefingStepForm
                ref={formRef}
                step={currentStep}
                draft={draft}
                showErrors={showErrors}
                onValueChange={(fieldId: string, value: BriefingValue) => setValue(fieldId, value)}
                onPendingChange={(fieldId: string, pending: boolean) =>
                  setPending(fieldId, pending)
                }
                onCepResolved={handleCepResolved}
              />

              {currentStep.kind === "photos" ? (
                <div className="mt-6">
                  <BriefingPhotosPanel
                    photos={draft.photos}
                    onAddFiles={handleAddFiles}
                    onUpdatePhoto={updatePhoto}
                    onRemovePhoto={removePhoto}
                    uploading={uploading}
                    message={photoMessage}
                  />
                </div>
              ) : null}

              <p className="mt-6 border-t border-white/10 pt-3 text-xs leading-relaxed text-neutral-500">
                Campos com <span className="text-[var(--brand-text-accent)]">*</span> são
                obrigatórios, mas podem ser marcados como pendentes quando a informação não estiver
                disponível. Declarações finais não podem ser marcadas como pendentes.
              </p>
            </section>
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
              <Button type="button" variant="primary" onClick={() => void handleNext()}>
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
            onSubmit={() => void handleSubmit()}
            onReset={() => setShowResetDialog(true)}
            submitState={submitState}
            submitError={submitError}
            submitted={submitted}
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
              Limpar cache local?
            </h2>
            <p
              id="briefing-reset-description"
              className="mt-2 text-sm leading-relaxed text-neutral-400"
            >
              As respostas permanecem gravadas no servidor. Esta ação remove apenas a cópia mantido
              neste navegador.
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
                Limpar cache local
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
