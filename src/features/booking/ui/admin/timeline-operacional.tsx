import { useState, useEffect, useMemo, useCallback, useTransition } from "react";
import {
  Check,
  History,
  AlertTriangle,
  RotateCcw,
  Send,
  MessageSquare,
  Sparkles,
  ShieldAlert,
  Loader2,
  X,
  Clock,
  ArrowRight,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ETAPAS_OPERACIONAIS,
  ETAPA_CONFIG_MAP,
  normalizarPapel,
  rotuloPapel,
  type EtapaId,
  type Papel,
  type AcaoEtapa6,
} from "../../config/etapas.config";
import {
  estadoEtapas,
  etapaAtual,
  progresso,
  podeExecutar,
  podeDesfazer,
  podeReverter,
  podePedirAtualizacao,
  concluirEtapa,
  desfazerUltimaAcao,
  reverterEtapa,
  pedirAtualizacao,
  formatarConclusaoEtapa,
  formatarTempoRelativo,
  formatarTimestampEtapa,
  formatarDataHoraCompleta,
  getEtapaEventsForAppointment,
  ensureInitialEtapaEvents,
  type EventoEtapa,
  type EstadoEtapa,
} from "../../domain/etapas";
import { getAdminSession } from "../../domain/auth";

export interface TimelineOperacionalProps {
  agendamentoId: string;
  clienteNome?: string;
  agendamentoCreatedAt?: string;
  isCancelado?: boolean;
  className?: string;
  usuarioPapelCustom?: Papel; // Permite sobrepor papel em testes/demo
}

export function TimelineOperacional({
  agendamentoId,
  clienteNome = "Cliente",
  agendamentoCreatedAt,
  isCancelado = false,
  className = "",
  usuarioPapelCustom,
}: TimelineOperacionalProps) {
  const [, startTransition] = useTransition();

  // Sessão atual do usuário
  const session = getAdminSession();
  const papelAtivo: Papel = usuarioPapelCustom || normalizarPapel(session?.role);
  const autorNome = session?.name || "Operador Master";
  const autorId = session?.email || "operador-demo";

  // Estado local sincronizado de eventos
  const [eventos, setEventos] = useState<EventoEtapa[]>(() => {
    return ensureInitialEtapaEvents(agendamentoId, clienteNome, agendamentoCreatedAt);
  });

  // UI state
  const [observacaoTexto, setObservacaoTexto] = useState("");
  const [mostrarCampoObs, setMostrarCampoObs] = useState(false);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [dialogReversaoAberto, setDialogReversaoAberto] = useState(false);
  const [justificativaReversao, setJustificativaReversao] = useState("");
  const [isProcessando, setIsProcessando] = useState(false);
  const [mensagemConflito, setMensagemConflito] = useState<string | null>(null);
  const [anuncioAcessivel, setAnuncioAcessivel] = useState("");

  // Toast efêmero de Desfazer (10s)
  const [toastDesfazer, setToastDesfazer] = useState<{
    visivel: boolean;
    mensagem: string;
    segundosRestantes: number;
  }>({ visivel: false, mensagem: "", segundosRestantes: 10 });

  // Recarregar eventos locais e escutar canal multi-aba
  const carregarEventos = useCallback(() => {
    const atualizados = getEtapaEventsForAppointment(agendamentoId);
    if (atualizados.length === 0) {
      setEventos(ensureInitialEtapaEvents(agendamentoId, clienteNome, agendamentoCreatedAt));
    } else {
      setEventos(atualizados);
    }
  }, [agendamentoId, clienteNome, agendamentoCreatedAt]);

  useEffect(() => {
    carregarEventos();

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel("master_booking_sync");
      channel.onmessage = (msg) => {
        if (msg.data?.payload?.agendamentoId === agendamentoId) {
          startTransition(() => {
            carregarEventos();
          });
        }
      };
      return () => channel.close();
    }
  }, [agendamentoId, carregarEventos]);

  // Contagem regressiva do toast de desfazer (10s)
  useEffect(() => {
    if (!toastDesfazer.visivel) return;

    const timer = setInterval(() => {
      setToastDesfazer((prev) => {
        if (prev.segundosRestantes <= 1) {
          return { ...prev, visivel: false };
        }
        return { ...prev, segundosRestantes: prev.segundosRestantes - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [toastDesfazer.visivel]);

  // Recalcular inatividade a cada 60s
  const [, setRelogio] = useState(0);
  useEffect(() => {
    const ticker = setInterval(() => {
      setRelogio((r) => r + 1);
    }, 60_000);
    return () => clearInterval(ticker);
  }, []);

  // Derivações puras
  const estados = useMemo(() => estadoEtapas(eventos), [eventos]);
  const dadosProgresso = useMemo(() => progresso(eventos), [eventos]);
  const etapaAtualAtiva = useMemo(() => estados.find((e) => e.estado === "atual"), [estados]);

  // Permissões
  const permissaoConclusao = useMemo(() => {
    if (!etapaAtualAtiva) return { pode: false, motivo: "Todas as etapas concluídas." };
    let acaoDesejada: AcaoEtapa6 | undefined;
    if (etapaAtualAtiva.etapaId === "qualidade_entrega") {
      const acao6a = etapaAtualAtiva.acoes?.find((a) => a.acao === "aprovar_qualidade");
      acaoDesejada = acao6a?.concluida ? "registrar_entrega" : "aprovar_qualidade";
    }
    return podeExecutar(papelAtivo, etapaAtualAtiva.etapaId, acaoDesejada, eventos, autorId);
  }, [etapaAtualAtiva, papelAtivo, eventos, autorId]);

  const permissaoDesfazer = useMemo(
    () => podeDesfazer(eventos, autorId, papelAtivo),
    [eventos, autorId, papelAtivo],
  );

  const permissaoReverter = useMemo(() => podeReverter(papelAtivo, eventos), [papelAtivo, eventos]);

  const permissaoPedirAtualizacao = useMemo(
    () => podePedirAtualizacao(papelAtivo, eventos),
    [papelAtivo, eventos],
  );

  // Ações do Usuário
  const handleConcluir = (acaoCustom?: AcaoEtapa6) => {
    if (!etapaAtualAtiva || isProcessando) return;
    setIsProcessando(true);
    setMensagemConflito(null);

    let acao: AcaoEtapa6 | undefined = acaoCustom;
    if (etapaAtualAtiva.etapaId === "qualidade_entrega" && !acao) {
      const acao6a = etapaAtualAtiva.acoes?.find((a) => a.acao === "aprovar_qualidade");
      acao = acao6a?.concluida ? "registrar_entrega" : "aprovar_qualidade";
    }

    const resultado = concluirEtapa({
      agendamentoId,
      etapa: etapaAtualAtiva.etapaId,
      acao,
      etapaEsperada: etapaAtualAtiva.etapaId,
      autorId,
      autorNome,
      papel: papelAtivo,
      observacao: observacaoTexto,
    });

    setIsProcessando(false);

    if (resultado.sucesso) {
      carregarEventos();
      setObservacaoTexto("");
      setMostrarCampoObs(false);
      const msg = `Etapa ${etapaAtualAtiva.ordem} (${etapaAtualAtiva.tituloCurto}) concluída com sucesso.`;
      setAnuncioAcessivel(msg);
      setToastDesfazer({
        visivel: true,
        mensagem: msg,
        segundosRestantes: 10,
      });
    } else {
      setMensagemConflito(resultado.erro || "Falha ao concluir etapa.");
      carregarEventos(); // Sincroniza tela em caso de divergência
    }
  };

  const handleDesfazer = () => {
    if (!permissaoDesfazer.pode || isProcessando) return;
    setIsProcessando(true);
    const res = desfazerUltimaAcao(agendamentoId, autorId, autorNome, papelAtivo);
    setIsProcessando(false);
    if (res.sucesso) {
      carregarEventos();
      setToastDesfazer({ visivel: false, mensagem: "", segundosRestantes: 0 });
      setAnuncioAcessivel("Ação desfeita com sucesso.");
    } else {
      setMensagemConflito(res.erro || "Não foi possível desfazer.");
    }
  };

  const handleReverter = () => {
    if (!permissaoReverter.pode || !permissaoReverter.ultimaEtapaConcluida || isProcessando) {
      return;
    }
    if (justificativaReversao.trim().length < 10) return;

    setIsProcessando(true);
    const res = reverterEtapa({
      agendamentoId,
      etapa: permissaoReverter.ultimaEtapaConcluida.etapaId,
      justificativa: justificativaReversao,
      autorId,
      autorNome,
      papel: papelAtivo,
    });
    setIsProcessando(false);

    if (res.sucesso) {
      carregarEventos();
      setDialogReversaoAberto(false);
      setJustificativaReversao("");
      setAnuncioAcessivel(
        `Etapa ${permissaoReverter.ultimaEtapaConcluida.tituloCurto} revertida com sucesso.`,
      );
    } else {
      setMensagemConflito(res.erro || "Não foi possível reverter a etapa.");
    }
  };

  const handlePedirAtualizacao = () => {
    if (!permissaoPedirAtualizacao.pode || isProcessando) return;
    setIsProcessando(true);
    const res = pedirAtualizacao({
      agendamentoId,
      autorId,
      autorNome,
      papel: papelAtivo,
    });
    setIsProcessando(false);

    if (res.sucesso) {
      carregarEventos();
      setAnuncioAcessivel(
        `Pedido de atualização enviado à equipe técnica às ${res.horaFormatada}.`,
      );
      setToastDesfazer({
        visivel: true,
        mensagem: `Pedido de atualização enviado à equipe técnica às ${res.horaFormatada}.`,
        segundosRestantes: 5,
      });
    } else {
      setMensagemConflito(res.erro || "Falha ao solicitar atualização.");
    }
  };

  return (
    <div className={`space-y-4 font-sans ${className}`}>
      {/* Região acessível oculta para leitores de tela */}
      <div className="sr-only" role="status" aria-live="polite">
        {anuncioAcessivel}
      </div>

      {/* 1. CABEÇALHO DA LINHA DO TEMPO */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-slate-900 text-white flex items-center justify-center shadow-2xs">
              <History size={13} aria-hidden="true" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight">
              Linha do tempo operacional
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Status quantitativo rigoroso */}
            <span className="text-xs font-medium text-slate-700">
              {dadosProgresso.concluidas === 6 ? (
                <span className="text-emerald-700 font-semibold">6 de 6 · Entregue</span>
              ) : isCancelado ? (
                <span className="text-rose-700 font-semibold">Cancelado</span>
              ) : (
                <span>
                  Etapa {dadosProgresso.atual} de 6 · {dadosProgresso.concluidas}{" "}
                  {dadosProgresso.concluidas === 1 ? "concluída" : "concluídas"}
                </span>
              )}
            </span>

            {/* Botão de Histórico Completo */}
            <button
              type="button"
              onClick={() => setHistoricoAberto(true)}
              className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900"
              title="Ver histórico de auditoria e eventos"
            >
              <History size={12} className="text-slate-500" />
              <span>Ver histórico ({eventos.length})</span>
            </button>
          </div>
        </div>

        {/* Barra de progresso contínua e discreta (4px) */}
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCancelado
                ? "bg-rose-500"
                : dadosProgresso.concluidas === 6
                  ? "bg-emerald-600"
                  : "bg-slate-900"
            }`}
            style={{ width: `${dadosProgresso.porcentagem}%` }}
          />
        </div>
      </div>

      {/* Alerta de Conflito de Concorrência */}
      {mensagemConflito && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert size={15} className="text-amber-700 shrink-0" />
            <span>{mensagemConflito}</span>
          </div>
          <button
            type="button"
            onClick={() => setMensagemConflito(null)}
            className="p-1 hover:bg-amber-100 rounded text-amber-800 cursor-pointer"
            aria-label="Fechar alerta"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* 2. STEPPER RESPONSIVO (Horizontal em >=1024px, Vertical em <1024px) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
        {/* DESKTOP (>=1024px): 6 Colunas Proporcionais com Conector Alinhado */}
        <ol
          aria-label="Linha do tempo operacional"
          className="hidden lg:grid grid-cols-6 gap-3 relative"
        >
          {estados.map((item, idx) => {
            const isConcluida = item.estado === "concluida";
            const isAtual = item.estado === "atual";
            const isPendente = item.estado === "pendente";
            const dadosConclusao = formatarConclusaoEtapa(item.concluidaEm, item.concluidaPor);

            return (
              <li
                key={item.etapaId}
                aria-current={isAtual ? "step" : undefined}
                className="flex flex-col items-center text-center relative group"
              >
                {/* Linha conectora entre círculos */}
                {idx < estados.length - 1 && (
                  <div
                    aria-hidden="true"
                    className={`absolute top-5 left-[50%] w-full h-0.5 z-0 transition-colors ${
                      isConcluida && estados[idx + 1]?.estado !== "pendente"
                        ? "bg-emerald-500"
                        : "bg-slate-200"
                    }`}
                  />
                )}

                {/* Nó circular de 40px (h-10 w-10) */}
                <div
                  className={`size-10 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all select-none shadow-2xs ${
                    isCancelado
                      ? "bg-slate-100 text-slate-400 border border-slate-200"
                      : isConcluida
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-50"
                        : isAtual
                          ? "bg-slate-900 text-white ring-4 ring-slate-100 shadow-sm"
                          : "bg-white text-slate-600 border-2 border-slate-300"
                  }`}
                >
                  {isConcluida ? (
                    <Check size={18} strokeWidth={2.8} aria-hidden="true" />
                  ) : (
                    <span>{item.ordem}</span>
                  )}
                </div>

                {/* Conteúdo textual alinhado ao topo com altura reservada para 3 linhas */}
                <div className="w-full mt-2.5 space-y-1">
                  <span
                    className={`text-xs block font-semibold leading-snug min-h-[48px] flex items-center justify-center text-balance ${
                      isAtual || isConcluida ? "text-slate-900" : "text-slate-600"
                    }`}
                  >
                    {item.tituloCompleto}
                  </span>

                  {item.subtitulo && (
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      {item.subtitulo}
                    </span>
                  )}

                  {/* Estado / Horário / Autor */}
                  <div className="pt-0.5 min-h-[28px] flex flex-col items-center justify-start text-[11px]">
                    {isConcluida ? (
                      <time
                        dateTime={item.concluidaEm}
                        title={dadosConclusao.titleAcessivel}
                        className="text-emerald-700 font-medium leading-tight block truncate max-w-full"
                      >
                        {dadosConclusao.textoVisual}
                      </time>
                    ) : isAtual ? (
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-900 block leading-tight">
                          {ETAPA_CONFIG_MAP[item.etapaId].rotuloQuandoAtual}
                        </span>
                        {item.tipo === "atividade" && item.ultimaAtividadeEm && (
                          <span className="text-[10px] text-slate-500 block leading-tight font-mono">
                            {formatarTempoRelativo(item.ultimaAtividadeEm)}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-600 font-medium">Pendente</span>
                    )}
                  </div>

                  {/* Alerta de inatividade (>120min) em atividade atual */}
                  {item.precisaAlertaInatividade && (
                    <div
                      role="status"
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-[10px] font-semibold text-amber-800 animate-pulse mt-1"
                    >
                      <AlertTriangle size={10} className="text-amber-700 shrink-0" />
                      <span>
                        Sem atualização há {Math.floor((item.tempoInativoMinutos || 0) / 60)} h
                      </span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* MOBILE & TABLET (<1024px): Stepper Vertical Linear */}
        <ol
          aria-label="Linha do tempo operacional"
          className="flex lg:hidden flex-col space-y-4 relative"
        >
          {estados.map((item, idx) => {
            const isConcluida = item.estado === "concluida";
            const isAtual = item.estado === "atual";
            const isPendente = item.estado === "pendente";
            const dadosConclusao = formatarConclusaoEtapa(item.concluidaEm, item.concluidaPor);

            return (
              <li
                key={item.etapaId}
                aria-current={isAtual ? "step" : undefined}
                className="flex items-start gap-3 relative group"
              >
                {/* Linha vertical conectora */}
                {idx < estados.length - 1 && (
                  <div
                    aria-hidden="true"
                    className={`absolute top-10 left-5 w-0.5 -bottom-4 z-0 ${
                      isConcluida && estados[idx + 1]?.estado !== "pendente"
                        ? "bg-emerald-500"
                        : "bg-slate-200"
                    }`}
                  />
                )}

                {/* Círculo de 40px */}
                <div
                  className={`size-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 select-none ${
                    isCancelado
                      ? "bg-slate-100 text-slate-400 border border-slate-200"
                      : isConcluida
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-50"
                        : isAtual
                          ? "bg-slate-900 text-white ring-4 ring-slate-100 shadow-sm"
                          : "bg-white text-slate-600 border-2 border-slate-300"
                  }`}
                >
                  {isConcluida ? (
                    <Check size={18} strokeWidth={2.8} aria-hidden="true" />
                  ) : (
                    <span>{item.ordem}</span>
                  )}
                </div>

                {/* Conteúdo textual */}
                <div className="flex-1 pt-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-semibold leading-tight ${
                        isAtual || isConcluida ? "text-slate-900" : "text-slate-600"
                      }`}
                    >
                      {item.tituloCompleto}
                    </span>

                    {item.precisaAlertaInatividade && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-[10px] font-semibold text-amber-800 shrink-0">
                        <AlertTriangle size={10} />
                        <span>Sem atualização</span>
                      </span>
                    )}
                  </div>

                  {item.subtitulo && (
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {item.subtitulo}
                    </span>
                  )}

                  <div className="mt-1 flex items-center gap-2 text-xs">
                    {isConcluida ? (
                      <time
                        dateTime={item.concluidaEm}
                        title={dadosConclusao.titleAcessivel}
                        className="text-emerald-700 font-medium text-[11px]"
                      >
                        {dadosConclusao.textoVisual}
                      </time>
                    ) : isAtual ? (
                      <span className="font-semibold text-slate-900 text-[11px]">
                        {ETAPA_CONFIG_MAP[item.etapaId].rotuloQuandoAtual}
                        {item.tipo === "atividade" && item.ultimaAtividadeEm && (
                          <span className="text-slate-500 font-normal ml-1.5">
                            ({formatarTempoRelativo(item.ultimaAtividadeEm)})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-[11px]">Pendente</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* 3. PAINEL DE PRÓXIMA AÇÃO (h-12 / >=44px) */}
      {!isCancelado && dadosProgresso.concluidas < 6 && etapaAtualAtiva && (
        <div className="bg-slate-50 rounded-xl border border-slate-200/90 p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                Próxima ação: Etapa {etapaAtualAtiva.ordem}
              </span>
              <span className="text-xs text-slate-500 font-medium">·</span>
              <span className="text-xs text-slate-600 font-medium">
                {etapaAtualAtiva.tituloCurto}
              </span>
            </div>

            {/* Informação sobre permissão */}
            <p className="text-xs text-slate-600 leading-normal">
              {permissaoConclusao.pode ? (
                <span>
                  Você possui permissão como <strong>{rotuloPapel(papelAtivo)}</strong> para
                  registrar esta etapa.
                </span>
              ) : (
                <span className="text-amber-800">
                  Aguardando:{" "}
                  <strong>
                    {ETAPA_CONFIG_MAP[etapaAtualAtiva.etapaId].responsaveisConclusao
                      .map((p) => rotuloPapel(p))
                      .join(" ou ")}
                  </strong>
                  .
                </span>
              )}
            </p>

            {/* Link para expandir textarea de observação opcional */}
            {permissaoConclusao.pode && !mostrarCampoObs && (
              <button
                type="button"
                onClick={() => setMostrarCampoObs(true)}
                className="text-[11px] text-slate-600 hover:text-slate-900 underline flex items-center gap-1 cursor-pointer pt-1"
              >
                <MessageSquare size={11} />
                <span>Adicionar observação antes de concluir</span>
              </button>
            )}
          </div>

          {/* Área de Botões e Controles */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            {permissaoConclusao.pode ? (
              <>
                {/* Caso Etapa 6: Ações Sequenciais (6a e 6b) */}
                {etapaAtualAtiva.etapaId === "qualidade_entrega" ? (
                  <>
                    {!etapaAtualAtiva.acoes?.find((a) => a.acao === "aprovar_qualidade")
                      ?.concluida ? (
                      <button
                        type="button"
                        onClick={() => handleConcluir("aprovar_qualidade")}
                        disabled={isProcessando}
                        className="h-12 px-5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50"
                      >
                        {isProcessando ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <>
                            <Check size={16} strokeWidth={2.5} />
                            <span>Aprovar qualidade (6a)</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleConcluir("registrar_entrega")}
                        disabled={isProcessando}
                        className="h-12 px-5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 disabled:opacity-50"
                      >
                        {isProcessando ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <>
                            <Sparkles size={16} />
                            <span>Registrar entrega (6b)</span>
                          </>
                        )}
                      </button>
                    )}
                  </>
                ) : (
                  /* Demais Etapas: Botão Primário de 1 Clique (h-12 / >=44px) */
                  <button
                    type="button"
                    onClick={() => handleConcluir()}
                    disabled={isProcessando}
                    className="h-12 px-6 rounded-lg bg-slate-900 hover:bg-black active:scale-[0.99] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isProcessando ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Check size={16} strokeWidth={2.5} />
                        <span>Concluir etapa {etapaAtualAtiva.ordem}</span>
                      </>
                    )}
                  </button>
                )}
              </>
            ) : (
              /* Sem Permissão: Botão 'Pedir atualização' para atendimento/admin em atividade */
              permissaoPedirAtualizacao.pode && (
                <button
                  type="button"
                  onClick={handlePedirAtualizacao}
                  disabled={isProcessando}
                  className="h-12 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <Send size={14} />
                  <span>Pedir atualização</span>
                </button>
              )
            )}

            {/* Ação de Reversão / Correção (apenas atendimento/admin) */}
            {permissaoReverter.pode && (
              <button
                type="button"
                onClick={() => setDialogReversaoAberto(true)}
                className="h-12 px-3 text-xs text-slate-600 hover:text-rose-700 hover:bg-rose-50/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Corrigir ou reabrir etapa concluída anterior com justificativa"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline">Corrigir etapa anterior</span>
              </button>
            )}
          </div>

          {/* Campo de observação expandido */}
          {mostrarCampoObs && (
            <div className="w-full pt-2 border-t border-slate-200">
              <label
                htmlFor="obs-timeline"
                className="block text-[11px] font-semibold text-slate-700 mb-1"
              >
                Observação técnica ou nota de cliente (opcional)
              </label>
              <textarea
                id="obs-timeline"
                rows={2}
                value={observacaoTexto}
                onChange={(e) => setObservacaoTexto(e.target.value)}
                placeholder="Ex: Peça recebida sem avarias adicionais; cliente ciente do prazo."
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          )}
        </div>
      )}

      {/* 4. TOAST EFÊMERO DE DESFAZER (10 SEGUNDOS) */}
      {toastDesfazer.visivel && (
        <div
          role="status"
          aria-live="assertive"
          className="p-3.5 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2">
            <Check size={16} className="text-emerald-400 shrink-0" />
            <span>{toastDesfazer.mensagem}</span>
          </div>

          {permissaoDesfazer.pode && (
            <button
              type="button"
              onClick={handleDesfazer}
              disabled={isProcessando}
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
            >
              <RotateCcw size={13} />
              <span>Desfazer ({toastDesfazer.segundosRestantes}s)</span>
            </button>
          )}
        </div>
      )}

      {/* 5. SLIDE-OVER DE HISTÓRICO DE AUDITORIA COMPLETO */}
      <Dialog.Root open={historicoAberto} onOpenChange={setHistoricoAberto}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <History size={18} className="text-slate-800" />
                  <Dialog.Title className="text-sm font-bold text-slate-900">
                    Histórico operacional e auditoria
                  </Dialog.Title>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer"
                    aria-label="Fechar histórico"
                  >
                    <X size={16} />
                  </button>
                </Dialog.Close>
              </div>

              <Dialog.Description className="text-xs text-slate-500">
                Trilha append-only com todos os registros, papéis e justificativas de avanço e
                correção.
              </Dialog.Description>

              {/* Lista decrescente de eventos */}
              <div className="space-y-3 pt-2">
                {[...eventos].reverse().map((evt) => {
                  const isCorrecao = evt.tipo === "revertida" || evt.tipo === "desfeita";
                  const isPedido = evt.tipo === "pedido_atualizacao";

                  return (
                    <div
                      key={evt.id}
                      className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                        isCorrecao
                          ? "bg-rose-50/70 border-rose-200 text-rose-950"
                          : isPedido
                            ? "bg-amber-50/70 border-amber-200 text-amber-950"
                            : "bg-slate-50 border-slate-200/90 text-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold uppercase tracking-wider">
                          {evt.tipo === "concluida"
                            ? "Etapa Concluída"
                            : evt.tipo === "revertida"
                              ? "Etapa Revertida (Correção)"
                              : evt.tipo === "desfeita"
                                ? "Ação Desfeita"
                                : "Pedido de Atualização"}
                        </span>
                        <time
                          dateTime={evt.em}
                          className="font-mono text-slate-500"
                          title={formatarDataHoraCompleta(evt.em)}
                        >
                          {formatarTimestampEtapa(evt.em)}
                        </time>
                      </div>

                      <div className="font-medium text-xs">
                        {ETAPA_CONFIG_MAP[evt.etapa]?.tituloCompleto || evt.etapa}
                      </div>

                      <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                        <span>Por:</span>
                        <strong className="text-slate-900">{evt.porNome}</strong>
                        <span>({rotuloPapel(evt.papel)})</span>
                      </div>

                      {evt.justificativa && (
                        <div className="p-2 rounded bg-white/80 border border-rose-200 text-rose-900 text-xs mt-1">
                          <span className="font-semibold block text-[10px] uppercase">
                            Justificativa de correção:
                          </span>
                          <span>{evt.justificativa}</span>
                        </div>
                      )}

                      {evt.observacao && !evt.justificativa && (
                        <div className="p-2 rounded bg-white/80 border border-slate-200 text-slate-700 text-xs mt-1">
                          <span className="font-semibold block text-[10px] uppercase text-slate-500">
                            Nota:
                          </span>
                          <span>{evt.observacao}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold cursor-pointer"
                >
                  Fechar
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 6. DIALOG DE REVERSÃO / CORREÇÃO DE ETAPA */}
      <Dialog.Root open={dialogReversaoAberto} onOpenChange={setDialogReversaoAberto}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-xl border border-slate-200 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <div className="size-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                <RotateCcw size={16} />
              </div>
              <Dialog.Title className="text-sm font-bold text-slate-900">
                Corrigir e reabrir etapa
              </Dialog.Title>
            </div>

            <Dialog.Description className="text-xs text-slate-600 leading-relaxed">
              Você está reabrindo a etapa{" "}
              <strong>
                {permissaoReverter.ultimaEtapaConcluida?.tituloCompleto || "anterior"}
              </strong>
              . Por auditoria, é obrigatório registrar o motivo da correção (mínimo de 10
              caracteres).
            </Dialog.Description>

            <div className="space-y-1.5">
              <label
                htmlFor="motivo-reversao"
                className="block text-xs font-semibold text-slate-700"
              >
                Motivo da correção *
              </label>
              <textarea
                id="motivo-reversao"
                rows={3}
                value={justificativaReversao}
                onChange={(e) => setJustificativaReversao(e.target.value)}
                placeholder="Ex: Identificado novo ponto de amassado no painel traseiro após limpeza."
                className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                autoFocus
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Mínimo 10 caracteres</span>
                <span
                  className={
                    justificativaReversao.trim().length >= 10
                      ? "text-emerald-600 font-semibold"
                      : "text-rose-500 font-medium"
                  }
                >
                  {justificativaReversao.trim().length} / 10
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Cancelar
                </button>
              </Dialog.Close>

              <button
                type="button"
                onClick={handleReverter}
                disabled={justificativaReversao.trim().length < 10 || isProcessando}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {isProcessando ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <span>Reabrir etapa</span>
                )}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
