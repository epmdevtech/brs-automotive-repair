import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  HelpCircle,
  MapPin,
  Phone,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Truck,
  User,
  Wrench,
  XCircle,
  AlertCircle,
  Instagram,
  ArrowRight,
} from "lucide-react";
import { buildRouteHead } from "@/lib/seo";
import { company } from "@/lib/brs";
import { localBookingRepository } from "@/features/booking/data/local/local-repository";
import {
  buildCustomerTrackingView,
  getEventsForAppointment,
  ensureInitialEvents,
} from "@/features/booking/domain/events";
import type { Appointment, CustomerTrackingView } from "@/features/booking/domain/types";
import { getStatusBadgeClass, getStatusLabel } from "@/features/booking/domain/status";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/acompanhar/$token")({
  component: CustomerTrackingPage,
  head: () =>
    buildRouteHead({
      title: "Acompanhamento de Reparação | BRS Reparações Automotivas",
      description:
        "Consulte em tempo real a evolução técnica do reparo do seu veículo na BRS Reparações Automotivas.",
      path: "/acompanhar",
      noindex: true,
    }),
});

function CustomerTrackingPage() {
  const { token } = Route.useParams();
  const [trackingData, setTrackingData] = useState<CustomerTrackingView | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchProtocol, setSearchProtocol] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setLoading(true);
      const list = await localBookingRepository.listAppointments();

      // Busca por token, id ou protocolo limpo
      const normalizedToken = token.trim().toLowerCase();
      const match = list.find((a) => {
        const pClean = a.protocol.replace("#", "").toLowerCase();
        return (
          a.trackingToken === token ||
          a.id === token ||
          pClean === normalizedToken ||
          a.protocol.toLowerCase() === normalizedToken
        );
      });

      if (!isMounted) return;

      if (match) {
        let events = getEventsForAppointment(match.id);
        if (events.length === 0) {
          events = ensureInitialEvents(match);
        }
        setTrackingData(buildCustomerTrackingView(match, events));
      } else {
        setTrackingData(null);
      }
      setLoading(false);
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchProtocol.trim().replace("#", "").toLowerCase();
    if (clean) {
      navigate({ to: `/acompanhar/${clean}` });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-background px-4 py-24 text-center">
        <div className="space-y-3">
          <div className="size-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-400 font-mono">
            Carregando evolução técnica do veículo...
          </p>
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-background px-4 py-24">
        <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-6 rounded-2xl text-center space-y-4 shadow-xl">
          <div className="size-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold font-display text-white tracking-tight">
              Protocolo Não Localizado
            </h1>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Não encontramos nenhum agendamento associado ao identificador{" "}
              <strong className="text-neutral-200 font-mono font-bold">"{token}"</strong> na base
              local da oficina.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-2 pt-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-3 text-neutral-500" />
              <input
                type="text"
                value={searchProtocol}
                onChange={(e) => setSearchProtocol(e.target.value)}
                placeholder="Ex: BRS-8412 ou 8412"
                className="w-full text-xs bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-primary"
              />
            </div>
            <Button type="submit" variant="primary" className="w-full text-xs">
              Buscar Outro Protocolo
            </Button>
          </form>

          <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-500">
            Dúvidas? Entre em contato pelo telefone{" "}
            <a href="tel:4520359440" className="text-primary hover:underline">
              {company.phoneDisplay}
            </a>
            .
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = trackingData.status === "COMPLETED";
  const isCancelled = trackingData.status === "CANCELLED";

  return (
    <div className="min-h-[85vh] bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* BANNER INSTITUCIONAL & PROTOCOLO */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm bg-primary/20 text-primary border border-primary/40 px-3 py-1 rounded-md">
                {trackingData.protocol}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusBadgeClass(
                  trackingData.status,
                )}`}
              >
                {getStatusLabel(trackingData.status)}
              </span>
            </div>

            <div className="text-right text-xs text-neutral-400">
              <span>Agendado para: </span>
              <strong className="text-neutral-200">{trackingData.scheduledTime}</strong>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold font-display text-white tracking-tight">
              Acompanhamento de Reparação Automotiva
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              {trackingData.serviceTitle} • Técnico Responsável:{" "}
              <strong className="text-neutral-200">{trackingData.technicianName}</strong>
            </p>
          </div>

          {/* DADOS MASCARADOS DO VEÍCULO (CONFORMIDADE LGPD) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-800 text-xs">
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                  Veículo
                </span>
                <div className="font-semibold text-white mt-0.5">{trackingData.vehicleSummary}</div>
              </div>
              <Car size={18} className="text-neutral-500" />
            </div>

            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                  Identificação do Veículo
                </span>
                <div className="font-mono font-bold text-primary mt-0.5 tracking-wider">
                  {trackingData.maskedPlate}
                </div>
              </div>
              <Shield size={18} className="text-neutral-500" />
            </div>
          </div>
        </div>

        {/* LINHA DO TEMPO PÚBLICA (ETAPAS VISÍVEIS AO CLIENTE) */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900 text-white space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              Evolução da Reparação (Ciclo Técnico BRS)
            </h2>
            <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              Atualização em Tempo Real
            </span>
          </div>

          <div className="relative pl-6 border-l-2 border-neutral-800 space-y-6">
            {trackingData.events.map((evt, idx) => {
              const isDone = evt.status === "completed";
              const isCurrent = evt.status === "current";
              const isFailed = evt.status === "cancelled";

              return (
                <div key={evt.id} className="relative group">
                  {/* PONTO NO EIXO DA TIMELINE */}
                  <div
                    className={`absolute -left-[31px] top-1 size-4 rounded-full border-2 transition-all ${
                      isFailed
                        ? "border-red-500 bg-red-600"
                        : isDone
                          ? "border-emerald-500 bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                          : isCurrent
                            ? "border-amber-400 bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                            : "border-neutral-700 bg-neutral-800"
                    }`}
                  />

                  <div
                    className={`p-4 rounded-xl border text-xs transition-all ${
                      isFailed
                        ? "border-red-900/60 bg-red-950/30 text-red-200"
                        : isDone
                          ? "border-emerald-800/40 bg-emerald-950/20 text-neutral-200"
                          : isCurrent
                            ? "border-amber-500/50 bg-amber-950/30 text-white ring-1 ring-amber-500/30"
                            : "border-neutral-800/70 bg-neutral-950/40 text-neutral-400"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span
                        className={`font-bold text-sm tracking-tight ${
                          isFailed
                            ? "text-red-400"
                            : isDone
                              ? "text-emerald-400"
                              : isCurrent
                                ? "text-amber-300"
                                : "text-neutral-400"
                        }`}
                      >
                        {evt.title}
                      </span>

                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isFailed
                            ? "bg-red-900/80 text-red-200"
                            : isDone
                              ? "bg-emerald-900/80 text-emerald-200"
                              : isCurrent
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : "bg-neutral-800 text-neutral-400"
                        }`}
                      >
                        {isFailed
                          ? "Cancelado"
                          : isDone
                            ? "Concluído"
                            : isCurrent
                              ? "Fase Atual"
                              : "Aguardando"}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed mt-1">
                      {evt.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CANAIS OFICIAIS DE ATENDIMENTO */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <div className="font-bold text-white text-sm">BRS Reparações Automotivas</div>
            <p className="text-neutral-400 text-xs mt-0.5">
              Av. Senador Attilio Fontana, 3427 • Toledo - PR
            </p>
            <p className="text-neutral-500 text-[11px] mt-0.5">
              Atendimento: Segunda a Sexta, das 08h às 18h
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="tel:4520359440"
              className="py-2 px-3.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Phone size={13} className="text-primary" /> {company.phoneDisplay}
            </a>

            <a
              href="https://instagram.com/brsreparacoes"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3.5 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-neutral-300 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Instagram size={13} /> @brsreparacoes
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
