import { BRIEFING_STEPS } from "../../domain/steps";
import { BRIEFING_STATUS_LABELS, type BriefingStatus } from "../../domain/status";
import { formatDateTimeUtc } from "../../domain/format";
import type { BriefingActivityRow, BriefingAnswerRow, BriefingRow } from "../db-types";
import { PdfDocument } from "./pdf-writer";

export interface BriefingPdfInput {
  briefing: BriefingRow;
  answers: BriefingAnswerRow[];
  activity: BriefingActivityRow[];
  companyName: string;
}

export interface BriefingPdfOutput {
  fileName: string;
  bytes: Buffer;
  pageCount: number;
}

const ACCENT: [number, number, number] = [0.88, 0.11, 0.14];
const MUTED: [number, number, number] = [0.45, 0.45, 0.5];

/**
 * Monta o documento de evidência do briefing: identificação, as 15 etapas com
 * campo e resposta, pendências e trilha de auditoria.
 */
export function buildBriefingPdf(input: BriefingPdfInput): BriefingPdfOutput {
  const { briefing, answers, activity } = input;
  const byKey = new Map(answers.map((answer) => [answer.section_key, answer]));
  const answeredCount = answers.reduce(
    (total, answer) => total + Object.keys(answer.answers?.values ?? {}).length,
    0,
  );

  const document = new PdfDocument();
  document.setFooter(
    (page) => `EPM DevTech · Master Chapeação e Pinturas · documento interno · página ${page}`,
  );

  document.text("EPM DEVTECH · EVIDÊNCIA DE BRIEFING", document.margin, document.y, {
    size: 8,
    font: "bold",
    color: ACCENT,
  });
  document.cursorY -= 16;
  document.text(
    input.companyName || briefing.company_name || "Briefing sem nome",
    document.margin,
    document.cursorY,
    {
      size: 19,
      font: "bold",
      color: [0.06, 0.06, 0.07],
    },
  );
  document.cursorY -= 13;
  document.text(
    `Master Chapeação e Pinturas · registro ${briefing.id}`,
    document.margin,
    document.cursorY,
    { size: 9, color: MUTED },
  );

  document.cursorY -= 10;
  document.rule(ACCENT, 1.2);

  document.keyValue(
    "Situação",
    BRIEFING_STATUS_LABELS[briefing.status as BriefingStatus] ?? briefing.status,
    {
      keyWidth: 150,
      size: 9.5,
    },
  );
  document.keyValue("Criado em", `${formatDateTimeUtc(briefing.created_at)} UTC`, {
    keyWidth: 150,
    size: 9.5,
  });
  document.keyValue(
    "Enviado em",
    briefing.submitted_at ? `${formatDateTimeUtc(briefing.submitted_at)} UTC` : "—",
    { keyWidth: 150, size: 9.5 },
  );
  document.keyValue("Etapas gravadas", `${answers.length} de 15 · ${answeredCount} respostas`, {
    keyWidth: 150,
    size: 9.5,
  });
  document.keyValue("Identificador", briefing.id, { keyWidth: 150, size: 9.5, color: MUTED });

  document.callout(
    "Documento interno gerado a partir do registro persistido no banco de dados. O envio confirma apenas o recebimento das informações para análise da EPM DevTech: não representa credenciamento, aprovação, regularidade documental, certificação nem publicação das informações no site.",
  );

  for (const step of BRIEFING_STEPS) {
    const answer = byKey.get(step.id);
    const values = (answer?.answers?.values ?? {}) as Record<string, string | boolean>;
    const pending = (answer?.answers?.pending ?? {}) as Record<string, boolean>;

    document.heading(`${String(step.number).padStart(2, "0")} · ${step.title}`, {
      size: 12.5,
      color: [0.08, 0.08, 0.1],
      spaceBefore: 12,
    });

    document.paragraph(step.description, { size: 8.5, color: MUTED, lineHeight: 11 });

    const answered = step.fields.filter(
      (field) => values[field.id] !== undefined && values[field.id] !== "",
    );

    if (answered.length === 0) {
      document.paragraph("Sem respostas registradas nesta etapa.", {
        size: 9,
        color: [0.55, 0.55, 0.6],
      });
      continue;
    }

    for (const field of answered) {
      const value = String(values[field.id]);
      document.keyValue(field.label, pending[field.id] ? `${value}  (pendente)` : value, {
        keyWidth: 205,
        size: 9,
        color: pending[field.id] ? [0.65, 0.5, 0.15] : [0.08, 0.08, 0.1],
      });
    }
  }

  document.heading("Auditoria", { size: 12.5, color: [0.08, 0.08, 0.1], spaceBefore: 14 });
  document.paragraph(
    activity.length === 0
      ? "Nenhum evento registrado."
      : `${activity.length} evento(s) registrados, de ${formatDateTimeUtc(
          activity[0]?.created_at ?? "",
        )} a ${formatDateTimeUtc(activity.at(-1)?.created_at ?? "")} UTC.`,
    { size: 9, color: MUTED },
  );

  for (const event of activity) {
    const note =
      event.metadata && typeof event.metadata["note"] === "string"
        ? ` — ${String(event.metadata["note"])}`
        : "";
    document.keyValue(`${event.action}${note}`, formatDateTimeUtc(event.created_at), {
      keyWidth: 340,
      size: 8.5,
      color: MUTED,
    });
  }

  const bytes = document.build();
  const dateStamp = briefing.created_at.slice(0, 10);

  return {
    fileName: `evidencia-briefing-${briefing.id.slice(0, 8)}-${dateStamp}.pdf`,
    bytes,
    pageCount: document.pageCount,
  };
}
