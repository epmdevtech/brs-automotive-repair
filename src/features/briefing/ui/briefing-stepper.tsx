import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BriefingStep } from "../domain/types";

interface BriefingStepperProps {
  steps: BriefingStep[];
  activeNumber: number;
  completedSteps: number[];
  onSelect: (stepNumber: number) => void;
}

export function BriefingStepper({
  steps,
  activeNumber,
  completedSteps,
  onSelect,
}: BriefingStepperProps) {
  return (
    <nav aria-label="Etapas do briefing">
      <ol className="grid grid-cols-5 gap-1.5 sm:grid-cols-8 lg:grid-cols-[repeat(15,minmax(0,1fr))]">
        {steps.map((step) => {
          const isActive = step.number === activeNumber;
          const isComplete = completedSteps.includes(step.number);

          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onSelect(step.number)}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Etapa ${step.number}: ${step.title}`}
                title={`${step.number}. ${step.title}`}
                className={cn(
                  "flex min-h-12 w-full flex-col items-center justify-center gap-0.5 rounded-md border px-1 py-1.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
                  isActive
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/15 text-white"
                    : "border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/25 hover:text-white",
                )}
              >
                <span className="flex items-center gap-1 font-mono text-[0.65rem]">
                  {isComplete ? (
                    <Check className="size-3 text-[var(--brand-text-accent)]" aria-hidden="true" />
                  ) : null}
                  {String(step.number).padStart(2, "0")}
                </span>
                <span className="line-clamp-2 text-[0.6rem] leading-tight">
                  {step.shortLabel}
                  {isComplete ? <span className="sr-only"> — concluída</span> : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
