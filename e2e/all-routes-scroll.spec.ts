import { test, expect } from "@playwright/test";

const routes = [
  { path: "/", name: "Home" },
  { path: "/servicos", name: "Serviços Index" },
  { path: "/servicos/funilaria", name: "Serviço Funilaria" },
  { path: "/servicos/pintura-automotiva", name: "Serviço Pintura" },
  { path: "/servicos/martelinho-de-ouro", name: "Serviço Martelinho" },
  { path: "/trabalhos", name: "Trabalhos" },
  { path: "/para-corretores", name: "Para Corretores" },
  { path: "/sobre", name: "Sobre" },
  { path: "/contato", name: "Contato" },
];

for (const route of routes) {
  test(`verify scroll animation and visibility on ${route.name} (${route.path})`, async ({
    page,
  }) => {
    await page.goto(route.path);
    await page.waitForLoadState("networkidle");

    // Scroll down progressively in increments of 400px
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log(`[${route.name}] scrollHeight: ${scrollHeight}`);

    for (let pos = 400; pos < scrollHeight; pos += 400) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), pos);
      await page.waitForTimeout(100);
    }

    // Scroll to the very bottom
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
    );
    await page.waitForTimeout(800);

    // Verify if any element is stuck with opacity: 0
    const hiddenElements = await page.evaluate(() => {
      const candidates = Array.from(
        document.querySelectorAll("main [style*='opacity'], main [data-reveal]"),
      );
      return candidates
        .filter((el) => {
          const comp = window.getComputedStyle(el);
          const opacity = parseFloat(comp.opacity);
          // If opacity is near 0 and element has visible dimensions
          const rect = el.getBoundingClientRect();
          return opacity < 0.1 && rect.width > 0 && rect.height > 0;
        })
        .map((el) => ({
          tag: el.tagName,
          classes: el.className.slice(0, 50),
          style: el.getAttribute("style"),
          text: el.textContent?.slice(0, 40).trim(),
        }));
    });

    console.log(`[${route.name}] Hidden elements after full scroll:`, hiddenElements.length);
    if (hiddenElements.length > 0) {
      console.log(
        `[${route.name}] Stuck hidden elements:`,
        JSON.stringify(hiddenElements, null, 2),
      );
    }

    expect(hiddenElements.length).toBe(0);
  });
}
