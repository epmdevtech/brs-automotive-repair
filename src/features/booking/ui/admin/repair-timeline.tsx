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
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5">
          <History size={14} className="text-[#FF5A00]" />
          Linha do Tempo Automotiva (Histórico Real de Reparação)
        </h4>

        <span className="text-[11px] text-zinc-400 font-mono">
          Eventos registrados: <strong className="text-white">{events.length}</strong>
        </span>
      </div>

      {/* ESTEIRA DE PROGRESSO HORIZONTAL TÉCNICA (AWWWARDS INDUSTRIAL ENGINE) */}
      <div className="bg-[#121214] rounded-xl border border-[#1F1F23] p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        {/* TRILHO DE FUNDO LINEAR (DESKTOP) */}
        <div
          className="hidden lg:block absolute top-[34px] left-8 right-8 h-[1px] bg-[#27272A]"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
          {milestones.map((milestone) => {
            const isDone = milestone.status === "completed";
            const isCurrent = milestone.status === "current";
            const isFailed = milestone.status === "cancelled";

            return (
              <div
                key={milestone.id}
                className={`p-3.5 rounded-lg border text-xs transition-all relative ${
                  isFailed
                    ? "border-red-900/50 bg-red-950/20 text-red-200"
                    : isDone
                      ? "border-[#1F1F23] bg-[#161619] text-zinc-200"
                      : isCurrent
                        ? "border-[#FF5A00]/40 bg-[#1A1816] text-white ring-1 ring-[#FF5A00]/30 shadow-[0_0_15px_rgba(255,90,0,0.15)]"
                        : "border-[#1F1F23]/60 bg-[#0E0E10] text-zinc-500"
                }`}
              >
                {/* INDICADOR LUMINOSO / STATUS BADGE */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`flex items-center gap-2 font-bold text-[11px] tracking-tight ${
                      isFailed
                        ? "text-red-400"
                        : isDone
                          ? "text-emerald-400"
                          : isCurrent
                            ? "text-[#FF7A29]"
                            : "text-zinc-500"
                    }`}
                  >
                    {isFailed ? (
                      <span className="size-2 rounded-full bg-red-500 shadow-[0_0_6px_#EF4444]" />
                    ) : isDone ? (
                      <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#00E599]" />
                    ) : isCurrent ? (
                      <span className="size-2 rounded-full bg-[#FF5A00] shadow-[0_0_8px_#FF5A00] animate-pulse" />
                    ) : (
                      <span className="size-2 rounded-full bg-zinc-700" />
                    )}
                    <span className={isCurrent || isDone ? "text-white" : "text-zinc-400"}>
                      {milestone.title}
                    </span>
                  </span>

                  <span
                    className={`text-[9px] font-semibold px-2 py-0.5 rounded uppercase font-mono tracking-wider shrink-0 ${
                      isFailed
                        ? "bg-red-500/10 text-red-400 border border-red-500/30"
                        : isDone
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : isCurrent
                            ? "bg-[#FF5A00]/15 text-[#FF7A29] border border-[#FF5A00]/40 font-bold animate-pulse"
                            : "bg-white/5 text-zinc-500 border border-white/5"
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
                <p
                  className={`text-[11px] leading-relaxed ${isCurrent || isDone ? "text-zinc-300" : "text-zinc-500"}`}
                >
                  {milestone.description}
                </p>

                {/* TIMESTAMP QUANDO DISPONÍVEL */}
                {milestone.timestamp && (
                  <div className="mt-2.5 pt-2 border-t border-[#1F1F23] flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Concluído em:</span>
                    <span className="font-medium text-zinc-300">
                      {formatDateTime(new Date(milestone.timestamp))}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* REGISTRO DE AUDITORIA APPEND-ONLY (HISTÓRICO INTERNO DE EVENTOS) */}
      {showAuditLog && events.length > 0 && (
        <details className="p-3.5 rounded-xl border border-[#1F1F23] bg-[#121214] text-xs group">
          <summary className="font-bold text-zinc-300 flex items-center justify-between cursor-pointer select-none list-none">
            <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-300">
              <History size={13} className="text-[#FF5A00]" />
              Trilha de Auditoria Técnica (Append-Only Event Store)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 font-mono bg-[#18181B] border border-[#27272A] px-2 py-0.5 rounded">
                localStorage: brs_appointment_events_v1
              </span>
              <span className="text-[10px] text-zinc-400 font-mono group-open:rotate-180 transition-transform">
                ▼
              </span>
            </div>
          </summary>

          <div className="divide-y divide-[#1F1F23] max-h-48 overflow-y-auto pr-1 mt-3 pt-2 border-t border-[#1F1F23]">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="py-2 flex items-start justify-between gap-3 text-xs font-mono"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[10px] text-zinc-300 bg-[#18181B] border border-[#27272A] px-1.5 py-0.5 rounded">
                      {evt.type}
                    </span>
                    <span className="text-white font-medium text-[11px]">{evt.actorName}</span>
                    {evt.visibleToCustomer && (
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1 rounded">
                        Público
                      </span>
                    )}
                  </div>
                  {evt.note && (
                    <p className="text-[11px] text-zinc-400 mt-1 italic font-sans">"{evt.note}"</p>
                  )}
                </div>

                <span className="text-[10px] text-zinc-500 shrink-0">
                  {formatDateTime(new Date(evt.createdAt))}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
