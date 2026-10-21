import type { ReactNode } from "react";
import type { BriefingDraft, BriefingStep, BriefingValue } from "../domain/types";
import { BriefingFieldInput } from "./briefing-field";

interface BriefingStepPanelProps {
  step: BriefingStep;
  draft: BriefingDraft;
  showErrors: boolean;
  onValueChange: (fieldId: string, value: BriefingValue) => void;
  onPendingChange: (fieldId: string, pending: boolean) => void;
  children?: ReactNode;
}

export function BriefingStepPanel({
  step,
  draft,
  showErrors,
  onValueChange,
  onPendingChange,
  children,
}: BriefingStepPanelProps) {
  const descriptionId = `briefing-step-${step.number}-description`;

  return (
    <section
      aria-labelledby={`briefing-step-${step.number}-title`}
      aria-describedby={descriptionId}
      className="border border-white/10 bg-white/[0.02] p-4 sm:p-6"
    >
      <div className="border-b border-white/10 pb-4">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--brand-text-accent)]">
          Etapa {String(step.number).padStart(2, "0")} de 15
        </p>
        <h2
          id={`briefing-step-${step.number}-title`}
          className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl"
        >
          {step.title}
        </h2>
        <p id={descriptionId} className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-400">
          {step.description}
        </p>
      </div>

      {step.kind === "photos" ? (
        <div className="mt-4 rounded-md border border-amber-300/20 bg-amber-300/5 p-3 text-xs leading-relaxed text-amber-100/90">
          Os arquivos selecionados não são lidos, enviados nem armazenados. Ficam registrados apenas
          nome, tamanho, tipo, descrição e autorização no rascunho local deste navegador.
        </div>
      ) : null}

      <fieldset className="mt-5 min-w-0">
        <legend className="sr-only">{step.title}</legend>
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          {step.fields.map((field) => (
            <BriefingFieldInput
              key={field.id}
              field={field}
              value={draft.values[field.id]}
              pending={Boolean(draft.pending[field.id])}
              showError={showErrors}
              onChange={(value) => onValueChange(field.id, value)}
              onPendingChange={(pending) => onPendingChange(field.id, pending)}
            />
          ))}
        </div>
      </fieldset>

      {children ? <div className="mt-6">{children}</div> : null}

      <p className="mt-6 border-t border-white/10 pt-3 text-xs leading-relaxed text-neutral-500">
        Campos com <span className="text-[var(--brand-text-accent)]">*</span> são obrigatórios, mas
        podem ser marcados como pendentes quando a informação não estiver disponível. Declarações
        finais não podem ser marcadas como pendentes.
      </p>
    </section>
  );
}
