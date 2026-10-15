import { useMemo } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Shield,
  ShieldAlert,
  Sparkles,
  Truck,
  Wrench,
  XCircle,
  AlertTriangle,
  History,
} from "lucide-react";
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

  const isCancelled = appointment.status === "CANCELLED";

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#716860] flex items-center gap-1.5">
          <History size={14} className="text-[#3b3530]" />
          Linha do Tempo Automotiva (Histórico Real de Reparação)
        </h4>

        <span className="text-[11px] text-[#716860]">
          Total de eventos registrados: <strong className="text-[#201d1b]">{events.length}</strong>
        </span>
      </div>

      {/* GRADE VISUAL DAS ETAPAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {milestones.map((milestone, idx) => {
          const isDone = milestone.status === "completed";
          const isCurrent = milestone.status === "current";
          const isFailed = milestone.status === "cancelled";

          return (
            <div
              key={milestone.id}
              className={`p-3.5 rounded-xl border text-xs transition-all relative overflow-hidden ${
                isFailed
                  ? "border-red-200 bg-red-50/60 text-red-950"
                  : isDone
                    ? "border-emerald-300 bg-emerald-50/70 text-emerald-950 shadow-2xs"
                    : isCurrent
                      ? "border-amber-300 bg-amber-50/80 text-amber-950 ring-2 ring-amber-300/40 shadow-xs"
                      : "border-[#ded7cc] bg-white text-[#554e47] opacity-80"
              }`}
            >
              {/* STATUS INDICATOR BADGE */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span
                  className={`flex items-center gap-1.5 font-bold text-[11px] tracking-tight ${
                    isFailed
                      ? "text-red-700"
                      : isDone
                        ? "text-emerald-800"
                        : isCurrent
                          ? "text-amber-900"
                          : "text-[#716860]"
                  }`}
                >
                  {isFailed ? (
                    <XCircle size={13} className="text-red-600" />
                  ) : isDone ? (
                    <CheckCircle2 size={13} className="text-emerald-600" />
                  ) : isCurrent ? (
                    <Clock size={13} className="text-amber-600 animate-pulse" />
                  ) : (
                    <span className="size-2 rounded-full bg-[#ded7cc]" />
                  )}
                  {milestone.title}
                </span>

                <span
                  className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                    isFailed
                      ? "bg-red-100 text-red-800"
                      : isDone
                        ? "bg-emerald-200/80 text-emerald-900 font-mono"
                        : isCurrent
                          ? "bg-amber-200 text-amber-950 font-bold animate-pulse"
                          : "bg-[#eee7de] text-[#716860]"
                  }`}
                >
                  {isFailed
                    ? "Cancelado"
                    : isDone
                      ? "Concluído"
                      : isCurrent
                        ? "Em Andamento"
                        : "Pendente"}
                </span>
              </div>

              {/* DESCRIÇÃO DA ETAPA */}
              <p className="text-[11px] text-[#4a423a] leading-relaxed">{milestone.description}</p>

              {/* TIMESTAMP QUANDO DISPONÍVEL */}
              {milestone.timestamp && (
                <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-[#716860] font-mono">
                  <span>Concluído em:</span>
                  <span className="font-medium text-[#201d1b]">
                    {formatDateTime(new Date(milestone.timestamp))}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* REGISTRO DE AUDITORIA APPEND-ONLY (HISTÓRICO INTERNO DE EVENTOS) */}
      {showAuditLog && events.length > 0 && (
        <div className="mt-4 p-4 rounded-xl border border-[#ded7cc] bg-white space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#201d1b] flex items-center gap-1.5">
              <History size={13} className="text-[#716860]" />
              Trilha de Auditoria Técnica (Append-Only Event Store)
            </span>
            <span className="text-[10px] text-[#716860] font-mono bg-[#f4eee6] px-2 py-0.5 rounded">
              localStorage: brs_appointment_events_v1
            </span>
          </div>

          <div className="divide-y divide-[#eee7de] max-h-48 overflow-y-auto pr-1">
            {events.map((evt) => (
              <div key={evt.id} className="py-2 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-[11px] text-[#3b3530] bg-[#eee7de] px-1.5 py-0.5 rounded">
                      {evt.type}
                    </span>
                    <span className="text-[#201d1b] font-medium text-[11px]">{evt.actorName}</span>
                    {evt.visibleToCustomer && (
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1 rounded">
                        Público
                      </span>
                    )}
                  </div>
                  {evt.note && (
                    <p className="text-[11px] text-[#554e47] mt-0.5 italic">"{evt.note}"</p>
                  )}
                </div>

                <span className="text-[10px] text-[#716860] font-mono shrink-0">
                  {formatDateTime(new Date(evt.createdAt))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
