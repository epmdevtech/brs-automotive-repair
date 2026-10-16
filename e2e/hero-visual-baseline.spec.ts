import { test, expect, type Page } from "@playwright/test";

/**
 * SPEC-069 — Trava anti-regressão visual do Hero.
 *
 * Garante que o pipeline de imagem responsivo (AVIF/WebP + srcset/sizes) e o
 * preload casado não alteraram a composição do perfil `veiculo-inteiro`.
 *
 * Requer o servidor de desenvolvimento em execução (`bun run dev`, porta 5210).
 */

interface HeroViewport {
  name: string;
  viewport: { width: number; height: number };
  reducedMotion?: boolean;
}

const VIEWPORTS: HeroViewport[] = [
  { name: "desktop", viewport: { width: 1280, height: 800 } },
  { name: "mobile", viewport: { width: 375, height: 667 } },
  { name: "reduced-motion", viewport: { width: 1280, height: 800 }, reducedMotion: true },
];

const TIMELINE_MARKS_MS = [0, 5000, 6000, 10000];

async function prepareHero(page: Page, vp: HeroViewport) {
  if (vp.reducedMotion) {
    await page.emulateMedia({ reducedMotion: "reduce" });
  }
  await page.setViewportSize(vp.viewport);
  await page.goto("/");

  const hero = page.locator("#inicio");
  await expect(hero).toBeVisible();

  const image = page.locator("img.hero-photo-cinematic");
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((el) => (el as HTMLImageElement).complete)).toBe(true);

  await page.evaluate(() => (document as Document & { fonts: FontFaceSet }).fonts.ready);
  return hero;
}

test.describe("SPEC-069: Baseline visual do Hero (perfil veiculo-inteiro)", () => {
  for (const vp of VIEWPORTS) {
    test(`${vp.name}: composição settled estável (sem regressão)`, async ({ page }) => {
      const hero = await prepareHero(page, vp);

      await expect(hero).toHaveClass(/hero-intro-complete/, { timeout: 12000 });

      await expect(hero).toHaveScreenshot(`hero-${vp.name}-settled.png`, {
        animations: "disabled",
        maxDiffPixelRatio: 0.03,
      });
    });

    test(`${vp.name}: evidência de linha do tempo 0/5/6/10 s`, async ({ page }, testInfo) => {
      const hero = await prepareHero(page, vp);

      let elapsed = 0;
      for (const mark of TIMELINE_MARKS_MS) {
        await page.waitForTimeout(mark - elapsed);
        elapsed = mark;
        await hero.screenshot({
          path: testInfo.outputPath(`hero-${vp.name}-t${mark / 1000}s.png`),
        });
      }
    });
  }
});
