import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";

/**
 * Percurso E2E do briefing operacional da Master Chapeação (SPEC-073).
 *
 * 1. Autentica pela tela real de login (Supabase Auth).
 * 2. Percorre as 15 etapas preenchendo os campos e confirmando a sincronização
 *    com o servidor a cada etapa.
 * 3. Envia o briefing e valida a tela de confirmação exibida só após a
 *    persistência ser confirmada pelo servidor.
 * 4. Lê o registro gravado no Supabase (PostgREST) e exibe a evidência.
 *
 * Credenciais: E2E_EMAIL / E2E_PASSWORD (ambiente ou .env).
 * Com SUPABASE_SERVICE_ROLE_KEY disponível, o teste garante a conta de teste já
 * confirmada pela Admin API do Supabase.
 */

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EVIDENCE_DIR = path.join(REPO_ROOT, "e2e-screenshots");

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

const dotEnv = loadDotEnv();

function envValue(key: string): string | undefined {
  return process.env[key] ?? dotEnv[key];
}

const SUPABASE_URL = envValue("SUPABASE_URL");
const SUPABASE_ANON_KEY = envValue("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = envValue("SUPABASE_SERVICE_ROLE_KEY");

const TEST_EMAIL = envValue("E2E_EMAIL") ?? "qa.brs@masterchapeacao.com.br";
const TEST_PASSWORD = envValue("E2E_PASSWORD") ?? "QaBrs-2026!";

const STEP_TITLES = [
  "Identificação da empresa",
  "Serviços e especialidades",
  "Estrutura física",
  "Equipamentos e ferramentas",
  "Equipe e responsabilidades",
  "Processos operacionais",
  "Capacidade operacional e prazos",
  "Qualidade, garantia e rastreabilidade",
  "Documentação e regularidade",
  "Sistemas e tecnologia",
  "Fornecedores e terceiros",
  "Interesse em credenciamento",
  "Fotos e portfólio",
  "Informações para o site",
  "Observações e confirmação",
];

async function ensureTestUser(): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;

  const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: "QA E2E Master" },
    }),
  });

  if (response.ok) return;

  const payload = (await response.json().catch(() => ({}))) as { msg?: string; message?: string };
  const message = payload.msg ?? payload.message ?? "";

  if (response.status === 422 || /already|registered|exists/i.test(message)) {
    return;
  }

  throw new Error(`Falha ao garantir o usuário de teste: ${response.status} ${message}`);
}

/**
 * Remove os briefings anteriores do usuário de teste para que cada execução
 * comece de um rascunho limpo (o app mantém um briefing ativo por usuário).
 */
async function resetTestBriefings(): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;

  const usersResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=50`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  if (!usersResponse.ok) return;

  const payload = (await usersResponse.json()) as {
    users?: { id: string; email?: string }[];
  };
  const testUser = payload.users?.find((user) => user.email === TEST_EMAIL);
  if (!testUser) return;

  await fetch(`${SUPABASE_URL}/rest/v1/briefings?owner_user_id=eq.${testUser.id}`, {
    method: "DELETE",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
}

async function login(page: Page): Promise<void> {
  await page.goto("/login");

  // O botão só habilita após a hidratação: espera determinística de que o
  // React já assumiu os inputs (preencher antes disso perde os valores).
  await expect(page.getByRole("button", { name: "Entrar" })).toBeEnabled({ timeout: 20_000 });

  await page.getByRole("textbox", { name: "E-mail" }).fill(TEST_EMAIL);
  await page.getByLabel("Senha").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
}

async function waitForServerSync(page: Page): Promise<void> {
  await expect(page.getByText(/Sincronizado às|Salvando no servidor/i)).toBeVisible({
    timeout: 20_000,
  });
  await page.waitForTimeout(1_200);
}

async function fillFirstControlOfStep(page: Page, stepNumber: number): Promise<void> {
  const value = `Registro de validação E2E — etapa ${String(stepNumber).padStart(2, "0")}`;

  // Prioriza campos de texto livre: campos de e-mail, telefone, número e data
  // têm validação de formato e não aceitam o texto de validação.
  const textarea = page.locator("textarea").first();
  if ((await textarea.count()) > 0) {
    await textarea.fill(value);
    return;
  }

  const textInput = page.locator('input[type="text"]').first();
  if ((await textInput.count()) > 0) {
    await textInput.fill(value);
  }
}

interface PersistedEvidence {
  briefing: {
    id: string;
    company_name: string;
    status: string;
    owner_user_id: string;
    submitted_at: string | null;
    updated_at: string;
  };
  sectionKeys: string[];
  sectionCount: number;
  answeredFields: number;
  pendingCount: number;
  activityActions: string[];
  activityActionsVisibleToClient: string[];
  anonymousVisibility: string;
}

async function readPersistedBriefing(): Promise<PersistedEvidence> {
  const tokenResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY as string,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Não foi possível autenticar na API do Supabase: ${tokenResponse.status}`);
  }

  const { access_token: accessToken } = (await tokenResponse.json()) as { access_token: string };
  const headers = {
    apikey: SUPABASE_ANON_KEY as string,
    Authorization: `Bearer ${accessToken}`,
  };

  const briefingsResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/briefings?select=*&order=updated_at.desc&limit=1`,
    { headers },
  );
  const briefings = (await briefingsResponse.json()) as PersistedEvidence["briefing"][];
  const briefing = briefings[0];
  if (!briefing) throw new Error("Nenhum briefing encontrado no Supabase após o envio.");

  const answersResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/briefing_answers?select=section_key,answers&briefing_id=eq.${briefing.id}`,
    { headers },
  );
  const answers = (await answersResponse.json()) as {
    section_key: string;
    answers: { values?: Record<string, unknown>; pending?: Record<string, boolean> };
  }[];

  // Auditoria: visivel apenas para quem tem papel admin (service role no teste).
  const activityResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/briefing_activity?select=action&briefing_id=eq.${briefing.id}&order=created_at`,
    {
      headers: SUPABASE_SERVICE_ROLE_KEY
        ? {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          }
        : headers,
    },
  );
  const activity = (await activityResponse.json()) as { action: string }[];

  // O proprio cliente nao enxerga a auditoria: leitura com o token do cliente.
  const clientActivityResponse = await fetch(
    `${SUPABASE_URL}/rest/v1/briefing_activity?select=action&briefing_id=eq.${briefing.id}`,
    { headers },
  );
  const clientActivity = (await clientActivityResponse.json()) as { action: string }[];

  const anonymousResponse = await fetch(`${SUPABASE_URL}/rest/v1/briefings?select=id&limit=5`, {
    headers: { apikey: SUPABASE_ANON_KEY as string },
  });
  const anonymous = await anonymousResponse.text();

  let answeredFields = 0;
  let pendingCount = 0;
  for (const answer of answers) {
    answeredFields += Object.keys(answer.answers?.values ?? {}).length;
    pendingCount += Object.values(answer.answers?.pending ?? {}).filter(Boolean).length;
  }

  return {
    briefing,
    sectionKeys: answers.map((answer) => answer.section_key),
    sectionCount: answers.length,
    answeredFields,
    pendingCount,
    activityActions: activity.map((entry) => entry.action),
    activityActionsVisibleToClient: clientActivity.map((entry) => entry.action),
    anonymousVisibility: anonymous,
  };
}

test.describe("SPEC-073 — percurso E2E do briefing da Master", () => {
  test.beforeAll(async () => {
    test.skip(
      !SUPABASE_URL || !SUPABASE_ANON_KEY,
      "SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios para o percurso E2E do briefing.",
    );
    await ensureTestUser();
    await resetTestBriefings();
  });

  test("percorre as 15 etapas, envia o briefing e evidencia o registro persistido", async ({
    page,
  }, testInfo) => {
    test.setTimeout(240_000);

    // A consulta assistida de CEP falha de propósito: o formulário precisa
    // seguir funcionando com o preenchimento manual.
    await page.route(/viacep\.com\.br/, (route) => route.abort("failed"));

    await login(page);

    // Regressão: as credenciais nunca podem aparecer na URL (submissão nativa).
    expect(page.url()).not.toContain("password");
    expect(page.url()).not.toContain(TEST_PASSWORD);

    await expect(page).toHaveURL(/\/briefing/);
    await expect(
      page.getByRole("heading", { name: /Briefing operacional e credenciamento/i }),
    ).toBeVisible({ timeout: 20_000 });

    const companyName = "LCL Chapeação LTDA (E2E)";
    const ownerName = "Responsável de QA E2E";

    // Etapa 1 — Identificação da empresa (obrigatórios: razão social e responsável)
    await page.getByRole("textbox", { name: "Razão social" }).fill(companyName);
    await page.getByRole("textbox", { name: "Proprietário ou responsável legal" }).fill(ownerName);
    await page.getByRole("textbox", { name: "Nome fantasia" }).fill("Master Chapeação e Pinturas");
    await page.getByRole("textbox", { name: "CNPJ da empresa" }).fill("51.784.844/0001-01");
    await page.getByRole("textbox", { name: "Cidade" }).fill("Toledo");
    await page.getByLabel("Estado", { exact: true }).selectOption("PR");

    // A máscara de CEP é aplicada enquanto o usuário digita.
    const cepField = page.getByPlaceholder("00000-000");
    await cepField.fill("85900000");
    await expect(cepField).toHaveValue("85900-000");

    // Falha da consulta externa de CEP não bloqueia o preenchimento manual.
    await expect(
      page.getByText(/CEP não localizado|Preencha o endereço manualmente/i),
    ).toBeVisible({ timeout: 15_000 });
    await page.getByRole("textbox", { name: "Endereço (logradouro)" }).fill("Av. das Indústrias");
    await page.getByRole("textbox", { name: "Bairro" }).fill("Centro");

    await waitForServerSync(page);
    await page.getByRole("button", { name: "Próxima etapa" }).click();
    await expect(page.getByRole("heading", { name: STEP_TITLES[1] as string })).toBeVisible({
      timeout: 15_000,
    });

    // Etapas 2 a 14 — preenche um campo por etapa para gravar cada seção
    for (let index = 1; index < 14; index += 1) {
      await fillFirstControlOfStep(page, index + 1);
      await waitForServerSync(page);
      await page.getByRole("button", { name: "Próxima etapa" }).click();
      await expect(
        page.getByRole("heading", { name: STEP_TITLES[index + 1] as string }),
      ).toBeVisible({ timeout: 15_000 });
    }

    // Etapa 15 — Observações e confirmação (obrigatórios: responsável e duas declarações)
    await expect(page.getByRole("heading", { name: STEP_TITLES[14] as string })).toBeVisible({
      timeout: 15_000,
    });

    await page.getByRole("textbox", { name: "Responsável pelo preenchimento" }).fill(ownerName);
    await page.getByRole("checkbox", { name: /Declaro que as informações correspondem/i }).check();
    await page
      .getByRole("checkbox", { name: /Estou ciente de que as informações serão usadas/i })
      .check();
    await waitForServerSync(page);

    await page.getByRole("button", { name: "Revisar respostas" }).click();
    await expect(page.getByText("Revisão final")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Situação por etapa")).toBeVisible();
    await expect(page.getByText("Autorizações registradas")).toBeVisible();
    await page.screenshot({ path: path.join(EVIDENCE_DIR, "briefing-revisao-e2e.png") });

    // O envio exige confirmação explícita do cliente.
    const enviar = page.getByRole("button", { name: /Enviar para análise/i });
    await expect(enviar).toBeDisabled();
    await page.getByRole("checkbox", { name: /Confirmo que as informações/i }).check();
    await expect(enviar).toBeEnabled();
    await enviar.click();

    await expect(page).toHaveURL(/\/briefing\/confirmacao/, { timeout: 30_000 });
    await expect(page.getByText(/Briefing registrado no servidor/i)).toBeVisible();
    await page.screenshot({ path: path.join(EVIDENCE_DIR, "briefing-confirmacao-e2e.png") });

    const evidence = await readPersistedBriefing();
    testInfo.attach("briefing-cadastrado", {
      body: JSON.stringify(evidence, null, 2),
      contentType: "application/json",
    });

    console.log("\n=== REGISTRO PERSISTIDO NO SUPABASE (leitura via PostgREST) ===");
    console.log(JSON.stringify(evidence, null, 2));

    expect(evidence.briefing.status).toBe("submitted");
    expect(evidence.briefing.company_name).toBe(companyName);
    expect(evidence.briefing.submitted_at).toBeTruthy();
    expect(evidence.sectionKeys).toContain("company_identification");
    expect(evidence.sectionKeys).toContain("observations");
    expect(evidence.anonymousVisibility).toBe("[]");
    expect(evidence.activityActions).toContain("submitted");
    expect(evidence.activityActionsVisibleToClient).toHaveLength(0);
  });
});
