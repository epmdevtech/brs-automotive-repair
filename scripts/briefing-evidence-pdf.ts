/**
 * Gera o PDF de evidência do briefing (SPEC-074) a partir do registro
 * persistido no Supabase.
 *
 * Uso:
 *   bun run scripts/briefing-evidence-pdf.ts [briefingId]
 *
 * Sem argumentos, usa o briefing mais recente do usuário de teste E2E.
 * Saída: docs/evidencia-briefing-15-etapas.pdf
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { BRIEFING_STEPS } from "../src/features/briefing/domain/steps";
import { formatDateTimeUtc } from "../src/features/briefing/domain/format";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const OUTPUT_DIR = path.join(REPO_ROOT, "docs");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "evidencia-briefing-15-etapas.pdf");

function loadDotEnv(): Record<string, string> {
  try {
    const raw = readFileSync(path.join(REPO_ROOT, ".env"), "utf8");
    const entries: Record<string, string> = {};

    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.length === 0 || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator < 0) continue;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed
        .slice(separator + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      if (value.length > 0) entries[key] = value;
    }

    return entries;
  } catch {
    return {};
  }
}

const env = loadDotEnv();
const url = env["SUPABASE_URL"];
const anonKey = env["SUPABASE_ANON_KEY"];
const serviceKey = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!url || !anonKey) {
  console.error("SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios.");
  process.exit(1);
}

const headers = serviceKey
  ? { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
  : { apikey: anonKey };

const briefingId = process.argv[2];
const query = briefingId
  ? `${url}/rest/v1/briefings?select=*&id=eq.${briefingId}`
  : `${url}/rest/v1/briefings?select=*&order=updated_at.desc&limit=1`;

const briefings = (await (await fetch(query, { headers })).json()) as Record<string, unknown>[];
const briefing = briefings[0];

if (!briefing) {
  console.error("Nenhum briefing encontrado.");
  process.exit(1);
}

const id = String(briefing["id"]);
const answers = (await (
  await fetch(
    `${url}/rest/v1/briefing_answers?select=section_key,answers,updated_at&briefing_id=eq.${id}`,
    { headers },
  )
).json()) as {
  section_key: string;
  answers: { values?: Record<string, string | boolean>; pending?: Record<string, boolean> };
}[];

const activity = (await (
  await fetch(
    `${url}/rest/v1/briefing_activity?select=action,metadata,created_at&briefing_id=eq.${id}&order=created_at`,
    { headers },
  )
).json()) as { action: string; created_at: string }[];

const byKey = new Map(answers.map((answer) => [answer.section_key, answer]));

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const answeredCount = answers.reduce(
  (total, section) => total + Object.keys(section.answers?.values ?? {}).length,
  0,
);

const stepsHtml = BRIEFING_STEPS.map((step) => {
  const row = byKey.get(step.id);
  const values = (row?.answers?.values ?? {}) as Record<string, string | boolean>;
  const pending = (row?.answers?.pending ?? {}) as Record<string, boolean>;
  const rows = step.fields
    .filter((field) => values[field.id] !== undefined && values[field.id] !== "")
    .map(
      (field) => `
        <tr>
          <td class="k">${escapeHtml(field.label)}</td>
          <td class="v">${escapeHtml(String(values[field.id]))}${
            pending[field.id] ? ' <span class="pend">pendente</span>' : ""
          }</td>
        </tr>`,
    )
    .join("");

  return `
    <section class="step">
      <h2><span class="num">${String(step.number).padStart(2, "0")}</span> ${escapeHtml(
        step.title,
      )}</h2>
      <p class="desc">${escapeHtml(step.description)}</p>
      ${
        rows
          ? `<table>${rows}</table>`
          : '<p class="empty">Sem respostas registradas nesta etapa.</p>'
      }
    </section>`;
}).join("");

const activityCounts = new Map<string, number>();
for (const item of activity)
  activityCounts.set(item.action, (activityCounts.get(item.action) ?? 0) + 1);

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Evidência do briefing — ${escapeHtml(String(briefing["company_name"]))}</title>
<style>
  @page { size: A4; margin: 14mm 12mm 16mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #0b0d10;
    color: #e8e8ea;
    font-family: "Manrope", "Segoe UI", Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.45;
  }
  header { border-bottom: 2px solid #e01b24; padding-bottom: 12px; margin-bottom: 16px; }
  .eyebrow { font-family: "Sora", Arial, sans-serif; font-size: 8pt; letter-spacing: .22em; text-transform: uppercase; color: #f26b6f; margin: 0 0 6px; }
  h1 { font-family: "Sora", Arial, sans-serif; font-size: 20pt; margin: 0 0 4px; color: #fff; }
  .sub { color: #9a9aa2; font-size: 9.5pt; margin: 0; }
  .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 16px; margin: 14px 0 6px; }
  .card { border: 1px solid #23252b; background: #101216; padding: 8px 10px; }
  .card dt { font-size: 7.5pt; letter-spacing: .14em; text-transform: uppercase; color: #7c7c85; margin: 0 0 3px; }
  .card dd { margin: 0; font-size: 10.5pt; color: #fff; word-break: break-word; }
  .note { margin: 10px 0 0; padding: 8px 10px; border: 1px solid #3a3f2a; background: #16170f; color: #d9d6a8; font-size: 8.5pt; }
  .step { break-inside: avoid; margin: 0 0 14px; border-top: 1px solid #23252b; padding-top: 10px; }
  .step h2 { font-family: "Sora", Arial, sans-serif; font-size: 12.5pt; margin: 0 0 2px; color: #fff; display: flex; gap: 8px; align-items: baseline; }
  .num { font-family: "Sora", Arial, sans-serif; color: #e01b24; font-size: 11pt; }
  .desc { color: #8e8e96; font-size: 8.5pt; margin: 0 0 6px; }
  table { width: 100%; border-collapse: collapse; }
  td { border-top: 1px solid #1d1f24; padding: 4px 0; vertical-align: top; font-size: 9.5pt; }
  td.k { width: 42%; color: #9a9aa2; padding-right: 10px; }
  td.v { color: #e8e8ea; }
  .pend { color: #e0b354; font-size: 7.5pt; text-transform: uppercase; letter-spacing: .1em; }
  .empty { color: #6f6f78; font-size: 9pt; font-style: italic; margin: 4px 0 0; }
  footer { margin-top: 18px; border-top: 1px solid #23252b; padding-top: 10px; color: #7c7c85; font-size: 8pt; }
  .pill { display: inline-block; border: 1px solid #2c5a3a; color: #7fd39b; padding: 2px 8px; border-radius: 999px; font-size: 8pt; letter-spacing: .1em; text-transform: uppercase; }
</style>
</head>
<body>
  <header>
    <p class="eyebrow">EPM DevTech · Evidência de briefing</p>
    <h1>${escapeHtml(String(briefing["company_name"]))}</h1>
    <p class="sub">Master Chapeação e Pinturas · registro <code>${escapeHtml(id)}</code></p>
  </header>

  <dl class="grid">
    <div class="card"><dt>Situação</dt><dd><span class="pill">${escapeHtml(String(briefing["status"]))}</span></dd></div>
    <div class="card"><dt>Criado em</dt><dd>${formatDateTimeUtc(String(briefing["created_at"]))} UTC</dd></div>
    <div class="card"><dt>Enviado em</dt><dd>${
      briefing["submitted_at"] ? `${formatDateTimeUtc(String(briefing["submitted_at"]))} UTC` : "—"
    }</dd></div>
    <div class="card"><dt>Etapas gravadas</dt><dd>${answers.length} de 15 · ${answeredCount} respostas</dd></div>
  </dl>

  <p class="note">
    Documento gerado a partir do registro persistido no PostgreSQL do projeto. As respostas são
    sintéticas de teste (E2E) e não representam a operação real da Master Chapeação. O envio
    confirma apenas o recebimento das informações para análise: não representa credenciamento,
    aprovação, regularidade documental nem publicação.
  </p>

  ${stepsHtml}

  <footer>
    <p><strong>Auditoria:</strong> ${[...activityCounts.entries()]
      .map(([action, count]) => `${action} (${count})`)
      .join(" · ")} — total de ${activity.length} evento(s), de ${formatDateTimeUtc(
      activity[0]?.created_at ?? "",
    )} a ${formatDateTimeUtc(activity.at(-1)?.created_at ?? "")} UTC.</p>
    <p>EPM DevTech · Master Chapeação e Pinturas · documento interno</p>
  </footer>
</body>
</html>`;

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(path.join(OUTPUT_DIR, "evidencia-briefing-15-etapas.html"), html, "utf8");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.pdf({
  path: OUTPUT_FILE,
  format: "A4",
  printBackground: true,
  margin: { top: "14mm", bottom: "16mm", left: "12mm", right: "12mm" },
});
await browser.close();

console.log(`PDF gerado: ${OUTPUT_FILE}`);
console.log(`HTML auxiliar: ${path.join(OUTPUT_DIR, "evidencia-briefing-15-etapas.html")}`);
console.log(
  `etapas: ${answers.length}/15 · respostas: ${answeredCount} · auditoria: ${activity.length}`,
);
