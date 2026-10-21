// Headless screenshots of the built site: standalone + ?embed=1 at 375 and 1280, dark and light.
// Usage: npm run build && npm run shots   (writes qa-output/*.png)
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const PORT = 4411;
const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--port", String(PORT), "--strictPort"], { stdio: "ignore" });
const base = `http://localhost:${PORT}/`;
mkdirSync("qa-output", { recursive: true });

try {
  for (let i = 0; i < 50; i++) { try { await fetch(base); break; } catch { await new Promise((r) => setTimeout(r, 200)); } }
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const errors = [];
  const shot = async (name, width, height, query = "", opts = {}) => {
    const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: opts.reduced ? "reduce" : "no-preference" });
    if (opts.light) await ctx.addInitScript(() => localStorage.setItem("theme", "light"));
    const page = await ctx.newPage();
    page.on("console", (m) => m.type() === "error" && errors.push(`${name}: ${m.text()}`));
    page.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
    await page.goto(base + query);
    await page.waitForTimeout(2500);
    const box = await page.locator("#pond").boundingBox();
    if (box && !opts.reduced) {
      await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.5);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.55, { steps: 12 });
      await page.mouse.up();
      await page.waitForTimeout(400);
    }
    await page.screenshot({ path: `qa-output/${name}.png`, fullPage: !query });
    await ctx.close();
  };
  await shot("standalone-1280-dark", 1280, 800);
  await shot("standalone-1280-light", 1280, 800, "", { light: true });
  await shot("standalone-375-dark", 375, 812);
  await shot("standalone-375-light", 375, 812, "", { light: true });
  await shot("embed-1280", 1280, 800, "?embed=1");
  await shot("embed-375", 375, 812, "?embed=1");
  await shot("embed-1280-reduced", 1280, 800, "?embed=1", { reduced: true });
  await browser.close();
  console.log(errors.length ? errors.join("\n") : "no console errors");
} finally {
  server.kill();
}
