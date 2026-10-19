import { test, expect } from "@playwright/test";

test.describe("Scroll Reveal Motion Behavior", () => {
  test("services and leva-e-traz below fold animate in when scrolled into view", async ({
    page,
  }) => {
    await page.goto("/servicos");
    await page.waitForLoadState("networkidle");

    const levaETraz = page.locator("#leva-e-traz");
    await expect(levaETraz).toBeAttached();

    // Initial opacity before scrolling down
    const initialOpacity = await levaETraz.evaluate((el) => window.getComputedStyle(el).opacity);
    console.log("Guincho opacity before scroll:", initialOpacity);
    expect(parseFloat(initialOpacity)).toBe(0);

    // Scroll into view
    await levaETraz.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const animatedOpacity = await levaETraz.evaluate((el) => window.getComputedStyle(el).opacity);
    console.log("Guincho opacity after scroll:", animatedOpacity);
    expect(parseFloat(animatedOpacity)).toBeGreaterThan(0.9);
  });

  test("homepage sections below fold animate in sequentially as user scrolls", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // 1. Philosophy section is below fold
    const philosophy = page.locator("section:has-text('Padrão de execução')");
    await expect(philosophy).toBeAttached();

    const philBeforeScroll = await philosophy.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const firstReveal = el.querySelector("[style*='opacity']");
      return {
        top: rect.top,
        opacity: firstReveal ? window.getComputedStyle(firstReveal).opacity : "none",
      };
    });
    console.log("Philosophy before scroll:", philBeforeScroll);
    expect(parseFloat(philBeforeScroll.opacity)).toBe(0);

    // Scroll philosophy into view
    await philosophy.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const philAfterScroll = await philosophy.evaluate((el) => {
      const firstReveal = el.querySelector("[style*='opacity']");
      return firstReveal ? window.getComputedStyle(firstReveal).opacity : "none";
    });
    console.log("Philosophy after scroll:", philAfterScroll);
    expect(parseFloat(philAfterScroll)).toBeGreaterThan(0.9);

    // 2. HomePathways section is further down
    const pathways = page.locator("section:has-text('Escolha por onde continuar')");
    await expect(pathways).toBeAttached();

    // Scroll pathways into view
    await pathways.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const pathwaysOpacity = await pathways.evaluate((el) => {
      const firstReveal = el.querySelector("[style*='opacity']");
      return firstReveal ? window.getComputedStyle(firstReveal).opacity : "none";
    });
    console.log("Pathways after scroll:", pathwaysOpacity);
    expect(parseFloat(pathwaysOpacity)).toBeGreaterThan(0.9);
  });
});
