import { test, expect } from "@playwright/test";

test.describe("SPEC-025 — Comparador Antes e Depois na Home e Galeria E2E", () => {
  test("valida a seção de demonstração na Home, manipulação por teclado e navegação para /trabalhos", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Localiza a seção de demonstração
    const demoSection = page.locator("#demonstracao");
    await expect(demoSection).toBeVisible();

    // Valida título da seção
    await expect(demoSection.getByRole("heading", { level: 2 })).toContainText(
      "Recuperação estrutural com padrão de fábrica",
    );

    // Valida o slider na Home
    const slider = demoSection.getByRole("slider");
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute("aria-valuenow", "50");

    // Interação via teclado no slider (ArrowRight aumenta para 55)
    await slider.focus();
    await page.keyboard.press("ArrowRight");
    await expect(slider).toHaveAttribute("aria-valuenow", "55");

    // Interação via PageUp / PageDown
    await page.keyboard.press("PageDown");
    await expect(slider).toHaveAttribute("aria-valuenow", "45");

    // Valida clique no CTA 'Ver galeria completa' e transição para /trabalhos
    const galleryCta = demoSection.getByRole("link", { name: /ver galeria completa/i });
    await expect(galleryCta).toBeVisible();
    await galleryCta.click();

    await expect(page).toHaveURL(/\/trabalhos/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Casos de Reparação e Acabamento",
    );
  });

  test("valida que a página /trabalhos reutiliza o BeforeAfterSlider nos casos técnicos", async ({
    page,
  }) => {
    await page.goto("/trabalhos");
    await page.waitForLoadState("networkidle");

    // Devem existir 3 sliders correspondentes aos 3 casos de serviços
    const sliders = page.getByRole("slider");
    await expect(sliders).toHaveCount(3);

    // Valida que o primeiro slider de Funilaria responde a arraste/clique
    const firstSlider = sliders.first();
    await expect(firstSlider).toBeVisible();
    await firstSlider.scrollIntoViewIfNeeded();
    const box = await firstSlider.boundingBox();
    expect(box).not.toBeNull();

    // Simula clique próximo ao terço direito (posição ~70%)
    await page.mouse.click(box!.x + box!.width * 0.7, box!.y + box!.height / 2);
    const valueNow = await firstSlider.getAttribute("aria-valuenow");
    expect(Number(valueNow)).toBeGreaterThanOrEqual(60);
  });
});
