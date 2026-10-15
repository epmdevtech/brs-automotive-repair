import { useState } from "react";
import { Check, Clock, Copy, ExternalLink, MessageCircle, User, Wrench } from "lucide-react";
import type { Appointment, AppointmentStatus } from "../../domain/types";
import { formatTime } from "../../domain/time";
import { formatPhoneBR } from "../../domain/phone";
import { getStatusBorderClass, getStatusLabel } from "../../domain/status";
import { buildCustomerWhatsAppLink, formatPreOsSummary } from "../../domain/intake";
import { BRS_BOOKING_CONFIG } from "../../config/booking.config";
import { ProcessStepper } from "./process-stepper";

export interface KanbanBoardProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
}

interface KanbanColumnConfig {
  status: AppointmentStatus;
  title: string;
  dotColor: string;
  headerBorder: string;
  emptyText: string;
}

const COLUMNS: KanbanColumnConfig[] = [
  {
    status: "PENDING",
    title: "Abertos",
    dotColor: "bg-sky-500",
    headerBorder: "border-sky-500",
    emptyText: "Nenhum atendimento aberto",
  },
  {
    status: "CONFIRMED",
    title: "Em Andamento",
    dotColor: "bg-amber-500",
    headerBorder: "border-amber-500",
    emptyText: "Nenhum atendimento em andamento",
  },
  {
    status: "COMPLETED",
    title: "Concluídos",
    dotColor: "bg-emerald-500",
    headerBorder: "border-emerald-500",
    emptyText: "Nenhum atendimento concluído",
  },
  {
    status: "NO_SHOW",
    title: "Fechados",
    dotColor: "bg-neutral-600",
    headerBorder: "border-neutral-600",
    emptyText: "Nenhum atendimento fechado",
  },
  {
    status: "CANCELLED",
    title: "Cancelados",
    dotColor: "bg-rose-500",
    headerBorder: "border-rose-500",
    emptyText: "Nenhum atendimento cancelado",
  },
];

/**
 * Visão em Quadro (KanbanBoard) operacional de atendimentos BRS.
 * Organiza os atendimentos pelas 5 situações operacionais em colunas com cards técnicos,
 * mini-stepper de etapas e atalhos rápidos de contato.
 */
export function KanbanBoard({ appointments, onSelectAppointment }: KanbanBoardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getProfessionalName = (profId: string) => {
    return BRS_BOOKING_CONFIG.professionals.find((p) => p.id === profId)?.name || profId;
  };

  const getServiceName = (serviceId: string) => {
    return BRS_BOOKING_CONFIG.services.find((s) => s.id === serviceId)?.name || serviceId;
  };

  const handleCopy = (e: React.MouseEvent, app: Appointment) => {
    e.stopPropagation();
    const summary = formatPreOsSummary(app);
    navigator.clipboard.writeText(summary);
    setCopiedId(app.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-w-[1020px] items-start">
        {COLUMNS.map((col) => {
          const columnAppointments = appointments.filter((app) => app.status === col.status);
          const count = columnAppointments.length;

          return (
            <div
              key={col.status}
              className="bg-slate-50/80 rounded-xl border border-slate-200/90 flex flex-col min-h-[460px] shadow-2xs"
            >
              {/* Cabeçalho da Coluna Kanban */}
              <div
                className={`px-4 py-3 border-b border-slate-200/90 bg-white rounded-t-xl border-t-4 ${col.headerBorder} flex items-center justify-between`}
              >
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${col.dotColor}`} aria-hidden="true" />
                  <h3 className="text-xs font-bold text-slate-800 tracking-tight">{col.title}</h3>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono text-[11px] font-semibold border border-slate-200">
                  {count}
                </span>
              </div>

              {/* Lista de Cards da Coluna */}
              <div className="p-2.5 space-y-2.5 flex-1">
                {count === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-lg">
                    <p className="text-xs text-slate-400 font-medium">{col.emptyText}</p>
                  </div>
                ) : (
                  columnAppointments.map((app) => {
                    const waLink = buildCustomerWhatsAppLink(app);
                    const isCopied = copiedId === app.id;

                    return (
                      <div
                        key={app.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelectAppointment(app)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            onSelectAppointment(app);
                          }
                        }}
                        className={`w-full text-left p-3.5 rounded-lg bg-white border border-slate-200 hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer space-y-2.5 relative border-l-4 ${getStatusBorderClass(
                          app.status,
                        )}`}
                      >
                        {/* Topo do Card: Protocolo e Horário */}
                        <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-100">
                          <span className="font-mono font-bold text-slate-900 tracking-tight text-[11px]">
                            {app.protocol}
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                            <Clock size={11} className="text-slate-400" />
                            {formatTime(app.startTime)}
                          </span>
                        </div>

                        {/* Dados do Cliente */}
                        <div>
                          <div className="font-semibold text-xs text-slate-900 truncate">
                            {app.customer.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {formatPhoneBR(app.customer.phone)}
                          </div>
                        </div>

                        {/* Veículo e Placa */}
                        {app.intake?.vehicle && (
                          <div className="p-2 rounded bg-slate-50 border border-slate-200/80 text-[11px] space-y-0.5">
                            <div className="font-medium text-slate-800 truncate">
                              {app.intake.vehicle.make} {app.intake.vehicle.model}
                            </div>
                            <div className="font-mono text-slate-500 text-[10px] flex items-center justify-between">
                              <span>Placa: {app.intake.vehicle.plate || "S/P"}</span>
                              {app.intake.vehicle.year && <span>{app.intake.vehicle.year}</span>}
                            </div>
                          </div>
                        )}

                        {/* Serviço e Técnico */}
                        <div className="space-y-1 text-[11px] text-slate-600">
                          <div className="flex items-center gap-1.5 truncate">
                            <Wrench size={11} className="text-slate-400 shrink-0" />
                            <span className="truncate">{getServiceName(app.serviceId)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <User size={11} className="text-slate-400 shrink-0" />
                            <span className="truncate">
                              {getProfessionalName(app.professionalId)}
                            </span>
                          </div>
                        </div>

                        {/* Mini-stepper de progresso */}
                        <div className="pt-1 border-t border-slate-100">
                          <ProcessStepper status={app.status} />
                        </div>

                        {/* Ações rápidas no rodapé do card */}
                        <div className="pt-2 flex items-center justify-between gap-1.5">
                          {/* Botão de WhatsApp autêntico #25D366 */}
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="px-2.5 py-1 rounded bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                            title="Conversar com o cliente no WhatsApp"
                          >
                            <MessageCircle size={11} className="fill-white" />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={(e) => handleCopy(e, app)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Copiar dados da Pré-OS"
                            aria-label="Copiar resumo da Pré-OS"
                          >
                            {isCopied ? (
                              <Check size={13} className="text-emerald-600" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
