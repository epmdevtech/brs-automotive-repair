import { test, expect } from "@playwright/test";

test.describe("SPEC-026 — Imagens Distintas e Eliminação de Repetição Visual E2E", () => {
  test("valida que o comparador Antes e Depois da Home possui imagens distintas carregadas", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const demoSection = page.locator("#demonstracao");
    await expect(demoSection).toBeVisible();

    const images = demoSection.locator("img");
    await expect(images).toHaveCount(2);

    const src1 = await images.nth(0).getAttribute("src");
    const src2 = await images.nth(1).getAttribute("src");

    expect(src1).not.toBeNull();
    expect(src2).not.toBeNull();
    expect(src1).not.toBe(src2);

    // Valida que nenhuma imagem usa filtros artificiais
    const class1 = (await images.nth(0).getAttribute("class")) || "";
    const class2 = (await images.nth(1).getAttribute("class")) || "";
    expect(class1).not.toContain("filter contrast-125");
    expect(class2).not.toContain("filter contrast-125");
  });

  test("valida que a galeria em /trabalhos possui 3 pares distintos de imagens", async ({
    page,
  }) => {
    await page.goto("/trabalhos");
    await page.waitForLoadState("networkidle");

    const sliders = page.getByRole("slider");
    await expect(sliders).toHaveCount(3);

    // Em cada slider, as 2 imagens devem ser distintas entre si
    for (let i = 0; i < 3; i++) {
      const slider = sliders.nth(i);
      const images = slider.locator("img");
      await expect(images).toHaveCount(2);

      const beforeSrc = await images.nth(0).getAttribute("src");
      const afterSrc = await images.nth(1).getAttribute("src");

      expect(beforeSrc).not.toBeNull();
      expect(afterSrc).not.toBeNull();
      expect(beforeSrc).not.toBe(afterSrc);
    }
  });

  test("valida que as páginas de serviços possuem imagens distintas entre si", async ({ page }) => {
    const routes = [
      "/servicos/funilaria",
      "/servicos/pintura-automotiva",
      "/servicos/martelinho-de-ouro",
      "/para-corretores",
    ];

    const serviceImages: string[] = [];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      // Localiza a imagem principal ilustrativa da página
      const heroImg = page.locator("img[alt*='ilustrativa']").first();
      await expect(heroImg).toBeVisible();
      const src = await heroImg.getAttribute("src");
      expect(src).not.toBeNull();
      serviceImages.push(src!);
    }

    // Todas as imagens principais devem ser distintas
    const uniqueImages = new Set(serviceImages);
    expect(uniqueImages.size).toBe(routes.length);
  });
});
