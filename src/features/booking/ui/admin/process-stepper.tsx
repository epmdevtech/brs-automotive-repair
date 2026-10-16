import { useMemo, useState, useEffect } from "react";
import { Check } from "lucide-react";
import type { AppointmentStatus } from "../../domain/types";
import { ETAPAS_OPERACIONAIS } from "../../config/etapas.config";
import {
  getEtapaEventsForAppointment,
  etapaAtual,
  progresso,
  ETAPA_SYNC_DOM_EVENT,
} from "../../domain/etapas";

export const REPAIR_STAGES = ETAPAS_OPERACIONAIS.map((e) => ({
  step: e.ordem,
  key: e.id,
  label: e.tituloCurto,
  shortLabel: e.tituloCurto,
}));

export interface ProcessStepperProps {
  status: AppointmentStatus;
  currentStep?: number;
  appointmentId?: string;
  className?: string;
}

/**
 * Mini-stepper horizontal compacto das 6 etapas canônicas da oficina BRS (SPEC-057 / SPEC-065):
 * Agendamento → Recebimento → Vistoria → Orçamento → Execução → Qualidade & Entrega.
 * Alimenta tanto os cards de agendamento quanto o Kanban e prévias institucionais.
 */
export function ProcessStepper({
  status,
  currentStep,
  appointmentId,
  className = "",
}: ProcessStepperProps) {
  const [syncRevision, setSyncRevision] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleSync = () => {
      setSyncRevision((prev) => prev + 1);
    };
    window.addEventListener(ETAPA_SYNC_DOM_EVENT, handleSync);
    return () => {
      window.removeEventListener(ETAPA_SYNC_DOM_EVENT, handleSync);
    };
  }, []);

  // Se houver appointmentId, lê os eventos reais append-only reativamente
  const derived = useMemo(() => {
    void syncRevision;
    void status;
    if (appointmentId) {
      const eventos = getEtapaEventsForAppointment(appointmentId);
      if (eventos.length > 0) {
        const p = progresso(eventos);
        const atual = etapaAtual(eventos);
        return {
          step: Math.min(atual, 6),
          isCompleted: p.concluidas === 6,
        };
      }
    }
    return null;
  }, [appointmentId, status, syncRevision]);

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

  let activeStep = currentStep ?? derived?.step ?? 1;
  let isAllCompleted = derived?.isCompleted ?? false;

  if (!currentStep && !derived) {
    if (status === "COMPLETED" || status === "NO_SHOW") {
      activeStep = 6;
      isAllCompleted = true;
    } else if (status === "CONFIRMED") {
      activeStep = 3; // Vistoria técnica
    } else {
      activeStep = 1; // Agendamento
    }
  }

  const currentStage = REPAIR_STAGES[activeStep - 1] ?? REPAIR_STAGES[0];

  return (
    <div className={`w-full ${className}`}>
      {/* VISÃO DESKTOP (>=640px): 6 nós horizontais com linhas conectoras */}
      <div
        className="hidden sm:flex items-center justify-between w-full relative py-1"
        aria-label={`Etapa atual da reparação: ${currentStage.label} (${activeStep} de 6)`}
      >
        {REPAIR_STAGES.map((stage, idx) => {
          const isCompleted = isAllCompleted || stage.step < activeStep;
          const isCurrent = !isAllCompleted && stage.step === activeStep;

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

                {/* Tooltip acessível */}
                <span className="sr-only">
                  {stage.label}:{" "}
                  {isCompleted ? "Concluído" : isCurrent ? "Em andamento" : "Pendente"}
                </span>
              </div>

              {/* Linha conectora entre os nós */}
              {idx < REPAIR_STAGES.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 rounded-full transition-colors ${
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
            {isAllCompleted ? "6/6" : `${activeStep}/6`}
          </span>
        </div>
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isAllCompleted ? "bg-emerald-500" : "bg-amber-500"
            }`}
            style={{ width: `${(activeStep / 6) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
