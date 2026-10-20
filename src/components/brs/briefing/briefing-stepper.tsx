import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepInfo {
  number: number;
  label: string;
  shortLabel: string;
  hasErrors?: boolean;
  hasPending?: boolean;
}

interface BriefingStepperProps {
  steps: StepInfo[];
  activeStep: number;
  onSelectStep: (stepNumber: number) => void;
  completedSteps: number[];
}

export function BriefingStepper({
  steps,
  activeStep,
  onSelectStep,
  completedSteps,
}: BriefingStepperProps) {
  const percentComplete = Math.round((completedSteps.length / steps.length) * 100);

  return (
    <div className="w-full bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 mb-8">
      {/* Barra de Progresso Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
            Fluxo Guiado de Briefing
          </span>
          <h2 className="text-sm sm:text-base font-semibold text-white">
            Etapa {activeStep} de {steps.length}: {steps[activeStep - 1]?.label}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 font-mono">{percentComplete}% concluído</span>
          <div className="w-24 sm:w-32 h-2 rounded-full bg-neutral-800 overflow-hidden border border-white/5">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grade de Navegação das Etapas */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
        {steps.map((s) => {
          const isActive = s.number === activeStep;
          const isDone = completedSteps.includes(s.number);

          return (
            <button
              key={s.number}
              type="button"
              onClick={() => onSelectStep(s.number)}
              className={cn(
                "group relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary",
                isActive
                  ? "bg-primary/15 border-primary text-white shadow-lg shadow-primary/10"
                  : isDone
                    ? "bg-neutral-800/40 border-emerald-500/30 text-neutral-300 hover:border-emerald-500/60"
                    : "bg-neutral-900/40 border-white/5 text-neutral-400 hover:border-white/20 hover:text-neutral-200",
              )}
            >
              <div className="flex items-center justify-center size-6 rounded-full text-xs font-bold mb-1 transition-colors">
                {isDone && !isActive ? (
                  <CheckCircle2 className="size-4 text-emerald-400" aria-hidden="true" />
                ) : s.hasPending ? (
                  <AlertCircle className="size-4 text-brand-accent" aria-hidden="true" />
                ) : (
                  <span
                    className={cn(
                      "size-5 rounded-full flex items-center justify-center text-[11px]",
                      isActive
                        ? "bg-primary text-white font-bold"
                        : "bg-neutral-800 text-neutral-400 group-hover:text-white",
                    )}
                  >
                    {s.number}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium truncate w-full tracking-tight">
                {s.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
