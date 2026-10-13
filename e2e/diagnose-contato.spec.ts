import { test } from "@playwright/test";

test("diagnose contato route animations", async ({ page }) => {
  // Capture console messages
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

  await page.goto("/contato");
  await page.waitForLoadState("networkidle");

  const initialCheck = await page.evaluate(() => {
    const main = document.querySelector("main");
    const elements = Array.from(document.querySelectorAll("main *")).filter((el) => {
      const s = el.getAttribute("style");
      return s && s.includes("opacity");
    });
    return elements.map((el) => {
      const comp = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        text: el.textContent?.slice(0, 30),
        rect: { top: rect.top, height: rect.height },
        styleAttr: el.getAttribute("style"),
        opacity: comp.opacity,
        transform: comp.transform,
      };
    });
  });

  console.log("INITIAL CHECK ON /contato:", JSON.stringify(initialCheck, null, 2));

  // Check window height and scroll position
  const winInfo = await page.evaluate(() => ({
    innerHeight: window.innerHeight,
    scrollY: window.scrollY,
    documentHeight: document.documentElement.scrollHeight,
  }));
  console.log("WINDOW INFO:", winInfo);
});
