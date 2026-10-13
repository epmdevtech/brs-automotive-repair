import { test, expect } from "@playwright/test";

test.describe("Scroll Reveal & Motion Validation", () => {
  test("audit elements with scroll reveal on homepage", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check if reduced-motion is requested or evaluated
    const reducedMotion = await page.evaluate(() => {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });
    console.log("Browser reduced motion:", reducedMotion);

    // Check Philosophy section element
    const philosophyHeader = page.locator("section:has-text('Padrão de execução')");
    await expect(philosophyHeader).toBeVisible();

    // Check initial styles or attributes
    const elementsInfo = await page.evaluate(() => {
      const allReveals = Array.from(document.querySelectorAll("[data-reveal], [style*='opacity']"));
      return allReveals.map((el) => {
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          classes: el.className,
          styleAttr: el.getAttribute("style"),
          opacity: computed.opacity,
          transform: computed.transform,
          top: rect.top,
          text: el.textContent?.slice(0, 30),
        };
      });
    });

    console.log("Found reveal elements:", JSON.stringify(elementsInfo, null, 2));

    // Scroll down to philosophy section
    await page.evaluate(() => window.scrollTo({ top: 2500, behavior: "instant" }));
    await page.waitForTimeout(1000);

    const afterScrollInfo = await page.evaluate(() => {
      const section = Array.from(document.querySelectorAll("section")).find((s) =>
        s.textContent?.includes("Padrão de execução"),
      );
      if (!section) return [];
      const allReveals = Array.from(section.querySelectorAll("[style*='opacity'], .pillar"));
      return allReveals.map((el) => {
        const computed = window.getComputedStyle(el);
        return {
          tag: el.tagName,
          classes: el.className,
          styleAttr: el.getAttribute("style"),
          opacity: computed.opacity,
          transform: computed.transform,
          text: el.textContent?.slice(0, 30),
        };
      });
    });

    console.log("After scroll info:", JSON.stringify(afterScrollInfo, null, 2));
  });
});
