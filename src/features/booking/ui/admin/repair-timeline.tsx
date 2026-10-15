import { useMemo } from "react";
import { Check, CheckCircle2, History, X, XCircle } from "lucide-react";
import type { Appointment, AppointmentEvent } from "../../domain/types";
import {
  buildServiceMilestones,
  ensureInitialEvents,
  getEventsForAppointment,
} from "../../domain/events";
import { formatDateTime } from "../../domain/time";

export interface RepairTimelineProps {
  appointment: Appointment;
  events?: AppointmentEvent[];
  className?: string;
  showAuditLog?: boolean;
}

export function RepairTimeline({
  appointment,
  events: propEvents,
  className = "",
  showAuditLog = true,
}: RepairTimelineProps) {
  const events = useMemo(() => {
    if (propEvents && propEvents.length > 0) return propEvents;
    const fromStorage = getEventsForAppointment(appointment.id);
    if (fromStorage.length > 0) return fromStorage;
    return ensureInitialEvents(appointment);
  }, [appointment, propEvents]);

  const milestones = useMemo(() => {
    return buildServiceMilestones(appointment, events);
  }, [appointment, events]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <History size={14} className="text-slate-600" />
          <span>Linha do Tempo Operacional</span>
        </h4>

        <span className="text-[11px] text-slate-500">
          Etapas registradas: <strong className="text-slate-900">{events.length}</strong>
        </span>
      </div>

      {/* STEPPER HORIZONTAL LIMPO E LINEAR */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="relative">
          {/* TRILHO HORIZONTAL CONTÍNUO (DESKTOP) */}
          <div
            className="hidden md:block absolute top-3.5 left-6 right-6 h-0.5 bg-slate-200 z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 relative z-10">
            {milestones.map((milestone, index) => {
              const stepNumber = index + 1;
              const isDone = milestone.status === "completed";
              const isCurrent = milestone.status === "current";
              const isFailed = milestone.status === "cancelled";

              return (
                <div
                  key={milestone.id}
                  className="flex flex-col items-center text-center space-y-2"
                >
                  {/* NÓ DO STEPPER */}
                  <div
                    className={`size-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all shadow-2xs ${
                      isFailed
                        ? "bg-rose-600 text-white ring-2 ring-rose-100"
                        : isDone
                          ? "bg-emerald-600 text-white ring-2 ring-emerald-100"
                          : isCurrent
                            ? "bg-slate-900 text-white ring-4 ring-slate-100 font-bold"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                  >
                    {isFailed ? (
                      <X size={13} strokeWidth={2.5} />
                    ) : isDone ? (
                      <Check size={13} strokeWidth={2.5} />
                    ) : (
                      <span>{stepNumber}</span>
                    )}
                  </div>

                  {/* IDENTIFICAÇÃO DA ETAPA */}
                  <div className="space-y-0.5 w-full">
                    <span
                      className={`text-xs block font-medium leading-tight ${
                        isCurrent || isDone ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {milestone.title}
                    </span>

                    <span
                      className={`text-[10px] inline-block font-medium ${
                        isFailed
                          ? "text-rose-600"
                          : isDone
                            ? "text-emerald-600"
                            : isCurrent
                              ? "text-slate-900 font-semibold"
                              : "text-slate-400"
                      }`}
                    >
                      {isFailed
                        ? "Cancelado"
                        : isDone
                          ? "Concluído"
                          : isCurrent
                            ? "Em Execução"
                            : "Pendente"}
                    </span>
                  </div>

                  {milestone.timestamp && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDateTime(new Date(milestone.timestamp)).split(" ")[1]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TABELA DE METADADOS E AUDITORIA COMPACTA */}
      {showAuditLog && events.length > 0 && (
        <details className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs group shadow-2xs">
          <summary className="font-semibold text-slate-700 flex items-center justify-between cursor-pointer select-none list-none">
            <span className="flex items-center gap-1.5 text-xs text-slate-700">
              <History size={13} className="text-slate-500" />
              <span>Registro de Eventos e Auditoria ({events.length})</span>
            </span>
            <span className="text-[11px] text-slate-400 group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>

          <div className="mt-3 pt-3 border-t border-slate-200 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] text-slate-500 font-medium bg-slate-50/70">
                  <th className="py-2 px-3">Data / Hora</th>
                  <th className="py-2 px-3">Evento</th>
                  <th className="py-2 px-3">Responsável</th>
                  <th className="py-2 px-3">Nota Técnica</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {formatDateTime(new Date(evt.createdAt))}
                    </td>
                    <td className="py-2 px-3">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {evt.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-800 whitespace-nowrap">
                      {evt.actorName}
                    </td>
                    <td className="py-2 px-3 text-slate-600 text-[11px]">{evt.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}
