import { test, expect, type Page } from "@playwright/test";

/** Tap the canvas, return how many bytes differ between before/after canvas screenshots. */
test.setTimeout(90_000);
async function tapDiff(page: Page): Promise<number> {
  const pond = page.locator("#pond");
  const box = (await pond.boundingBox())!;
  const clip = { x: box.x, y: box.y, width: Math.min(box.width, 640), height: Math.min(box.height, 480) };
  const a = await page.screenshot({ clip });
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(300);
  const b = await page.screenshot({ clip });
  let n = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) n++;
  return n + Math.abs(a.length - b.length);
}

function collect(page: Page): string[] {
  const errs: string[] = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(e.message));
  return errs;
}

test("ripple fallback (no float render targets) renders and reacts to taps", async ({ page }) => {
  await page.addInitScript(() => {
    const orig = WebGL2RenderingContext.prototype.getExtension;
    WebGL2RenderingContext.prototype.getExtension = function (this: WebGL2RenderingContext, name: string) {
      return name.startsWith("EXT_color_buffer_") ? null : orig.call(this, name);
    } as typeof orig;
  });
  const errs = collect(page);
  await page.goto("/");
  await page.waitForTimeout(1000);
  await expect(page.locator("#fallback")).toBeHidden();
  await expect(page.locator("#pond")).toHaveAttribute("data-ripples", "packed");
  expect(await tapDiff(page)).toBeGreaterThan(500);
  expect(errs).toEqual([]);
  await expect(page.locator("#fallback")).toBeHidden();
});

test("float ripple path: tap changes pixels, no console errors", async ({ page }) => {
  const errs = collect(page);
  await page.goto("/");
  await page.waitForTimeout(1000);
  await expect(page.locator("#fallback")).toBeHidden();
  await expect(page.locator("#pond")).toHaveAttribute("data-ripples", "half");
  expect(await tapDiff(page)).toBeGreaterThan(500);
  expect(errs).toEqual([]);
});
