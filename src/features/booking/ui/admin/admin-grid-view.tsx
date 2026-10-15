import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  Filter,
  LogOut,
  MessageCircle,
  PlayCircle,
  Plus,
  Slash,
  Sparkles,
  Truck,
  XCircle,
} from "lucide-react";
import { company } from "@/lib/brs";
import type { Appointment, AppointmentStatus } from "../../domain/types";
import { localBookingRepository } from "../../data/local/local-repository";
import { formatDate, formatTime, isSameCivilDay, parseTimeOnDate } from "../../domain/time";
import { formatPhoneBR } from "../../domain/phone";
import { getStatusBorderClass } from "../../domain/status";
import { buildCustomerWhatsAppLink, formatPreOsSummary } from "../../domain/intake";
import { getBlockedPeriods, isPeriodBlocked, type BlockedPeriod } from "../../domain/blocks";
import { BRS_BOOKING_CONFIG } from "../../config/booking.config";
import { logoutAdmin } from "../../domain/auth";
import { ensureSeedData } from "../../domain/seed";
import { ManualBookingDialog } from "./manual-booking-dialog";
import { BlockSlotDialog } from "./block-slot-dialog";
import { CustomerProcessDialog } from "./customer-process-dialog";
import { StatusBadge } from "../status-badge";

type ViewMode = "dia" | "semana" | "lista" | "solicitacoes";
type StatusFilter = "ALL" | AppointmentStatus;

const GRID_HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00", // Almoço
  "13:00", // Almoço
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export interface AdminGridViewProps {
  onLogout: () => void;
}

export function AdminGridView({ onLogout }: AdminGridViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedPeriods, setBlockedPeriods] = useState<BlockedPeriod[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("dia");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>("ALL");
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  // Diálogos de Ação Rápida
  const [manualBookingOpen, setManualBookingOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState<{
    time: string;
    profId: string;
  } | null>(null);

  // Modal de Detalhe e Processo do Cliente
  const [selectedAppointmentForDetail, setSelectedAppointmentForDetail] =
    useState<Appointment | null>(null);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  useEffect(() => {
    ensureSeedData(false, currentDate);
    const unsub = localBookingRepository.subscribe((list) => {
      setAppointments(list);
    });
    setBlockedPeriods(getBlockedPeriods());
    return () => unsub();
  }, [currentDate]);

  const refreshBlocks = () => {
    setBlockedPeriods(getBlockedPeriods());
  };

  const handleOpenAppointmentDetail = (app: Appointment) => {
    setSelectedAppointmentForDetail(app);
    setProcessDialogOpen(true);
  };

  const handleCloseProcessDialog = (open: boolean) => {
    setProcessDialogOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedAppointmentForDetail(null);
      }, 150);
    }
  };

  const handleResetDemoData = () => {
    const res = ensureSeedData(true, currentDate);
    setBlockedPeriods(getBlockedPeriods());
    setSeedNotice(
      `Dados fictícios carregados: ${res.appointments} agendamentos e ${res.blocks} bloqueio técnico restaurados.`,
    );
    setTimeout(() => setSeedNotice(null), 4500);
  };

  const handleLogout = () => {
    logoutAdmin();
    onLogout();
  };

  const changeDateBy = (days: number) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + days);
    setCurrentDate(next);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Profissionais filtrados
  const displayedProfessionals = useMemo(() => {
    if (selectedProfessionalId === "ALL") {
      return BRS_BOOKING_CONFIG.professionals;
    }
    return BRS_BOOKING_CONFIG.professionals.filter((p) => p.id === selectedProfessionalId);
  }, [selectedProfessionalId]);

  // KPIs superiores semânticos
  const stats = useMemo(() => {
    const dayAppointments = appointments.filter((a) =>
      isSameCivilDay(new Date(a.startTime), currentDate),
    );
    const inProgressCount = dayAppointments.filter((a) => a.status === "CONFIRMED").length;
    const completedCount = dayAppointments.filter((a) => a.status === "COMPLETED").length;
    const openCount = dayAppointments.filter((a) => a.status === "PENDING").length;
    const closedCount = dayAppointments.filter((a) => a.status === "NO_SHOW").length;
    const cancelledCount = dayAppointments.filter((a) => a.status === "CANCELLED").length;
    const levaETrazCount = dayAppointments.filter((a) => a.logistics.type === "leva-e-traz").length;

    return {
      total: dayAppointments.length,
      inProgress: inProgressCount,
      completed: completedCount,
      open: openCount,
      closed: closedCount,
      cancelled: cancelledCount,
      levaETraz: levaETrazCount,
      activePros: BRS_BOOKING_CONFIG.professionals.length,
    };
  }, [appointments, currentDate]);

  const displayedAppointments = useMemo(() => {
    if (statusFilter === "ALL") return appointments;
    return appointments.filter((a) => a.status === statusFilter);
  }, [appointments, statusFilter]);

  const handleStatusChange = async (
    id: string,
    newStatus: AppointmentStatus,
    options?: {
      note?: string;
      actorId?: string;
      actorName?: string;
    },
  ): Promise<boolean> => {
    const res = await localBookingRepository.updateStatus(id, newStatus, options);
    if (!res.ok) {
      return false;
    } else {
      setSelectedAppointmentForDetail((prev) => (prev && prev.id === id ? res.value : prev));
      return true;
    }
  };

  const handleCopySummary = async (app: Appointment) => {
    const svc = BRS_BOOKING_CONFIG.services.find((s) => s.id === app.serviceId);
    const summary = formatPreOsSummary({
      protocol: app.protocol,
      serviceTitle: svc?.title ?? app.serviceId,
      scheduledTime: `${formatDate(new Date(app.startTime))} às ${formatTime(new Date(app.startTime))}`,
      customer: app.customer,
      intake: app.intake,
      logistics: app.logistics,
    });
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedId(app.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // Fallback
    }
  };

  const openSlotBooking = (time: string, profId: string) => {
    setSelectedSlotForBooking({ time, profId });
    setManualBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* 1. BARRA SUPERIOR DE TELEMETRIA OPERACIONAL */}
      <div className="w-full px-6 py-2 bg-white border-b border-slate-200 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-600 font-medium">
            Ambiente Demonstrativo: Sincronização multi-abas ativa via Web Locks & BroadcastChannel
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <button
            type="button"
            onClick={handleResetDemoData}
            className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Recarrega a agenda com agendamentos fictícios de demonstração"
          >
            <Sparkles size={12} className="text-amber-600" />
            <span>Restaurar Dados Fictícios</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            Ver site da oficina <ExternalLink size={11} />
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="text-slate-600 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <LogOut size={12} /> Sair
          </button>
        </div>
      </div>

      {/* BANNER DE NOTIFICAÇÃO DO SEED */}
      {seedNotice && (
        <div className="w-full px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-600" />
            <span className="font-medium">{seedNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSeedNotice(null)}
            className="text-emerald-800 hover:text-emerald-950 text-xs font-semibold px-2 py-0.5 rounded cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* 2. CABEÇALHO DO ERP ADMINISTRATIVO */}
      <header className="px-6 py-4 bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                Agenda dos Técnicos
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                EPM BOOKING
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {company.name} • Gestão Integrada de Atendimentos
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setBlockDialogOpen(true)}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Slash size={13} className="text-slate-400" />
            Bloquear Período
          </button>

          <button
            type="button"
            onClick={() => openSlotBooking("09:00", BRS_BOOKING_CONFIG.professionals[0].id)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-black active:scale-[0.99] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Plus size={14} />
            Novo Agendamento
          </button>
        </div>
      </header>

      {/* 3. BARRA DE NAVEGAÇÃO & CONTROLES */}
      <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* ABAS: DIA, LISTA, LEVA E TRAZ */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setViewMode("dia")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === "dia"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calendar size={13} /> Dia
          </button>

          <button
            type="button"
            onClick={() => setViewMode("lista")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === "lista"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Filter size={13} /> Lista
          </button>

          <button
            type="button"
            onClick={() => setViewMode("solicitacoes")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === "solicitacoes"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Truck size={13} /> Leva e Traz
            {stats.levaETraz > 0 && (
              <span className="size-4 rounded-full bg-slate-900 text-white text-[9px] flex items-center justify-center font-bold">
                {stats.levaETraz}
              </span>
            )}
          </button>
        </div>

        {/* NAVEGADOR DE PROFISSIONAL E DATA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Profissional:</span>
            <select
              value={selectedProfessionalId}
              onChange={(e) => setSelectedProfessionalId(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-900 shadow-2xs"
            >
              <option value="ALL">Todos os profissionais</option>
              {BRS_BOOKING_CONFIG.professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => changeDateBy(-1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer shadow-2xs"
              title="Dia anterior"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-800 cursor-pointer shadow-2xs"
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={() => changeDateBy(1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer shadow-2xs"
              title="Próximo dia"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="text-xs font-medium text-slate-700 capitalize">
            {currentDate.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* 4. CARDS DE KPIS / MÉTRICAS SÓBRIAS */}
      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">Total do Dia</span>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 border-l-4 border-l-amber-500 space-y-1 shadow-2xs">
            <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
              <PlayCircle size={13} className="text-amber-600" /> Em Andamento
            </span>
            <div className="text-2xl font-bold text-slate-900">{stats.inProgress}</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 border-l-4 border-l-emerald-500 space-y-1 shadow-2xs">
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 size={13} className="text-emerald-600" /> Concluídos
            </span>
            <div className="text-2xl font-bold text-slate-900">{stats.completed}</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 border-l-4 border-l-sky-500 space-y-1 shadow-2xs">
            <span className="text-[11px] text-sky-700 font-semibold flex items-center gap-1">
              <Clock size={13} className="text-sky-600" /> Abertos
            </span>
            <div className="text-2xl font-bold text-slate-900">{stats.open}</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 border-l-4 border-l-neutral-400 space-y-1 shadow-2xs">
            <span className="text-[11px] text-neutral-600 font-semibold flex items-center gap-1">
              <Slash size={13} className="text-neutral-500" /> Fechados
            </span>
            <div className="text-2xl font-bold text-slate-900">{stats.closed}</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 border-l-4 border-l-rose-400 space-y-1 shadow-2xs">
            <span className="text-[11px] text-rose-700 font-semibold flex items-center gap-1">
              <XCircle size={13} className="text-rose-600" /> Cancelados
            </span>
            <div className="text-2xl font-bold text-slate-900">{stats.cancelled}</div>
          </div>
        </div>

        {/* BARRA DE FILTRO OPERACIONAL POR STATUS */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs font-medium text-slate-700">Filtrar por Situação:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-slate-900 text-white shadow-xs font-semibold"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Todos ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("CONFIRMED")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "CONFIRMED"
                  ? "bg-amber-600 text-white shadow-xs font-semibold"
                  : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
              }`}
            >
              <span className="size-2 rounded-full bg-amber-500" />
              Em Andamento ({stats.inProgress})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("COMPLETED")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "COMPLETED"
                  ? "bg-emerald-600 text-white shadow-xs font-semibold"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
              }`}
            >
              <span className="size-2 rounded-full bg-emerald-500" />
              Concluídos ({stats.completed})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("PENDING")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "PENDING"
                  ? "bg-sky-600 text-white shadow-xs font-semibold"
                  : "bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100"
              }`}
            >
              <span className="size-2 rounded-full bg-sky-500" />
              Abertos ({stats.open})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("NO_SHOW")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "NO_SHOW"
                  ? "bg-neutral-800 text-white shadow-xs font-semibold"
                  : "bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200"
              }`}
            >
              <span className="size-2 rounded-full bg-neutral-400" />
              Fechados ({stats.closed})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("CANCELLED")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "CANCELLED"
                  ? "bg-rose-600 text-white shadow-xs font-semibold"
                  : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
              }`}
            >
              <span className="size-2 rounded-full bg-rose-500" />
              Cancelados ({stats.cancelled})
            </button>
          </div>
        </div>

        {/* 5. VISÃO EM GRADE / TABELA DE AGENDAMENTOS PROFISSIONAL */}
        {viewMode === "dia" && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F9FAFB]">
                  <th className="p-3 text-center font-mono font-medium text-slate-500 w-20 border-r border-slate-200 text-xs">
                    Horário
                  </th>
                  {displayedProfessionals.map((pro) => (
                    <th
                      key={pro.id}
                      className="p-3 text-left font-semibold text-slate-800 border-r border-slate-200 last:border-r-0 min-w-[260px]"
                    >
                      <div className="font-semibold text-xs text-slate-900">{pro.name}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{pro.role}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GRID_HOURS.map((hourStr) => {
                  const isLunch = hourStr === "12:00" || hourStr === "13:00";
                  const slotDate = parseTimeOnDate(currentDate, hourStr);

                  return (
                    <tr key={hourStr} className="border-b border-slate-200 last:border-b-0">
                      {/* COLUNA DE HORÁRIO */}
                      <td className="p-3 text-center font-mono text-slate-500 border-r border-slate-200 bg-[#F9FAFB] align-middle">
                        {hourStr}
                      </td>

                      {/* COLUNAS DOS PROFISSIONAIS */}
                      {displayedProfessionals.map((pro) => {
                        // Verifica se é almoço
                        if (isLunch) {
                          return (
                            <td
                              key={pro.id}
                              className="p-4 text-center text-slate-400 text-xs bg-slate-50/60 border-r border-slate-200 last:border-r-0 select-none"
                            >
                              Intervalo de almoço
                            </td>
                          );
                        }

                        // Verifica se há agendamento para este profissional neste dia e horário
                        const app = appointments.find((a) => {
                          if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
                          if (statusFilter === "ALL" && a.status === "CANCELLED") return false;
                          if (a.professionalId !== pro.id) return false;
                          const aDate = new Date(a.startTime);
                          return (
                            isSameCivilDay(aDate, currentDate) && formatTime(aDate) === hourStr
                          );
                        });

                        // Verifica se este slot está bloqueado
                        const isBlocked = isPeriodBlocked(
                          slotDate,
                          new Date(slotDate.getTime() + 45 * 60 * 1000),
                          pro.id,
                          blockedPeriods,
                        );

                        if (app) {
                          const svc = BRS_BOOKING_CONFIG.services.find(
                            (s) => s.id === app.serviceId,
                          );
                          const isLeva = app.logistics.type === "leva-e-traz";
                          const whatsAppLink = buildCustomerWhatsAppLink({
                            protocol: app.protocol,
                            customer: app.customer,
                            intake: app.intake,
                            serviceTitle: svc?.title ?? app.serviceId,
                            scheduledTime: `${formatDate(slotDate)} às ${formatTime(slotDate)}`,
                            logistics: app.logistics,
                          });

                          return (
                            <td
                              key={pro.id}
                              className="p-2 border-r border-slate-200 last:border-r-0 align-top bg-slate-50/30"
                            >
                              <div
                                onClick={() => handleOpenAppointmentDetail(app)}
                                className={`p-2.5 rounded-lg border border-slate-200 border-l-4 ${getStatusBorderClass(app.status)} bg-white hover:border-slate-300 shadow-2xs space-y-1.5 cursor-pointer transition-all group`}
                                title="Clique para expandir o processo completo do cliente"
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-mono font-semibold text-[11px] text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                    {app.protocol}
                                  </span>
                                  <StatusBadge status={app.status} size="xs" />
                                </div>

                                <div>
                                  <div className="font-semibold text-xs text-slate-900 group-hover:text-slate-700 transition-colors truncate">
                                    {app.customer.name}
                                  </div>
                                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                    <span>
                                      {app.intake.vehicle.make} {app.intake.vehicle.model}
                                    </span>
                                    {app.intake.vehicle.plate && (
                                      <span className="font-mono text-[10px] text-slate-700 bg-slate-100 px-1 py-0.2 rounded">
                                        {app.intake.vehicle.plate}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                                  <span className="truncate">{svc?.short ?? app.serviceId}</span>
                                  {isLeva && (
                                    <span className="flex items-center gap-1 text-slate-700 font-medium text-[10px]">
                                      <Truck size={11} /> Leva e Traz
                                    </span>
                                  )}
                                </div>

                                {/* BOTÕES DE AÇÃO NO CARD */}
                                <div
                                  className="flex items-center gap-1.5 pt-1.5 border-t border-slate-100"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <a
                                    href={whatsAppLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-1 px-2 rounded-md bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-all shadow-2xs"
                                    title="Abrir WhatsApp com dados da Pré-OS"
                                  >
                                    <MessageCircle size={12} /> WhatsApp
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() => handleCopySummary(app)}
                                    title="Copiar dados da Pré-OS"
                                    className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer shadow-2xs"
                                  >
                                    <Copy size={12} />
                                  </button>

                                  {app.status !== "COMPLETED" && (
                                    <button
                                      type="button"
                                      onClick={() => handleStatusChange(app.id, "COMPLETED")}
                                      title="Concluir Atendimento"
                                      className="p-1 rounded-md border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                                    >
                                      <Check size={12} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>
                          );
                        }

                        if (isBlocked) {
                          return (
                            <td
                              key={pro.id}
                              className="p-2 border-r border-slate-200 last:border-r-0 align-top bg-slate-50/50"
                            >
                              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-100/70 text-slate-600 text-xs text-center space-y-1">
                                <Slash size={13} className="mx-auto text-slate-400" />
                                <div className="font-medium text-[11px] text-slate-600">
                                  Bloqueado
                                </div>
                              </div>
                            </td>
                          );
                        }

                        // SLOT LIVRE DISCRETO
                        return (
                          <td
                            key={pro.id}
                            className="p-2 border-r border-slate-200 last:border-r-0 align-middle text-center"
                          >
                            <button
                              type="button"
                              onClick={() => openSlotBooking(hourStr, pro.id)}
                              className="w-full h-full min-h-[64px] rounded-lg border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-400 hover:text-slate-700 text-xs transition-all cursor-pointer flex items-center justify-center font-medium"
                            >
                              <span>+ Livre</span>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. VISÃO EM LISTA (TABELA DETALHADA) */}
        {viewMode === "lista" && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
            <h3 className="font-semibold text-sm text-slate-900">
              Listagem Cronológica de Atendimentos
            </h3>
            {displayedAppointments.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">
                {statusFilter === "ALL"
                  ? "Nenhum atendimento cadastrado."
                  : "Nenhum atendimento encontrado para o filtro selecionado."}
              </p>
            ) : (
              <div className="space-y-2">
                {displayedAppointments.map((a) => {
                  const svc = BRS_BOOKING_CONFIG.services.find((s) => s.id === a.serviceId);
                  const whatsApp = buildCustomerWhatsAppLink({
                    protocol: a.protocol,
                    customer: a.customer,
                    intake: a.intake,
                    serviceTitle: svc?.title ?? a.serviceId,
                    scheduledTime: `${formatDate(new Date(a.startTime))} às ${formatTime(new Date(a.startTime))}`,
                    logistics: a.logistics,
                  });

                  return (
                    <div
                      key={a.id}
                      onClick={() => handleOpenAppointmentDetail(a)}
                      className={`p-3.5 rounded-lg border border-slate-200 border-l-4 ${getStatusBorderClass(a.status)} bg-white hover:border-slate-300 hover:bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer transition-all shadow-2xs`}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-semibold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                            {a.protocol}
                          </span>
                          <StatusBadge status={a.status} size="sm" />
                          <span className="font-semibold text-slate-900">{a.customer.name}</span>
                          <span className="text-slate-500 text-[11px]">
                            ({formatPhoneBR(a.customer.phone)})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          <span className="font-mono">
                            {formatDate(new Date(a.startTime))} às{" "}
                            {formatTime(new Date(a.startTime))}
                          </span>{" "}
                          •{" "}
                          <strong className="text-slate-800">
                            {a.intake.vehicle.make} {a.intake.vehicle.model}
                          </strong>{" "}
                          • {svc?.short}
                        </div>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleOpenAppointmentDetail(a)}
                          className="py-1 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Eye size={12} /> Ver Processo
                        </button>

                        <a
                          href={whatsApp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-3.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                          title="Abrir WhatsApp com dados da Pré-OS"
                        >
                          <MessageCircle size={13} /> WhatsApp
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 7. VISÃO EXCLUSIVA LEVA E TRAZ */}
        {viewMode === "solicitacoes" && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-slate-700" />
              <div>
                <h3 className="font-semibold text-sm text-slate-900">
                  Roteiro de Coleta e Devolução Leva e Traz (Toledo-PR)
                </h3>
                <p className="text-xs text-slate-500">
                  Clientes que solicitaram retirada e entrega do veículo no endereço.
                </p>
              </div>
            </div>

            {appointments.filter((a) => a.logistics.type === "leva-e-traz").length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">
                Nenhuma solicitação de Leva e Traz ativa no momento.
              </p>
            ) : (
              <div className="grid gap-3">
                {appointments
                  .filter((a) => a.logistics.type === "leva-e-traz")
                  .map((a) => (
                    <div
                      key={a.id}
                      onClick={() => handleOpenAppointmentDetail(a)}
                      className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 space-y-2 text-xs cursor-pointer transition-all shadow-2xs"
                    >
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                            {a.protocol}
                          </span>
                          <StatusBadge status={a.status} size="sm" />
                        </div>
                        <span className="font-medium text-slate-700 font-mono">
                          {formatDate(new Date(a.startTime))} às {formatTime(new Date(a.startTime))}
                        </span>
                      </div>

                      <div className="text-slate-800">
                        Cliente: <strong>{a.customer.name}</strong> (
                        {formatPhoneBR(a.customer.phone)})
                      </div>
                      <div className="text-slate-600">
                        Endereço de Coleta:{" "}
                        <strong className="text-slate-900">
                          {a.logistics.address}, Bairro {a.logistics.neighborhood} (Toledo-PR)
                        </strong>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-[11px] text-slate-500">
                          Veículo: {a.intake.vehicle.make} {a.intake.vehicle.model}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAppointmentDetail(a);
                          }}
                          className="py-1 px-2.5 rounded-lg bg-slate-900 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Eye size={12} /> Ver Detalhes do Processo
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL EXPANSÍVEL DO PROCESSO DO CLIENTE */}
      <CustomerProcessDialog
        appointment={selectedAppointmentForDetail}
        open={processDialogOpen}
        onOpenChange={handleCloseProcessDialog}
        onStatusChange={handleStatusChange}
      />

      {/* MODAL DE AGENDAMENTO MANUAL */}
      <ManualBookingDialog
        open={manualBookingOpen}
        onOpenChange={setManualBookingOpen}
        initialDate={currentDate}
        initialTime={selectedSlotForBooking?.time ?? "09:00"}
        initialProfessionalId={selectedSlotForBooking?.profId}
      />

      {/* MODAL DE BLOQUEIO DE HORÁRIO */}
      <BlockSlotDialog
        open={blockDialogOpen}
        onOpenChange={setBlockDialogOpen}
        selectedDate={currentDate}
        onSuccess={refreshBlocks}
      />
    </div>
  );
}
