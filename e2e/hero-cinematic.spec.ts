import { test, expect } from "@playwright/test";

test.describe("SPEC-067: Hero Abertura Cinematográfica e Validação E2E", () => {
  test("Desktop: sequência cinematográfica sem erros de console ou hidratação", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // 0s: Imagem do Hero carregada como LCP e CTA clicável desde o início
    const heroImg = page.locator(".hero-photo-cinematic");
    await expect(heroImg).toBeVisible();

    const ctaButton = page.locator("a[href='/contato']").first();
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();

    // Capturas de validação temporal
    await page.waitForTimeout(1000); // 1s: Header visível
    const header = page.locator("header");
    await expect(header).toBeVisible();

    await page.waitForTimeout(2000); // 3s: UI completa visível
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("Funilaria, pintura");

    await page.waitForTimeout(2000); // 5s: Zoom em andamento e reflexo de luz executado
    await page.waitForTimeout(5000); // 10s: Composição estável, sem loop

    // Verifica ausência de overflow horizontal
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    // Filtra erros irrelevantes de extensões ou terceiros caso existam
    const appErrors = consoleErrors.filter(
      (err) => !err.includes("favicon") && !err.includes("chrome-extension"),
    );
    expect(appErrors).toHaveLength(0);
  });

  test("Mobile: viewport estreito preserva proporções e sem overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    const heroImg = page.locator(".hero-photo-cinematic");
    await expect(heroImg).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test("Reduced Motion: UI completa e visível imediatamente sem atrasos", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const heroSection = page.locator("#inicio");
    await expect(heroSection).toHaveClass(/hero-intro-complete/);

    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
  });
});
