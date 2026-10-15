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
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  ShieldAlert,
  Sparkles,
  Truck,
  User,
  Wrench,
  X,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Appointment, AppointmentStatus } from "../../domain/types";
import { BRS_BOOKING_CONFIG } from "../../config/booking.config";
import { formatDate, formatTime, formatDateTime } from "../../domain/time";
import { formatPhoneBR } from "../../domain/phone";
import { getStatusBadgeClass, getStatusLabel } from "../../domain/status";
import {
  buildCustomerWhatsAppLink,
  formatPreOsSummary,
  DAMAGE_AREAS_LIST,
  DAMAGE_TYPES_LIST,
} from "../../domain/intake";

export interface CustomerProcessDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (id: string, newStatus: AppointmentStatus) => void;
}

export function CustomerProcessDialog({
  appointment,
  open,
  onOpenChange,
  onStatusChange,
}: CustomerProcessDialogProps) {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedProtocol, setCopiedProtocol] = useState(false);

  if (!appointment) return null;

  const service = BRS_BOOKING_CONFIG.services.find((s) => s.id === appointment.serviceId);
  const professional = BRS_BOOKING_CONFIG.professionals.find(
    (p) => p.id === appointment.professionalId,
  );
  const isLeva = appointment.logistics.type === "leva-e-traz";
  const slotDate = new Date(appointment.startTime);
  const createdDate = new Date(appointment.createdAt);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-[#fbf9f6] text-[#201d1b] border-[#ded7cc] p-0 sm:rounded-2xl shadow-2xl">
        {/* CABEÇALHO SUPERIOR */}
        <div className="p-6 bg-[#f4eee6] border-b border-[#ded7cc] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-emerald-900 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-md flex items-center gap-1.5 shadow-2xs">
                {appointment.protocol}
                <button
                  type="button"
                  onClick={handleCopyProtocol}
                  title="Copiar protocolo"
                  className="hover:text-emerald-700 cursor-pointer ml-1"
                >
                  {copiedProtocol ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusBadgeClass(
                  appointment.status,
                )}`}
              >
                {getStatusLabel(appointment.status)}
              </span>
            </div>

            <div className="text-right text-xs text-[#716860]">
              <span className="font-medium text-[#201d1b]">
                {formatDate(slotDate)} às {formatTime(slotDate)}
              </span>
              <div className="text-[11px]">
                Duração estimada: {service?.durationMinutes ?? 45} min
              </div>
            </div>
          </div>

          <div>
            <DialogTitle className="text-xl font-display font-bold text-[#201d1b] tracking-tight">
              Processo Completo do Cliente • {appointment.customer.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#716860] mt-1 flex flex-wrap items-center gap-2">
              <span>{service?.title}</span>
              <span>•</span>
              <span className="font-semibold text-[#3b3530]">
                Técnico Responsável: {professional?.name ?? appointment.professionalId}
              </span>
            </DialogDescription>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 1. DESTAQUE OBRIGATÓRIO: QUANDO O CLIENTE CADASTROU */}
          <div className="p-4 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50/80 to-orange-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-lg bg-amber-500/10 text-amber-800 flex items-center justify-center shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <div className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
                  Registro de Cadastro do Cliente
                </div>
                <div className="text-[#3a322c] mt-0.5">
                  Cadastrado em{" "}
                  <strong className="text-[#201d1b] font-semibold">
                    {formatDateTime(createdDate)}
                  </strong>{" "}
                  ({getCreatedRelative()})
                </div>
                <div className="text-[11px] text-[#716860] mt-0.5">
                  Canal de Entrada:{" "}
                  <span className="font-medium text-[#201d1b]">
                    Portal Web BRS (Auto-Confirmação pelo Cliente)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right text-[11px] text-[#716860] font-mono bg-white/70 px-2.5 py-1.5 rounded-md border border-amber-200/80 shrink-0">
              Idempotência: {appointment.idempotencyKey.slice(0, 16)}...
            </div>
          </div>

          {/* 2. LINHA DO TEMPO / TIMELINE DO PROCESSO DO CLIENTE */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#716860] flex items-center gap-1.5">
              <FileCheck size={14} className="text-[#3b3530]" />
              Linha do Tempo do Atendimento (Jornada BRS)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* ETAPA 1 */}
              <div className="p-3 rounded-lg border border-emerald-300 bg-emerald-50/70 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px]">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  1. Cadastro & Intake
                </div>
                <div className="text-[11px] text-[#554e47]">
                  Dados do veículo e fotos/descrição informados em {formatTime(createdDate)}.
                </div>
              </div>

              {/* ETAPA 2 */}
              <div className="p-3 rounded-lg border border-emerald-300 bg-emerald-50/70 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px]">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  2. Horário Confirmado
                </div>
                <div className="text-[11px] text-[#554e47]">
                  Reserva imediata na grade sem necessidade de aprovação manual.
                </div>
              </div>

              {/* ETAPA 3 */}
              <div
                className={`p-3 rounded-lg border space-y-1 text-xs ${
                  isLeva ? "border-amber-300 bg-amber-50/70" : "border-emerald-300 bg-emerald-50/70"
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 font-semibold text-[11px] ${
                    isLeva ? "text-amber-900" : "text-emerald-800"
                  }`}
                >
                  {isLeva ? <Truck size={13} /> : <MapPin size={13} />}
                  3. {isLeva ? "Logística Leva e Traz" : "Recepção Presencial"}
                </div>
                <div className="text-[11px] text-[#554e47]">
                  {isLeva
                    ? `Coleta agendada no bairro ${appointment.logistics.neighborhood} (Toledo).`
                    : "Cliente se desloca até a oficina na sede da BRS."}
                </div>
              </div>

              {/* ETAPA 4 */}
              <div
                className={`p-3 rounded-lg border space-y-1 text-xs ${
                  appointment.status === "COMPLETED"
                    ? "border-emerald-300 bg-emerald-50/70"
                    : "border-[#ded7cc] bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[#3b3530] font-semibold text-[11px]">
                  <Wrench size={13} />
                  4. Vistoria Técnica
                </div>
                <div className="text-[11px] text-[#716860]">
                  Inspeção minuciosa com luminária técnica pelo especialista {professional?.name}.
                </div>
              </div>

              {/* ETAPA 5 */}
              <div
                className={`p-3 rounded-lg border space-y-1 text-xs ${
                  appointment.status === "COMPLETED"
                    ? "border-emerald-300 bg-emerald-50/70"
                    : "border-[#ded7cc] bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[#3b3530] font-semibold text-[11px]">
                  <Shield size={13} />
                  5.{" "}
                  {appointment.intake.isInsurance ? "Regulação Seguradora" : "Orçamento Aprovado"}
                </div>
                <div className="text-[11px] text-[#716860]">
                  {appointment.intake.isInsurance
                    ? "Encaminhado para vistoria de sinistro com corretor/seguradora."
                    : "Orçamento com detalhamento de mão de obra e insumos."}
                </div>
              </div>

              {/* ETAPA 6 */}
              <div
                className={`p-3 rounded-lg border space-y-1 text-xs ${
                  appointment.status === "COMPLETED"
                    ? "border-emerald-300 bg-emerald-50/70"
                    : "border-[#ded7cc] bg-white"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[#3b3530] font-semibold text-[11px]">
                  <Sparkles size={13} />
                  6. Reparação & Entrega
                </div>
                <div className="text-[11px] text-[#716860]">
                  Garantia técnica de fábrica nos reparos e liberação do veículo.
                </div>
              </div>
            </div>
          </div>

          {/* 3. DADOS DO CLIENTE & VEÍCULO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FICHA DO CLIENTE */}
            <div className="p-4 rounded-xl border border-[#ded7cc] bg-white space-y-3 text-xs">
              <div className="font-bold text-[#201d1b] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-[#716860]" />
                  Ficha do Cliente
                </span>
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  LGPD Consentida
                </span>
              </div>

              <div className="space-y-1.5">
                <div>
                  <span className="text-[11px] text-[#716860]">Nome Completo:</span>
                  <div className="font-semibold text-sm text-[#201d1b]">
                    {appointment.customer.name}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-[#716860]">WhatsApp / Telefone:</span>
                  <div className="font-mono font-medium text-[#201d1b] flex items-center gap-2">
                    <a
                      href={`tel:${appointment.customer.phone}`}
                      className="hover:underline flex items-center gap-1"
                    >
                      <Phone size={12} className="text-[#716860]" />
                      {formatPhoneBR(appointment.customer.phone)}
                    </a>
                  </div>
                </div>

                {appointment.customer.notes && (
                  <div>
                    <span className="text-[11px] text-[#716860]">Observações do Cliente:</span>
                    <p className="p-2 rounded bg-[#fbf9f6] border border-[#ded7cc] text-[#554e47] text-[11px] italic mt-0.5">
                      "{appointment.customer.notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* FICHA DO VEÍCULO */}
            <div className="p-4 rounded-xl border border-[#ded7cc] bg-white space-y-3 text-xs">
              <div className="font-bold text-[#201d1b] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Car size={14} className="text-[#716860]" />
                  Dados do Veículo
                </span>

                {/* PLACA MERCOSUL ESTILIZADA */}
                {appointment.intake.vehicle.plate && (
                  <div className="rounded border-2 border-slate-700 bg-white overflow-hidden text-center shadow-xs">
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
                  <span className="text-[11px] text-[#716860]">Marca / Modelo:</span>
                  <div className="font-semibold text-[#201d1b]">
                    {appointment.intake.vehicle.make} {appointment.intake.vehicle.model}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-[#716860]">Ano de Fabricação:</span>
                  <div className="font-medium text-[#201d1b]">
                    {appointment.intake.vehicle.year || "Não informado"}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-[#716860]">Cor Externa:</span>
                  <div className="font-medium text-[#201d1b]">
                    {appointment.intake.vehicle.color || "Padrão montadora"}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-[#716860]">Tipo de Acabamento:</span>
                  <div className="font-medium text-[#201d1b] capitalize">
                    {appointment.intake.vehicle.finishType || "Metálica"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. DIAGNÓSTICO DE DANOS & ANAMNESE DA PRÉ-OS */}
          <div className="p-4 rounded-xl border border-[#ded7cc] bg-white space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#201d1b] flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-amber-600" />
                Diagnóstico de Avarias (Anamnese Técnica de Pré-OS)
              </span>

              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                  appointment.intake.isInsurance
                    ? "bg-blue-50 text-blue-800 border-blue-200"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                {appointment.intake.isInsurance ? "Seguradora / Sinistro" : "Particular"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-[#716860]">Classificação do Dano:</span>
                <div className="font-semibold text-[#201d1b] mt-0.5">{damageTypeLabel}</div>
              </div>

              <div>
                <span className="text-[11px] text-[#716860]">Áreas Afetadas:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {appointment.intake.affectedAreas.map((areaId) => {
                    const label = DAMAGE_AREAS_LIST.find((a) => a.id === areaId)?.label ?? areaId;
                    return (
                      <span
                        key={areaId}
                        className="px-2 py-0.5 rounded bg-[#eee7de] text-[#3b3530] text-[10px] font-medium"
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
                <span className="text-[11px] text-[#716860]">Relato Técnico do Cliente:</span>
                <p className="p-2.5 rounded bg-[#fbf9f6] border border-[#ded7cc] text-[#2c2724] text-xs leading-relaxed mt-1">
                  {appointment.intake.description}
                </p>
              </div>
            )}
          </div>

          {/* 5. LOGÍSTICA LEVA E TRAZ (SE APLICÁVEL) */}
          {isLeva && (
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 space-y-2 text-xs">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <Truck size={14} className="text-amber-700" />
                Roteiro de Coleta e Entrega Leva e Traz (Toledo-PR)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#3b3530]">
                <div>
                  <span className="text-[11px] text-amber-900 font-medium">
                    Endereço de Coleta:
                  </span>
                  <div className="font-semibold">{appointment.logistics.address}</div>
                </div>

                <div>
                  <span className="text-[11px] text-amber-900 font-medium">Bairro / Cidade:</span>
                  <div>
                    {appointment.logistics.neighborhood} —{" "}
                    {appointment.logistics.city ?? "Toledo-PR"}
                  </div>
                </div>

                {appointment.logistics.referencePoint && (
                  <div>
                    <span className="text-[11px] text-amber-900 font-medium">
                      Ponto de Referência:
                    </span>
                    <div>{appointment.logistics.referencePoint}</div>
                  </div>
                )}

                {appointment.logistics.contactPerson && (
                  <div>
                    <span className="text-[11px] text-amber-900 font-medium">
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
        <div className="p-5 bg-[#f4eee6] border-t border-[#ded7cc] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <MessageCircle size={14} /> Abrir WhatsApp da Pré-OS
            </a>

            <button
              type="button"
              onClick={handleCopySummary}
              className="py-2 px-3.5 rounded-lg border border-[#ded7cc] bg-white hover:bg-[#ede7de] text-xs font-medium text-[#3b3530] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSummary ? (
                <>
                  <Check size={14} className="text-emerald-600" /> Copiado com sucesso!
                </>
              ) : (
                <>
                  <Copy size={14} /> Copiar Resumo para OS
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onStatusChange && appointment.status !== "COMPLETED" && (
              <button
                type="button"
                onClick={() => {
                  onStatusChange(appointment.id, "COMPLETED");
                  onOpenChange(false);
                }}
                className="py-2 px-3 rounded-lg border border-emerald-400 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Check size={13} /> Concluir Atendimento
              </button>
            )}

            {onStatusChange && appointment.status !== "CANCELLED" && (
              <button
                type="button"
                onClick={() => {
                  if (confirm("Deseja realmente cancelar este agendamento?")) {
                    onStatusChange(appointment.id, "CANCELLED");
                    onOpenChange(false);
                  }
                }}
                className="py-2 px-2.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-700 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                title="Cancelar agendamento"
              >
                <XCircle size={13} /> Cancelar
              </button>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
