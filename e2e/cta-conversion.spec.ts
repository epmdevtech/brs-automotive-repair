import { test, expect } from "@playwright/test";

test.describe("SPEC-022 — Padronização de Botões, Elementos de Forma e Limpeza do Hero E2E", () => {
  test("valida padronização de botões, touch target e navegação do Hero e Header CTA", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Valida CTA da Navbar: primário, acessível e sem chanfro
    const headerCta = page.locator("header a[href='/contato']").first();
    await expect(headerCta).toBeVisible();
    await expect(headerCta).toHaveClass(/btn--primary/);
    await expect(headerCta).not.toHaveClass(/btn-bevel-4/);

    const headerBox = await headerCta.boundingBox();
    expect(headerBox).not.toBeNull();
    // Altura mínima compacta (>= 34px no header)
    expect(headerBox!.height).toBeGreaterThanOrEqual(34);

    // Valida que o Hero NÃO duplica o CTA 'Solicitar avaliação' (SPEC-022)
    const heroDuplicateCta = page.locator("#inicio a[href='/contato']");
    await expect(heroDuplicateCta).toHaveCount(0);

    // Valida que o Hero possui exclusivamente o botão secundário 'Conhecer os serviços'
    const heroSecondaryCta = page.locator("#inicio a[href='/servicos']").first();
    await expect(heroSecondaryCta).toBeVisible();
    await expect(heroSecondaryCta).toHaveClass(/btn--secondary/);
    await expect(heroSecondaryCta).not.toHaveClass(/btn-bevel-4/);
    await expect(heroSecondaryCta).toHaveText(/conhecer os serviços/i);

    const heroBox = await heroSecondaryCta.boundingBox();
    expect(heroBox).not.toBeNull();
    expect(Math.round(heroBox!.height)).toBeGreaterThanOrEqual(44);

    // Clique e transição para /servicos
    await heroSecondaryCta.click();
    await expect(page).toHaveURL(/\/servicos/);
  });

  test("valida botões de serviço com classe canônica .btn--secondary em /servicos", async ({
    page,
  }) => {
    await page.goto("/servicos");
    await page.waitForLoadState("networkidle");

    // Verifica que os botões de especialidade possuem classe secundária sem chanfro
    const funilariaBtn = page.getByRole("link", { name: /conhecer funilaria/i });
    await expect(funilariaBtn).toBeVisible();
    await expect(funilariaBtn).toHaveClass(/btn--secondary/);
    await expect(funilariaBtn).not.toHaveClass(/btn-bevel-4/);

    const pinturaBtn = page.getByRole("link", { name: /conhecer a pintura/i });
    await expect(pinturaBtn).toBeVisible();
    await expect(pinturaBtn).toHaveClass(/btn--secondary/);
    await expect(pinturaBtn).not.toHaveClass(/btn-bevel-4/);

    const martelinhoBtn = page.getByRole("link", { name: /entender o martelinho/i });
    await expect(martelinhoBtn).toBeVisible();
    await expect(martelinhoBtn).toHaveClass(/btn--secondary/);
    await expect(martelinhoBtn).not.toHaveClass(/btn-bevel-4/);

    // Valida navegação para a rota especializada
    await martelinhoBtn.click();
    await expect(page).toHaveURL("/servicos/martelinho-de-ouro");
  });

  test("valida fluxo do formulário de contato, máquina de estados e modal em /contato", async ({
    page,
    context,
  }) => {
    // Permissão para clipboard no Chromium
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    await page.goto("/contato");
    await page.waitForLoadState("networkidle");

    const submitBtn = page.getByRole("button", { name: /preparar mensagem/i });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toHaveClass(/btn--primary/);
    await expect(submitBtn).not.toHaveClass(/btn-bevel-4/);

    // Submissão vazia deve exibir validação sem abrir diálogo
    await submitBtn.click();
    await expect(page.getByText(/informe seu nome/i)).toBeVisible();
    await expect(page.locator("role=dialog")).not.toBeVisible();

    // Preenchimento de dados válidos
    await page.getByPlaceholder(/como podemos chamar você/i).fill("Juliana Mendes");
    await page.getByPlaceholder(/\(45\) 90000-0000/i).fill("(45) 99123-4567");
    await page
      .getByPlaceholder(/descreva a peça afetada/i)
      .fill("Pequeno amassado no paralama dianteiro sem raspar o verniz.");

    // Envio do formulário
    await submitBtn.click();

    // Dialog modal abre com a mensagem formatada
    const dialog = page.locator("role=dialog");
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/mensagem pronta para envio/i)).toBeVisible();

    // Valida botões dentro do modal
    const copyBtn = dialog.getByRole("button", { name: /copiar mensagem/i });
    await expect(copyBtn).toBeVisible();
    await expect(copyBtn).toHaveClass(/btn--secondary/);
    await expect(copyBtn).not.toHaveClass(/btn-bevel-4/);

    const instagramBtn = dialog.getByRole("link", { name: /abrir instagram/i });
    await expect(instagramBtn).toBeVisible();
    await expect(instagramBtn).toHaveClass(/btn--primary/);
    await expect(instagramBtn).not.toHaveClass(/btn-bevel-4/);
    await expect(instagramBtn).toHaveAttribute(
      "href",
      "https://www.instagram.com/masterchapeacao2022/",
    );

    // Clique para copiar
    await copyBtn.click();
    await expect(dialog.getByText(/mensagem copiada/i)).toBeVisible();
  });

  test("valida acessibilidade e navegação por teclado (Tab) nos CTAs", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Foca o primeiro elemento interativo da navegação do cabeçalho
    const firstLink = page.locator("header a").first();
    await firstLink.focus();

    // Tabula pelos elementos até alcançar o CTA da navbar
    for (let i = 0; i < 10; i++) {
      const currentText = await page.evaluate(
        () => document.activeElement?.textContent?.trim() || "",
      );
      if (/solicitar avaliação/i.test(currentText)) {
        break;
      }
      await page.keyboard.press("Tab");
    }

    const focusedElement = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(focusedElement).toMatch(/solicitar avaliação/i);

    // Valida anel de foco visível ou outline presente
    const hasFocusRing = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const comp = window.getComputedStyle(el);
      return (
        comp.outlineStyle !== "none" ||
        comp.boxShadow.includes("rgb") ||
        el.classList.contains("focus-visible:ring-2") ||
        el.className.includes("ring")
      );
    });
    expect(hasFocusRing).toBe(true);
  });
});
