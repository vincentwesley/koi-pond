import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("embed: canvas only, pan-y, axe clean", async ({ page }) => {
  await page.goto("/?embed=1");
  await page.waitForTimeout(1000);
  await expect(page.locator("#pond")).toBeVisible();
  await expect(page.locator(".chrome").first()).toBeHidden();
  await expect(page.locator("#sound")).toBeHidden();
  expect(await page.locator("#pond").evaluate((e) => getComputedStyle(e).touchAction)).toBe("pan-y");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
