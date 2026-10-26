import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("no WebGL2: fallback shown, axe clean", async ({ page }) => {
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
      return type === "webgl2" ? null : (orig as (...a: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof orig;
  });
  await page.goto("/");
  await expect(page.locator("#fallback")).toBeVisible();
  await expect(page.locator("#fallback")).toContainText("WebGL2");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
