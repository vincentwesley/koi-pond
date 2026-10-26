// Set-dressing screenshots (season / time / feeding). Usage: npm run build && node scripts/shots-dress.mjs [nameFilter]
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const PORT = 4421;
const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--port", String(PORT), "--strictPort"], { stdio: "ignore" });
const base = `http://localhost:${PORT}/`;
mkdirSync("qa-output/dress", { recursive: true });

try {
  for (let i = 0; i < 50; i++) { try { await fetch(base); break; } catch { await new Promise((r) => setTimeout(r, 200)); } }
  const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const errors = [];
  const shot = async (name, width, height, query, opts = {}) => {
    if (process.argv[2] && !name.includes(process.argv[2])) return;
    const ctx = await browser.newContext({ viewport: { width, height } });
    const page = await ctx.newPage();
    page.on("console", (m) => m.type() === "error" && errors.push(`${name}: ${m.text()}`));
    page.on("pageerror", (e) => errors.push(`${name}: ${e.message}`));
    await page.goto(base + query);
    await page.waitForTimeout(opts.wait ?? 4000);
    if (opts.tap) {
      const box = await page.locator("#pond").boundingBox();
      await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
      await page.waitForTimeout(opts.tap);
    }
    await page.screenshot({ timeout: 120000, path: `qa-output/dress/${name}.png` });
    await ctx.close();
  };
  for (const w of [1280, 375]) {
    const h = w === 1280 ? 800 : 812;
    for (const s of ["spring", "summer", "autumn", "winter"]) await shot(`${s}-day-${w}`, w, h, `?embed=1&time=day&season=${s}`);
    for (const t of ["dusk", "night"]) await shot(`summer-${t}-${w}`, w, h, `?embed=1&time=${t}&season=summer`);
  }
  await shot("feed-1280", 1280, 800, "?embed=1&time=day&season=summer", { tap: 1200 });
  await shot("feed-eaten-1280", 1280, 800, "?embed=1&time=day&season=summer", { tap: 5000 });
  await browser.close();
  console.log(errors.length ? errors.join("\n") : "no console errors");
} finally {
  server.kill();
}
