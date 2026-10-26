import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 375, height: 667 }, hasTouch: true, isMobile: true });

test("embed: touch tap on canvas does not throw and changes pixels", async ({ page }) => {
  const errs: string[] = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(e.message));
  await page.goto("/?embed=1");
  await page.waitForTimeout(1000);
  const pond = page.locator("#pond");
  const a = await pond.screenshot();
  await pond.tap();
  await page.waitForTimeout(300);
  const b = await pond.screenshot();
  expect(a.equals(b)).toBe(false);
  expect(errs).toEqual([]);
});
