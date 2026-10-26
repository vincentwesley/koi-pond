import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("reduced motion: renders, rAF loop stops", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __raf: number };
    w.__raf = 0;
    const orig = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => { w.__raf++; return orig(cb); };
  });
  await page.goto("/");
  await expect(page.locator("#pond")).toBeVisible();
  await expect(page.locator("#fallback")).toBeHidden();
  await page.waitForTimeout(1500);
  const a = await page.evaluate(() => (window as unknown as { __raf: number }).__raf);
  await page.waitForTimeout(1000);
  const b = await page.evaluate(() => (window as unknown as { __raf: number }).__raf);
  expect(b - a).toBeLessThanOrEqual(2);
});
