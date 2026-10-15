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
  MapPin,
  MessageCircle,
  Phone,
  PlayCircle,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Slash,
  Sparkles,
  Truck,
  User,
  Wrench,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/brs";
import type { Appointment, AppointmentStatus, Professional } from "../../domain/types";
import { localBookingRepository } from "../../data/local/local-repository";
import { formatDate, formatTime, isSameCivilDay, parseTimeOnDate } from "../../domain/time";
import { formatPhoneBR } from "../../domain/phone";
import { getStatusBorderClass, getStatusLabel } from "../../domain/status";
import {
  DAMAGE_AREAS_LIST,
  DAMAGE_TYPES_LIST,
  buildCustomerWhatsAppLink,
  formatPreOsSummary,
} from "../../domain/intake";
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
    <div className="min-h-screen bg-[#0B0B0C] text-[#EDEDED] flex flex-col font-sans selection:bg-[#FF5A00]/30 selection:text-white">
      {/* 1. BARRA DE STATUS MULTI-ABAS (TELEMETRIA INDUSTRIAL) */}
      <div className="w-full px-6 py-2 bg-[#0E0E10] border-b border-[#1F1F23] text-[11px] text-zinc-400 flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00E599] animate-pulse" />
          <span className="text-zinc-300">
            Ambiente Demonstrativo: sincronização multi-abas ativa via Web Locks & BroadcastChannel
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <button
            type="button"
            onClick={handleResetDemoData}
            className="text-zinc-400 hover:text-[#FF5A00] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Recarrega a agenda com agendamentos fictícios de demonstração"
          >
            <Sparkles size={12} className="text-[#FF5A00]" />
            <span>Restaurar Dados Fictícios</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            Ver site da oficina <ExternalLink size={11} />
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="text-zinc-400 hover:text-red-400 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <LogOut size={12} /> Sair
          </button>
        </div>
      </div>

      {/* BANNER DE NOTIFICAÇÃO DO SEED */}
      {seedNotice && (
        <div className="w-full px-6 py-2.5 bg-emerald-950/40 border-b border-emerald-800 text-xs text-emerald-300 flex items-center justify-between font-mono animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="font-medium">{seedNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSeedNotice(null)}
            className="text-emerald-300 hover:text-white text-xs font-bold px-2 py-0.5 rounded cursor-pointer"
          >
            Fechar
          </button>
        </div>
      )}

      {/* 2. CABEÇALHO DA PLATAFORMA (CHASSIS WORKSHOP HEADER) */}
      <header className="px-6 py-5 bg-[#121214] border-b border-[#1F1F23] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-[#18181B] text-white flex items-center justify-center font-display font-bold text-base border border-[#27272A] shadow-inner">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-display font-bold text-white tracking-tight">
                Agenda dos Técnicos
              </h1>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 font-semibold border border-white/10">
                EPM BOOKING
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              BRS Reparações Automotivas • Gestão Integrada de Atendimentos
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setBlockDialogOpen(true)}
            className="px-3.5 py-2 rounded-lg border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Slash size={13} className="text-zinc-500" />
            Bloquear Período
          </button>

          <button
            type="button"
            onClick={() => openSlotBooking("09:00", BRS_BOOKING_CONFIG.professionals[0].id)}
            className="px-4 py-2 rounded-lg bg-[#FF5A00] hover:bg-[#E04F00] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#FF5A00]/20"
          >
            <Plus size={14} />
            Novo Agendamento
          </button>
        </div>
      </header>

      {/* 3. BARRA DE NAVEGAÇÃO & CONTROLES */}
      <div className="px-6 py-3.5 bg-[#121214] border-b border-[#1F1F23] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* ABAS: DIA, LISTA, LEVA E TRAZ */}
        <div className="flex items-center gap-1 bg-[#18181B] p-1 rounded-lg border border-[#27272A]">
          <button
            type="button"
            onClick={() => setViewMode("dia")}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === "dia"
                ? "bg-[#27272A] text-white shadow-xs font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Calendar size={13} /> Dia
          </button>

          <button
            type="button"
            onClick={() => setViewMode("lista")}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === "lista"
                ? "bg-[#27272A] text-white shadow-xs font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Filter size={13} /> Lista
          </button>

          <button
            type="button"
            onClick={() => setViewMode("solicitacoes")}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === "solicitacoes"
                ? "bg-[#27272A] text-white shadow-xs font-semibold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Truck size={13} /> Leva e Traz
            {stats.levaETraz > 0 && (
              <span className="size-4 rounded-full bg-[#FF5A00] text-white text-[9px] flex items-center justify-center font-bold">
                {stats.levaETraz}
              </span>
            )}
          </button>
        </div>

        {/* NAVEGADOR DE PROFISSIONAL E DATA */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 font-mono text-[11px] uppercase">Profissional:</span>
            <select
              value={selectedProfessionalId}
              onChange={(e) => setSelectedProfessionalId(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-[#27272A] bg-[#18181B] text-xs font-medium text-white focus:outline-none focus:border-[#FF5A00]"
            >
              <option value="ALL" className="bg-[#18181B] text-white">
                Todos os profissionais
              </option>
              {BRS_BOOKING_CONFIG.professionals.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#18181B] text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => changeDateBy(-1)}
              className="p-1.5 rounded-lg border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-zinc-400 hover:text-white cursor-pointer"
              title="Dia anterior"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="px-3 py-1.5 rounded-lg border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-xs font-semibold text-white cursor-pointer"
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={() => changeDateBy(1)}
              className="p-1.5 rounded-lg border border-[#27272A] bg-[#18181B] hover:bg-[#27272A] text-zinc-400 hover:text-white cursor-pointer"
              title="Próximo dia"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider">
            {currentDate.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* 4. CARDS DE KPIS / MÉTRICAS SEMÂNTICAS */}
      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-xl bg-[#121214] border border-[#1F1F23] space-y-1 shadow-md">
            <span className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider">
              Total do Dia
            </span>
            <div className="text-2xl lg:text-3xl font-display font-bold text-white">
              {stats.total}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#121214] border border-[#1F1F23] border-l-4 border-l-amber-500 space-y-1 shadow-md">
            <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 font-mono uppercase tracking-wider">
              <PlayCircle size={13} className="text-amber-500" /> Em Andamento
            </span>
            <div className="text-2xl lg:text-3xl font-display font-bold text-[#FF7A29]">
              {stats.inProgress}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#121214] border border-[#1F1F23] border-l-4 border-l-emerald-500 space-y-1 shadow-md">
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 font-mono uppercase tracking-wider">
              <CheckCircle2 size={13} className="text-emerald-400" /> Concluídos
            </span>
            <div className="text-2xl lg:text-3xl font-display font-bold text-emerald-400">
              {stats.completed}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#121214] border border-[#1F1F23] border-l-4 border-l-sky-500 space-y-1 shadow-md">
            <span className="text-[11px] text-sky-400 font-semibold flex items-center gap-1 font-mono uppercase tracking-wider">
              <Clock size={13} className="text-sky-400" /> Abertos
            </span>
            <div className="text-2xl lg:text-3xl font-display font-bold text-sky-400">
              {stats.open}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#121214] border border-[#1F1F23] border-l-4 border-l-neutral-400 space-y-1 shadow-md">
            <span className="text-[11px] text-neutral-400 font-semibold flex items-center gap-1 font-mono uppercase tracking-wider">
              <Slash size={13} className="text-neutral-400" /> Fechados
            </span>
            <div className="text-2xl lg:text-3xl font-display font-bold text-neutral-300">
              {stats.closed}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#121214] border border-[#1F1F23] border-l-4 border-l-red-400 space-y-1 shadow-md">
            <span className="text-[11px] text-red-400 font-semibold flex items-center gap-1 font-mono uppercase tracking-wider">
              <XCircle size={13} className="text-red-400" /> Cancelados
            </span>
            <div className="text-2xl lg:text-3xl font-display font-bold text-red-400">
              {stats.cancelled}
            </div>
          </div>
        </div>

        {/* BARRA DE FILTRO OPERACIONAL POR STATUS */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#121214] border border-[#1F1F23]">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-zinc-500" />
            <span className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider text-[11px]">
              Filtrar por Situação:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === "ALL"
                  ? "bg-white text-black shadow-xs font-semibold"
                  : "bg-[#18181B] text-zinc-400 hover:text-white border border-[#27272A]"
              }`}
            >
              Todos ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("CONFIRMED")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "CONFIRMED"
                  ? "bg-[#FF5A00] text-white shadow-xs font-semibold"
                  : "bg-amber-500/10 text-[#FF7A29] border border-amber-500/30 hover:bg-amber-500/20"
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
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
              }`}
            >
              <span className="size-2 rounded-full bg-emerald-400" />
              Concluídos ({stats.completed})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("PENDING")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "PENDING"
                  ? "bg-sky-600 text-white shadow-xs font-semibold"
                  : "bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20"
              }`}
            >
              <span className="size-2 rounded-full bg-sky-400" />
              Abertos ({stats.open})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("NO_SHOW")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "NO_SHOW"
                  ? "bg-neutral-800 text-white shadow-xs font-semibold"
                  : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/30 hover:bg-neutral-500/20"
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
                  ? "bg-red-600 text-white shadow-xs font-semibold"
                  : "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
              }`}
            >
              <span className="size-2 rounded-full bg-red-400" />
              Cancelados ({stats.cancelled})
            </button>
          </div>
        </div>

        {/* 5. VISÃO EM GRADE / TIMELINE DE ENGENHARIA (HORÁRIOS X PROFISSIONAIS) */}
        {viewMode === "dia" && (
          <div className="bg-[#121214] rounded-xl border border-[#1F1F23] overflow-x-auto shadow-2xl">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1F1F23] bg-[#161619]">
                  <th className="p-3.5 text-center font-mono font-semibold text-zinc-400 w-24 border-r border-[#1F1F23] uppercase text-[10px] tracking-wider">
                    Horário
                  </th>
                  {displayedProfessionals.map((pro) => (
                    <th
                      key={pro.id}
                      className="p-3.5 text-center font-semibold text-white border-r border-[#1F1F23] last:border-r-0 min-w-[260px]"
                    >
                      <div className="font-display font-bold text-xs text-white">{pro.name}</div>
                      <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                        {pro.role}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GRID_HOURS.map((hourStr) => {
                  const isLunch = hourStr === "12:00" || hourStr === "13:00";
                  const slotDate = parseTimeOnDate(currentDate, hourStr);

                  return (
                    <tr key={hourStr} className="border-b border-[#1F1F23] last:border-b-0">
                      {/* COLUNA DE HORÁRIO */}
                      <td className="p-3 text-center font-mono font-semibold text-zinc-400 border-r border-[#1F1F23] bg-[#121214] align-middle">
                        {hourStr}
                      </td>

                      {/* COLUNAS DOS PROFISSIONAIS */}
                      {displayedProfessionals.map((pro) => {
                        // Verifica se é almoço
                        if (isLunch) {
                          return (
                            <td
                              key={pro.id}
                              className="p-4 text-center text-zinc-600 font-mono uppercase text-[10px] tracking-wider bg-[#0E0E10] border-r border-[#1F1F23] last:border-r-0 select-none"
                            >
                              Fora do expediente
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
                              className="p-2.5 border-r border-[#1F1F23] last:border-r-0 align-top"
                            >
                              <div
                                onClick={() => handleOpenAppointmentDetail(app)}
                                className={`p-3 rounded-lg border border-[#27272A] border-l-4 ${getStatusBorderClass(app.status)} bg-[#18181B] hover:bg-[#1E1E22] hover:border-[#3F3F46] shadow-md space-y-2 cursor-pointer transition-all group`}
                                title="Clique para expandir o processo completo do cliente"
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-mono font-bold text-[11px] text-zinc-200 bg-white/5 border border-white/10 px-2 py-0.5 rounded tracking-wider">
                                    {app.protocol}
                                  </span>
                                  <StatusBadge status={app.status} size="sm" />
                                </div>

                                <div>
                                  <div className="font-semibold text-xs text-white group-hover:text-amber-400 transition-colors">
                                    {app.customer.name}
                                  </div>
                                  <div className="text-[11px] text-zinc-400 font-mono">
                                    {app.intake.vehicle.make} {app.intake.vehicle.model}
                                    {app.intake.vehicle.plate
                                      ? ` (${app.intake.vehicle.plate})`
                                      : ""}
                                  </div>
                                </div>

                                <div className="text-[10px] text-zinc-400 flex items-center justify-between font-mono">
                                  <span>{svc?.short ?? app.serviceId}</span>
                                  {isLeva && (
                                    <span className="flex items-center gap-1 text-[#FF7A29] font-medium">
                                      <Truck size={11} /> Leva e Traz
                                    </span>
                                  )}
                                </div>

                                {/* BOTÕES DE AÇÃO NO CARD */}
                                <div
                                  className="flex items-center gap-1.5 pt-1.5 border-t border-[#27272A]"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <a
                                    href={whatsAppLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                                    title="Abrir WhatsApp com dados da Pré-OS"
                                  >
                                    <MessageCircle size={13} className="fill-white/20" /> WhatsApp
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() => handleCopySummary(app)}
                                    title="Copiar dados da Pré-OS"
                                    className="p-1.5 rounded border border-[#27272A] bg-[#121214] hover:bg-[#27272A] text-zinc-300 hover:text-white cursor-pointer"
                                  >
                                    <Copy size={12} />
                                  </button>

                                  {app.status !== "COMPLETED" && (
                                    <button
                                      type="button"
                                      onClick={() => handleStatusChange(app.id, "COMPLETED")}
                                      title="Concluir Atendimento"
                                      className="p-1.5 rounded border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-400 cursor-pointer"
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
                              className="p-2.5 border-r border-[#1F1F23] last:border-r-0 align-top"
                            >
                              <div className="p-3 rounded-lg border border-red-900/40 bg-red-950/20 text-red-400 text-xs text-center space-y-1">
                                <Slash size={14} className="mx-auto text-red-500" />
                                <div className="font-semibold text-[11px] font-mono uppercase tracking-wider">
                                  Período Bloqueado
                                </div>
                              </div>
                            </td>
                          );
                        }

                        // SLOT LIVRE: BOTÃO "+ Livre"
                        return (
                          <td
                            key={pro.id}
                            className="p-2.5 border-r border-[#1F1F23] last:border-r-0 align-middle text-center"
                          >
                            <button
                              type="button"
                              onClick={() => openSlotBooking(hourStr, pro.id)}
                              className="w-full py-3.5 px-4 rounded-lg border border-dashed border-zinc-800 hover:border-zinc-600 bg-transparent hover:bg-zinc-900/60 text-zinc-500 hover:text-zinc-200 text-xs font-mono transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
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
          <div className="bg-[#121214] rounded-xl border border-[#1F1F23] p-4 space-y-3 shadow-2xl">
            <h3 className="font-display font-bold text-sm text-white">
              Listagem Cronológica de Atendimentos
            </h3>
            {displayedAppointments.length === 0 ? (
              <p className="text-xs text-zinc-400 py-8 text-center font-mono">
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
                      className={`p-3.5 rounded-lg border border-[#27272A] border-l-4 ${getStatusBorderClass(a.status)} bg-[#18181B] hover:border-[#3F3F46] hover:bg-[#1E1E22] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer transition-all`}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-zinc-200 bg-white/5 border border-white/10 px-2 py-0.5 rounded tracking-wider">
                            {a.protocol}
                          </span>
                          <StatusBadge status={a.status} size="sm" />
                          <span className="font-semibold text-white">{a.customer.name}</span>
                          <span className="text-zinc-400 font-mono text-[11px]">
                            ({formatPhoneBR(a.customer.phone)})
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          {formatDate(new Date(a.startTime))} às {formatTime(new Date(a.startTime))}{" "}
                          •{" "}
                          <strong className="text-zinc-300">
                            {a.intake.vehicle.make} {a.intake.vehicle.model}
                          </strong>{" "}
                          • {svc?.short}
                        </div>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleOpenAppointmentDetail(a)}
                          className="py-1 px-3 rounded-lg border border-[#27272A] bg-[#121214] hover:bg-[#27272A] text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Eye size={12} /> Ver Processo
                        </button>

                        <a
                          href={whatsApp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-3.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                          title="Abrir WhatsApp com dados da Pré-OS"
                        >
                          <MessageCircle size={13} className="fill-white/20" /> WhatsApp
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
          <div className="bg-[#121214] rounded-xl border border-[#1F1F23] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-[#FF5A00]" />
              <div>
                <h3 className="font-display font-bold text-sm text-white">
                  Roteiro de Coleta e Devolução Leva e Traz (Toledo-PR)
                </h3>
                <p className="text-xs text-zinc-400">
                  Clientes que solicitaram retirada e entrega do veículo no endereço.
                </p>
              </div>
            </div>

            {appointments.filter((a) => a.logistics.type === "leva-e-traz").length === 0 ? (
              <p className="text-xs text-zinc-400 py-8 text-center font-mono">
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
                      className="p-4 rounded-lg border border-[#27272A] bg-[#18181B] hover:border-[#3F3F46] hover:bg-[#1E1E22] space-y-2 text-xs cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#FF5A00] bg-[#FF5A00]/10 border border-[#FF5A00]/30 px-2 py-0.5 rounded tracking-wider">
                            {a.protocol}
                          </span>
                          <StatusBadge status={a.status} size="sm" />
                        </div>
                        <span className="font-semibold text-zinc-300 font-mono">
                          {formatDate(new Date(a.startTime))} às {formatTime(new Date(a.startTime))}
                        </span>
                      </div>

                      <div className="font-medium text-white">
                        Cliente: <strong>{a.customer.name}</strong> (
                        {formatPhoneBR(a.customer.phone)})
                      </div>
                      <div className="text-zinc-300">
                        Endereço de Coleta:{" "}
                        <strong className="text-white">
                          {a.logistics.address}, Bairro {a.logistics.neighborhood} (Toledo-PR)
                        </strong>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-[#27272A]">
                        <span className="text-[11px] text-zinc-400 font-mono">
                          Veículo: {a.intake.vehicle.make} {a.intake.vehicle.model}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAppointmentDetail(a);
                          }}
                          className="py-1 px-2.5 rounded bg-[#FF5A00] hover:bg-[#E04F00] text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
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
