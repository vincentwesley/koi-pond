// WebGL2 pipeline: ripple sim -> floor+caustics -> underwater sprites -> water surface -> surface sprites -> bloom -> screen.

import { program, target, freeTarget, halfFloatTargets, type Prog, type Target } from "./gl";
import * as S from "./shaders";
import { STRIDE, type Mesh, type Pond } from "./scene";

const CELL = 4; // css px per ripple cell
const SIM_DT = 1 / 120;
const MAX_DROPS = 32;
const WATER: [number, number, number] = [0.07, 0.25, 0.22];

export class Renderer {
  scale = 1;
  private half: boolean; // RGBA16F targets usable (scene/bloom)
  private packed: boolean; // ripple state in packed RGBA8 instead of RG16F
  private drops = new Float32Array(MAX_DROPS * 4);
  private P: Record<"sim" | "floor" | "under" | "sprite" | "water" | "bright" | "blur" | "final", Prog>;
  private vao: WebGLVertexArrayObject;
  private spriteVao: WebGLVertexArrayObject;
  private vbo: WebGLBuffer;
  private sim: Target[] = [];
  private floor?: Target;
  private under?: Target;
  private scene?: Target;
  private bloomA?: Target;
  private bloomB?: Target;
  private cssW = 0;
  private cssH = 0;
  private acc = 0;
  private time = 0;

  /** opts.forceNoFloat: pretend RGBA16F is unusable (exercises the packed RGBA8 ripple path). */
  constructor(private gl: WebGL2RenderingContext, private dprCap: number, opts: { forceNoFloat?: boolean } = {}) {
    this.half = !opts.forceNoFloat && halfFloatTargets(gl);
    this.packed = !this.half;
    const m = (src: string) => (this.packed ? S.packed(src) : src);
    const fs = (src: string) => program(gl, S.FS_VS, m(src));
    this.P = {
      sim: fs(S.SIM_FS), floor: program(gl, S.FS_VS, S.FLOOR_FS), under: fs(S.UNDER_FS), water: fs(S.WATER_FS),
      bright: program(gl, S.FS_VS, S.BRIGHT_FS), blur: program(gl, S.FS_VS, S.BLUR_FS), final: program(gl, S.FS_VS, S.FINAL_FS),
      sprite: program(gl, m(S.SPRITE_VS), S.SPRITE_FS),
    };
    this.vao = gl.createVertexArray()!;
    this.spriteVao = gl.createVertexArray()!;
    this.vbo = gl.createBuffer()!;
    gl.bindVertexArray(this.spriteVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    const b = STRIDE * 4;
    [[0, 2, 0], [1, 2, 2], [2, 2, 4], [3, 4, 6]].forEach(([loc, size, off]) => {
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, b, off * 4);
    });
    gl.bindVertexArray(null);
  }

  /** Pixel size of the render targets for the current css size and adaptive scale. */
  private px(): [number, number] {
    const dpr = Math.min(window.devicePixelRatio || 1, this.dprCap) * this.scale;
    return [Math.max(1, Math.round(this.cssW * dpr)), Math.max(1, Math.round(this.cssH * dpr))];
  }

  resize(cssW: number, cssH: number): void {
    const gl = this.gl;
    const simChanged = cssW !== this.cssW || cssH !== this.cssH || !this.sim.length;
    this.cssW = cssW; this.cssH = cssH;
    const [w, h] = this.px();
    gl.canvas.width = w; gl.canvas.height = h;
    if (simChanged) {
      this.sim.forEach((t) => freeTarget(gl, t));
      const sw = Math.min(512, Math.ceil(cssW / CELL)), shh = Math.min(512, Math.ceil(cssH / CELL));
      const mk = () => this.packed ? target(gl, sw, shh, false, true, [128 / 255, 0, 128 / 255, 0]) : target(gl, sw, shh, true);
      this.sim = [mk(), mk()];
    }
    for (const t of [this.floor, this.under, this.scene, this.bloomA, this.bloomB]) freeTarget(gl, t);
    this.floor = target(gl, w, h, false);
    this.under = target(gl, w, h, false);
    this.scene = target(gl, w, h, this.half);
    const bw = Math.max(1, w >> 2), bh = Math.max(1, h >> 2);
    this.bloomA = target(gl, bw, bh, this.half);
    this.bloomB = target(gl, bw, bh, this.half);
    this.pass(this.P.floor, this.floor, (p) => {
      gl.uniform2f(p.u("uRes"), cssW, cssH);
      gl.uniform1f(p.u("uScale"), this.patternScale());
    });
  }

  private patternScale(): number { return Math.min(1.4, Math.max(0.6, Math.min(this.cssW, this.cssH) / 700)); }

  setScale(s: number): void {
    if (Math.abs(s - this.scale) < 0.01) return;
    this.scale = s;
    this.resize(this.cssW, this.cssH);
  }

  private bindTex(p: Prog, name: string, unit: number, tex: WebGLTexture): void {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(p.u(name), unit);
  }

  private pass(p: Prog, to: Target | null, setup: (p: Prog) => void): void {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, to ? to.fb : null);
    gl.viewport(0, 0, to ? to.w : gl.canvas.width, to ? to.h : gl.canvas.height);
    gl.useProgram(p.p);
    setup(p);
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private stepSim(pond: Pond, steps: number): void {
    const gl = this.gl, sw = this.sim[0].w, sh = this.sim[0].h, p = this.P.sim, drops = this.drops;
    const n = Math.min(pond.drops.length, MAX_DROPS); // anything beyond 32 this frame is dropped
    for (let i = 0; i < n; i++) {
      const d = pond.drops[i], k = i * 4;
      drops[k] = (d.x / this.cssW) * sw; drops[k + 1] = (1 - d.y / this.cssH) * sh; drops[k + 2] = Math.max(1.5, d.r / CELL); drops[k + 3] = d.s;
    }
    pond.drops.length = 0;
    gl.useProgram(p.p);
    gl.bindVertexArray(this.vao);
    gl.viewport(0, 0, sw, sh);
    gl.uniform2f(p.u("uTexel"), 1 / sw, 1 / sh);
    gl.uniform2f(p.u("uSize"), sw, sh);
    gl.uniform1f(p.u("uDamp"), 0.986);
    gl.uniform4fv(p.u("uDrops"), drops);
    for (let i = 0; i < steps; i++) {
      const [src, dst] = this.sim;
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
      this.bindTex(p, "uState", 0, src.tex);
      gl.uniform1i(p.u("uDropN"), i === 0 ? n : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      this.sim[0] = dst; this.sim[1] = src;
    }
  }

  private drawMesh(m: Mesh, surface: boolean): void {
    if (!m.n) return;
    const gl = this.gl, p = this.P.sprite, rip = this.sim[0];
    gl.useProgram(p.p);
    gl.uniform2f(p.u("uRes"), this.cssW, this.cssH);
    gl.uniform2f(p.u("uSimTexel"), 1 / rip.w, 1 / rip.h);
    gl.uniform1f(p.u("uSurface"), surface ? 1 : 0);
    gl.uniform3f(p.u("uWater"), ...WATER);
    gl.uniform1f(p.u("uTime"), this.time);
    this.bindTex(p, "uRip", 0, rip.tex);
    gl.bindVertexArray(this.spriteVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, m.data.subarray(0, m.n * STRIDE), gl.DYNAMIC_DRAW);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLES, 0, m.n);
    gl.disable(gl.BLEND);
  }

  frame(pond: Pond, dt: number): void {
    const gl = this.gl;
    if (!this.under || !this.scene || !this.floor || !this.bloomA || !this.bloomB) return;
    this.time += dt;
    // Fixed-step ripples.
    this.acc = Math.min(this.acc + dt, SIM_DT * 4);
    let steps = 0;
    while (this.acc >= SIM_DT) { this.acc -= SIM_DT; steps++; }
    if (steps) this.stepSim(pond, steps);

    pond.build();
    const rip = this.sim[0], cw = this.cssW, ch = this.cssH, ps = this.patternScale();
    const common = (p: Prog) => {
      gl.uniform2f(p.u("uSimTexel"), 1 / rip.w, 1 / rip.h);
      gl.uniform2f(p.u("uRes"), cw, ch);
      gl.uniform1f(p.u("uTime"), this.time);
      gl.uniform1f(p.u("uScale"), ps);
    };

    this.pass(this.P.under, this.under, (p) => {
      common(p);
      this.bindTex(p, "uFloor", 0, this.floor!.tex);
      this.bindTex(p, "uRip", 1, rip.tex);
    });
    this.drawMesh(pond.under, false);

    this.pass(this.P.water, this.scene, (p) => {
      common(p);
      gl.uniform3f(p.u("uWater"), ...WATER);
      this.bindTex(p, "uUnder", 0, this.under!.tex);
      this.bindTex(p, "uRip", 1, rip.tex);
    });
    this.drawMesh(pond.surface, true);

    const A = this.bloomA, B = this.bloomB;
    this.pass(this.P.bright, A, (p) => this.bindTex(p, "uSrc", 0, this.scene!.tex));
    for (const [from, to, dx, dy] of [[A, B, 1, 0], [B, A, 0, 1]] as const) {
      this.pass(this.P.blur, to, (p) => {
        this.bindTex(p, "uSrc", 0, from.tex);
        gl.uniform2f(p.u("uDir"), dx / A.w, dy / A.h);
      });
    }
    this.pass(this.P.final, null, (p) => {
      this.bindTex(p, "uScene", 0, this.scene!.tex);
      this.bindTex(p, "uBloom", 1, A.tex);
      gl.uniform2f(p.u("uPx"), gl.canvas.width, gl.canvas.height);
      gl.uniform1f(p.u("uTime"), this.time);
    });
  }
}
