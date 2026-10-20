import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Pencil,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMissingRequiredFieldsAll, getPendingItems } from "../domain/progress";
import {
  buildBriefingExport,
  buildExportFileName,
  generateBriefingReportText,
  serializeBriefingExport,
} from "../domain/export";
import type { BriefingDraft } from "../domain/types";
import { copyTextToClipboard, downloadTextFile } from "./download";

interface BriefingReviewProps {
  draft: BriefingDraft;
  onEditStep: (stepNumber: number) => void;
  onComplete: () => void;
  onReset: () => void;
}

export function BriefingReview({ draft, onEditStep, onComplete, onReset }: BriefingReviewProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const exportData = useMemo(() => buildBriefingExport(draft), [draft]);
  const reportText = useMemo(() => generateBriefingReportText(exportData), [exportData]);
  const missingRequired = useMemo(() => getMissingRequiredFieldsAll(draft), [draft]);
  const pendingItems = useMemo(() => getPendingItems(draft), [draft]);
  const answeredCount = exportData.sections.reduce(
    (total, section) =>
      total + section.answers.filter((answer) => answer.value !== "Não informado").length,
    0,
  );
  const totalFields = exportData.sections.reduce(
    (total, section) => total + section.answers.length,
    0,
  );

  function handleDownloadJson() {
    downloadTextFile(
      buildExportFileName(draft),
      serializeBriefingExport(draft),
      "application/json",
    );
  }

  function handleDownloadReport() {
    const reportFileName = buildExportFileName(draft).replace(/\.json$/, "-relatorio.txt");
    downloadTextFile(reportFileName, reportText, "text/plain;charset=utf-8");
  }

  async function handleCopyReport() {
    const copied = await copyTextToClipboard(reportText);
    setCopyStatus(
      copied
        ? "Relatório copiado. Nenhum dado foi enviado automaticamente."
        : "Não foi possível copiar automaticamente. Use a seção de cópia manual abaixo.",
    );
  }

  return (
    <div className="space-y-5">
      <section className="border border-white/10 bg-white/[0.02] p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[var(--brand-text-accent)]">
              Revisão final
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white">
              Confira antes de concluir
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-400">
              Revise as respostas e as pendências. A conclusão é local: nada é enviado, publicado ou
              encaminhado a seguradoras por este formulário.
            </p>
          </div>
          <span
            className={
              draft.completed
                ? "rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200"
                : "rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs text-amber-100"
            }
          >
            {draft.completed ? "Concluído localmente" : "Rascunho local"}
          </span>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="border border-white/10 bg-neutral-950/40 p-3">
            <dt className="text-xs text-neutral-500">Respostas</dt>
            <dd className="mt-1 font-mono text-lg text-white">
              {answeredCount}/{totalFields}
            </dd>
          </div>
          <div className="border border-white/10 bg-neutral-950/40 p-3">
            <dt className="text-xs text-neutral-500">Pendências</dt>
            <dd className="mt-1 font-mono text-lg text-amber-200">{pendingItems.length}</dd>
          </div>
          <div className="border border-white/10 bg-neutral-950/40 p-3">
            <dt className="text-xs text-neutral-500">Obrigatórios em falta</dt>
            <dd className="mt-1 font-mono text-lg text-red-200">{missingRequired.length}</dd>
          </div>
          <div className="border border-white/10 bg-neutral-950/40 p-3">
            <dt className="text-xs text-neutral-500">Imagens</dt>
            <dd className="mt-1 font-mono text-lg text-white">{draft.photos.length}</dd>
          </div>
        </dl>

        {missingRequired.length > 0 ? (
          <div
            role="alert"
            className="mt-5 border border-red-400/30 bg-red-400/5 p-3 text-sm text-red-100"
          >
            <p className="flex items-center gap-2 font-medium">
              <AlertTriangle className="size-4" aria-hidden="true" />
              Existem campos obrigatórios sem resposta nem pendência.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-red-100/90">
              {missingRequired.map((field) => {
                const step = exportData.sections.find((section) =>
                  section.answers.some((answer) => answer.fieldId === field.id),
                );
                return (
                  <li key={field.id}>
                    Etapa {step?.number ?? "?"} — {field.label}
                  </li>
                );
              })}
            </ul>
            <Button
              type="button"
              variant="secondary"
              className="mt-3"
              onClick={() => {
                const section = exportData.sections.find((item) =>
                  item.answers.some((answer) =>
                    missingRequired.some((field) => field.id === answer.fieldId),
                  ),
                );
                if (section) onEditStep(section.number);
              }}
            >
              Corrigir agora
            </Button>
          </div>
        ) : null}
      </section>

      <section className="border border-white/10 bg-white/[0.02] p-4 sm:p-6">
        <h3 className="font-display text-lg font-semibold text-white">Respostas por etapa</h3>
        <div className="mt-4 space-y-4">
          {exportData.sections.map((section) => (
            <article key={section.id} className="border border-white/10 bg-neutral-950/40 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-white">
                  {section.number}. {section.title}
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditStep(section.number)}
                  className="text-neutral-300"
                >
                  <Pencil aria-hidden="true" />
                  Editar etapa
                </Button>
              </div>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {section.answers.map((answer) => (
                  <div key={answer.fieldId} className="min-w-0 text-xs">
                    <dt className="text-neutral-500">{answer.label}</dt>
                    <dd
                      className={
                        answer.pending
                          ? "mt-0.5 break-words text-amber-200"
                          : "mt-0.5 break-words text-neutral-200"
                      }
                    >
                      {answer.value}
                      {answer.pending ? " (pendente)" : ""}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="border border-white/10 bg-white/[0.02] p-4 sm:p-6">
        <h3 className="font-display text-lg font-semibold text-white">Pendências registradas</h3>
        {pendingItems.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-400">Nenhuma pendência registrada.</p>
        ) : (
          <ul className="mt-3 space-y-1 text-sm text-amber-200">
            {pendingItems.map((item) => (
              <li key={item.fieldId}>
                Etapa {item.stepNumber} — {item.label}
              </li>
            ))}
          </ul>
        )}

        <h3 className="mt-6 font-display text-lg font-semibold text-white">Imagens</h3>
        {draft.photos.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-400">Nenhuma imagem registrada.</p>
        ) : (
          <ul className="mt-3 space-y-1 text-sm text-neutral-300">
            {draft.photos.map((photo) => (
              <li key={photo.id}>
                {photo.categoryLabel}: {photo.fileName} —{" "}
                {photo.authorized ? "autorizada para avaliação" : "sem autorização"}
                {photo.identifiable ? " — contém informação identificável" : ""}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-neutral-500">
          Apenas metadados. Nenhum arquivo foi enviado ou armazenado.
        </p>
      </section>

      <section className="border border-white/10 bg-white/[0.02] p-4 sm:p-6">
        <h3 className="font-display text-lg font-semibold text-white">Pacote para revisão</h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-400">
          O JSON e o relatório são gerados no navegador. A conclusão local não representa envio,
          aprovação, regularidade documental, certificação ou credenciamento.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={handleDownloadJson}>
            <Download aria-hidden="true" />
            Baixar JSON
          </Button>
          <Button type="button" variant="secondary" onClick={handleDownloadReport}>
            <FileText aria-hidden="true" />
            Baixar relatório
          </Button>
          <Button type="button" variant="secondary" onClick={handleCopyReport}>
            <Copy aria-hidden="true" />
            Copiar relatório
          </Button>
        </div>

        {copyStatus ? (
          <p role="status" className="mt-3 text-xs text-neutral-300">
            {copyStatus}
          </p>
        ) : null}

        <details className="mt-4 border border-white/10 bg-neutral-950/40 p-3">
          <summary className="cursor-pointer text-xs text-neutral-400">
            Ver relatório para cópia manual
          </summary>
          <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words font-mono text-[0.7rem] leading-relaxed text-neutral-300">
            {reportText}
          </pre>
        </details>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
          {draft.completed ? (
            <p className="flex items-center gap-2 text-sm text-emerald-200">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Briefing concluído localmente. Baixe o pacote e entregue pelo canal combinado.
            </p>
          ) : (
            <Button type="button" variant="primary" onClick={onComplete}>
              <CheckCircle2 aria-hidden="true" />
              Concluir localmente
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="text-neutral-400 hover:text-red-300"
          >
            <RotateCcw aria-hidden="true" />
            Limpar rascunho
          </Button>
        </div>
      </section>
    </div>
  );
}
