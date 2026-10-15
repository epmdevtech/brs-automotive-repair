import { useState } from "react";
import {
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileCheck,
  FileText,
  HelpCircle,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Shield,
  ShieldAlert,
  Slash,
  Sparkles,
  Truck,
  User,
  Wrench,
  X,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Appointment, AppointmentStatus } from "../../domain/types";
import { BRS_BOOKING_CONFIG } from "../../config/booking.config";
import { formatDate, formatTime, formatDateTime } from "../../domain/time";
import { formatPhoneBR } from "../../domain/phone";
import { canTransition, getStatusBadgeClass, getStatusLabel } from "../../domain/status";
import {
  buildCustomerWhatsAppLink,
  formatPreOsSummary,
  DAMAGE_AREAS_LIST,
  DAMAGE_TYPES_LIST,
} from "../../domain/intake";
import { MILESTONE_MESSAGES, buildMilestoneWhatsAppUrl, maskPlate } from "../../domain/events";
import { RepairTimeline } from "./repair-timeline";
import { StatusBadge } from "../status-badge";

export interface CustomerProcessDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (
    id: string,
    newStatus: AppointmentStatus,
    options?: {
      note?: string;
      actorId?: string;
      actorName?: string;
    },
  ) => Promise<boolean | void> | void;
}

export function CustomerProcessDialog({
  appointment,
  open,
  onOpenChange,
  onStatusChange,
}: CustomerProcessDialogProps) {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedProtocol, setCopiedProtocol] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedMilestoneId, setCopiedMilestoneId] = useState<string | null>(null);

  // Estados de mutação e feedback
  const [isPending, setIsPending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Modal acessível de cancelamento
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Marco ativo no gerador de mensagens WhatsApp
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(MILESTONE_MESSAGES[0].id);

  if (!appointment) return null;

  const service = BRS_BOOKING_CONFIG.services.find((s) => s.id === appointment.serviceId);
  const professional = BRS_BOOKING_CONFIG.professionals.find(
    (p) => p.id === appointment.professionalId,
  );
  const isLeva = appointment.logistics.type === "leva-e-traz";
  const slotDate = new Date(appointment.startTime);
  const createdDate = new Date(appointment.createdAt);

  const trackingToken =
    appointment.trackingToken ?? appointment.protocol.replace("#", "").toLowerCase();
  const trackingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/acompanhar/${trackingToken}`
      : `/acompanhar/${trackingToken}`;

  const whatsAppLink = buildCustomerWhatsAppLink({
    protocol: appointment.protocol,
    customer: appointment.customer,
    intake: appointment.intake,
    serviceTitle: service?.title ?? appointment.serviceId,
    scheduledTime: `${formatDate(slotDate)} às ${formatTime(slotDate)}`,
    logistics: appointment.logistics,
  });

  const handleCopySummary = async () => {
    const summary = formatPreOsSummary({
      protocol: appointment.protocol,
      serviceTitle: service?.title ?? appointment.serviceId,
      scheduledTime: `${formatDate(slotDate)} às ${formatTime(slotDate)}`,
      customer: appointment.customer,
      intake: appointment.intake,
      logistics: appointment.logistics,
    });
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      // Fallback silencioso
    }
  };

  const handleCopyProtocol = async () => {
    try {
      await navigator.clipboard.writeText(appointment.protocol);
      setCopiedProtocol(true);
      setTimeout(() => setCopiedProtocol(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyTrackingLink = async () => {
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyMilestoneMessage = async (milestoneId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMilestoneId(milestoneId);
      setTimeout(() => setCopiedMilestoneId(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleClose = () => {
    setActionError(null);
    setActionSuccess(null);
    setIsPending(false);
    onOpenChange(false);
  };

  const handleComplete = async () => {
    if (!appointment || !onStatusChange || isPending) return;
    setActionError(null);

    if (!canTransition(appointment.status, "COMPLETED")) {
      setActionError(
        `Transição inválida: o status atual (${getStatusLabel(
          appointment.status,
        )}) não pode avançar diretamente para Concluído.`,
      );
      return;
    }

    setIsPending(true);
    try {
      const result = await onStatusChange(appointment.id, "COMPLETED", {
        actorId: appointment.professionalId,
        actorName: professional?.name ?? "Técnico BRS",
        note: "Atendimento concluído e conferido com checklist de qualidade.",
      });

      if (result === false) {
        setActionError("Falha na persistência da conclusão. O agendamento permanece aberto.");
        setIsPending(false);
        return;
      }

      setActionSuccess("Atendimento concluído com sucesso!");
      setTimeout(() => {
        setIsPending(false);
        setActionSuccess(null);
        handleClose();
      }, 700);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Erro inesperado ao concluir atendimento.",
      );
      setIsPending(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!appointment || !onStatusChange || isPending) return;
    setActionError(null);

    setIsPending(true);
    try {
      const reason = cancelReason.trim() || "Cancelado pelo operador no painel administrativo.";
      const result = await onStatusChange(appointment.id, "CANCELLED", {
        actorId: "admin",
        actorName: "Administrador BRS",
        note: reason,
      });

      if (result === false) {
        setActionError("Falha ao registrar o cancelamento. Tente novamente.");
        setIsPending(false);
        return;
      }

      setCancelDialogOpen(false);
      setCancelReason("");
      setActionSuccess("Agendamento cancelado com sucesso.");
      setTimeout(() => {
        setIsPending(false);
        setActionSuccess(null);
        handleClose();
      }, 700);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Erro inesperado ao cancelar agendamento.",
      );
      setIsPending(false);
    }
  };

  const handleNoShow = async () => {
    if (!appointment || !onStatusChange || isPending) return;
    setActionError(null);

    setIsPending(true);
    try {
      const result = await onStatusChange(appointment.id, "NO_SHOW", {
        actorId: "admin",
        actorName: "Administrador BRS",
        note: "Cliente não compareceu ao horário agendado. Atendimento encerrado administrativamente.",
      });

      if (result === false) {
        setActionError("Falha ao registrar encerramento administrativo. Tente novamente.");
        setIsPending(false);
        return;
      }

      setActionSuccess("Atendimento encerrado por não comparecimento.");
      setTimeout(() => {
        setIsPending(false);
        setActionSuccess(null);
        handleClose();
      }, 700);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Erro inesperado ao registrar ausência.");
      setIsPending(false);
    }
  };

  const damageTypeLabel =
    DAMAGE_TYPES_LIST.find((d) => d.id === appointment.intake.damageType)?.label ??
    appointment.intake.damageType;

  // Cálculo amigável de tempo desde o cadastro
  const getCreatedRelative = () => {
    const diffMs = Math.max(0, Date.now() - createdDate.getTime());
    const diffMinutes = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 5) return "há poucos instantes";
    if (diffMinutes < 60) return `há cerca de ${diffMinutes} minutos`;
    if (diffHours < 24) return `há cerca de ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    return `há cerca de ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
  };

  const selectedMilestone =
    MILESTONE_MESSAGES.find((m) => m.id === selectedMilestoneId) ?? MILESTONE_MESSAGES[0];
  const selectedMilestoneText = selectedMilestone.generateText(appointment);
  const selectedMilestoneWaUrl = buildMilestoneWhatsAppUrl(
    appointment.customer.phone,
    selectedMilestoneText,
  );

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-[#121214] text-[#EDEDED] border-[#1F1F23] p-0 sm:rounded-xl shadow-2xl">
          {/* CABEÇALHO SUPERIOR (CHASSIS WORKSHOP HEADER) */}
          <div className="p-6 bg-[#161619] border-b border-[#1F1F23] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[#FF5A00] bg-[#FF5A00]/10 border border-[#FF5A00]/30 px-3 py-1 rounded-md flex items-center gap-1.5 shadow-sm tracking-wider">
                  {appointment.protocol}
                  <button
                    type="button"
                    onClick={handleCopyProtocol}
                    title="Copiar protocolo"
                    className="hover:text-white cursor-pointer ml-1 text-zinc-400"
                  >
                    {copiedProtocol ? (
                      <Check size={13} className="text-emerald-400" />
                    ) : (
                      <Copy size={13} />
                    )}
                  </button>
                </span>
                <StatusBadge status={appointment.status} size="md" />
              </div>

              <div className="text-right text-xs text-zinc-400 font-mono">
                <span className="font-medium text-white">
                  {formatDate(slotDate)} às {formatTime(slotDate)}
                </span>
                <div className="text-[11px] text-zinc-500">
                  Duração estimada: {service?.durationMinutes ?? 45} min
                </div>
              </div>
            </div>

            <div>
              <DialogTitle className="text-xl font-display font-bold text-white tracking-tight">
                Processo Completo do Cliente • {appointment.customer.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400 mt-1 flex flex-wrap items-center gap-2">
                <span>{service?.title}</span>
                <span>•</span>
                <span className="font-semibold text-zinc-300 font-mono uppercase text-[11px]">
                  Técnico Responsável: {professional?.name ?? appointment.professionalId}
                </span>
              </DialogDescription>
            </div>

            {/* MENSAGENS INLINE DE ERRO OU SUCESSO */}
            {actionError && (
              <div className="p-3 rounded-lg border border-red-900/50 bg-red-950/30 text-red-300 text-xs flex items-center gap-2 animate-in fade-in-50">
                <AlertCircle size={15} className="text-red-400 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {actionSuccess && (
              <div className="p-3 rounded-lg border border-emerald-900/50 bg-emerald-950/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in-50">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* 1. DESTAQUE OBRIGATÓRIO: QUANDO O CLIENTE CADASTROU (TELEMETRIA DE ENTRADA) */}
            <div className="p-4 rounded-xl border border-[#1F1F23] bg-[#18181B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-[#FF5A00]/10 border border-[#FF5A00]/30 text-[#FF5A00] flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="font-bold text-white uppercase font-mono tracking-wider text-[11px] flex items-center gap-2">
                    <span>Registro de Cadastro do Cliente</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-zinc-400">
                      TELEMETRIA
                    </span>
                  </div>
                  <div className="text-zinc-300 mt-0.5">
                    Cadastrado em{" "}
                    <strong className="text-white font-semibold font-mono">
                      {formatDateTime(createdDate)}
                    </strong>{" "}
                    ({getCreatedRelative()})
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Canal de Entrada:{" "}
                    <span className="font-medium text-zinc-200">
                      Portal Web BRS (Auto-Confirmação pelo Cliente)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyTrackingLink}
                  className="py-1.5 px-3 rounded-md border border-[#27272A] bg-[#121214] hover:bg-[#27272A] text-[11px] font-medium text-zinc-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedTracking ? (
                    <>
                      <Check size={12} className="text-emerald-400" /> Link de Acompanhamento
                      Copiado!
                    </>
                  ) : (
                    <>
                      <ExternalLink size={12} /> Copiar Link de Acompanhamento do Cliente
                    </>
                  )}
                </button>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Idempotência:{" "}
                  {appointment.idempotencyKey
                    ? `${appointment.idempotencyKey.slice(0, 14)}...`
                    : "local"}
                </span>
              </div>
            </div>

            {/* 2. LINHA DO TEMPO AUTOMOTIVA DINÂMICA (ALIMENTADA POR EVENTOS REAIS) */}
            <RepairTimeline appointment={appointment} />

            {/* 3. COMUNICAÇÃO DE MARCOS WHATSAPP CUSTO ZERO (DEMO) */}
            <div className="p-4 rounded-xl border border-[#1F1F23] bg-[#161619] space-y-3 text-xs shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-white flex items-center gap-1.5 font-display text-xs">
                  <MessageCircle size={15} className="text-emerald-400" />
                  Comunicação com Cliente via WhatsApp (Custo Zero • Sem APIs Pagas)
                </span>
                <span className="text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  1-Clique Deep Link + Área de Transferência
                </span>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Envie atualizações oficiais da oficina no WhatsApp do cliente com textos contextuais
                pré-formatados para cada marco do reparo automotivo:
              </p>

              {/* SELEÇÃO DO MARCO */}
              <div className="flex flex-wrap gap-1.5">
                {MILESTONE_MESSAGES.map((m) => {
                  const isActive = m.id === selectedMilestoneId;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMilestoneId(m.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-xs font-semibold"
                          : "bg-[#18181B] border border-[#27272A] text-zinc-400 hover:text-white"
                      }`}
                    >
                      {m.stageName}
                    </button>
                  );
                })}
              </div>

              {/* PREVIEW DA MENSAGEM DO MARCO */}
              <div className="p-3 rounded-lg bg-[#0B0B0C] border border-[#1F1F23] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-zinc-200">{selectedMilestone.label}</span>
                  <span className="text-zinc-500 font-mono">
                    Destino: {formatPhoneBR(appointment.customer.phone)}
                  </span>
                </div>

                <pre className="text-xs text-zinc-200 font-mono whitespace-pre-wrap bg-[#121214] p-3 rounded border border-[#27272A] max-h-36 overflow-y-auto leading-relaxed">
                  {selectedMilestoneText}
                </pre>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyMilestoneMessage(selectedMilestone.id, selectedMilestoneText)
                    }
                    className="py-1.5 px-3 rounded-md border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-xs font-medium text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedMilestoneId === selectedMilestone.id ? (
                      <>
                        <Check size={13} className="text-emerald-400" /> Copiado com sucesso!
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Copiar Mensagem do Marco
                      </>
                    )}
                  </button>

                  <a
                    href={selectedMilestoneWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-md bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <Send size={13} /> Abrir no WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* 4. DADOS DO CLIENTE & VEÍCULO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* FICHA DO CLIENTE */}
              <div className="p-4 rounded-xl border border-[#1F1F23] bg-[#161619] space-y-3 text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-display text-xs">
                    <User size={14} className="text-[#FF5A00]" />
                    Ficha do Cliente
                  </span>
                  <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    LGPD Consentida
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase font-mono">
                      Nome Completo:
                    </span>
                    <div className="font-semibold text-sm text-white">
                      {appointment.customer.name}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase font-mono">
                      WhatsApp / Telefone:
                    </span>
                    <div className="font-mono font-medium text-zinc-300 flex items-center gap-2">
                      <a
                        href={`tel:${appointment.customer.phone}`}
                        className="hover:underline flex items-center gap-1 text-white"
                      >
                        <Phone size={12} className="text-zinc-500" />
                        {formatPhoneBR(appointment.customer.phone)}
                      </a>
                    </div>
                  </div>

                  {appointment.customer.notes && (
                    <div>
                      <span className="text-[11px] text-zinc-500 uppercase font-mono">
                        Observações do Cliente:
                      </span>
                      <p className="p-2.5 rounded bg-[#121214] border border-[#27272A] text-zinc-300 text-[11px] italic mt-0.5 font-sans">
                        "{appointment.customer.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* FICHA DO VEÍCULO */}
              <div className="p-4 rounded-xl border border-[#1F1F23] bg-[#161619] space-y-3 text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-display text-xs">
                    <Car size={14} className="text-[#FF5A00]" />
                    Dados do Veículo
                  </span>

                  {/* PLACA MERCOSUL ESTILIZADA */}
                  {appointment.intake.vehicle.plate && (
                    <div className="rounded border border-zinc-700 bg-white overflow-hidden text-center shadow-xs">
                      <div className="bg-[#003399] text-white text-[7px] font-bold px-2 py-0.2 tracking-wider flex items-center justify-center gap-1">
                        <span>BRASIL</span>
                      </div>
                      <div className="font-mono font-black text-xs px-2 py-0.5 text-slate-900 tracking-wider">
                        {appointment.intake.vehicle.plate.toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase font-mono">
                      Marca / Modelo:
                    </span>
                    <div className="font-semibold text-white">
                      {appointment.intake.vehicle.make} {appointment.intake.vehicle.model}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase font-mono">
                      Ano de Fabricação:
                    </span>
                    <div className="font-medium text-zinc-300 font-mono">
                      {appointment.intake.vehicle.year || "Não informado"}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase font-mono">
                      Cor Externa:
                    </span>
                    <div className="font-medium text-zinc-300">
                      {appointment.intake.vehicle.color || "Padrão montadora"}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase font-mono">
                      Tipo de Acabamento:
                    </span>
                    <div className="font-medium text-zinc-300 capitalize">
                      {appointment.intake.vehicle.finishType || "Metálica"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. DIAGNÓSTICO DE DANOS & ANAMNESE DA PRÉ-OS */}
            <div className="p-4 rounded-xl border border-[#1F1F23] bg-[#161619] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5 font-display text-xs">
                  <ShieldAlert size={14} className="text-[#FF5A00]" />
                  Diagnóstico de Avarias (Anamnese Técnica de Pré-OS)
                </span>

                <span
                  className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                    appointment.intake.isInsurance
                      ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                      : "bg-white/5 text-zinc-400 border-white/10"
                  }`}
                >
                  {appointment.intake.isInsurance ? "Seguradora / Sinistro" : "Particular"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-zinc-500 uppercase font-mono">
                    Classificação do Dano:
                  </span>
                  <div className="font-semibold text-white mt-0.5">{damageTypeLabel}</div>
                </div>

                <div>
                  <span className="text-[11px] text-zinc-500 uppercase font-mono">
                    Áreas Afetadas:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(appointment.intake.affectedAreas ?? []).map((areaId) => {
                      const label = DAMAGE_AREAS_LIST.find((a) => a.id === areaId)?.label ?? areaId;
                      return (
                        <span
                          key={areaId}
                          className="px-2 py-0.5 rounded bg-[#18181B] border border-[#27272A] text-zinc-300 text-[10px] font-mono"
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {appointment.intake.description && (
                <div>
                  <span className="text-[11px] text-zinc-500 uppercase font-mono">
                    Relato Técnico do Cliente:
                  </span>
                  <p className="p-2.5 rounded bg-[#121214] border border-[#27272A] text-zinc-300 text-xs leading-relaxed mt-1 font-sans">
                    {appointment.intake.description}
                  </p>
                </div>
              )}
            </div>

            {/* 6. LOGÍSTICA LEVA E TRAZ (SE APLICÁVEL) */}
            {isLeva && (
              <div className="p-4 rounded-xl border border-[#FF5A00]/30 bg-[#FF5A00]/5 space-y-2 text-xs">
                <div className="font-bold text-[#FF7A29] flex items-center gap-1.5 font-display text-xs">
                  <Truck size={14} className="text-[#FF5A00]" />
                  Roteiro de Coleta e Entrega Leva e Traz (Toledo-PR)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase font-mono">
                      Endereço de Coleta:
                    </span>
                    <div className="font-semibold text-white">{appointment.logistics.address}</div>
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-500 uppercase font-mono">
                      Bairro / Cidade:
                    </span>
                    <div>
                      {appointment.logistics.neighborhood} —{" "}
                      {appointment.logistics.city ?? "Toledo-PR"}
                    </div>
                  </div>

                  {appointment.logistics.referencePoint && (
                    <div>
                      <span className="text-[11px] text-zinc-500 uppercase font-mono">
                        Ponto de Referência:
                      </span>
                      <div>{appointment.logistics.referencePoint}</div>
                    </div>
                  )}

                  {appointment.logistics.contactPerson && (
                    <div>
                      <span className="text-[11px] text-zinc-500 uppercase font-mono">
                        Contato no Local:
                      </span>
                      <div>{appointment.logistics.contactPerson}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RODAPÉ DE AÇÕES OPERACIONAIS */}
          <div className="p-5 bg-[#161619] border-t border-[#1F1F23] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <MessageCircle size={14} /> Abrir WhatsApp da Pré-OS
              </a>

              <button
                type="button"
                onClick={handleCopySummary}
                className="py-2 px-3.5 rounded-lg border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-xs font-medium text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSummary ? (
                  <>
                    <Check size={14} className="text-emerald-400" /> Copiado com sucesso!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copiar Resumo para OS
                  </>
                )}
              </button>
            </div>

            {/* BOTÕES DE CONTROLE: CONCLUIR, CANCELAR E FECHAR */}
            <div className="flex items-center gap-2">
              {onStatusChange &&
                appointment.status !== "COMPLETED" &&
                appointment.status !== "CANCELLED" &&
                appointment.status !== "NO_SHOW" && (
                  <button
                    type="button"
                    disabled={isPending || !canTransition(appointment.status, "COMPLETED")}
                    onClick={handleComplete}
                    className="py-2 px-3.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                  >
                    {isPending ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Check size={13} />
                    )}
                    Concluir Atendimento
                  </button>
                )}

              {onStatusChange &&
                (appointment.status === "CONFIRMED" || appointment.status === "PENDING") && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handleNoShow}
                    className="py-2 px-2.5 rounded-lg border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] disabled:opacity-50 disabled:cursor-not-allowed text-zinc-400 hover:text-white text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors font-mono uppercase text-[11px]"
                    title="Registrar ausência do cliente e fechar atendimento"
                  >
                    <Slash size={13} /> Fechar / Ausente
                  </button>
                )}

              {onStatusChange &&
                appointment.status !== "CANCELLED" &&
                appointment.status !== "COMPLETED" && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => setCancelDialogOpen(true)}
                    className="py-2 px-3 rounded-lg border border-red-900/50 bg-red-950/20 hover:bg-red-950/40 disabled:opacity-50 disabled:cursor-not-allowed text-red-400 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors font-mono uppercase text-[11px]"
                    title="Cancelar agendamento"
                  >
                    <XCircle size={13} /> Cancelar
                  </button>
                )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="text-xs border-[#27272A] bg-[#18181B] text-zinc-300 hover:bg-[#27272A] hover:text-white cursor-pointer"
              >
                Fechar Janela
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO ACESSÍVEL DE CONFIRMAÇÃO DE CANCELAMENTO (RADIX UI ALERTDIALOG) */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="bg-[#121214] text-white border-[#1F1F23] sm:rounded-xl shadow-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <XCircle size={18} className="text-red-500" />
              Confirmar Cancelamento do Agendamento
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-zinc-400 leading-relaxed">
              Você está cancelando o agendamento{" "}
              <strong className="text-white font-mono">{appointment.protocol}</strong> do cliente{" "}
              <strong>{appointment.customer.name}</strong>. Esta ação altera o status do reparo e
              registra um evento no histórico de auditoria.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-1.5 my-2">
            <label
              htmlFor="cancel-reason-input"
              className="text-[11px] font-semibold text-zinc-300 uppercase font-mono"
            >
              Motivo do Cancelamento (opcional):
            </label>
            <textarea
              id="cancel-reason-input"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Ex: Desistência do cliente, agendamento duplicado, etc."
              rows={2}
              className="w-full text-xs p-2.5 rounded-lg border border-[#27272A] bg-[#18181B] text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>

          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel
              disabled={isPending}
              onClick={() => {
                setCancelDialogOpen(false);
                setCancelReason("");
              }}
              className="text-xs border-[#27272A] bg-[#18181B] text-zinc-300 hover:bg-[#27272A] hover:text-white cursor-pointer"
            >
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={handleCancelConfirm}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 size={13} className="animate-spin mr-1" /> Cancelando...
                </>
              ) : (
                "Confirmar Cancelamento"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
