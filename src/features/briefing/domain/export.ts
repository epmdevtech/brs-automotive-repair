import { company } from "@/lib/brs";
import { getPendingItems } from "./progress";
import { BRIEFING_STEPS } from "./steps";
import type {
  BriefingAnswer,
  BriefingDraft,
  BriefingExport,
  BriefingField,
  BriefingFieldOption,
} from "./types";

function optionLabel(options: BriefingFieldOption[] | undefined, value: string): string | null {
  if (!options) return null;
  return options.find((option) => option.value === value)?.label ?? null;
}

export function formatFieldValue(field: BriefingField, draft: BriefingDraft): string {
  if (draft.pending[field.id]) return "Pendente";

  const value = draft.values[field.id];

  if (field.type === "checkbox") {
    return value === true ? "Sim" : "Não";
  }

  if (typeof value !== "string" || value.trim().length === 0) return "Não informado";
  return optionLabel(field.options, value) ?? value.trim();
}

function stringValue(draft: BriefingDraft, key: string): string {
  const value = draft.values[key];
  return typeof value === "string" ? value.trim() : "";
}

export function buildBriefingExport(draft: BriefingDraft): BriefingExport {
  const sections = BRIEFING_STEPS.map((step) => ({
    id: step.id,
    number: step.number,
    title: step.title,
    answers: step.fields.map<BriefingAnswer>((field) => ({
      fieldId: field.id,
      label: field.label,
      value: formatFieldValue(field, draft),
      pending: Boolean(draft.pending[field.id]),
    })),
  }));

  return {
    schemaVersion: "1.0",
    kind: "briefing-operacional-master",
    generatedAt: new Date().toISOString(),
    status: draft.completed ? "concluido_localmente" : "rascunho",
    company: {
      name: stringValue(draft, "empresa.nomeFantasia") || company.name,
      legalName: stringValue(draft, "empresa.razaoSocial") || company.legalName,
      cnpj: stringValue(draft, "empresa.cnpj") || company.cnpj,
    },
    sections,
    pending: getPendingItems(draft),
    photos: draft.photos,
    disclaimers: [
      "Este arquivo foi gerado localmente no navegador e não foi enviado automaticamente a nenhum servidor.",
      "As respostas não foram publicadas no site público e dependem de revisão da EPM DevTech.",
      "Itens marcados como Pendente exigem confirmação do responsável antes de qualquer uso comercial.",
      "As imagens listadas não foram enviadas nem armazenadas; apenas os metadados foram registrados.",
      "A conclusão local não representa credenciamento, aprovação, regularidade documental ou certificação.",
    ],
  };
}

export function serializeBriefingExport(draft: BriefingDraft): string {
  return JSON.stringify(buildBriefingExport(draft), null, 2);
}

export function buildExportFileName(draft: BriefingDraft): string {
  const name = stringValue(draft, "empresa.nomeFantasia") || company.name;
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const date = new Date().toISOString().slice(0, 10);
  return `briefing-operacional-${slug || "master"}-${date}.json`;
}

export function generateBriefingReportText(exportData: BriefingExport): string {
  const lines: string[] = [
    "BRIEFING OPERACIONAL E COMERCIAL — MASTER CHAPEAÇÃO E PINTURAS",
    "=".repeat(66),
    `Empresa: ${exportData.company.name}`,
    `Razão social: ${exportData.company.legalName}`,
    `CNPJ: ${exportData.company.cnpj || "Não informado"}`,
    `Gerado em: ${exportData.generatedAt}`,
    `Status: ${exportData.status === "concluido_localmente" ? "Concluído localmente" : "Rascunho"}`,
    "",
  ];

  for (const section of exportData.sections) {
    lines.push(`${section.number}. ${section.title}`);
    lines.push("-".repeat(66));
    for (const answer of section.answers) {
      lines.push(`${answer.label}: ${answer.value}`);
    }
    lines.push("");
  }

  lines.push("PENDÊNCIAS");
  lines.push("-".repeat(66));
  if (exportData.pending.length === 0) {
    lines.push("Nenhuma pendência registrada.");
  } else {
    for (const item of exportData.pending) {
      lines.push(`- Etapa ${item.stepNumber} — ${item.label}`);
    }
  }
  lines.push("");

  lines.push("IMAGENS REGISTRADAS (SEM ENVIO OU ARMAZENAMENTO DO ARQUIVO)");
  lines.push("-".repeat(66));
  if (exportData.photos.length === 0) {
    lines.push("Nenhuma imagem registrada.");
  } else {
    for (const photo of exportData.photos) {
      lines.push(
        `- ${photo.categoryLabel}: ${photo.fileName} — ${photo.authorized ? "autorizada para avaliação" : "sem autorização"}${photo.identifiable ? " — contém informação identificável" : ""}`,
      );
    }
  }
  lines.push("");

  lines.push("AVISOS");
  lines.push("-".repeat(66));
  for (const disclaimer of exportData.disclaimers) {
    lines.push(`- ${disclaimer}`);
  }
  lines.push("");

  return lines.join("\n");
}
