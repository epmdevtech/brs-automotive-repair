import { useState, useEffect, useCallback, useId } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Facebook,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  WifiOff,
  Wrench,
} from "lucide-react";
import { buildRouteHead } from "@/lib/seo";
import { company } from "@/lib/brs";
import { localBookingRepository } from "@/features/booking/data/local/local-repository";
import { getEventsForAppointment, ensureInitialEvents } from "@/features/booking/domain/events";
import type { Appointment } from "@/features/booking/domain/types";
import {
  toPublicCustomerTrackingDto,
  CONTATO_OFICINA,
  type PublicCustomerTrackingDto,
  type PublicCustomerStepDto,
} from "@/features/booking/domain/tracking-public";

export const Route = createFileRoute("/acompanhar/$token")({
  component: CustomerTrackingPage,
  head: () => {
    const baseHead = buildRouteHead({
      title: "Acompanhamento do Reparo | Master Chapeação e Pinturas",
      description:
        "Consulte em tempo real a evolução técnica do reparo do seu veículo na Master Chapeação e Pinturas.",
      path: "/acompanhar",
      noindex: true,
    });

    return {
      ...baseHead,
      meta: [...(baseHead.meta || []), { name: "referrer", content: "no-referrer" }],
    };
  },
});

function CustomerTrackingPage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();

  const [trackingData, setTrackingData] = useState<PublicCustomerTrackingDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );
  const [searchProtocol, setSearchProtocol] = useState("");
  const [copiedProtocol, setCopiedProtocol] = useState(false);
  const [expandedCompleted, setExpandedCompleted] = useState(false);

  // Monitorar conectividade de rede
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadData = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const list = await localBookingRepository.listAppointments();
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

        if (match) {
          let events = getEventsForAppointment(match.id);
          if (events.length === 0) {
            events = ensureInitialEvents(match);
          }
          setTrackingData(toPublicCustomerTrackingDto(match, events));
        } else {
          setTrackingData(null);
        }
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [token],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Copiar protocolo para a área de transferência
  const handleCopyProtocol = async () => {
    if (!trackingData) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(trackingData.protocol);
      }
      setCopiedProtocol(true);
      setTimeout(() => setCopiedProtocol(false), 2500);
    } catch {
      // Fallback gracioso
      setCopiedProtocol(true);
      setTimeout(() => setCopiedProtocol(false), 2000);
    }
  };

  const handleSearchAnother = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchProtocol.trim().replace("#", "").toLowerCase();
    if (clean) {
      navigate({ to: `/acompanhar/${clean}` });
    }
  };

  const scrollToCurrentStep = () => {
    const el = document.getElementById("etapa-atual");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // 1. Estado: Carregando (Skeleton)
  if (loading) {
    return <TrackingSkeleton />;
  }

  // 2. Estado: Protocolo não encontrado
  if (!trackingData) {
    return (
      <TrackingNotFound
        token={token}
        searchProtocol={searchProtocol}
        onSearchChange={setSearchProtocol}
        onSearchSubmit={handleSearchAnother}
      />
    );
  }

  const isCancelled = trackingData.statusGeral === "cancelado";
  const isCompleted = trackingData.statusGeral === "concluido";

  return (
    <div className="min-h-screen bg-[#0B0D10] text-neutral-200 antialiased selection:bg-[#D4AF37]/30 selection:text-white">
      {/* CABEÇALHO ENXUTO DEDICADO NO FLUXO (NÃO FLUTUANTE) */}
      <header className="sticky top-0 z-30 w-full h-14 sm:h-16 bg-[#0B0D10]/95 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg p-1"
            title="Master Chapeação e Pinturas - Ir para início"
          >
            <div className="size-8 sm:size-9 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#A68322] flex items-center justify-center font-bold font-display text-neutral-950 text-base shadow-sm">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-white text-sm sm:text-base tracking-tight leading-tight group-hover:text-[#D4AF37] transition-colors">
                Master Chapeação
              </span>
              <span className="text-[10px] text-neutral-400 font-medium tracking-wide">
                Canal do cliente
              </span>
            </div>
          </Link>

          {/* AÇÃO RÁPIDA DESKTOP */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={CONTATO_OFICINA.construirLinkWhatsApp(trackingData.protocol)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60 text-xs font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <MessageCircle size={14} className="text-emerald-400" />
              <span>Falar com a oficina</span>
            </a>
            <a
              href={CONTATO_OFICINA.telefoneHref}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <Phone size={13} className="text-[#D4AF37]" />
              <span>{CONTATO_OFICINA.telefoneFormatado}</span>
            </a>
          </div>
        </div>
      </header>

      {/* BANNER OFFLINE QUANDO A CONEXÃO CAIR */}
      {isOffline && (
        <aside
          role="status"
          aria-live="polite"
          className="bg-amber-950/80 border-b border-amber-800/80 px-4 py-2.5 text-amber-200 text-xs flex items-center justify-center gap-2"
        >
          <WifiOff size={15} className="shrink-0 text-amber-400" />
          <span>Você está sem internet. Mostrando os últimos dados salvos.</span>
          <button
            type="button"
            onClick={() => loadData(true)}
            className="underline hover:text-white font-semibold ml-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400 rounded px-1"
          >
            Tentar reconectar
          </button>
        </aside>
      )}

      {/* CONTAINER PRINCIPAL (RESERVANDO ESPAÇO PARA A BARRA INFERIOR MOBILE) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28 sm:pb-16">
        <div className="lg:grid lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-8 items-start space-y-6 lg:space-y-0">
          {/* COLUNA ESQUERDA (STICKY NO DESKTOP): HERO DE STATUS + VEÍCULO + CONTATOS */}
          <div className="lg:sticky lg:top-24 space-y-5">
            {/* 1. HERO DE STATUS (CABIMENTO PERFEITO ACIMA DA DOBRA EM 360×640) */}
            <section
              aria-label="Resumo do status atual"
              className="p-5 sm:p-6 rounded-2xl border border-neutral-800 bg-[#13161B] text-white space-y-4 shadow-xl"
            >
              {/* TOPO DO HERO: PROTOCOLO + BOTÃO COPIAR */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                    Protocolo
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyProtocol}
                    aria-label={`Copiar protocolo ${trackingData.protocol}`}
                    className="inline-flex items-center gap-1.5 font-mono font-bold text-xs bg-neutral-900 hover:bg-neutral-800 text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] px-2.5 py-1 rounded-md transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                  >
                    <span>{trackingData.protocol}</span>
                    {copiedProtocol ? (
                      <Check size={13} className="text-emerald-400" />
                    ) : (
                      <Copy size={13} className="text-neutral-400" />
                    )}
                  </button>
                  <span aria-live="polite" className="sr-only">
                    {copiedProtocol ? "Protocolo copiado para a área de transferência" : ""}
                  </span>
                </div>

                {/* STATUS GERAL BADGE */}
                {isCancelled ? (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-950/70 border border-rose-800/70 text-rose-300">
                    Cancelado
                  </span>
                ) : isCompleted ? (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800/70 text-emerald-300">
                    Concluído
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-800/70 text-amber-300">
                    Em andamento
                  </span>
                )}
              </div>

              {/* TÍTULOS H1 E H2 */}
              <div className="space-y-1">
                <h1 className="text-xs uppercase tracking-widest font-semibold text-neutral-400">
                  Acompanhamento do reparo
                </h1>
                <h2 className="text-lg sm:text-xl font-bold font-display text-white tracking-tight">
                  {isCancelled
                    ? "Atendimento cancelado"
                    : isCompleted
                      ? "Reparo concluído com sucesso"
                      : trackingData.etapaAtualTitulo}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pt-0.5">
                  {isCancelled
                    ? "Este atendimento foi encerrado. Entre em contato com nossa equipe caso tenha dúvidas."
                    : isCompleted
                      ? "Seu veículo passou por todas as etapas técnicas de reparação e controle de qualidade."
                      : "Acompanhe em tempo real a evolução técnica do serviço automotivo."}
                </p>
              </div>

              {/* BARRA DE PROGRESSO EM 6 SEGMENTOS */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-[11px] text-neutral-400">
                  <span>
                    Etapa{" "}
                    <strong className="text-white font-semibold">
                      {isCancelled ? 0 : isCompleted ? 6 : trackingData.etapaAtualOrdem}
                    </strong>{" "}
                    de 6
                  </span>
                  <span className="font-mono text-neutral-300">
                    {isCancelled ? "0%" : `${trackingData.porcentagemProgresso}%`}
                  </span>
                </div>

                {/* PROGRESSBAR SEMÂNTICA */}
                <div
                  role="progressbar"
                  aria-valuenow={isCancelled ? 0 : isCompleted ? 6 : trackingData.etapaAtualOrdem}
                  aria-valuemin={1}
                  aria-valuemax={6}
                  aria-valuetext={`Etapa ${trackingData.etapaAtualOrdem} de 6: ${trackingData.etapaAtualTitulo}`}
                  className="grid grid-cols-6 gap-1.5 h-2"
                >
                  {[1, 2, 3, 4, 5, 6].map((stepNum) => {
                    const isDone =
                      !isCancelled && (isCompleted || stepNum <= trackingData.etapasConcluidasQtd);
                    const isCurrent =
                      !isCancelled && !isCompleted && stepNum === trackingData.etapaAtualOrdem;

                    return (
                      <div
                        key={stepNum}
                        className={`h-full rounded-sm transition-all duration-300 ${
                          isDone
                            ? "bg-emerald-500"
                            : isCurrent
                              ? "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                              : "bg-neutral-800"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* SINCRONIZAÇÃO E BOTÃO ÂNCORA */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[11px] text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-neutral-500" />
                  <span>{trackingData.ultimaAtualizacaoRelativa}</span>
                  <button
                    type="button"
                    onClick={() => loadData(true)}
                    disabled={isRefreshing}
                    title="Atualizar dados agora"
                    aria-label="Atualizar dados agora"
                    className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                  >
                    <RefreshCw
                      size={12}
                      className={isRefreshing ? "animate-spin text-[#D4AF37]" : ""}
                    />
                  </button>
                </div>

                {!isCancelled && !isCompleted && (
                  <button
                    type="button"
                    onClick={scrollToCurrentStep}
                    className="inline-flex items-center gap-1 text-[11px] text-[#D4AF37] hover:underline font-semibold focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded"
                  >
                    <span>Ver etapa atual</span>
                    <ArrowRight size={11} />
                  </button>
                )}
              </div>
            </section>

            {/* 2. CARD DO VEÍCULO E DADOS DO REPARO */}
            <section
              aria-label="Identificação do veículo e serviço"
              className="p-5 sm:p-6 rounded-2xl border border-neutral-800 bg-[#13161B] text-white space-y-4 shadow-xl"
            >
              <h3 className="text-xs uppercase tracking-wider font-semibold text-neutral-400 flex items-center gap-2">
                <Car size={15} className="text-[#D4AF37]" />
                <span>Dados do veículo</span>
              </h3>

              <div className="space-y-3 text-xs">
                {/* VEÍCULO */}
                <div className="p-3 rounded-xl bg-[#0B0D10] border border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Modelo do veículo
                    </span>
                    <strong className="text-sm font-semibold text-white mt-0.5 block">
                      {trackingData.veiculoResumo}
                    </strong>
                  </div>
                  <Car size={18} className="text-neutral-500 shrink-0" />
                </div>

                {/* PLACA MASCARADA (CONFORMIDADE LGPD) */}
                <div className="p-3 rounded-xl bg-[#0B0D10] border border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Placa identificada
                    </span>
                    <strong className="text-sm font-mono font-bold text-[#D4AF37] mt-0.5 tracking-wider block">
                      {trackingData.placaMascarada}
                    </strong>
                  </div>
                  <Shield size={18} className="text-neutral-500 shrink-0" />
                </div>

                {/* SERVIÇO */}
                <div className="p-3 rounded-xl bg-[#0B0D10] border border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Serviço técnico
                    </span>
                    <span className="text-xs font-medium text-neutral-200 mt-0.5 block">
                      {trackingData.servicoTitulo}
                    </span>
                  </div>
                  <Wrench size={18} className="text-neutral-500 shrink-0" />
                </div>

                {/* TÉCNICO RESPONSÁVEL (SE DISPONÍVEL NOME PESSOAL) */}
                {trackingData.tecnicoPrimeiroNome && (
                  <div className="px-3 py-2 text-[11px] text-neutral-400 flex items-center justify-between">
                    <span>Técnico responsável:</span>
                    <strong className="text-neutral-200">{trackingData.tecnicoPrimeiroNome}</strong>
                  </div>
                )}

                {/* PREVISÃO DE ENTREGA (SOMENTE SE INFORMADA FORMALMENTE) */}
                {trackingData.previsaoEntrega && (
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 flex items-center gap-2.5">
                    <Calendar size={16} className="text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-amber-300 uppercase tracking-wider block font-semibold">
                        Previsão de entrega
                      </span>
                      <strong className="text-xs text-white">{trackingData.previsaoEntrega}</strong>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 3. INFORMAÇÕES DA OFICINA (LOCALIZAÇÃO & HORÁRIOS) */}
            <section
              aria-label="Canais e endereço da oficina"
              className="p-5 rounded-2xl border border-neutral-800 bg-[#13161B]/60 text-white space-y-3 text-xs"
            >
              <div className="font-semibold text-white text-sm">Master Chapeação e Pinturas</div>
              <div className="space-y-1 text-neutral-400 text-xs">
                <p className="flex items-start gap-1.5">
                  <MapPin size={13} className="text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{company.address.full}</span>
                </p>
                <p className="flex items-center gap-1.5 pl-4 text-[11px] text-neutral-400">
                  {company.openingHours}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 flex items-center gap-2">
                <a
                  href={company.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors"
                >
                  <Instagram size={13} />
                  <span>{company.instagram.handle}</span>
                </a>
                <a
                  href={company.social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors"
                >
                  <Facebook size={13} />
                  <span>Facebook</span>
                </a>
              </div>
            </section>
          </div>

          {/* COLUNA DIREITA: LINHA DO TEMPO PÚBLICA (ETAPAS OPERACIONAIS) */}
          <div className="space-y-6">
            <section
              id="timeline"
              aria-label="Linha do tempo da reparação"
              className="p-5 sm:p-7 rounded-2xl border border-neutral-800 bg-[#13161B] text-white space-y-6 shadow-xl"
            >
              {/* CABEÇALHO DA TIMELINE */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                    <Sparkles size={16} className="text-[#D4AF37]" />
                    <span>Evolução da reparação</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Ciclo de 6 etapas técnicas com rigor de fábrica.
                  </p>
                </div>

                {/* BOTÃO PARA COMPACTAR / EXPANDIR CONCLUÍDAS NO MOBILE */}
                {trackingData.etapasConcluidasQtd > 1 && (
                  <button
                    type="button"
                    onClick={() => setExpandedCompleted(!expandedCompleted)}
                    className="sm:hidden text-[11px] text-[#D4AF37] hover:underline font-medium"
                  >
                    {expandedCompleted ? "Recolher etapas anteriores" : "Ver etapas anteriores"}
                  </button>
                )}
              </div>

              {/* STEPPER VERTICAL RESPONSIVO */}
              <div className="relative space-y-7 sm:space-y-8 pl-1">
                {/* LINHA CONTÍNUA CONECTOR (2PX) */}
                <div
                  aria-hidden="true"
                  className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-neutral-800"
                />

                {trackingData.etapas.map((etapa, idx) => {
                  const isDone = etapa.estado === "concluida";
                  const isCurrent = etapa.estado === "atual";
                  const isPending = etapa.estado === "pendente";
                  const isNextStep = isPending && idx === trackingData.etapasConcluidasQtd;

                  // No mobile, se colapsado, oculta etapas concluídas anteriores exceto a última antes da atual
                  const shouldHideOnMobile =
                    !expandedCompleted &&
                    isDone &&
                    trackingData.etapasConcluidasQtd > 2 &&
                    idx < trackingData.etapasConcluidasQtd - 1;

                  return (
                    <article
                      key={etapa.id}
                      id={isCurrent ? "etapa-atual" : undefined}
                      aria-current={isCurrent ? "step" : undefined}
                      className={`relative flex items-start gap-4 transition-all ${
                        shouldHideOnMobile ? "hidden sm:flex" : "flex"
                      }`}
                    >
                      {/* MARCADOR CIRCULAR (24PX) ALINHADO À PRIMEIRA LINHA DO TÍTULO (TOP-0) */}
                      <div
                        className={`relative z-10 size-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isDone
                            ? "bg-emerald-950 border-2 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                            : isCurrent
                              ? "bg-amber-950 border-2 border-amber-400 text-amber-300 ring-4 ring-amber-400/20 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                              : "bg-[#0B0D10] border-2 border-neutral-700 text-neutral-400"
                        }`}
                      >
                        {isDone ? (
                          <Check size={14} className="stroke-[2.5]" />
                        ) : (
                          <span>{etapa.ordem}</span>
                        )}
                      </div>

                      {/* CONTEÚDO DO CARD DA ETAPA */}
                      <div
                        className={`flex-1 rounded-xl p-4 sm:p-5 border text-xs transition-all ${
                          isCurrent
                            ? "bg-[#1A1F26] border-amber-500/50 ring-1 ring-amber-500/30 text-white"
                            : isDone
                              ? "bg-[#0B0D10]/80 border-emerald-900/40 text-neutral-300"
                              : "bg-[#0B0D10]/40 border-neutral-800/70 text-neutral-400"
                        }`}
                      >
                        {/* CABEÇALHO DO CARD (TÍTULO + BADGE SEM REPETIÇÃO) */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3
                            className={`font-semibold text-sm sm:text-base leading-6 tracking-tight ${
                              isCurrent
                                ? "text-amber-300 font-bold"
                                : isDone
                                  ? "text-neutral-200"
                                  : "text-neutral-400"
                            }`}
                          >
                            {etapa.titulo}
                          </h3>

                          {/* BADGES COM SEMÂNTICA LIMPA (SEM "AGUARDANDO" REPETIDO 4X) */}
                          {isDone ? (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-300">
                              {etapa.concluidaEmFormatado
                                ? `Concluído · ${etapa.concluidaEmFormatado}`
                                : "Concluído"}
                            </span>
                          ) : isCurrent ? (
                            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                              Fase atual
                            </span>
                          ) : isNextStep ? (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">
                              Próxima etapa
                            </span>
                          ) : null}
                        </div>

                        {/* SUBTÍTULO TÉCNICO SE PRESENTE */}
                        {etapa.subtitulo && (
                          <div className="text-[11px] text-neutral-400 font-medium mt-0.5">
                            {etapa.subtitulo}
                          </div>
                        )}

                        {/* DESCRIÇÃO EM SENTENCE CASE E VOCABULÁRIO ACOLHEDOR */}
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mt-2">
                          {etapa.descricaoPublica}
                        </p>

                        {/* AÇÃO CONTEXTUAL ESPECIAL: ETAPA DE APROVAÇÃO DE ORÇAMENTO */}
                        {etapa.requerAcaoCliente && (
                          <div className="mt-4 p-3.5 sm:p-4 rounded-lg bg-emerald-950/30 border border-emerald-700/50 space-y-3">
                            <div className="flex items-start gap-2.5">
                              <MessageCircle
                                size={18}
                                className="text-emerald-400 shrink-0 mt-0.5"
                              />
                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                  Autorização necessária
                                </h4>
                                <p className="text-xs text-neutral-300 leading-relaxed">
                                  Nosso consultor técnico já preparou a estimativa detalhada de
                                  peças e insumos. Fale diretamente conosco pelo WhatsApp para
                                  aprovar e liberar a execução imediata.
                                </p>
                              </div>
                            </div>

                            <a
                              href={CONTATO_OFICINA.construirLinkWhatsAppAprovacao(
                                trackingData.protocolo,
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-400"
                            >
                              <MessageCircle size={15} />
                              <span>Aprovar orçamento pelo WhatsApp</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* RODA-PÉ DA TIMELINE: INSTRUÇÃO DE CONTATO */}
              <div className="pt-4 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Dúvidas sobre o processo?</span>
                <a
                  href={CONTATO_OFICINA.construirLinkWhatsApp(trackingData.protocol)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:underline font-semibold"
                >
                  Falar com o consultor técnico
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* BARRA INFERIOR FIXA MOBILE (< sm) */}
      <nav
        aria-label="Ações de contato rápido"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#13161B]/95 backdrop-blur-md border-t border-neutral-800 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center gap-2 shadow-2xl"
      >
        <a
          href={CONTATO_OFICINA.construirLinkWhatsApp(trackingData.protocol)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <MessageCircle size={16} />
          <span>Falar no WhatsApp</span>
        </a>

        <a
          href={CONTATO_OFICINA.telefoneHref}
          className="min-h-[44px] px-4 flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 border border-neutral-700 active:bg-neutral-800 text-neutral-200 text-xs font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          title="Ligar para a Master"
          aria-label="Ligar para a oficina"
        >
          <Phone size={15} className="text-[#D4AF37]" />
          <span>Ligar</span>
        </a>
      </nav>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SUBCOMPONENTES AUXILIARES: SKELETON LOADING & PROTOCOLO NÃO ENCONTRADO
// ---------------------------------------------------------------------------

function TrackingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0B0D10] text-neutral-400 antialiased">
      {/* HEADER SKELETON */}
      <div className="w-full h-14 sm:h-16 border-b border-neutral-800/80 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-neutral-800 animate-pulse" />
          <div className="h-4 w-32 bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="hidden sm:block h-8 w-28 bg-neutral-800 rounded-lg animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="lg:grid lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-8 space-y-6 lg:space-y-0">
          <div className="space-y-4">
            <div className="h-56 rounded-2xl bg-[#13161B] border border-neutral-800 p-6 animate-pulse space-y-4">
              <div className="h-4 w-24 bg-neutral-800 rounded" />
              <div className="h-7 w-48 bg-neutral-800 rounded" />
              <div className="h-4 w-full bg-neutral-800 rounded" />
              <div className="h-3 w-full bg-neutral-800 rounded" />
            </div>
            <div className="h-44 rounded-2xl bg-[#13161B] border border-neutral-800 p-6 animate-pulse space-y-3">
              <div className="h-4 w-32 bg-neutral-800 rounded" />
              <div className="h-8 w-full bg-neutral-800 rounded" />
              <div className="h-8 w-full bg-neutral-800 rounded" />
            </div>
          </div>

          <div className="h-96 rounded-2xl bg-[#13161B] border border-neutral-800 p-7 animate-pulse space-y-6">
            <div className="h-5 w-40 bg-neutral-800 rounded" />
            <div className="space-y-4">
              <div className="h-16 w-full bg-neutral-800/60 rounded-xl" />
              <div className="h-16 w-full bg-neutral-800/60 rounded-xl" />
              <div className="h-16 w-full bg-neutral-800/60 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TrackingNotFoundProps {
  token: string;
  searchProtocol: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

function TrackingNotFound({
  token,
  searchProtocol,
  onSearchChange,
  onSearchSubmit,
}: TrackingNotFoundProps) {
  return (
    <div className="min-h-screen bg-[#0B0D10] text-neutral-200 flex flex-col justify-between">
      {/* HEADER DISCRETO */}
      <header className="w-full h-14 sm:h-16 border-b border-neutral-800/80 px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#A68322] flex items-center justify-center font-bold text-neutral-950 text-sm">
            B
          </div>
          <span className="font-display font-bold text-white text-sm">Master Chapeação</span>
        </Link>
        <a
          href={CONTATO_OFICINA.telefoneHref}
          className="text-xs text-neutral-400 hover:text-white"
        >
          {CONTATO_OFICINA.telefoneFormatado}
        </a>
      </header>

      {/* CARD CENTRAL */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-[#13161B] border border-neutral-800 p-6 sm:p-8 rounded-2xl text-center space-y-5 shadow-2xl">
          <div className="size-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
            <AlertCircle size={24} />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-bold font-display text-white tracking-tight">
              Protocolo não localizado
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Não encontramos nenhum agendamento associado ao identificador{" "}
              <strong className="text-neutral-200 font-mono">"{token}"</strong> na base local da
              oficina.
            </p>
          </div>

          <form onSubmit={onSearchSubmit} className="space-y-2.5 pt-2">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-3 text-neutral-500" />
              <input
                type="text"
                value={searchProtocol}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Digite seu protocolo (ex: Master-7391)"
                className="w-full text-xs bg-[#0B0D10] border border-neutral-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-[#D4AF37]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#C29E2F] text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Consultar outro protocolo</span>
              <ArrowRight size={13} />
            </button>
          </form>

          <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 space-y-1">
            <p>Precisa de assistência com o seu veículo?</p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <a
                href={CONTATO_OFICINA.telefoneHref}
                className="text-[#D4AF37] hover:underline font-semibold"
              >
                {CONTATO_OFICINA.telefoneFormatado}
              </a>
              <span className="text-neutral-600">•</span>
              <a
                href={company.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white"
              >
                Instagram
              </a>
              <span className="text-neutral-600">•</span>
              <a
                href={company.social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 border-t border-neutral-900 text-center text-[10px] text-neutral-400">
        © 2026 Master Chapeação e Pinturas • Toledo - PR
      </footer>
    </div>
  );
}
