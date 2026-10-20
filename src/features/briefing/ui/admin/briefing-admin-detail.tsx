import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Download, FileText, MessageSquare, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BRIEFING_STEPS } from "../../domain/steps";
import { BRIEFING_STATUS_LABELS, type BriefingStatus } from "../../domain/status";
import {
  addBriefingInternalNote,
  changeAdminBriefingStatus,
  createBriefingFileUrl,
  loadAdminBriefing,
  requestBriefingComplement,
} from "../../server/functions";
import type { BriefingDetail } from "../../server/briefing-service";

interface BriefingAdminDetailProps {
  briefingId: string;
}

export function BriefingAdminDetail({ briefingId }: BriefingAdminDetailProps) {
  const [detail, setDetail] = useState<BriefingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [complementMessage, setComplementMessage] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    const result = await loadAdminBriefing({ data: { briefingId } });

    if (!result.ok) {
      setErrorMessage(result.error.message);
      setLoading(false);
      return;
    }

    setDetail(result.data);
    setLoading(false);
  }, [briefingId]);

  useEffect(() => {
    void load();
  }, [load]);

  const pendingBySection = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const section of Object.entries(detail?.sections ?? {})) {
      const items = Object.entries(section[1].pending)
        .filter(([, value]) => value)
        .map(([fieldId]) => fieldId);
      if (items.length > 0) map[section[0]] = items;
    }
    return map;
  }, [detail]);

  async function handleStatusChange(to: BriefingStatus) {
    setBusy(true);
    setActionMessage(null);

    const result = await changeAdminBriefingStatus({
      data: { briefingId, to, clientMessage: null },
    });

    setBusy(false);

    if (!result.ok) {
      setActionMessage(result.error.message);
      return;
    }

    setActionMessage(`Situação atualizada para ${BRIEFING_STATUS_LABELS[to]}.`);
    await load();
  }

  async function handleRequestComplement() {
    setBusy(true);
    setActionMessage(null);

    const result = await requestBriefingComplement({
      data: { briefingId, message: complementMessage },
    });

    setBusy(false);

    if (!result.ok) {
      setActionMessage(result.error.message);
      return;
    }

    setComplementMessage("");
    setActionMessage("Complementação solicitada ao cliente.");
    await load();
  }

  async function handleAddNote() {
    setBusy(true);
    setActionMessage(null);

    const result = await addBriefingInternalNote({
      data: { briefingId, note: internalNote },
    });

    setBusy(false);

    if (!result.ok) {
      setActionMessage(result.error.message);
      return;
    }

    setInternalNote("");
    setActionMessage("Nota interna registrada.");
    await load();
  }

  async function handleDownload(fileId: string) {
    setActionMessage(null);

    const result = await createBriefingFileUrl({ data: { fileId } });

    if (!result.ok) {
      setActionMessage(result.error.message);
      return;
    }

    window.open(result.data.url, "_blank", "noopener,noreferrer");
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-sm text-neutral-500">Carregando briefing…</p>
      </div>
    );
  }

  if (errorMessage || !detail) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <div role="alert" className="border border-red-400/30 bg-red-400/5 p-5">
          <h1 className="flex items-center gap-2 font-display text-xl font-semibold text-white">
            <ShieldAlert className="size-5 text-red-300" aria-hidden="true" />
            Briefing indisponível
          </h1>
          <p className="mt-3 text-sm text-neutral-300">{errorMessage}</p>
          <Link
            to="/admin/briefings"
            className="mt-4 inline-block text-sm text-[var(--brand-text-accent)] underline-offset-4 hover:underline"
          >
            Voltar à lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <Link
        to="/admin/briefings"
        className="inline-flex items-center gap-1.5 pt-6 text-xs text-neutral-500 transition-colors hover:text-white"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Voltar à lista
      </Link>

      <header className="mt-4 border-b border-white/10 pb-5">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--brand-text-accent)]">
          Briefing {detail.briefing.id.slice(0, 8)}
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
          {detail.briefing.companyName || "Empresa não informada"}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Situação: {BRIEFING_STATUS_LABELS[detail.briefing.status]} · atualizado em{" "}
          {new Date(detail.briefing.updatedAt).toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
        {detail.briefing.clientMessage ? (
          <p className="mt-3 border border-amber-300/30 bg-amber-300/5 p-3 text-sm text-amber-100">
            Complementação solicitada: {detail.briefing.clientMessage}
          </p>
        ) : null}
      </header>

      {actionMessage ? (
        <p
          role="status"
          className="mt-4 border border-white/10 bg-white/5 p-3 text-sm text-neutral-200"
        >
          {actionMessage}
        </p>
      ) : null}

      <section className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="border border-white/10 bg-white/[0.02] p-4">
          <h2 className="font-display text-lg font-semibold text-white">Alterar situação</h2>
          <p className="mt-1 text-xs text-neutral-500">
            As transições são validadas no servidor e registradas na auditoria.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["in_review", "awaiting_information", "completed", "draft"] as BriefingStatus[]).map(
              (status) => (
                <Button
                  key={status}
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={busy || detail.briefing.status === status}
                  onClick={() => void handleStatusChange(status)}
                >
                  {BRIEFING_STATUS_LABELS[status]}
                </Button>
              ),
            )}
          </div>
        </div>

        <div className="border border-white/10 bg-white/[0.02] p-4">
          <h2 className="font-display text-lg font-semibold text-white">
            Solicitar complementação
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            O texto abaixo é visível para o cliente no painel dele.
          </p>
          <Textarea
            value={complementMessage}
            onChange={(event) => setComplementMessage(event.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Ex.: faltam as notas fiscais da equipe técnica."
            aria-label="Mensagem de complementação para o cliente"
            className="mt-3 border-white/15 bg-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-[var(--brand-primary)]"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-3"
            disabled={busy || complementMessage.trim().length < 3}
            onClick={() => void handleRequestComplement()}
          >
            <MessageSquare aria-hidden="true" />
            Solicitar
          </Button>
        </div>
      </section>

      <section className="mt-4 border border-white/10 bg-white/[0.02] p-4">
        <h2 className="font-display text-lg font-semibold text-white">Nota interna</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Notas internas nunca aparecem nas respostas enviadas ao cliente.
        </p>
        <Textarea
          value={internalNote}
          onChange={(event) => setInternalNote(event.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Ex.: faltam as notas fiscais da equipe técnica."
          aria-label="Nota interna da análise"
          className="mt-3 border-white/15 bg-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-[var(--brand-primary)]"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-3"
          disabled={busy || internalNote.trim().length < 3}
          onClick={() => void handleAddNote()}
        >
          <FileText aria-hidden="true" />
          Registrar nota
        </Button>
      </section>

      <section className="mt-4 border border-white/10 bg-white/[0.02] p-4">
        <h2 className="font-display text-lg font-semibold text-white">Arquivos</h2>
        {detail.files.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-400">Nenhum arquivo enviado.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {detail.files.map((file) => (
              <li
                key={file.id}
                className="flex flex-wrap items-center justify-between gap-2 border border-white/10 bg-neutral-950/40 p-3 text-sm text-neutral-200"
              >
                <span className="min-w-0 truncate">
                  {file.original_name} · {file.category}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => void handleDownload(file.id)}
                >
                  <Download aria-hidden="true" />
                  Baixar
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-4 space-y-3">
        <h2 className="font-display text-lg font-semibold text-white">Respostas por etapa</h2>
        {BRIEFING_STEPS.map((step) => {
          const section = detail.sections[step.id];
          const pendingFields = pendingBySection[step.id] ?? [];

          return (
            <article key={step.id} className="border border-white/10 bg-white/[0.02] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">
                  {step.number}. {step.title}
                </h3>
                {pendingFields.length > 0 ? (
                  <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-xs text-amber-100">
                    {pendingFields.length} pendência(s)
                  </span>
                ) : null}
              </div>

              {section && Object.keys(section.values).length > 0 ? (
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  {Object.entries(section.values).map(([fieldId, value]) => {
                    const field = step.fields.find((item) => item.id === fieldId);
                    return (
                      <div key={fieldId} className="min-w-0 text-xs">
                        <dt className="text-neutral-500">{field?.label ?? fieldId}</dt>
                        <dd
                          className={
                            section.pending[fieldId]
                              ? "mt-0.5 break-words text-amber-200"
                              : "mt-0.5 break-words text-neutral-200"
                          }
                        >
                          {String(value)}
                          {section.pending[fieldId] ? " (pendente)" : ""}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              ) : (
                <p className="mt-2 text-sm text-neutral-500">Sem respostas registradas.</p>
              )}
            </article>
          );
        })}
      </section>

      <section className="mt-4 border border-white/10 bg-white/[0.02] p-4">
        <h2 className="font-display text-lg font-semibold text-white">Histórico</h2>
        {detail.activity.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-400">Nenhum evento registrado.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm text-neutral-300">
            {detail.activity.map((entry) => (
              <li key={entry.id} className="border border-white/10 bg-neutral-950/40 p-3">
                <p className="font-mono text-xs text-[var(--brand-text-accent)]">{entry.action}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {new Date(entry.created_at).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
                {typeof entry.metadata?.["note"] === "string" ? (
                  <p className="mt-1 text-xs text-neutral-300">{entry.metadata["note"]}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
