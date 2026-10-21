import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";

/**
 * Preenchimento completo do briefing da Master Chapeação (SPEC-074).
 *
 * Percorre as 15 etapas preenchendo campos representativos de cada uma com
 * conteúdo de teste, envia o briefing e imprime o registro persistido no
 * Supabase — etapa por etapa, campo por campo — como o cliente veria.
 *
 * Os dados são sintéticos e identificados como E2E: nenhum dado real da
 * Master Chapeação é afirmarado por este teste.
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

/** Respostas de teste por etapa: [fieldId, valor]. */
const RESPOSTAS: Record<string, [string, string][]> = {
  company_identification: [
    ["empresa.razaoSocial", "LCL Chapeação LTDA (E2E)"],
    ["empresa.nomeFantasia", "Master Chapeação e Pinturas (E2E)"],
    ["empresa.cnpj", "51.784.844/0001-01"],
    ["empresa.anoFundacao", "2023"],
    ["empresa.tempoMercado", "3"],
    ["empresa.proprietario", "Responsável de QA E2E"],
    ["empresa.responsavelComercial", "Comercial de QA E2E"],
    ["empresa.telefone", "(45) 99999-9999"],
    ["empresa.whatsapp", "(45) 99999-9999"],
    ["empresa.email", "qa@masterchapeacao.com.br"],
    ["empresa.endereco", "Av. das Indústrias"],
    ["empresa.enderecoNumero", "1234"],
    ["empresa.bairro", "Centro"],
    ["empresa.cep", "85900-000"],
    ["empresa.cidade", "Toledo"],
    ["empresa.estado", "PR"],
    ["empresa.horarioFuncionamento", "Segunda a sexta, das 8h às 18h"],
    ["empresa.atendeSabado", "nao"],
    ["empresa.outrasUnidades", "nao"],
    ["empresa.regiaoAtendida", "Toledo, Marechal Cândido Rondon, Cascavel e região"],
    ["empresa.historia", "Oficina especializada em funilaria e pintura automotiva (E2E)."],
    [
      "empresa.diferenciais",
      "Pintura em estufa e martelinho de ouro preservando a pintura original (E2E).",
    ],
  ],
  services: [
    ["servicos.chapeacao", "proprio"],
    ["servicos.pintura", "proprio"],
    ["servicos.martelinho", "proprio"],
    ["servicos.recuperacaoAmassados", "proprio"],
    ["servicos.paraChoques", "proprio"],
    ["servicos.preparacaoAcabamento", "proprio"],
    ["servicos.polimento", "proprio"],
    [
      "servicos.especialidadesPrincipais",
      "Funilaria, pintura em estufa e martelinho de ouro (E2E).",
    ],
    ["servicos.tiposVeiculos", "Passenger, SUVs, picapes e vans (E2E)."],
    ["servicos.encaminhamentoSeguradora", "sim"],
  ],
  facility: [
    ["estrutura.fachada", "adequada"],
    ["estrutura.recepcao", "melhoria"],
    ["estrutura.salaEspera", "adequada"],
    ["estrutura.avaliacaoOrcamento", "adequada"],
    ["estrutura.funilaria", "adequada"],
    ["estrutura.preparacaoPintura", "adequada"],
  ],
  equipment: [
    ["equipamentos.funilaria", "propria"],
    ["equipamentos.soldagem", "propria"],
    ["equipamentos.lixamento", "propria"],
    ["equipamentos.compressor", "propria"],
    ["equipamentos.cabine", "propria"],
    ["equipamentos.pistolas", "propria"],
    ["equipamentos.manutencaoPreventiva", "sim"],
    [
      "equipamentos.quantidadesObservacoes",
      "Cabine de pintura e box de funilaria dedicados (E2E).",
    ],
  ],
  team: [
    ["equipe.totalColaboradores", "12"],
    ["equipe.profissionaisReparacao", "8"],
    ["equipe.administrativo", "4"],
    ["equipe.funcoes", "Preparação de superfície, pintura, montagem e acabamento (E2E)."],
    ["equipe.qualificacoes", "Curso técnico em funilaria e pintura automotiva (E2E)."],
    ["equipe.ampliar", "sim"],
  ],
  operations: [
    ["processos.recepcaoCadastro", "formalizado_registrado"],
    ["processos.orcamento", "formalizado_registrado"],
    ["processos.inspecaoFinal", "formalizado_registrado"],
    ["processos.entrega", "formalizado_registrado"],
  ],
  capacity: [
    ["capacidade.mediaRecebidos", "6"],
    ["capacidade.mediaEntregues", "5"],
    ["capacidade.servicosSimultaneos", "10"],
    ["capacidade.capacidadeAdicional", "4"],
    ["capacidade.prazoSimples", "5"],
    ["capacidade.prazoComplexos", "20"],
    ["capacidade.prazoBase", "uteis"],
    [
      "capacidade.definicaoPrazos",
      "Prazos por tamanho da avaria e disponibilidade de peças (E2E).",
    ],
  ],
  quality: [
    ["qualidade.checklistFinal", "sim"],
    ["qualidade.padroes", "Controle de cor, planimetria e acabamento uniforme (E2E)."],
    ["qualidade.fotos", "sim"],
    ["qualidade.historico", "sim"],
    ["qualidade.retrabalho", "parcial"],
    [
      "qualidade.politicaGarantia",
      "Garantia por tipo de serviço, registrada em ordem de serviço (E2E).",
    ],
    ["qualidade.prazoGarantia", "90 dias em pintura e 6 meses em funilaria (E2E)."],
  ],
  compliance: [
    ["documentos.cartaoCnpj", "disponivel"],
    ["documentos.contratoSocial", "disponivel"],
    ["documentos.inscricaoMunicipal", "disponivel"],
    ["documentos.alvara", "disponivel"],
    ["documentos.licencasAmbientais", "nao_aplicavel"],
    ["documentos.autorizacoes", "confirmar"],
    ["documentos.notaFiscal", "disponivel"],
    ["documentos.comprovanteEndereco", "disponivel"],
    ["documentos.regularidadeFiscal", "pendente"],
    ["documentos.segurancaTrabalho", "disponivel"],
    ["documentos.seguro", "confirmar"],
    ["documentos.certificados", "pendente"],
    ["documentos.responsavel", "Responsável administrativo (E2E)"],
    [
      "documentos.validades",
      "Alvará — validade a confirmar; seguro — vencimento a confirmar (E2E).",
    ],
  ],
  technology: [
    ["sistemas.gestao", "utiliza"],
    ["sistemas.orcamento", "utiliza"],
    ["sistemas.seguradoras", "utiliza"],
    ["sistemas.vistoriaFotos", "utiliza"],
    ["sistemas.planilhas", "utiliza"],
    ["sistemas.entradaSaida", "utiliza"],
  ],
  suppliers: [
    ["fornecedores.pecas", "Fornecedores regionais de peças e materiais (E2E)."],
    ["fornecedores.indicados", "sim"],
    [
      "fornecedores.terceirizados",
      "Pintura de FSI terceirizada quando a fila excede a capacidade (E2E).",
    ],
    ["fornecedores.criterios", "Prazo, nota fiscal e garantia do fornecedor (E2E)."],
  ],
  accreditation_interest: [
    ["credenciamento.seguradoras", "Interesse em seguradoras dos ramos de seguro auto (E2E)."],
    ["credenciamento.jaPossui", "nao"],
    ["credenciamento.associacoes", "nao"],
    ["credenciamento.frotas", "sim"],
    ["credenciamento.quaisFrotas", "Transportadora local e locadora de veículos (E2E)."],
    ["credenciamento.volume", "Até 40 veículos por mês (E2E)."],
    ["credenciamento.regiao", "Toledo e região (E2E)."],
  ],
  portfolio: [
    ["fotos.fachada", "sem_autorizacao"],
    ["fotos.funilaria", "sem_autorizacao"],
    ["fotos.pintura", "sem_autorizacao"],
    ["fotos.antesDepois", "sem_autorizacao"],
    ["fotos.autorizacaoPublicacao", "nao_autorizo"],
    ["fotos.restricoes", "Sem autorização de uso de imagens por enquanto (E2E)."],
  ],
  website_content: [
    ["site.telefone", "(45) 99999-9999"],
    ["site.whatsapp", "(45) 99999-9999"],
    ["site.email", "contato@masterchapeacao.com.br"],
    ["site.endereco", "Av. das Indústrias, 1234 — Centro, Toledo/PR"],
    ["site.horarios", "Segunda a sexta, das 8h às 18h"],
    ["site.redesSociais", "Instagram institucional (E2E)."],
    ["site.servicosDestaque", "Funilaria, pintura em estufa e martelinho de ouro (E2E)."],
    ["site.autorizacaoImagens", "nao_autorizo"],
    ["site.autorizacaoInformacoes", "autorizo"],
    ["site.responsavelAprovacao", "Proprietário (E2E)"],
    ["site.responsavelConteudo", "Proprietário (E2E)"],
  ],
  observations: [
    ["confirmacao.observacoes", "Levantamento de teste executado pelo percurso E2E (SPEC-074)."],
    ["confirmacao.documentosPendentes", "Seguro empresarial e certificados de equipe (E2E)."],
    ["confirmacao.responsavel", "Responsável de QA E2E"],
    ["confirmacao.data", "20/10/2026"],
  ],
};

/** Campos recusados por opção inexistente, reportados ao final do percurso. */
const preenchimentosRecusados: string[] = [];

/** Campos não encontrados na etapa (podem ser condicionais). */
const camposNaoEncontrados: string[] = [];

/** Títulos das 15 etapas, usados para esperar a transição de forma determinística. */
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

const CHECKBOXES: [string, boolean][] = [
  ["confirmacao.veracidade", true],
  ["confirmacao.ciencia", true],
  ["confirmacao.autorizacaoPublicacao", false],
];

/**
 * Preenche um campo pelo identificador persistido. Respostas curtas migradas
 * para radio group usam o controle com id `<campo>-<valor>`.
 */
async function fillField(page: Page, fieldId: string, value: string): Promise<void> {
  const radio = page.locator(`[id="${fieldId}-${value}"]`);
  if ((await radio.count()) > 0) {
    await radio.first().check({ force: true });
    return;
  }

  const locator = page.locator(`[id="${fieldId}"]`);
  if ((await locator.count()) === 0) {
    camposNaoEncontrados.push(fieldId);
    return;
  }

  // Data civil em segmentos: dia, mês e ano.
  if (fieldId === "confirmacao.data") {
    const [dia, mes, ano] = value.split("/");
    await page.getByLabel("Dia", { exact: true }).fill(dia ?? "");
    await page.getByLabel("Mês", { exact: true }).fill(mes ?? "");
    await page.getByLabel("Ano", { exact: true }).fill(ano ?? "");
    return;
  }

  if ((await locator.first().getAttribute("role")) === "combobox") {
    await locator.first().click();
    const option = page.getByRole("option", { name: value, exact: true });
    if ((await option.count()) === 0) {
      preenchimentosRecusados.push(`${fieldId} (opção "${value}" inexistente)`);
      return;
    }
    await option.first().click();
    return;
  }

  const tagName = await locator.first().evaluate((node) => node.tagName.toLowerCase());

  if (tagName === "select") {
    const options = await locator
      .first()
      .locator("option")
      .evaluateAll((nodes) => nodes.map((node) => (node as HTMLOptionElement).value));
    if (!options.includes(value)) {
      preenchimentosRecusados.push(`${fieldId} (opção "${value}" inexistente)`);
      return;
    }
    await locator.first().selectOption(value);
    return;
  }

  await locator.first().fill(value);
}

async function login(page: Page): Promise<void> {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "Entrar" })).toBeEnabled({ timeout: 20_000 });
  await page.getByRole("textbox", { name: "E-mail" }).fill(TEST_EMAIL);
  await page.getByLabel("Senha").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/briefing/);
}

async function resetTestBriefings(): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;

  const usersResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=50`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  if (!usersResponse.ok) return;

  const payload = (await usersResponse.json()) as { users?: { id: string; email?: string }[] };
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

async function readBriefing(): Promise<{
  briefing: Record<string, unknown>;
  answers: { section_key: string; answers: { values?: Record<string, string | boolean> } }[];
  activity: { action: string; created_at: string }[];
}> {
  const tokenResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY as string, "Content-Type": "application/json" },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
  });
  const { access_token: accessToken } = (await tokenResponse.json()) as { access_token: string };
  const headers = { apikey: SUPABASE_ANON_KEY as string, Authorization: `Bearer ${accessToken}` };

  const briefings = (await (
    await fetch(`${SUPABASE_URL}/rest/v1/briefings?select=*&order=updated_at.desc&limit=1`, {
      headers,
    })
  ).json()) as Record<string, unknown>[];
  const briefing = briefings[0]!;

  const answers = (await (
    await fetch(
      `${SUPABASE_URL}/rest/v1/briefing_answers?select=section_key,answers&briefing_id=eq.${briefing["id"]}`,
      { headers },
    )
  ).json()) as { section_key: string; answers: { values?: Record<string, string | boolean> } }[];

  const activity = (await (
    await fetch(
      `${SUPABASE_URL}/rest/v1/briefing_activity?select=action,created_at&briefing_id=eq.${briefing["id"]}&order=created_at`,
      {
        headers: SUPABASE_SERVICE_ROLE_KEY
          ? {
              apikey: SUPABASE_SERVICE_ROLE_KEY,
              Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            }
          : headers,
      },
    )
  ).json()) as { action: string; created_at: string }[];

  return { briefing, answers, activity };
}

test.describe("SPEC-074 — preenchimento completo das 15 etapas do briefing", () => {
  test.beforeAll(async () => {
    test.skip(
      !SUPABASE_URL || !SUPABASE_ANON_KEY,
      "SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios para o percurso E2E do briefing.",
    );
    await resetTestBriefings();
  });

  test("preenche as 15 etapas, envia e imprime as respostas persistidas", async ({
    page,
  }, testInfo) => {
    test.setTimeout(300_000);
    await page.route(/viacep\.com\.br/, (route) => route.abort("failed"));
    await login(page);

    await expect(
      page.getByRole("heading", { name: /Briefing operacional e credenciamento/i }),
    ).toBeVisible({ timeout: 20_000 });

    const stepButtons = page.getByRole("button", { name: /^Etapa \d+:/ });
    const totalSteps = await stepButtons.count();
    expect(totalSteps).toBe(15);

    for (let index = 0; index < 15; index += 1) {
      const stepId = Object.keys(RESPOSTAS)[index]!;
      const respostas = RESPOSTAS[stepId] ?? [];

      for (const [fieldId, value] of respostas) {
        await fillField(page, fieldId, value);
      }

      if (stepId === "observations") {
        for (const [fieldId, checked] of CHECKBOXES) {
          const box = page.locator(`[id="${fieldId}"]`);
          if ((await box.count()) === 0) continue;
          if (checked) await box.first().check();
          else await box.first().uncheck();
        }
      }

      await page.waitForTimeout(400);

      const next = page.getByRole("button", { name: "Próxima etapa" });
      if ((await next.count()) > 0) {
        await next.click();
        await expect(
          page.getByRole("heading", { name: STEP_TITLES[index + 1] as string }),
        ).toBeVisible({ timeout: 20_000 });
        await page.waitForTimeout(400);
      } else {
        await page.getByRole("button", { name: "Revisar respostas" }).click();
        await expect(page.getByText("Revisão final")).toBeVisible({ timeout: 20_000 });
      }
    }

    await expect(page.getByText("Revisão final")).toBeVisible({ timeout: 20_000 });
    await page.screenshot({ path: path.join(EVIDENCE_DIR, "briefing-revisao-completa-e2e.png") });

    const enviar = page.getByRole("button", { name: /Enviar para análise/i });
    await expect(enviar).toBeDisabled();
    await page.getByRole("checkbox", { name: /Confirmo que as informações/i }).check();
    await expect(enviar).toBeEnabled();
    await enviar.click();

    await expect(page).toHaveURL(/\/briefing\/confirmacao/, { timeout: 30_000 });
    await expect(page.getByText(/Briefing registrado no servidor/i)).toBeVisible();
    await page.screenshot({
      path: path.join(EVIDENCE_DIR, "briefing-confirmacao-completa-e2e.png"),
    });

    const registro = await readBriefing();
    writeFileSync(
      path.join(EVIDENCE_DIR, "briefing-respostas-15-etapas.json"),
      JSON.stringify(registro, null, 2),
      "utf8",
    );
    testInfo.attach("briefing-respostas", {
      body: JSON.stringify(registro, null, 2),
      contentType: "application/json",
    });

    console.log("\n=== REGISTRO PERSISTIDO (15 etapas) ===");
    console.log(JSON.stringify(registro.briefing, null, 2));
    console.log(`seções gravadas: ${registro.answers.length}`);
    console.log(
      `respostas: ${registro.answers.reduce(
        (total, section) => total + Object.keys(section.answers?.values ?? {}).length,
        0,
      )}`,
    );
    if (preenchimentosRecusados.length > 0) {
      console.log(`preenchimentos recusados: ${preenchimentosRecusados.join(", ")}`);
    }
    if (camposNaoEncontrados.length > 0) {
      console.log(`campos não encontrados: ${camposNaoEncontrados.join(", ")}`);
    }

    expect(registro.answers).toHaveLength(15);
    expect(registro.briefing["status"]).toBe("submitted");
  });
});
