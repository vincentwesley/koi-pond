import { test, expect, type Page } from "@playwright/test";

test.setTimeout(90_000);

function collect(page: Page): string[] {
  const errs: string[] = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(e.message));
  return errs;
}

async function shot(page: Page): Promise<Buffer> {
  const box = (await page.locator("#pond").boundingBox())!;
  return page.screenshot({ clip: { x: box.x, y: box.y, width: Math.min(box.width, 640), height: Math.min(box.height, 480) } });
}
const differs = (a: Buffer, b: Buffer) => !a.equals(b);

test("context loss then restore: no fallback, canvas renders again, no errors", async ({ page }) => {
  const errs = collect(page);
  await page.goto("/");
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const gl = document.querySelector<HTMLCanvasElement>("#pond")!.getContext("webgl2")!;
    const ext = gl.getExtension("WEBGL_lose_context")!;
    (window as unknown as { __lose: WEBGL_lose_context }).__lose = ext;
    ext.loseContext();
  });
  await page.waitForTimeout(500);
  await expect(page.locator("#fallback")).toBeHidden();
  await page.evaluate(() => (window as unknown as { __lose: WEBGL_lose_context }).__lose.restoreContext());
  await page.waitForTimeout(1000);
  await expect(page.locator("#fallback")).toBeHidden();
  const a = await shot(page);
  await page.waitForTimeout(500);
  const b = await shot(page);
  expect(differs(a, b)).toBe(true);
  expect(errs).toEqual([]);
});

test("pointercancel does not throw and later taps still ripple", async ({ page }) => {
  const errs = collect(page);
  await page.goto("/");
  await page.waitForTimeout(1000);
  const box = (await page.locator("#pond").boundingBox())!;
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.evaluate(() => document.querySelector("#pond")!.dispatchEvent(new PointerEvent("pointercancel", { bubbles: true })));
  await page.mouse.up();
  const a = await shot(page);
  await page.mouse.click(cx, cy);
  await page.waitForTimeout(300);
  expect(differs(a, await shot(page))).toBe(true);
  expect(errs).toEqual([]);
});
