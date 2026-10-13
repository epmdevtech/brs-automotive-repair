import { test, expect } from "@playwright/test";

test.describe("SPEC-027 & SPEC-028 — Rotas de Proposta Comercial no Navegador Real", () => {
  test("SPEC-028: carrega a proposta comercial modular da BRS, interage com módulos e valida responsividade", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/proposta/brs-reparacoes");
    await page.waitForLoadState("networkidle");

    // Valida cabeçalho e títulos da proposta modular
    await expect(page.getByText("Preparada para BRS Reparações Automotivas")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Uma estrutura digital preparada para a próxima fase da BRS.",
        exact: true,
      }),
    ).toBeVisible();

    // Valida a barra de navegação com as âncoras modulares
    const navProposal = page.getByRole("navigation", { name: "Navegação da proposta comercial" });
    await expect(navProposal).toBeVisible();
    await expect(navProposal.getByRole("link", { name: "Módulos de Software" })).toBeVisible();
    await expect(navProposal.getByRole("link", { name: "Matriz Comparativa" })).toBeVisible();
    await expect(navProposal.getByRole("link", { name: "Pacotes Sugeridos" })).toBeVisible();
    await expect(navProposal.getByRole("link", { name: "Custos & Infra" })).toBeVisible();

    // Valida presença dos 6 módulos no catálogo
    const catalog = page.locator("#modulos");
    await expect(catalog.getByRole("heading", { name: "EPM Web", exact: true })).toBeVisible();
    await expect(
      catalog.getByRole("heading", { name: "EPM Booking Auto", exact: true }),
    ).toBeVisible();
    await expect(catalog.getByRole("heading", { name: "EPM CRM Auto", exact: true })).toBeVisible();
    await expect(catalog.getByRole("heading", { name: "EPM Oficina", exact: true })).toBeVisible();
    await expect(catalog.getByRole("heading", { name: "EPM Connect", exact: true })).toBeVisible();
    await expect(catalog.getByRole("heading", { name: "EPM Insights", exact: true })).toBeVisible();

    // Valida matriz comparativa das soluções
    await expect(page.getByText("Matriz Comparativa das Soluções")).toBeVisible();

    // Valida os pacotes sugeridos
    await expect(page.getByText("Alternativa 4 — Operação Digital")).toBeVisible();

    // Valida custos de terceiros e infraestrutura
    await expect(page.getByText("Registro de Domínio Oficial (.com.br)")).toBeVisible();

    // Valida 9 etapas de execução
    await expect(page.getByText("Ciclo de Execução em 9 Etapas")).toBeVisible();

    // Salva screenshot em desktop
    await page.screenshot({ path: "e2e-screenshots/modular-proposal-desktop.png", fullPage: true });

    // Testa seleção interativa de pacote de 1 clique
    const bundleBtn = page.getByRole("button", { name: /selecionar esta combinação/i }).first();
    if (await bundleBtn.isVisible()) {
      await bundleBtn.click();
    }

    // Valida abertura do modal de manifestação de interesse
    const ctaButton = page.getByRole("button", {
      name: "Manifestar interesse na seleção",
      exact: true,
    });
    await expect(ctaButton).toBeVisible();
    await ctaButton.click();

    // Valida modal de interesse aberto com mensagem prévia
    await expect(page.getByText("Manifestação de Interesse Comercial")).toBeVisible();
    await expect(page.getByRole("button", { name: /copiar texto/i })).toBeVisible();

    // Fecha o modal
    await page.keyboard.press("Escape");
    await expect(page.getByText("Manifestação de Interesse Comercial")).toBeHidden();

    // Valida ausência de erros graves no console
    const fatalErrors = consoleErrors.filter(
      (err) => !err.includes("favicon") && !err.includes("Download the React DevTools"),
    );
    expect(fatalErrors).toHaveLength(0);
  });

  test("SPEC-028: valida responsividade mobile da proposta modular (viewport 375x812)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/proposta/brs-reparacoes");
    await page.waitForLoadState("networkidle");

    // Valida elementos no celular
    await expect(page.getByText("Preparada para BRS Reparações Automotivas")).toBeVisible();
    await expect(
      page.locator("#modulos").getByRole("heading", { name: "EPM Web", exact: true }),
    ).toBeVisible();

    // Screenshot mobile
    await page.screenshot({ path: "e2e-screenshots/modular-proposal-mobile.png", fullPage: true });
  });

  test("carrega a raiz /proposta e navega via botão direto para a proposta modular da BRS", async ({
    page,
  }) => {
    await page.goto("/proposta");
    await page.waitForLoadState("networkidle");

    const directButton = page.getByRole("link", { name: /abrir proposta modular brs/i });
    await expect(directButton).toBeVisible();

    await directButton.click();
    await page.waitForURL("**/proposta/brs-reparacoes");
    await expect(page.getByText("Preparada para BRS Reparações Automotivas")).toBeVisible();
  });
});
