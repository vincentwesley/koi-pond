import { test, expect } from "@playwright/test";

async function load(page: import("@playwright/test").Page, q: string) {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/" + q);
  await expect(page.locator("canvas#pond")).toBeVisible();
  await page.waitForTimeout(1500);
  return errors;
}

test("night+winter renders and differs from day+summer", async ({ page }) => {
  test.setTimeout(120_000); // software GL is slow
  const e1 = await load(page, "?time=night&season=winter");
  const a = await page.locator("#pond").screenshot();
  const e2 = await load(page, "?time=day&season=summer");
  const b = await page.locator("#pond").screenshot();
  expect(e1).toEqual([]);
  expect(e2).toEqual([]);
  expect(a.equals(b)).toBe(false);
});

test("invalid overrides are ignored", async ({ page }) => {
  const errors = await load(page, "?time=banana&season=;drop");
  expect(errors).toEqual([]);
  await expect(page.locator("#pond")).toBeVisible();
});

test("embed with mood stays canvas-only", async ({ page }) => {
  const errors = await load(page, "?embed=1&time=dusk");
  expect(errors).toEqual([]);
  await expect(page.locator("#sound")).toBeHidden();
  await expect(page.locator(".chrome").first()).toBeHidden();
});
