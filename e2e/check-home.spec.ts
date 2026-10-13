import { test } from "@playwright/test";

test("check homepage errors and content", async ({ page }) => {
  page.on("console", (msg) => console.log("HOME CONSOLE:", msg.type(), msg.text()));
  page.on("pageerror", (err) => console.log("HOME ERROR:", err));

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const html = await page.evaluate(() => document.body.innerHTML);
  console.log("HOME BODY LENGTH:", html.length);
  console.log("HOME FIRST 500 CHARS:", html.slice(0, 500));
  console.log("HOME LAST 500 CHARS:", html.slice(-500));
});
