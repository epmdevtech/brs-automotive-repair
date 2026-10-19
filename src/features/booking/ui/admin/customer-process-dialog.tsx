import { useState } from "react";
import {
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  MessageCircle,
  Phone,
  Send,
  Slash,
  Truck,
  User,
  Wrench,
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
import { MASTER_BOOKING_CONFIG } from "../../config/booking.config";
import { formatDate, formatTime, formatDateTime } from "../../domain/time";
import { formatPhoneBR } from "../../domain/phone";
import { canTransition } from "../../domain/status";
import {
  buildCustomerWhatsAppLink,
  formatPreOsSummary,
  DAMAGE_AREAS_LIST,
  DAMAGE_TYPES_LIST,
} from "../../domain/intake";
import { MILESTONE_MESSAGES, buildMilestoneWhatsAppUrl } from "../../domain/events";
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

  const service = MASTER_BOOKING_CONFIG.services.find((s) => s.id === appointment.serviceId);
  const professional = MASTER_BOOKING_CONFIG.professionals.find(
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
      // Fallback
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
    onOpenChange(false);
  };

  const handleComplete = async () => {
    if (!appointment || !onStatusChange || isPending) return;
    setActionError(null);

    if (!canTransition(appointment.status, "COMPLETED")) {
      setActionError(
        `Transição inválida: Não é possível concluir a partir de "${appointment.status}".`,
      );
      return;
    }

    setIsPending(true);
    try {
      const result = await onStatusChange(appointment.id, "COMPLETED", {
        actorId: professional?.id ?? "equipe-tecnica",
        actorName: professional?.name ?? "Equipe Técnica Master",
        note: "Atendimento concluído com sucesso e checklist técnico validado.",
      });

      if (result === false) {
        setActionError("Não foi possível concluir o agendamento. Tente novamente.");
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
        err instanceof Error ? err.message : "Erro inesperado ao concluir agendamento.",
      );
      setIsPending(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!appointment || !onStatusChange || isPending) return;
    setActionError(null);

    setIsPending(true);
    try {
      const result = await onStatusChange(appointment.id, "CANCELLED", {
        actorId: "admin",
        actorName: "Administrador Master",
        note: cancelReason.trim() ? cancelReason.trim() : "Cancelamento solicitado no painel.",
      });

      setCancelDialogOpen(false);
      setCancelReason("");

      if (result === false) {
        setActionError("Falha ao registrar cancelamento. Verifique e tente novamente.");
        setIsPending(false);
        return;
      }

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
        actorName: "Administrador Master",
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
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-white text-slate-900 border-slate-200 p-0 sm:rounded-xl shadow-xl">
          {/* CABEÇALHO DO DIÁLOGO */}
          <div className="p-6 bg-[#F9FAFB] border-b border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-xs text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-2xs">
                  {appointment.protocol}
                  <button
                    type="button"
                    onClick={handleCopyProtocol}
                    title="Copiar protocolo"
                    className="hover:text-slate-900 cursor-pointer text-slate-400 ml-1"
                  >
                    {copiedProtocol ? (
                      <Check size={12} className="text-emerald-600" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </span>
                <StatusBadge status={appointment.status} size="md" />
              </div>

              <div className="text-right text-xs text-slate-500">
                <span className="font-medium text-slate-900 font-mono">
                  {formatDate(slotDate)} às {formatTime(slotDate)}
                </span>
                <div className="text-[11px] text-slate-400">
                  Duração estimada: {service?.durationMinutes ?? 45} min
                </div>
              </div>
            </div>

            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
                Processo Completo do Cliente • {appointment.customer.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span className="font-medium text-slate-700">{service?.title}</span>
                <span>•</span>
                <span>
                  Técnico:{" "}
                  <strong className="text-slate-800">
                    {professional?.name ?? appointment.professionalId}
                  </strong>
                </span>
              </DialogDescription>
            </div>

            {/* MENSAGENS INLINE DE ERRO OU SUCESSO */}
            {actionError && (
              <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="text-rose-600 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {actionSuccess && (
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* 1. TELEMETRIA DE ENTRADA DO CADASTRO */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                    <span>Registro de Cadastro do Cliente</span>
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    Cadastrado em{" "}
                    <strong className="text-slate-900 font-mono font-medium">
                      {formatDateTime(createdDate)}
                    </strong>{" "}
                    ({getCreatedRelative()})
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Canal de Entrada: Portal Web Master (Auto-Confirmação pelo Cliente)
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyTrackingLink}
                  className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedTracking ? (
                    <>
                      <Check size={12} className="text-emerald-600" /> Link de Acompanhamento
                      Copiado!
                    </>
                  ) : (
                    <>
                      <ExternalLink size={12} /> Copiar Link de Acompanhamento
                    </>
                  )}
                </button>
                <span className="text-[10px] text-slate-400 font-mono">
                  Idempotência:{" "}
                  {appointment.idempotencyKey
                    ? `${appointment.idempotencyKey.slice(0, 14)}...`
                    : "local"}
                </span>
              </div>
            </div>

            {/* 2. LINHA DO TEMPO AUTOMOTIVA (STEPPER HORIZONTAL LIMPO) */}
            <RepairTimeline appointment={appointment} />

            {/* 3. COMUNICAÇÃO DE MARCOS WHATSAPP INTEGRADA */}
            <div className="p-4 rounded-xl border border-slate-200 bg-[#F9FAFB] space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <MessageCircle size={15} className="text-emerald-600" />
                  <span>Comunicação por Etapa com o Cliente (WhatsApp)</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Modelos de mensagem contextualizados
                </span>
              </div>

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
                          ? "bg-slate-900 text-white shadow-2xs font-semibold"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {m.stageName}
                    </button>
                  );
                })}
              </div>

              {/* PREVIEW DA MENSAGEM DO MARCO */}
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-900">{selectedMilestone.label}</span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    Destino: {formatPhoneBR(appointment.customer.phone)}
                  </span>
                </div>

                <div className="text-xs text-slate-800 whitespace-pre-wrap bg-slate-50 p-3 rounded-md border border-slate-200 max-h-32 overflow-y-auto leading-relaxed">
                  {selectedMilestoneText}
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyMilestoneMessage(selectedMilestone.id, selectedMilestoneText)
                    }
                    className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    {copiedMilestoneId === selectedMilestone.id ? (
                      <>
                        <Check size={13} className="text-emerald-600" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Copiar Mensagem
                      </>
                    )}
                  </button>

                  <a
                    href={selectedMilestoneWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <Send size={13} /> Abrir no WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* 4. METADADOS ESTRUTURADOS: FICHA DO CLIENTE & VEÍCULO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* FICHA DO CLIENTE */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-xs shadow-2xs">
                <div className="font-semibold text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs">
                    <User size={14} className="text-slate-500" />
                    <span>Dados do Cliente</span>
                  </span>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    LGPD Consentida
                  </span>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Nome:</span>
                    <span className="font-medium text-slate-900">{appointment.customer.name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Telefone:</span>
                    <a
                      href={`tel:${appointment.customer.phone}`}
                      className="font-mono text-slate-800 hover:text-slate-900 hover:underline flex items-center gap-1"
                    >
                      <Phone size={11} className="text-slate-400" />
                      {formatPhoneBR(appointment.customer.phone)}
                    </a>
                  </div>

                  {appointment.customer.notes && (
                    <div className="pt-1">
                      <span className="text-slate-500 block mb-0.5">Observações:</span>
                      <p className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs italic">
                        "{appointment.customer.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* FICHA DO VEÍCULO */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-xs shadow-2xs">
                <div className="font-semibold text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs">
                    <Car size={14} className="text-slate-500" />
                    <span>Veículo & Placa</span>
                  </span>

                  {appointment.intake.vehicle.plate && (
                    <span className="font-mono font-bold text-xs px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-900">
                      {appointment.intake.vehicle.plate.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Modelo:</span>
                    <span className="font-medium text-slate-900">
                      {appointment.intake.vehicle.make} {appointment.intake.vehicle.model}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Ano:</span>
                    <span className="font-mono text-slate-800">
                      {appointment.intake.vehicle.year || "Não informado"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Cor:</span>
                    <span className="text-slate-800">
                      {appointment.intake.vehicle.color || "Padrão montadora"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Acabamento:</span>
                    <span className="text-slate-800 capitalize">
                      {appointment.intake.vehicle.finishType || "Metálica"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. DIAGNÓSTICO DE DANOS DA PRÉ-OS */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 text-xs shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Wrench size={14} className="text-slate-500" />
                  <span>Diagnóstico de Avarias (Anamnese Técnica)</span>
                </span>

                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    appointment.intake.isInsurance
                      ? "bg-sky-50 text-sky-700 border-sky-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {appointment.intake.isInsurance ? "Seguradora / Sinistro" : "Particular"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-slate-500 block mb-0.5">Classificação do Dano:</span>
                  <div className="font-medium text-slate-900">{damageTypeLabel}</div>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Áreas Afetadas:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {(appointment.intake.affectedAreas ?? []).map((areaId) => {
                      const label = DAMAGE_AREAS_LIST.find((a) => a.id === areaId)?.label ?? areaId;
                      return (
                        <span
                          key={areaId}
                          className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[11px]"
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {appointment.intake.description && (
                <div className="pt-1">
                  <span className="text-slate-500 block mb-0.5">Relato do Cliente:</span>
                  <p className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs leading-relaxed">
                    {appointment.intake.description}
                  </p>
                </div>
              )}
            </div>

            {/* 6. LOGÍSTICA LEVA E TRAZ */}
            {isLeva && (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Truck size={14} className="text-slate-700" />
                  <span>Roteiro Guincho (Toledo-PR)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pt-1">
                  <div>
                    <span className="text-slate-500 block">Endereço de Coleta:</span>
                    <span className="font-medium text-slate-900">
                      {appointment.logistics.address}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Bairro / Cidade:</span>
                    <span>
                      {appointment.logistics.neighborhood} —{" "}
                      {appointment.logistics.city ?? "Toledo-PR"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RODAPÉ DE AÇÕES OPERACIONAIS */}
          <div className="p-5 bg-[#F9FAFB] border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <MessageCircle size={14} className="text-[#25D366]" />
                <span>Abrir WhatsApp da Pré-OS</span>
              </a>

              <button
                type="button"
                onClick={handleCopySummary}
                className="py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                {copiedSummary ? (
                  <>
                    <Check size={13} className="text-emerald-600" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copiar Resumo para OS
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
                    className="py-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                  >
                    {isPending ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Check size={13} strokeWidth={2.5} />
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
                    className="py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
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
                    className="py-2 px-3 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed text-rose-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
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
                className="text-xs border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer shadow-2xs"
              >
                Fechar Janela
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DIÁLOGO ACESSÍVEL DE CONFIRMAÇÃO DE CANCELAMENTO */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="bg-white text-slate-900 border-slate-200 sm:rounded-xl shadow-xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <XCircle size={18} className="text-rose-600" />
              Confirmar Cancelamento do Agendamento
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed">
              Você está cancelando o agendamento{" "}
              <strong className="text-slate-900 font-mono">{appointment.protocol}</strong> do
              cliente <strong className="text-slate-900">{appointment.customer.name}</strong>. Esta
              ação altera o status do reparo e registra um evento no histórico de auditoria.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-1.5 my-2">
            <label htmlFor="cancel-reason-input" className="text-xs font-medium text-slate-700">
              Motivo do Cancelamento (opcional):
            </label>
            <textarea
              id="cancel-reason-input"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Ex: Desistência do cliente, agendamento duplicado, etc."
              rows={2}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
            />
          </div>

          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel
              disabled={isPending}
              onClick={() => {
                setCancelDialogOpen(false);
                setCancelReason("");
              }}
              className="text-xs border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
            >
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={handleCancelConfirm}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
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
