import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Copy,
  ExternalLink,
  Filter,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Truck,
  User,
  Wrench,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Appointment, AppointmentStatus } from "../../domain/types";
import { localBookingRepository } from "../../data/local/local-repository";
import { formatDate, formatTime, isSameCivilDay } from "../../domain/time";
import { formatPhoneBR } from "../../domain/phone";
import { getStatusLabel } from "../../domain/status";
import {
  DAMAGE_AREAS_LIST,
  DAMAGE_TYPES_LIST,
  buildCustomerWhatsAppLink,
  formatPreOsSummary,
} from "../../domain/intake";
import { MASTER_BOOKING_CONFIG } from "../../config/booking.config";

type TabFilter = "CONFIRMED" | "TODAY" | "LEVA_E_TRAZ" | "COMPLETED" | "ALL";

export function AdminBookingDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tabFilter, setTabFilter] = useState<TabFilter>("CONFIRMED");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = localBookingRepository.subscribe((list) => {
      setAppointments(list);
    });
    return () => unsub();
  }, []);

  const today = useMemo(() => new Date(), []);

  // Métricas para a régua superior
  const metrics = useMemo(() => {
    const confirmed = appointments.filter((a) => a.status === "CONFIRMED").length;
    const forToday = appointments.filter(
      (a) => a.status !== "CANCELLED" && isSameCivilDay(new Date(a.startTime), today),
    ).length;
    const levaETraz = appointments.filter(
      (a) => a.status === "CONFIRMED" && a.logistics.type === "leva-e-traz",
    ).length;
    const completed = appointments.filter((a) => a.status === "COMPLETED").length;
    return { confirmed, forToday, levaETraz, completed };
  }, [appointments, today]);

  // Lista filtrada
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((app) => {
        // Filtro por Aba
        if (tabFilter === "CONFIRMED" && app.status !== "CONFIRMED") return false;
        if (tabFilter === "TODAY") {
          if (app.status === "CANCELLED") return false;
          if (!isSameCivilDay(new Date(app.startTime), today)) return false;
        }
        if (tabFilter === "LEVA_E_TRAZ") {
          if (app.logistics.type !== "leva-e-traz" || app.status === "CANCELLED") return false;
        }
        if (tabFilter === "COMPLETED" && app.status !== "COMPLETED") return false;

        // Filtro por Texto de Busca
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = app.customer.name.toLowerCase().includes(q);
          const matchProtocol = app.protocol.toLowerCase().includes(q);
          const matchPhone = app.customer.phone.includes(q);
          const matchCar =
            app.intake.vehicle.model.toLowerCase().includes(q) ||
            app.intake.vehicle.make.toLowerCase().includes(q) ||
            (app.intake.vehicle.plate?.toLowerCase().includes(q) ?? false);
          return matchName || matchProtocol || matchCar || matchPhone;
        }
        return true;
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [appointments, tabFilter, search, today]);

  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    const res = await localBookingRepository.updateStatus(id, newStatus);
    if (!res.ok) {
      alert(res.error);
    }
  };

  const handleCopySummary = async (app: Appointment) => {
    const svc = MASTER_BOOKING_CONFIG.services.find((s) => s.id === app.serviceId);
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

  return (
    <div className="space-y-6 p-4 md:p-6 bg-card border border-border rounded-xl text-foreground">
      {/* CABEÇALHO DA AGENDA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-primary">
            Agenda Oficial & Pré-OS da Oficina
          </span>
          <h2 className="text-xl md:text-2xl font-display font-semibold text-foreground tracking-tight">
            Painel de Agendamentos Master
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Horários auto-confirmados pelos clientes com detalhes técnicos do veículo e contato
            direto via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded bg-primary/10 text-primary border border-primary/20 font-mono font-medium">
            {metrics.confirmed} Agendamento{metrics.confirmed === 1 ? "" : "s"} Ativo
            {metrics.confirmed === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* CARDS DE RESUMO OPERACIONAL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          onClick={() => setTabFilter("CONFIRMED")}
          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
            tabFilter === "CONFIRMED"
              ? "bg-primary/15 border-primary shadow-sm"
              : "bg-secondary/30 border-border hover:border-foreground/30"
          }`}
        >
          <div className="text-[11px] font-mono uppercase text-muted-foreground mb-1">
            Confirmados (Agenda)
          </div>
          <div className="text-2xl font-display font-bold text-foreground">{metrics.confirmed}</div>
        </div>

        <div
          onClick={() => setTabFilter("TODAY")}
          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
            tabFilter === "TODAY"
              ? "bg-primary/15 border-primary shadow-sm"
              : "bg-secondary/30 border-border hover:border-foreground/30"
          }`}
        >
          <div className="text-[11px] font-mono uppercase text-muted-foreground mb-1 flex items-center gap-1">
            <Clock size={12} className="text-primary" /> Atendimentos Hoje
          </div>
          <div className="text-2xl font-display font-bold text-foreground">{metrics.forToday}</div>
        </div>

        <div
          onClick={() => setTabFilter("LEVA_E_TRAZ")}
          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
            tabFilter === "LEVA_E_TRAZ"
              ? "bg-primary/15 border-primary shadow-sm"
              : "bg-secondary/30 border-border hover:border-foreground/30"
          }`}
        >
          <div className="text-[11px] font-mono uppercase text-muted-foreground mb-1 flex items-center gap-1">
            <Truck size={12} className="text-primary" /> Remoção com Guincho
          </div>
          <div className="text-2xl font-display font-bold text-foreground">{metrics.levaETraz}</div>
        </div>

        <div
          onClick={() => setTabFilter("COMPLETED")}
          className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
            tabFilter === "COMPLETED"
              ? "bg-primary/15 border-primary shadow-sm"
              : "bg-secondary/30 border-border hover:border-foreground/30"
          }`}
        >
          <div className="text-[11px] font-mono uppercase text-muted-foreground mb-1">
            Concluídos
          </div>
          <div className="text-2xl font-display font-bold text-foreground">{metrics.completed}</div>
        </div>
      </div>

      {/* BUSCA E ABAS DE FILTRO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Buscar por cliente, telefone, protocolo (#Master-...) ou veículo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="field-input pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              ["CONFIRMED", "Confirmados"],
              ["TODAY", "Hoje"],
              ["LEVA_E_TRAZ", "Guincho"],
              ["COMPLETED", "Concluídos"],
              ["ALL", "Todos"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setTabFilter(val)}
              className={`text-xs px-3 py-1.5 rounded transition-colors ${
                tabFilter === val
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-secondary/40 text-muted-foreground border border-border hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA DE AGENDAMENTOS NA AGENDA */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg text-muted-foreground text-xs space-y-2">
          <Calendar size={28} className="mx-auto text-muted-foreground/60" />
          <p className="text-sm font-medium text-foreground">
            Nenhum agendamento encontrado nesta visão.
          </p>
          <p className="text-[11px] max-w-sm mx-auto">
            Quando um cliente finalizar o agendamento em /contato, ele aparecerá automaticamente
            aqui como Confirmado.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => {
            const svc = MASTER_BOOKING_CONFIG.services.find((s) => s.id === app.serviceId);
            const isLeva = app.logistics.type === "leva-e-traz";
            const scheduledDate = new Date(app.startTime);
            const isToday = isSameCivilDay(scheduledDate, today);

            const damageTypeLabel =
              DAMAGE_TYPES_LIST.find((t) => t.id === app.intake.damageType)?.label ??
              app.intake.damageType;

            const whatsAppLink = buildCustomerWhatsAppLink({
              protocol: app.protocol,
              customer: app.customer,
              intake: app.intake,
              serviceTitle: svc?.title ?? app.serviceId,
              scheduledTime: `${formatDate(scheduledDate)} às ${formatTime(scheduledDate)}`,
              logistics: app.logistics,
            });

            return (
              <div
                key={app.id}
                className="p-5 rounded-xl border border-border bg-secondary/20 hover:border-primary/40 transition-all space-y-4"
              >
                {/* TOPO DO CARD: PROTOCOLO, HORÁRIO E STATUS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-sm text-primary px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                      {app.protocol}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        app.status === "CONFIRMED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : app.status === "COMPLETED"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}
                    >
                      {getStatusLabel(app.status)}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                        Atendimento Hoje
                      </span>
                    )}
                    {isLeva && (
                      <span className="text-[10px] flex items-center gap-1 text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20">
                        <Truck size={12} /> Guincho em Toledo
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                    <Clock size={14} className="text-primary" />
                    <span>
                      {formatDate(scheduledDate)} às {formatTime(scheduledDate)}
                    </span>
                    <span className="text-muted-foreground font-normal">
                      ({svc?.durationMinutes ?? 45} min)
                    </span>
                  </div>
                </div>

                {/* CORPO DO CARD: DADOS DO CLIENTE & VEÍCULO (PRÉ-OS) */}
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  {/* DADOS DO CLIENTE E CONTATO */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-card/60 border border-border/60">
                    <div className="text-[11px] font-mono uppercase text-muted-foreground">
                      Dados do Cliente
                    </div>
                    <div className="text-sm font-semibold text-foreground">{app.customer.name}</div>
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Phone size={13} className="text-primary" />
                      <a
                        href={`tel:${app.customer.phone}`}
                        className="hover:text-primary transition-colors font-mono"
                      >
                        {formatPhoneBR(app.customer.phone)}
                      </a>
                    </div>
                    {app.intake.isInsurance && (
                      <div className="text-[11px] text-amber-400 font-medium">
                        • Atendimento vinculado a Sinistro / Seguradora
                      </div>
                    )}
                  </div>

                  {/* DADOS TÉCNICOS DO VEÍCULO */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-card/60 border border-border/60">
                    <div className="text-[11px] font-mono uppercase text-muted-foreground flex items-center justify-between">
                      <span>Veículo & Pré-OS</span>
                      <span className="text-primary font-medium">{svc?.short}</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {app.intake.vehicle.make} {app.intake.vehicle.model}{" "}
                      {app.intake.vehicle.year ? `(${app.intake.vehicle.year})` : ""}
                    </div>
                    <div className="text-muted-foreground flex flex-wrap gap-2 text-[11px]">
                      {app.intake.vehicle.plate && (
                        <span>
                          Placa:{" "}
                          <strong className="text-foreground">
                            {app.intake.vehicle.plate.toUpperCase()}
                          </strong>
                        </span>
                      )}
                      {app.intake.vehicle.color && <span>Cor: {app.intake.vehicle.color}</span>}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Avaria: <strong className="text-foreground">{damageTypeLabel}</strong>
                    </div>
                  </div>
                </div>

                {/* PEÇAS AFETADAS */}
                {app.intake.affectedAreas.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                      Peças Avariadas Mapeadas pelo Cliente:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {app.intake.affectedAreas.map((areaId) => {
                        const item = DAMAGE_AREAS_LIST.find((a) => a.id === areaId);
                        return (
                          <span
                            key={areaId}
                            className="text-[11px] px-2 py-0.5 rounded bg-secondary/80 text-foreground border border-border"
                          >
                            {item?.label ?? areaId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* DETALHES DE LOGÍSTICA LEVA E TRAZ */}
                {isLeva && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <MapPin size={13} className="text-primary" />
                      Endereço de Coleta em Toledo-PR:
                    </div>
                    <p className="text-muted-foreground">
                      {app.logistics.address}, Bairro {app.logistics.neighborhood} (Toledo-PR)
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Condição:{" "}
                      <strong
                        className={
                          app.logistics.vehicleDrivable ? "text-emerald-400" : "text-amber-400"
                        }
                      >
                        {app.logistics.vehicleDrivable
                          ? "Veículo rodando normalmente"
                          : "Requer guincho / reboque"}
                      </strong>
                    </p>
                  </div>
                )}

                {/* BARRA DE AÇÕES: WHATSAPP DE 1 CLIQUE & CICLO DE VIDA */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* BOTÃO OFICIAL DE CONVERSAR NO WHATSAPP COM O CLIENTE */}
                    <a
                      href={whatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
                    >
                      <MessageCircle size={15} />
                      Conversar no WhatsApp com {app.customer.name.split(" ")[0]}
                      <ExternalLink size={12} className="opacity-80" />
                    </a>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopySummary(app)}
                      className="h-8 text-xs"
                    >
                      {copiedId === app.id ? (
                        <>
                          <Check size={12} className="mr-1 text-emerald-400" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy size={12} className="mr-1" /> Copiar Pré-OS
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {app.status === "CONFIRMED" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(app.id, "COMPLETED")}
                        className="h-8 text-xs hover:border-emerald-500 hover:text-emerald-400"
                      >
                        <CheckCircle size={12} className="mr-1 text-emerald-400" /> Concluir
                        Atendimento
                      </Button>
                    )}

                    {app.status !== "CANCELLED" && app.status !== "COMPLETED" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStatusChange(app.id, "CANCELLED")}
                        className="h-8 text-xs text-destructive hover:bg-destructive/10"
                      >
                        <XCircle size={12} className="mr-1" /> Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
