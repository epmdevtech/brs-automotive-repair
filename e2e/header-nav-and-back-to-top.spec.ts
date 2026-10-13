import { test, expect } from "@playwright/test";

test.describe("SPEC-024 — Menu Hamburguer Desktop, Remoção do Ícone Flutuante e Botão Voltar ao Topo", () => {
  test("valida que o menu hamburguer está estritamente oculto no Desktop (1280x720) e a navbar visível", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Botão de menu hamburguer NÃO deve ser visível no desktop
    const hamburgerBtn = page.getByRole("button", { name: "Abrir menu de navegação" });
    await expect(hamburgerBtn).toBeHidden();

    // Links de navegação horizontal primária DEVEM estar visíveis no desktop
    const desktopNav = page.getByRole("navigation", { name: "Navegação principal" });
    await expect(desktopNav).toBeVisible();
    await expect(desktopNav.getByRole("link", { name: "Início" })).toBeVisible();
    await expect(desktopNav.getByRole("link", { name: "Serviços" })).toBeVisible();
  });

  test("valida que o menu hamburguer é exibido e funcional em dispositivos móveis (375x667)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // No mobile, o botão do hamburguer DEVE estar visível
    const hamburgerBtn = page.getByRole("button", { name: "Abrir menu de navegação" });
    await expect(hamburgerBtn).toBeVisible();

    // A navegação horizontal desktop primária deve estar oculta
    const desktopNav = page.getByRole("navigation", { name: "Navegação principal" });
    await expect(desktopNav).toBeHidden();

    // Ao clicar no hamburguer, o menu móvel deve abrir
    await hamburgerBtn.click();
    const mobileNav = page.getByRole("navigation", { name: "Navegação móvel" });
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Início" })).toBeVisible();
  });

  test("valida que o ícone flutuante de telefone/whatsapp foi completamente removido", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Nenhum botão flutuante com 'Ligar para a central de atendimento' deve existir
    const floatingPhoneBtn = page.locator("a[aria-label*='Ligar para a central']");
    await expect(floatingPhoneBtn).toHaveCount(0);
  });

  test("valida ciclo de visibilidade e rolagem suave do botão Voltar ao Topo", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const backToTopBtn = page.getByRole("button", { name: "Voltar ao topo da página" });

    // No topo da página (scrollY = 0), o botão deve estar oculto
    await expect(backToTopBtn).toBeHidden();

    // Rola a página para baixo (> 400px)
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(300);

    // O botão deve transicionar para visível
    await expect(backToTopBtn).toBeVisible();

    // Ao clicar, a página deve retornar ao topo
    await backToTopBtn.click();
    await page.waitForTimeout(600);

    const currentScrollY = await page.evaluate(() => window.scrollY);
    expect(currentScrollY).toBe(0);
  });
});
