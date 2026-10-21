// Pond contents (koi, pads, flowers, petals, plants) and the CPU geometry built from them each frame.

import { Koi, rng, followChain, type Vec } from "./spine";

/** Vertex layout: pos.xy, uv.xy, center.xy, kind, k1, k2, k3. */
export const STRIDE = 10;

export class Mesh {
  data = new Float32Array(8192 * STRIDE);
  n = 0;
  private v(x: number, y: number, u: number, w: number, cx: number, cy: number, k: number[]): void {
    if ((this.n + 1) * STRIDE > this.data.length) {
      const d = new Float32Array(this.data.length * 2);
      d.set(this.data);
      this.data = d;
    }
    const o = this.n++ * STRIDE, d = this.data;
    d[o] = x; d[o + 1] = y; d[o + 2] = u; d[o + 3] = w; d[o + 4] = cx; d[o + 5] = cy;
    d[o + 6] = k[0]; d[o + 7] = k[1]; d[o + 8] = k[2]; d[o + 9] = k[3];
  }
  /** Quad a-b-c-d (in order around), uv per corner. */
  quad(p: Vec[], uv: number[][], cx: number, cy: number, k: number[]): void {
    for (const i of [0, 1, 2, 0, 2, 3]) this.v(p[i].x, p[i].y, uv[i][0], uv[i][1], cx, cy, k);
  }
  /** Rotated square sprite of half-size r, uv in [-1,1]. */
  sprite(cx: number, cy: number, r: number, rot: number, k: number[]): void {
    const c = Math.cos(rot) * r, s = Math.sin(rot) * r;
    const uv = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    this.quad(uv.map(([u, v]) => ({ x: cx + u * c - v * s, y: cy + u * s + v * c })), uv, cx, cy, k);
  }
  /** Strip along `pts` with half widths `hw`; uv = (t along 0..1, -1..1 across). */
  ribbon(pts: Vec[], hw: number[], cx: number, cy: number, k: number[]): void {
    const n = pts.length;
    const side = pts.map((_, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
      const tx = b.x - a.x, ty = b.y - a.y, l = Math.hypot(tx, ty) || 1;
      return { x: -ty / l, y: tx / l };
    });
    for (let i = 0; i < n - 1; i++) {
      const q = (j: number, s: number) => ({ x: pts[j].x + side[j].x * hw[j] * s, y: pts[j].y + side[j].y * hw[j] * s });
      const t0 = i / (n - 1), t1 = (i + 1) / (n - 1);
      this.quad([q(i, -1), q(i + 1, -1), q(i + 1, 1), q(i, 1)], [[t0, -1], [t1, -1], [t1, 1], [t0, 1]], cx, cy, k);
    }
  }
  /** Rectangle from `root` along unit `dir`: uv.x root->tip, uv.y across. */
  fin(root: Vec, dir: Vec, len: number, hw: number, k: number[]): void {
    const nx = -dir.y * hw, ny = dir.x * hw, tx = root.x + dir.x * len, ty = root.y + dir.y * len;
    this.quad(
      [{ x: root.x - nx, y: root.y - ny }, { x: tx - nx, y: ty - ny }, { x: tx + nx, y: ty + ny }, { x: root.x + nx, y: root.y + ny }],
      [[0, -1], [1, -1], [1, 1], [0, 1]], 0, 0, k,
    );
  }
}

interface Pad { nx: number; ny: number; size: number; rot: number; spin: number; age: number; seed: number; flower?: { white: boolean; seed: number } }
interface Petal { x: number; y: number; vx: number; vy: number; rot: number; spin: number; size: number }
interface Plant { nx: number; ny: number; ang: number; blades: { da: number; len: number; curl: number; ph: number; shade: number }[] }

export interface Drop { x: number; y: number; r: number; s: number }

const VARIETIES = [0, 1, 2, 3, 4, 5, 0, 2, 5]; // kohaku, asagi, ogon, showa, shusui, sanke, + repeats

const bodyProfile = (u: number) => (u < 0.28 ? 0.72 + 0.28 * Math.sin((u / 0.28) * Math.PI * 0.5) : 1 - 0.85 * ((u - 0.28) / 0.72) ** 1.3);

export class Pond {
  w = 0;
  h = 0;
  t = 0;
  fish: Koi[] = [];
  pads: Pad[] = [];
  petals: Petal[] = [];
  plants: Plant[] = [];
  under = new Mesh();
  surface = new Mesh();
  pointer: Vec | null = null;
  drops: Drop[] = [];
  private rand: () => number;
  private fishCount: number;

  constructor(seed: number, fishCount = 8) {
    this.rand = rng(seed);
    this.fishCount = Math.max(6, Math.min(9, fishCount));
  }

  get unit(): number { return Math.min(this.w, this.h); }

  resize(w: number, h: number): void {
    const first = this.w === 0;
    const sx = first ? 1 : w / this.w, sy = first ? 1 : h / this.h;
    this.w = w; this.h = h;
    if (first) return this.populate();
    for (const f of this.fish) {
      for (const p of f.pts) { p.x *= sx; p.y *= sy; }
      f.length = this.unit * this.fishLen(f);
      f.segLen = f.length / (f.pts.length - 1);
      followChain(f.pts, f.segLen);
    }
    for (const p of this.petals) { p.x *= sx; p.y *= sy; }
  }

  private fishLen(f: Koi): number { return 0.17 + 0.07 * ((f.p.seed % 97) / 97); }

  private populate(): void {
    const r = this.rand;
    for (let i = 0; i < this.fishCount; i++) {
      const seed = Math.floor(r() * 1e6);
      const p = { speed: 0.28 + r() * 0.22, turn: 0.8 + r() * 0.4, wander: 0.6 + r() * 0.8, shy: 0.7 + r() * 0.6, seed };
      const k = new Koi(this.w * (0.2 + r() * 0.6), this.h * (0.2 + r() * 0.6), r() * Math.PI * 2, 1, VARIETIES[i], p);
      k.length = this.unit * this.fishLen(k);
      k.segLen = k.length / (k.pts.length - 1);
      followChain(k.pts, k.segLen);
      this.fish.push(k);
    }
    const layout: [number, number, number, boolean][] = [
      [0.86, 0.16, 1.1, true], [0.95, 0.42, 0.85, false], [0.8, 0.8, 1.2, true], [0.97, 0.97, 1.0, false],
      [0.1, 0.92, 0.8, true], [0.58, 0.06, 0.65, false], [0.04, 0.12, 0.7, false],
    ];
    for (const [nx, ny, size, flower] of layout) {
      this.pads.push({
        nx, ny, size, rot: r() * Math.PI * 2, spin: (r() - 0.5) * 0.02, age: r() * 0.8, seed: r(),
        flower: flower ? { white: r() > 0.5, seed: r() } : undefined,
      });
    }
    for (let i = 0; i < 16; i++) {
      this.petals.push({ x: r() * this.w, y: r() * this.h, vx: (r() - 0.3) * 6, vy: (r() - 0.5) * 4, rot: r() * 6.28, spin: (r() - 0.5) * 0.3, size: 0.6 + r() * 0.5 });
    }
    const clumps: [number, number, number][] = [[-0.02, 0.3, 0.15], [-0.02, 0.62, -0.1], [0.35, 1.02, -1.45], [0.62, -0.02, 1.7]];
    for (const [nx, ny, ang] of clumps) {
      this.plants.push({
        nx, ny, ang,
        blades: Array.from({ length: 6 + Math.floor(r() * 4) }, () => ({ da: (r() - 0.5) * 1.1, len: 0.16 + r() * 0.2, curl: (r() - 0.5) * 0.25, ph: r() * 6.28, shade: r() })),
      });
    }
  }

  /** Disturb the water at a point (world px). */
  splash(x: number, y: number, strength: number, radius = 14): void {
    this.drops.push({ x, y, r: radius, s: strength });
    if (Math.abs(strength) > 0.3) {
      for (const f of this.fish) if (Math.hypot(f.head.x - x, f.head.y - y) < f.length * 2) f.startle(0.8);
    }
  }

  update(dt: number): void {
    this.t += dt;
    const world = { w: this.w, h: this.h, pointer: this.pointer, others: this.fish };
    for (const f of this.fish) {
      f.update(dt, world);
      // Shallow, quick fish leave a faint wake.
      if (f.depth < 0.25 && this.rand() < dt * 3) this.drops.push({ x: f.head.x, y: f.head.y, r: f.length * 0.08, s: 0.04 });
    }
    const m = 20;
    for (const p of this.petals) {
      p.x += (p.vx + Math.sin(this.t * 0.2 + p.y * 0.01) * 3) * dt;
      p.y += (p.vy + Math.cos(this.t * 0.17 + p.x * 0.01) * 3) * dt;
      p.rot += p.spin * dt;
      if (p.x < -m) p.x += this.w + 2 * m; else if (p.x > this.w + m) p.x -= this.w + 2 * m;
      if (p.y < -m) p.y += this.h + 2 * m; else if (p.y > this.h + m) p.y -= this.h + 2 * m;
    }
    for (const p of this.pads) p.rot += p.spin * dt;
  }

  build(): void {
    const U = this.unit, t = this.t, under = this.under, surf = this.surface;
    under.n = 0; surf.n = 0;
    const sh = U * 0.012;

    // Pad shadows on the floor.
    for (const p of this.pads) under.sprite(p.nx * this.w + sh * 2.5, p.ny * this.h + sh * 3, p.size * U * 0.1, 0, [4, 0, 0, 0.35]);

    // Fish shadows.
    const fish = [...this.fish].sort((a, b) => b.depth - a.depth);
    const bodies = fish.map((f) => {
      const pts = f.bodyPoints(), n = pts.length, maxHw = f.length * 0.13;
      const hw = pts.map((_, i) => maxHw * bodyProfile(i / (n - 1)));
      return { f, pts, hw, maxHw };
    });
    for (const { f, pts, hw } of bodies) {
      const off = sh * (1.5 + f.depth * 3);
      under.ribbon(pts.map((q) => ({ x: q.x + off, y: q.y + off * 1.2 })), hw.map((w) => w * 1.7), 0, 0, [3, 0, 0, 0.4 * (1 - f.depth * 0.5)]);
    }

    // Water plants swaying from the banks.
    for (const pl of this.plants) {
      const ax = pl.nx * this.w, ay = pl.ny * this.h;
      for (const b of pl.blades) {
        const len = b.len * U, steps = 8, pts: Vec[] = [], hw: number[] = [];
        let x = ax, y = ay, a = pl.ang + b.da;
        for (let i = 0; i < steps; i++) {
          pts.push({ x, y });
          hw.push(Math.max(0.6, U * 0.007 * (1 - i / steps) ** 0.7));
          a += b.curl + Math.sin(t * 0.6 + b.ph + i * 0.4) * 0.04;
          x += Math.cos(a) * (len / steps);
          y += Math.sin(a) * (len / steps);
        }
        under.ribbon(pts, hw, 0, 0, [5, b.shade, 0, 0.35]);
      }
    }

    // Koi: fins first, then tail, then body on top.
    for (const { f, pts, hw, maxHw } of bodies) {
      const n = pts.length, L = f.length, k = (kind: number) => [kind, f.variety, (f.p.seed % 1000) / 1000, f.depth];
      const dirAt = (i: number) => {
        const a = pts[i], b = pts[i + 1], l = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        return { x: (b.x - a.x) / l, y: (b.y - a.y) / l };
      };
      for (const [i, len, w, base] of [[2, 0.2, 0.065, 1.0], [6, 0.11, 0.04, 0.8]] as const) {
        const back = dirAt(i), nx = -back.y, ny = back.x;
        for (const s of [-1, 1]) {
          const a = base + 0.22 * Math.sin(f.phase * 0.6 + s);
          const dir = { x: back.x * Math.cos(a) + nx * s * Math.sin(a), y: back.y * Math.cos(a) + ny * s * Math.sin(a) };
          under.fin({ x: pts[i].x + nx * s * hw[i] * 0.7, y: pts[i].y + ny * s * hw[i] * 0.7 }, dir, L * len, L * w, k(1));
        }
      }
      const d = dirAt(n - 2), sw = 0.35 * Math.sin(f.phase - n * 0.32), c = Math.cos(sw), s = Math.sin(sw);
      under.fin({ x: pts[n - 1].x - d.x * L * 0.03, y: pts[n - 1].y - d.y * L * 0.03 }, { x: d.x * c - d.y * s, y: d.x * s + d.y * c }, L * 0.32, L * 0.14, k(2));
      under.ribbon(pts, hw, L, maxHw, k(0));
    }

    // Surface: pads, flowers, petals (bob with the ripples in the vertex shader).
    for (const p of this.pads) {
      const x = p.nx * this.w, y = p.ny * this.h, r = p.size * U * 0.1;
      surf.sprite(x, y, r, p.rot, [6, p.seed, p.age, 0]);
    }
    for (const p of this.pads) {
      if (!p.flower) continue;
      const r = p.size * U * 0.1, a = p.rot + 2.4;
      const fx = p.nx * this.w + Math.cos(a) * r * 0.3, fy = p.ny * this.h + Math.sin(a) * r * 0.3;
      surf.sprite(fx, fy, r * 0.5, p.rot * 0.5, [7, p.flower.seed, p.flower.white ? 1 : 0, 0]);
    }
    for (const p of this.petals) surf.sprite(p.x, p.y, U * 0.014 * p.size, p.rot, [8, 0, 0, 0]);
  }
}
