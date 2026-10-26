import "./style.css";
import { Pond } from "./scene";
import { Renderer } from "./renderer";
import { PondAudio } from "./audio";

const embed = document.documentElement.classList.contains("embed");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.querySelector<HTMLCanvasElement>("#pond")!;
const fallback = document.querySelector<HTMLElement>("#fallback")!;

// Credits card animates only while on screen.
const credits = document.querySelector(".creator");
if (credits) new IntersectionObserver(([e]) => credits.classList.toggle("is-live", e.isIntersecting)).observe(credits);

// Light theme is opt-in and remembered (boot.js applies it before first paint).
const themeBtn = document.querySelector<HTMLButtonElement>("#theme");
themeBtn?.addEventListener("click", () => {
  const light = document.documentElement.dataset.theme !== "light";
  document.documentElement.dataset.theme = light ? "light" : "dark";
  themeBtn.setAttribute("aria-pressed", String(light));
  try { localStorage.setItem("theme", light ? "light" : "dark"); } catch { /* storage blocked */ }
});
themeBtn?.setAttribute("aria-pressed", String(document.documentElement.dataset.theme === "light"));

function fail(): void {
  canvas.hidden = true;
  fallback.hidden = false;
}

const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "high-performance" });
if (!gl) fail();
else start(gl);

function start(gl: WebGL2RenderingContext): void {
  let renderer: Renderer;
  try { renderer = new Renderer(gl, embed ? 1.5 : 2); } catch (e) { console.error(e); return fail(); }
  const pond = new Pond((Math.random() * 1e9) | 0, 8);
  const audio = new PondAudio();
  let lost = false, running = false, visible = true, last = 0, raf = 0, slow = 0, fast = 0, ema = 1 / 60;

  const still = () => {
    // Reduced motion: settle the scene off-screen, then draw a single frame.
    for (let i = 0; i < 90; i++) pond.update(1 / 60);
    pond.drops.length = 0;
    renderer.frame(pond, 1 / 60);
  };

  const size = () => {
    const r = canvas.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    pond.resize(r.width, r.height);
    renderer.resize(r.width, r.height);
    if (reduced) still();
  };
  new ResizeObserver(size).observe(canvas);

  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
    last = now;
    // Adaptive resolution: drop when frames run long, creep back when there is headroom.
    ema += (dt - ema) * 0.05;
    if (ema > 0.024) { slow++; fast = 0; } else if (ema < 0.0175) { fast++; slow = 0; } else { slow = fast = 0; }
    if (slow > 45 && renderer.scale > 0.5) { renderer.setScale(Math.max(0.5, renderer.scale - 0.15)); slow = 0; ema = 1 / 60; }
    if (fast > 240 && renderer.scale < 1) { renderer.setScale(Math.min(1, renderer.scale + 0.1)); fast = 0; }
    pond.update(dt);
    renderer.frame(pond, dt);
  };
  const sync = () => {
    const want = !lost && !reduced && visible && !document.hidden;
    if (want && !running) { running = true; last = 0; raf = requestAnimationFrame(tick); }
    else if (!want && running) { running = false; cancelAnimationFrame(raf); }
  };
  document.addEventListener("visibilitychange", sync);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(canvas);

  // Context loss is transient: pause quietly, rebuild GL resources on restore.
  canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); lost = true; running = false; cancelAnimationFrame(raf); });
  canvas.addEventListener("webglcontextrestored", () => {
    try { renderer = new Renderer(gl, embed ? 1.5 : 2); } catch (e) { console.error(e); return fail(); }
    lost = false;
    size();
    sync();
  });

  // Pointer: hover leaves faint trails, press/drag makes real ripples.
  let lastDrop = { x: -1e9, y: -1e9 }, idle = 0;
  const local = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const disturb = (x: number, y: number, s: number) => {
    pond.pointer = { x, y };
    clearTimeout(idle);
    idle = window.setTimeout(() => { pond.pointer = null; }, 600);
    pond.splash(x, y, s, Math.min(pond.w, pond.h) * 0.02);
    audio.plink(Math.abs(s), (x / pond.w) * 2 - 1);
  };
  canvas.addEventListener("pointerdown", (e) => {
    const p = local(e);
    canvas.setPointerCapture(e.pointerId);
    lastDrop = p;
    pond.pointerShy = 1;
    disturb(p.x, p.y, 1.2);
    pond.tap(p.x, p.y);
  });
  // Browser took the gesture (pan-y scroll) or it was interrupted: forget the pointer.
  canvas.addEventListener("pointercancel", () => { clearTimeout(idle); pond.pointer = null; });
  canvas.addEventListener("pointermove", (e) => {
    const p = local(e), pressed = e.buttons !== 0;
    if (!pressed && e.pointerType !== "mouse") return;
    const gap = Math.min(pond.w, pond.h) * (pressed ? 0.015 : 0.03);
    if (Math.hypot(p.x - lastDrop.x, p.y - lastDrop.y) < gap) return;
    lastDrop = p;
    if (pressed) { pond.pointerShy = 1; disturb(p.x, p.y, 0.45); }
    else { pond.pointerShy = 0.5; pond.pointer = p; pond.splash(p.x, p.y, 0.1, Math.min(pond.w, pond.h) * 0.012); }
  });
  canvas.addEventListener("pointerleave", () => { pond.pointer = null; });

  const soundBtn = document.querySelector<HTMLButtonElement>("#sound");
  soundBtn?.addEventListener("click", async () => {
    const on = await audio.toggle();
    soundBtn.setAttribute("aria-pressed", String(on));
  });

  size();
  sync();
}
