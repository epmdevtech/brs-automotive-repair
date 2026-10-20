import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

/**
 * Exportação da evidência em PDF pelo painel administrativo (SPEC-075).
 *
 * Cria (ou garante) uma conta de teste com papel `admin`, abre o detalhe de
 * um briefing enviado, baixa o PDF e valida o arquivo gerado.
 */

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOWNLOAD_DIR = path.join(REPO_ROOT, "e2e-screenshots");

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

const ADMIN_EMAIL = envValue("E2E_ADMIN_EMAIL") ?? "qa.admin@masterchapeacao.com.br";
const ADMIN_PASSWORD = envValue("E2E_ADMIN_PASSWORD") ?? "QaAdmin-2026!";

async function ensureAdminUser(): Promise<string> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios.");
  }

  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  };

  const listResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=50`, {
    headers,
  });
  const list = (await listResponse.json()) as { users?: { id: string; email?: string }[] };
  const existing = list.users?.find((user) => user.email === ADMIN_EMAIL);

  let userId = existing?.id;

  if (!userId) {
    const createResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { display_name: "QA E2E Administrador" },
      }),
    });

    if (!createResponse.ok) {
      throw new Error(`Falha ao criar o administrador de teste: ${createResponse.status}`);
    }

    const created = (await createResponse.json()) as { id: string };
    userId = created.id;
  } else {
    const updateResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ password: ADMIN_PASSWORD, email_confirm: true }),
    });
    if (!updateResponse.ok) {
      throw new Error(`Falha ao atualizar o administrador de teste: ${updateResponse.status}`);
    }
  }

  const promotion = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ role: "admin" }),
  });

  if (!promotion.ok) {
    throw new Error(
      "Não foi possível promover o usuário de teste a administrador. " +
        "Aplique a migração supabase/migrations/20261021000100_profile_role_guard_privileged.sql " +
        `no SQL Editor do projeto. Detalhe: ${(await promotion.text()).slice(0, 200)}`,
    );
  }

  return userId;
}

/**
 * Garante um briefing enviado para a exportação. Sem isso, o teste dependeria
 * da ordem de execução dos demais specs.
 */
async function ensureSubmittedBriefing(): Promise<{ id: string; company_name: string }> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios.");
  }

  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  };

  const list = (await (
    await fetch(
      `${SUPABASE_URL}/rest/v1/briefings?select=id,company_name,status&status=eq.submitted&order=updated_at.desc&limit=1`,
      { headers },
    )
  ).json()) as { id: string; company_name: string }[];

  if (list.length > 0) return list[0]!;

  const userId = await ensureAdminUser();
  const now = new Date().toISOString();

  const created = (await (
    await fetch(`${SUPABASE_URL}/rest/v1/briefings`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        owner_user_id: userId,
        company_name: "LCL Chapeação LTDA (E2E — PDF)",
        status: "submitted",
        submitted_at: now,
      }),
    })
  ).json()) as { id: string; company_name: string }[];

  const briefing = created[0]!;

  await fetch(`${SUPABASE_URL}/rest/v1/briefing_answers`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      briefing_id: briefing.id,
      section_key: "company_identification",
      answers: {
        values: {
          "empresa.razaoSocial": "LCL Chapeação LTDA (E2E — PDF)",
          "empresa.cnpj": "51.784.844/0001-01",
        },
        pending: { "empresa.proprietario": true },
      },
    }),
  });

  return briefing;
}

test.describe("SPEC-075 — exportação de evidência em PDF pelo painel", () => {
  test("administrador baixa um PDF válido do briefing enviado", async ({ page }) => {
    test.setTimeout(180_000);
    test.skip(
      !SUPABASE_URL || !SUPABASE_ANON_KEY,
      "SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios para a exportação.",
    );

    await ensureAdminUser();

    const briefing = await ensureSubmittedBriefing();

    await page.goto("/login");
    await expect(page.getByRole("button", { name: "Entrar" })).toBeEnabled({ timeout: 20_000 });
    await page.getByRole("textbox", { name: "E-mail" }).fill(ADMIN_EMAIL);
    await page.getByLabel("Senha").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/briefing/, { timeout: 30_000 });

    await page.goto(`/admin/briefings/${briefing.id}`);
    await expect(page.getByRole("heading", { name: /Evidência do briefing/i })).toBeVisible({
      timeout: 30_000,
    });

    const downloadPromise = page.waitForEvent("download", { timeout: 60_000 });
    await page.getByRole("button", { name: /Baixar evidência \(PDF\)/i }).click();

    const download = await downloadPromise;
    const target = path.join(DOWNLOAD_DIR, download.suggestedFilename());
    await download.saveAs(target);

    expect(download.suggestedFilename()).toMatch(/^evidencia-briefing-.+\.pdf$/);

    const bytes = readFileSync(target);
    expect(bytes.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(2000);

    await expect(page.getByText(/Evidência gerada/i)).toBeVisible();
    await page.screenshot({ path: path.join(DOWNLOAD_DIR, "admin-evidencia-pdf-e2e.png") });
  });
});
