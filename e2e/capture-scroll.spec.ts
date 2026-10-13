import { test } from "@playwright/test";

test("capture screenshots during scroll on home", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.screenshot({ path: "test-results/screenshot-top.png" });

  await page.evaluate(() => window.scrollTo({ top: 800, behavior: "smooth" }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "test-results/screenshot-scroll-800.png" });

  await page.evaluate(() => window.scrollTo({ top: 1600, behavior: "smooth" }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "test-results/screenshot-scroll-1600.png" });

  await page.evaluate(() => window.scrollTo({ top: 2400, behavior: "smooth" }));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "test-results/screenshot-scroll-2400.png" });
});
