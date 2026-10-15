import { Check } from "lucide-react";
import type { AppointmentStatus } from "../../domain/types";

export const REPAIR_STAGES = [
  { step: 1, key: "recebido", label: "Recebido", shortLabel: "Recebimento" },
  { step: 2, key: "desmontagem", label: "Desmontagem", shortLabel: "Desmontagem" },
  { step: 3, key: "reparo", label: "Reparo", shortLabel: "Funilaria/Reparo" },
  { step: 4, key: "pintura", label: "Pintura", shortLabel: "Pintura/Estufa" },
  { step: 5, key: "entrega", label: "Entrega", shortLabel: "Higienização/Entrega" },
] as const;

export interface ProcessStepperProps {
  status: AppointmentStatus;
  currentStep?: number;
  className?: string;
}

/**
 * Mini-stepper horizontal compacto das 5 etapas da oficina BRS:
 * Recebido → Desmontagem → Reparo → Pintura → Entrega.
 * Altura ~20px com nós de ~8px e linhas conectoras finas no desktop,
 * e resumo textual com barra de progresso no mobile (<640px).
 */
export function ProcessStepper({ status, currentStep, className = "" }: ProcessStepperProps) {
  // Se cancelado, exibe indicador de cancelamento
  if (status === "CANCELLED") {
    return (
      <div
        className={`flex items-center gap-1.5 text-[11px] text-rose-600 font-medium ${className}`}
      >
        <span className="size-2 rounded-full bg-rose-500" aria-hidden="true" />
        <span>Processo cancelado</span>
      </div>
    );
  }

  // Determinar etapa numérica padrão de 1 a 5
  let activeStep = currentStep ?? 1;
  if (!currentStep) {
    if (status === "COMPLETED" || status === "NO_SHOW") {
      activeStep = 5;
    } else if (status === "CONFIRMED") {
      activeStep = 3; // Em reparo
    } else {
      activeStep = 1; // Recebido / Aberto
    }
  }

  const isAllCompleted = (status === "COMPLETED" || status === "NO_SHOW") && activeStep === 5;
  const currentStage = REPAIR_STAGES[activeStep - 1] ?? REPAIR_STAGES[0];

  return (
    <div className={`w-full ${className}`}>
      {/* VISÃO DESKTOP (>=640px): 5 nós horizontais com linhas conectoras */}
      <div
        className="hidden sm:flex items-center justify-between w-full relative py-1"
        aria-label={`Etapa atual da reparação: ${currentStage.label} (${activeStep} de 5)`}
      >
        {REPAIR_STAGES.map((stage, idx) => {
          const isCompleted = isAllCompleted || stage.step < activeStep;
          const isCurrent = !isAllCompleted && stage.step === activeStep;
          const isPending = !isAllCompleted && stage.step > activeStep;

          return (
            <div key={stage.step} className="flex-1 flex items-center last:flex-none">
              {/* Nó circular de ~8px */}
              <div
                className="group relative flex flex-col items-center cursor-default"
                title={`${stage.label} • ${
                  isCompleted ? "Concluída" : isCurrent ? "Em andamento" : "Pendente"
                }`}
              >
                <div
                  className={`size-2.5 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-emerald-600 ring-2 ring-emerald-100"
                      : isCurrent
                        ? "bg-amber-500 ring-4 ring-amber-100 animate-pulse"
                        : "bg-white border border-slate-300 ring-1 ring-slate-100"
                  }`}
                  aria-hidden="true"
                >
                  {isCompleted && (
                    <Check size={7} className="text-white stroke-[3.5]" aria-hidden="true" />
                  )}
                </div>

                {/* Tooltip de hover ou rótulo acessível */}
                <span className="sr-only">
                  {stage.label}:{" "}
                  {isCompleted ? "Concluído" : isCurrent ? "Em Andamento" : "Pendente"}
                </span>
              </div>

              {/* Linha conectora entre os nós */}
              {idx < REPAIR_STAGES.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1.5 rounded-full transition-colors ${
                    stage.step < activeStep || isAllCompleted ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* VISÃO MOBILE (<640px): Resumo textual + barra fina de progresso */}
      <div className="flex sm:hidden flex-col gap-1 w-full pt-0.5">
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <span className="text-slate-700 font-semibold truncate">
            {isAllCompleted ? "Entrega Técnica Concluída" : currentStage.label}
          </span>
          <span className="font-mono text-slate-400">
            {isAllCompleted ? "5/5" : `${activeStep}/5`}
          </span>
        </div>
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isAllCompleted ? "bg-emerald-500" : "bg-amber-500"
            }`}
            style={{ width: `${(activeStep / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
