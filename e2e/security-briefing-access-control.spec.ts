import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

/**
 * Controle de acesso do briefing (auditoria de segurança — OWASP A01:2025).
 *
 * Cria duas contas sintéticas independentes (Cliente A e Cliente B) no projeto
 * de teste autorizado e prova, contra o PostgreSQL real (não apenas contra a
 * interface), que o Cliente B não lê, altera, apaga, audita nem baixa os
 * arquivos do Cliente A, que o usuário não autenticado não enxerga nada e que
 * nenhum cliente consegue elevar o próprio papel.
 *
 * Todas as contas e os dados criados por este teste são sintéticos e removidos
 * ao final da execução.
 */

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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
const BUCKET = envValue("SUPABASE_BRIEFING_BUCKET") ?? "master-briefing-private";

const CLIENT_A_EMAIL = "qa.audit.cliente-a@masterchapeacao.com.br";
const CLIENT_B_EMAIL = "qa.audit.cliente-b@masterchapeacao.com.br";
const CLIENT_PASSWORD = "QaAudit-2026!";
const ADMIN_EMAIL = envValue("E2E_ADMIN_EMAIL") ?? "qa.admin@masterchapeacao.com.br";
const ADMIN_PASSWORD = envValue("E2E_ADMIN_PASSWORD") ?? "QaAdmin-2026!";

interface Account {
  id: string;
  token: string;
}

function serviceHeaders(): Record<string, string> {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY as string,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  };
}

function userHeaders(token: string): Record<string, string> {
  return {
    apikey: SUPABASE_ANON_KEY as string,
    Authorization: `Bearer ${token}`,
  };
}

async function ensureUser(email: string, password: string): Promise<string> {
  const existing = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=200`, {
    headers: serviceHeaders(),
  });
  const users = (await existing.json()) as { users?: { id: string; email?: string }[] };
  const found = users.users?.find((user) => user.email === email);

  if (found) {
    await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${found.id}`, {
      method: "PUT",
      headers: { ...serviceHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ password, email_confirm: true }),
    });
    return found.id;
  }

  const created = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: { ...serviceHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, email_confirm: true }),
  });

  if (!created.ok) {
    throw new Error(`Falha ao criar a conta de teste: ${created.status}`);
  }

  const body = (await created.json()) as { id: string };
  return body.id;
}

async function signIn(email: string, password: string): Promise<Account> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY as string, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Falha ao autenticar ${email}: ${response.status}`);
  }

  const body = (await response.json()) as { access_token: string; user: { id: string } };
  return { id: body.user.id, token: body.access_token };
}

async function rest(
  pathName: string,
  options: {
    token?: string;
    method?: string;
    body?: unknown;
    prefer?: string;
    service?: boolean;
  } = {},
): Promise<{ status: number; body: unknown }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.service ? serviceHeaders() : userHeaders(options.token as string)),
  };
  if (options.prefer) headers["Prefer"] = options.prefer;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${pathName}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const text = await response.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    /* mantém o texto bruto */
  }

  return { status: response.status, body };
}

async function deleteUser(id: string): Promise<void> {
  await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${id}`, {
    method: "DELETE",
    headers: serviceHeaders(),
  });
}

async function deleteStorageFolder(userId: string): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
    method: "POST",
    headers: { ...serviceHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: `${userId}/`, limit: 100 }),
  });

  if (!response.ok) return;

  const objects = (await response.json()) as { name?: string }[];
  const paths = objects
    .map((object) => object.name)
    .filter((name): name is string => typeof name === "string")
    .map((name) => `${userId}/${name}`);

  if (paths.length === 0) return;

  await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}`, {
    method: "DELETE",
    headers: { ...serviceHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ prefixes: paths }),
  });
}

const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

test.describe("OWASP A01:2025 — controle de acesso do briefing", () => {
  test.skip(
    !SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY,
    "SUPABASE_URL, SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY são obrigatórios.",
  );

  let clientA: Account;
  let clientB: Account;
  let admin: Account;
  let briefingIdA: string;
  let fileIdA: string;
  let storagePathA: string;

  test.beforeAll(async () => {
    clientA = await signIn(CLIENT_A_EMAIL, CLIENT_PASSWORD).catch(async () => {
      await ensureUser(CLIENT_A_EMAIL, CLIENT_PASSWORD);
      return signIn(CLIENT_A_EMAIL, CLIENT_PASSWORD);
    });
    clientB = await signIn(CLIENT_B_EMAIL, CLIENT_PASSWORD).catch(async () => {
      await ensureUser(CLIENT_B_EMAIL, CLIENT_PASSWORD);
      return signIn(CLIENT_B_EMAIL, CLIENT_PASSWORD);
    });
    admin = await signIn(ADMIN_EMAIL, ADMIN_PASSWORD);

    // O Cliente A cria um briefing em rascunho com resposta e arquivo.
    const created = await rest("briefings", {
      token: clientA.token,
      method: "POST",
      prefer: "return=representation",
      body: {
        owner_user_id: clientA.id,
        company_name: "Empresa Auditoria A",
        status: "draft",
      },
    });
    const rows = created.body as { id: string }[];
    expect(
      rows[0]?.id,
      `falha ao criar o briefing do Cliente A: ${JSON.stringify(created.body)}`,
    ).toBeTruthy();
    briefingIdA = rows[0].id;

    await rest("briefing_answers", {
      token: clientA.token,
      method: "POST",
      body: {
        briefing_id: briefingIdA,
        section_key: "company_identification",
        answers: { values: { "empresa.razaoSocial": "Empresa Auditoria A LTDA" }, pending: {} },
      },
    });

    storagePathA = `${clientA.id}/${briefingIdA}/geral/auditoria.png`;
    const uploaded = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePathA}`, {
      method: "POST",
      headers: {
        ...userHeaders(clientA.token),
        "Content-Type": "image/png",
        "x-upsert": "false",
      },
      body: PNG_1X1,
    });
    expect(uploaded.ok, `upload do Cliente A deveria ser permitido: ${uploaded.status}`).toBe(true);

    const fileRow = await rest("briefing_files", {
      token: clientA.token,
      method: "POST",
      prefer: "return=representation",
      body: {
        briefing_id: briefingIdA,
        uploaded_by: clientA.id,
        storage_path: storagePathA,
        original_name: "auditoria.png",
        mime_type: "image/png",
        size_bytes: PNG_1X1.byteLength,
        category: "geral",
      },
    });
    fileIdA = (fileRow.body as { id: string }[])[0].id;

    // A trilha de auditoria é gravada apenas pela função controlada.
    const activity = await fetch(`${SUPABASE_URL}/rest/v1/rpc/log_briefing_activity`, {
      method: "POST",
      headers: { ...userHeaders(clientA.token), "Content-Type": "application/json" },
      body: JSON.stringify({
        p_briefing_id: briefingIdA,
        p_action: "briefing_created",
        p_metadata: {},
      }),
    });
    expect(activity.ok).toBe(true);
  });

  test.afterEach(async () => {
    // Garante que o Cliente B volte a `client` mesmo após o teste de
    // elevação de privilégio (que hoje é executado para documentar a falha).
    await rest(`profiles?id=eq.${clientB.id}`, {
      service: true,
      method: "PATCH",
      body: { role: "client" },
    });
  });

  test.afterAll(async () => {
    await deleteStorageFolder(clientA.id);
    await deleteUser(clientA.id);
    await deleteUser(clientB.id);
  });

  test("o Cliente B não lê os registros do Cliente A", async () => {
    const briefings = await rest(`briefings?id=eq.${briefingIdA}`, { token: clientB.token });
    expect(briefings.body).toEqual([]);

    const answers = await rest(`briefing_answers?briefing_id=eq.${briefingIdA}`, {
      token: clientB.token,
    });
    expect(answers.body).toEqual([]);

    const files = await rest(`briefing_files?briefing_id=eq.${briefingIdA}`, {
      token: clientB.token,
    });
    expect(files.body).toEqual([]);

    const activity = await rest(`briefing_activity?briefing_id=eq.${briefingIdA}`, {
      token: clientB.token,
    });
    expect(activity.body).toEqual([]);
  });

  test("o Cliente B não altera nem apaga o briefing do Cliente A", async () => {
    const before = await rest(`briefings?id=eq.${briefingIdA}&select=status,owner_user_id`, {
      token: clientA.token,
    });
    const beforeRow = (before.body as { status: string; owner_user_id: string }[])[0];

    await rest(`briefings?id=eq.${briefingIdA}`, {
      token: clientB.token,
      method: "PATCH",
      body: { status: "completed", owner_user_id: clientB.id },
    });
    await rest(`briefings?id=eq.${briefingIdA}`, {
      token: clientB.token,
      method: "DELETE",
    });

    const after = await rest(`briefings?id=eq.${briefingIdA}&select=status,owner_user_id`, {
      token: clientA.token,
    });
    const afterRow = (after.body as { status: string; owner_user_id: string }[])[0];

    expect(afterRow.status).toBe(beforeRow.status);
    expect(afterRow.owner_user_id).toBe(beforeRow.owner_user_id);
  });

  test("o Cliente B não assina URL nem manipula o arquivo do Cliente A", async () => {
    const signed = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/${BUCKET}/${storagePathA}`, {
      method: "POST",
      headers: { ...userHeaders(clientB.token), "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: 300 }),
    });
    expect(signed.ok).toBe(false);

    const upload = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${clientA.id}/briefing/geral/invasor.png`,
      {
        method: "POST",
        headers: { ...userHeaders(clientB.token), "Content-Type": "image/png" },
        body: PNG_1X1,
      },
    );
    expect(upload.ok).toBe(false);

    const removed = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePathA}`, {
      method: "DELETE",
      headers: userHeaders(clientB.token),
    });
    expect(removed.ok).toBe(false);

    const rows = await rest(`briefing_files?id=eq.${fileIdA}`, { token: clientB.token });
    expect(rows.body).toEqual([]);
  });

  test("o Cliente B não injeta trilha de auditoria no briefing do Cliente A", async () => {
    const activity = await fetch(`${SUPABASE_URL}/rest/v1/rpc/log_briefing_activity`, {
      method: "POST",
      headers: { ...userHeaders(clientB.token), "Content-Type": "application/json" },
      body: JSON.stringify({
        p_briefing_id: briefingIdA,
        p_action: "status_changed",
        p_metadata: { to: "completed" },
      }),
    });
    expect(activity.ok).toBe(false);
  });

  test("usuário não autenticado não acessa briefings nem Storage", async () => {
    const anonymous = await fetch(`${SUPABASE_URL}/rest/v1/briefings?select=id`, {
      headers: { apikey: SUPABASE_ANON_KEY as string },
    });
    expect(anonymous.ok).toBe(true);
    expect(await anonymous.json()).toEqual([]);
  });

  test("o papel `anon` não executa a função is_admin", async () => {
    test.fail(
      true,
      "Pendente: aplicar supabase/migrations/20261021000200_profile_role_guard_hardening.sql no Supabase (revoga a execução de is_admin para anon).",
    );

    const rpc = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_admin`, {
      method: "POST",
      headers: { apikey: SUPABASE_ANON_KEY as string, "Content-Type": "application/json" },
      body: "{}",
    });
    expect(rpc.ok).toBe(false);
  });

  test("nenhum cliente consegue elevar o próprio papel", async () => {
    test.fail(
      true,
      "Pendente: aplicar supabase/migrations/20261021000200_profile_role_guard_hardening.sql no Supabase (corrige o gatilho de papel e restringe o UPDATE de profiles).",
    );

    const escalation = await rest(`profiles?id=eq.${clientB.id}`, {
      token: clientB.token,
      method: "PATCH",
      body: { role: "admin" },
    });
    expect(escalation.status >= 400).toBe(true);

    const profile = await rest(`profiles?id=eq.${clientB.id}`, { token: clientB.token });
    expect((profile.body as { role: string }[])[0].role).toBe("client");
  });

  test("o Cliente B não lê o perfil de terceiros", async () => {
    const profile = await rest(`profiles?id=eq.${clientA.id}`, { token: clientB.token });
    expect(profile.body).toEqual([]);
  });

  test("o administrador enxerga todos os briefings e assina o arquivo do Cliente A", async () => {
    const list = await rest("briefings?select=id", { token: admin.token });
    expect((list.body as unknown[]).length).toBeGreaterThan(0);

    const signed = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/${BUCKET}/${storagePathA}`, {
      method: "POST",
      headers: { ...userHeaders(admin.token), "Content-Type": "application/json" },
      body: JSON.stringify({ expiresIn: 300 }),
    });
    expect(signed.ok).toBe(true);

    const activity = await rest(`briefing_activity?briefing_id=eq.${briefingIdA}`, {
      token: admin.token,
    });
    expect((activity.body as unknown[]).length).toBeGreaterThan(0);
  });

  test("a interface bloqueia o painel administrativo para o Cliente B", async ({ page }) => {
    await page.goto("/login");
    await page
      .getByRole("button", { name: "Entrar" })
      .waitFor({ state: "visible", timeout: 20_000 });
    await page.waitForFunction(() => {
      const button = [...document.querySelectorAll("button")].find(
        (candidate) => candidate.textContent?.trim() === "Entrar",
      );
      return Boolean(button && !(button as HTMLButtonElement).disabled);
    });
    await page.getByRole("textbox", { name: "E-mail" }).fill(CLIENT_B_EMAIL);
    await page.getByLabel("Senha").fill(CLIENT_PASSWORD);
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/briefing/, { timeout: 30_000 });

    await page.goto(`/admin/briefings/${briefingIdA}`);
    await expect(page.getByText(/Acesso restrito a administradores/i)).toBeVisible({
      timeout: 30_000,
    });
  });
});
