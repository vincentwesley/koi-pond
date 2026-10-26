import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("axe clean dark", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1000);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("axe clean light (toggle only)", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("html").getAttribute("data-theme")).toBe("dark");
  await page.locator("#theme").click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.waitForTimeout(500);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("canvas hidden from AT, text alternative present", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#pond")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator(".pond .sr-only")).toContainText("pond");
});

test("keyboard toggles; sound off until clicked", async ({ page }) => {
  await page.goto("/");
  const sound = page.locator("#sound"), theme = page.locator("#theme");
  await expect(sound).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Tab");
  await expect(sound).toBeFocused();
  expect(await sound.evaluate((e) => getComputedStyle(e).outlineStyle)).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(sound).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Tab");
  await expect(theme).toBeFocused();
  await page.keyboard.press("Space");
  await expect(theme).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
