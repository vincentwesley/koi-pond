// Pond contents (koi, pads, flowers, petals, plants) and the CPU geometry built from them each frame.

import { Koi, rng, followChain, wrapAngle, TAIL_SEGS, type Vec } from "./spine";
import { SEASONS, type Mood, type Season } from "./mood";

export const FIREFLIES = 24, PELLETS = 12, PELLET_LIFE = 20;
const SNOW_FALL = 1.4, SNOW_LIFE = 9;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Number of fireflies for a mood value 0..1. */
export const fireflyCount = (f: number): number => Math.round(clamp01(f) * FIREFLIES);

/** Season weights (sum 1): one-hot mid-season, cross-fading with the neighbour in the first/last 12% of it. */
export function seasonWeights(season: Season, t: number, out: Record<Season, number>): Record<Season, number> {
  const i = SEASONS.indexOf(season), E = 0.12;
  for (const s of SEASONS) out[s] = 0;
  const b = t < E ? 0.5 * (1 - t / E) : t > 1 - E ? 0.5 * (1 - (1 - t) / E) : 0;
  if (b > 0) out[SEASONS[(i + (t < E ? 3 : 1)) % 4]] = b;
  out[season] = 1 - b;
  return out;
}

/** Staggered fade: item with rank q (0..1) is fully in at weight 1 and appears one after another as w rises. */
export const itemAlpha = (w: number, q: number): number => clamp01((w - q * 0.6) / 0.4);

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

interface Pad { ox: number; oy: number; vx: number; vy: number; kick: number; nx: number; ny: number; size: number; rot: number; spin: number; age: number; seed: number; flower?: { white: boolean; seed: number; bud: boolean } }
/** Floating bit: kind 0 sakura petal, 1 maple, 2 ginkgo, 3 snowflake. q = fade rank, age/landed only used by snow. */
interface Petal { x: number; y: number; ex: number; ey: number; vx: number; vy: number; rot: number; spin: number; size: number; kind: number; q: number; age: number; landed: boolean }
interface Pellet { x: number; y: number; ex: number; ey: number; age: number; alive: boolean }
interface Dragonfly { x: number; y: number; ang: number; tx: number; ty: number; z: number; hue: number }
interface Firefly { hx: number; hy: number; fx: number; fy: number; ph: number; ox: number; oy: number }
const KIND_SEASON = [0, 2, 2, 3]; // SEASONS index each floater kind belongs to
const KIND_COUNT = [16, 8, 5, 18];
const CLUSTERS = [[0.25, 0.3], [0.7, 0.65], [0.45, 0.85]]; // where a few sakura petals start bunched
const PAD_FRAC = [0.55, 1, 0.6, 0.3]; // share of lotus leaves out per season
const PAD_SCALE = [0.85, 1.15, 0.95, 0.8];
const _k = [0, 0, 0, 0];
const K = (a: number, b: number, c: number, d: number) => { _k[0] = a; _k[1] = b; _k[2] = c; _k[3] = d; return _k; };
interface Plant { nx: number; ny: number; ang: number; blades: { da: number; len: number; curl: number; ph: number; shade: number }[] }

export interface Drop { x: number; y: number; r: number; s: number }

export const DISTURBANCES = 16;
export const DISTURB_LIFE = 2.5;

/** Radial push (unitless, ~0..s) on a point at offset (dx,dy) from a disturbance of strength s and
 *  radius r, `age` seconds old. Fades with age and distance; written into `out`. */
export function nudge(dx: number, dy: number, age: number, s: number, r: number, out: Vec): Vec {
  const d = Math.hypot(dx, dy), life = 1 - age / DISTURB_LIFE;
  if (life <= 0 || d < 1e-3) { out.x = out.y = 0; return out; }
  const reach = r * 4, m = (s * life * life * Math.exp(-((d / reach) ** 2))) / d;
  out.x = dx * m; out.y = dy * m;
  return out;
}

const _n: Vec = { x: 0, y: 0 };
// kohaku, tancho, showa, asagi, kumonryu, ogon, doitsu, chagoi, shusui (first 6 are always a good mix)
const VARIETIES = [0, 6, 3, 1, 8, 2, 9, 7, 4];
const _tp: Vec[] = Array.from({ length: TAIL_SEGS + 1 }, () => ({ x: 0, y: 0 }));
const _tw: number[] = new Array(TAIL_SEGS + 1).fill(0);
const _fp: Vec[] = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
const _fw = [0, 0, 0];

const bodyProfile = (u: number) => (u < 0.28 ? 0.72 + 0.28 * Math.sin((u / 0.28) * Math.PI * 0.5) : 1 - 0.85 * ((u - 0.28) / 0.72) ** 1.3);

export class Pond {
  w = 0;
  h = 0;
  t = 0;
  fish: Koi[] = [];
  pads: Pad[] = [];
  petals: Petal[] = [];
  plants: Plant[] = [];
  pellets: Pellet[] = Array.from({ length: PELLETS }, () => ({ x: 0, y: 0, ex: 0, ey: 0, age: 0, alive: false }));
  dragonflies: Dragonfly[] = [];
  fireflies: Firefly[] = [];
  /** Eased season weights (sum 1) and firefly level (0..FIREFLIES). */
  sw: Record<Season, number> = { spring: 0, summer: 1, autumn: 0, winter: 0 };
  private swT: Record<Season, number> = { spring: 0, summer: 1, autumn: 0, winter: 0 };
  ffLevel = 0;
  private ffT = 0;
  private moodSet = false;
  private claim = new Int8Array(9).fill(-1); // pellet each koi is after
  private eatCd = new Float32Array(9);
  private fx = new Float32Array(9); // where each koi was last sent
  private fy = new Float32Array(9);
  private baseSpeed: number[] = [];
  private _a: Vec = { x: 0, y: 0 };
  /** Called with the pellet position when a koi eats one (main plays a plink if sound is on). */
  onEat?: (x: number, y: number) => void;
  under = new Mesh();
  surface = new Mesh();
  pointer: Vec | null = null;
  drops: Drop[] = [];
  pointerShy = 1;
  // Fixed ring of recent disturbances (no per-frame allocation); age >= DISTURB_LIFE means unused.
  private dX = new Float32Array(DISTURBANCES);
  private dY = new Float32Array(DISTURBANCES);
  private dS = new Float32Array(DISTURBANCES);
  private dR = new Float32Array(DISTURBANCES);
  private dAge = new Float32Array(DISTURBANCES).fill(DISTURB_LIFE);
  private dHead = 0;
  private lastFeed = -10;
  private pairT = 6;
  private rand: () => number;
  private fishCount: number;

  constructor(seed: number, fishCount = 8) {
    this.rand = rng(seed);
    this.fishCount = Math.max(6, Math.min(9, fishCount));
  }

  get unit(): number { return Math.min(this.w, this.h); }

  /** Feed the current mood (about once a second): season dressing and firefly count ease toward it. */
  setMood(m: Pick<Mood, "season" | "seasonT" | "fireflies">): void {
    seasonWeights(m.season, m.seasonT, this.swT);
    this.ffT = fireflyCount(m.fireflies);
    if (!this.moodSet) { this.moodSet = true; for (const s of SEASONS) this.sw[s] = this.swT[s]; this.ffLevel = this.ffT; }
  }

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
    for (const p of this.pellets) { p.x *= sx; p.y *= sy; }
    for (const d of this.dragonflies) { d.x *= sx; d.y *= sy; d.tx *= sx; d.ty *= sy; }
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
      this.baseSpeed.push(p.speed);
    }
    // Lotus leaves in priority order (fewer show in spring/autumn/winter); flower 0 none, 1 bloom, 2 bud.
    const layout: [number, number, number, number][] = [
      [0.86, 0.16, 1.35, 1], [0.8, 0.8, 1.5, 1], [0.95, 0.42, 0.95, 2], [0.1, 0.92, 1.0, 1], [0.58, 0.06, 0.7, 0],
      [0.97, 0.97, 1.1, 0], [0.04, 0.12, 0.8, 2], [0.5, 0.95, 0.55, 0], [0.3, 0.08, 0.5, 0],
    ];
    for (const [nx, ny, size, flower] of layout) {
      this.pads.push({
        ox: 0, oy: 0, vx: 0, vy: 0, kick: 0, nx, ny, size, rot: r() * Math.PI * 2, spin: (r() - 0.5) * 0.02, age: r() * 0.5, seed: r(),
        flower: flower ? { white: r() > 0.6, seed: r(), bud: flower === 2 } : undefined,
      });
    }
    KIND_COUNT.forEach((n, kind) => {
      for (let i = 0; i < n; i++) {
        const leaf = kind === 1 || kind === 2;
        const cl = kind === 0 && i < 9 ? CLUSTERS[i % 3] : null;
        this.petals.push({
          ex: 0, ey: 0, x: cl ? (cl[0] + (r() - 0.5) * 0.12) * this.w : r() * this.w, y: cl ? (cl[1] + (r() - 0.5) * 0.12) * this.h : r() * this.h, vx: (r() - 0.3) * (leaf ? 8 : 6), vy: (r() - 0.5) * 4, rot: r() * 6.28,
          spin: (r() - 0.5) * (leaf ? 1.6 : kind === 3 ? 0.2 : 0.3), size: 0.6 + r() * 0.5, kind, q: (i + r()) / n, age: r() * SNOW_LIFE, landed: false,
        });
      }
    });
    for (let i = 0; i < 2; i++) this.dragonflies.push({ x: r() * this.w, y: r() * this.h, ang: r() * 6.28, tx: r() * this.w, ty: r() * this.h, z: 1, hue: i });
    for (let i = 0; i < FIREFLIES; i++) this.fireflies.push({ hx: 0.08 + r() * 0.84, hy: 0.08 + r() * 0.84, fx: 0.15 + r() * 0.3, fy: 0.12 + r() * 0.3, ph: r() * 6.28, ox: 0, oy: 0 });
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
    this.disturb(x, y, strength, radius);
    if (Math.abs(strength) > 0.3) {
      for (const f of this.fish) if (Math.hypot(f.head.x - x, f.head.y - y) < f.length) f.startle(0.8);
    }
  }

  /** Record a push on pads and petals (ring buffer, oldest overwritten). */
  disturb(x: number, y: number, s: number, r: number): void {
    const i = this.dHead; this.dHead = (i + 1) % DISTURBANCES;
    this.dX[i] = x; this.dY[i] = y; this.dS[i] = Math.min(1.5, Math.abs(s)); this.dR[i] = r; this.dAge[i] = 0;
  }

  /** A tap: the 1-3 nearest koi drift over to nibble at the point (at most one feed per ~1.5 s). */
  tap(x: number, y: number): void {
    if (this.t - this.lastFeed < 1.5) return;
    this.lastFeed = this.t;
    this.dropFood(x, y);
    const n = 1 + Math.floor(this.rand() * 3);
    const near = this.fish.filter((f) => !f.feeding).sort((a, b) => Math.hypot(a.head.x - x, a.head.y - y) - Math.hypot(b.head.x - x, b.head.y - y));
    for (const f of near.slice(0, n)) f.feed(x, y, 4 + this.rand() * 2.5);
  }

  /** Drop 3-5 food pellets around a point (the pool holds PELLETS; extras are skipped). Returns how many landed. */
  dropFood(x: number, y: number): number {
    const n = 3 + Math.floor(this.rand() * 3), sp = this.unit * 0.05;
    let made = 0;
    for (const p of this.pellets) {
      if (made === n) break;
      if (p.alive) continue;
      p.x = x + (this.rand() - 0.5) * sp * 2; p.y = y + (this.rand() - 0.5) * sp * 2;
      p.ex = (this.rand() - 0.5) * sp; p.ey = (this.rand() - 0.5) * sp; p.age = 0; p.alive = true;
      made++;
    }
    return made;
  }

  /** Summed disturbance push on a floating point (written into a shared scratch vector). */
  private push(x: number, y: number): Vec {
    let ax = 0, ay = 0;
    for (let i = 0; i < DISTURBANCES; i++) {
      if (this.dAge[i] >= DISTURB_LIFE) continue;
      nudge(x - this.dX[i], y - this.dY[i], this.dAge[i], this.dS[i], this.dR[i], _n);
      ax += _n.x; ay += _n.y;
    }
    this._a.x = ax; this._a.y = ay;
    return this._a;
  }

  private updateFood(dt: number): void {
    const U = this.unit, drag = Math.exp(-dt * 1.5), pe = this.pellets;
    for (const p of pe) {
      if (!p.alive) continue;
      p.age += dt;
      if (p.age > PELLET_LIFE) { p.alive = false; continue; }
      const a = this.push(p.x, p.y);
      p.ex = (p.ex + a.x * U * 0.08 * dt) * drag; p.ey = (p.ey + a.y * U * 0.08 * dt) * drag;
      p.x += (p.ex + Math.sin(this.t * 0.3 + p.y * 0.02) * 1.2) * dt;
      p.y += (p.ey + Math.cos(this.t * 0.27 + p.x * 0.02) * 1.2) * dt;
    }
    // Each koi that is feeding goes for the nearest pellet nobody else has claimed, one at a time.
    for (let i = 0; i < this.fish.length && i < this.claim.length; i++) {
      const f = this.fish[i];
      this.eatCd[i] -= dt;
      let c = this.claim[i];
      if (c >= 0 && !pe[c].alive) c = -1;
      if (c < 0 && f.feeding) {
        let best = 1e18;
        for (let j = 0; j < pe.length; j++) {
          if (!pe[j].alive || this.claim.includes(j)) continue;
          const d = Math.hypot(pe[j].x - f.head.x, pe[j].y - f.head.y);
          if (d < best) { best = d; c = j; }
        }
      }
      this.claim[i] = c;
      if (c < 0) continue;
      const p = pe[c], d = Math.hypot(p.x - f.head.x, p.y - f.head.y);
      if (this.eatCd[i] <= 0 && d < f.length * 0.35) {
        p.alive = false; this.claim[i] = -1; this.eatCd[i] = 0.7;
        this.splash(p.x, p.y, 0.14, U * 0.006);
        this.onEat?.(p.x, p.y);
      } else if (!f.feeding || Math.hypot(p.x - this.fx[i], p.y - this.fy[i]) > f.length * 0.2) {
        f.feed(p.x, p.y, 3); this.fx[i] = p.x; this.fy[i] = p.y; // retarget (also when the pellet drifted)
      }
    }
  }

  /** Dragonflies cruise to a spot, drop to the surface (z 1 -> 0), touch it (a small ripple) and pick the next spot. */
  private updateDragonflies(dt: number): void {
    if (this.sw.summer < 0.02) return;
    const U = this.unit, r = this.rand;
    for (const d of this.dragonflies) {
      const dist = Math.hypot(d.tx - d.x, d.ty - d.y);
      d.z = clamp01((dist - U * 0.04) / (U * 0.14));
      const want = Math.atan2(d.ty - d.y, d.tx - d.x), lim = dt * 5;
      d.ang += Math.max(-lim, Math.min(lim, wrapAngle(want - d.ang)));
      const sp = U * 0.3 * (0.5 + 0.5 * d.z);
      d.x += Math.cos(d.ang) * sp * dt; d.y += Math.sin(d.ang) * sp * dt;
      if (dist < U * 0.04) {
        if (this.sw.summer > 0.3) this.splash(d.x, d.y, 0.22, U * 0.008);
        const a = r() * 6.283, l = U * (0.3 + r() * 0.3);
        d.tx = Math.max(this.w * 0.08, Math.min(this.w * 0.92, d.x + Math.cos(a) * l));
        d.ty = Math.max(this.h * 0.08, Math.min(this.h * 0.92, d.y + Math.sin(a) * l));
      }
    }
  }

  /** Fireflies wander on slow loops, shy away from the pointer and drift back. */
  private updateFireflies(dt: number): void {
    if (this.ffLevel < 0.01) return;
    const U = this.unit, p = this.pointer, k = Math.exp(-dt * 0.6);
    for (const f of this.fireflies) {
      let ox = f.ox, oy = f.oy;
      if (p) {
        const x = f.hx * this.w + Math.sin(this.t * f.fx + f.ph) * U * 0.1 + ox, y = f.hy * this.h + Math.cos(this.t * f.fy + f.ph * 1.7) * U * 0.08 + oy;
        const dx = x - p.x, dy = y - p.y, d = Math.hypot(dx, dy) || 1;
        if (d < U * 0.28) { const s = (1 - d / (U * 0.28)) * U * 0.6 * dt; ox += (dx / d) * s; oy += (dy / d) * s; }
      }
      const m = U * 0.35, l = Math.hypot(ox, oy);
      if (l > m) { ox *= m / l; oy *= m / l; }
      f.ox = ox * k; f.oy = oy * k;
    }
  }

  update(dt: number): void {
    this.t += dt;
    // Every so often two idle koi pair up for a while (the follower trails the leader).
    this.pairT -= dt;
    if (this.pairT <= 0) {
      this.pairT = 12 + this.rand() * 18;
      const idle = this.fish.filter((f) => !f.leader && !f.feeding);
      if (idle.length >= 2 && this.rand() < 0.7) {
        const a = idle[Math.floor(this.rand() * idle.length)], b = idle.filter((f) => f !== a)[Math.floor(this.rand() * (idle.length - 1))];
        if (!this.fish.some((f) => f.leader === a)) b.follow(a, 14 + this.rand() * 14);
      }
    }
    const world = { w: this.w, h: this.h, pointer: this.pointer, others: this.fish, pointerShy: this.pointerShy };
    for (const f of this.fish) {
      f.update(dt, world);
      // Shallow, quick fish leave a faint wake.
      if (f.depth < 0.25 && this.rand() < dt * 3) this.drops.push({ x: f.head.x, y: f.head.y, r: f.length * 0.08, s: 0.04 });
      // Koi wake pushes lightly on whatever floats near the head.
      if (f.speed > 0.2 * f.length) this.disturb(f.head.x, f.head.y, 0.05, f.length * 0.1);
    }
    for (let i = 0; i < DISTURBANCES; i++) this.dAge[i] += dt;
    const m = 20, U = this.unit, drag = Math.exp(-dt * 1.5), maxOff = U * 0.012;
    // Season dressing and fireflies ease toward the mood (cross-fade, no popping); winter makes the koi sleepier.
    const ek = Math.min(1, dt * 0.7);
    for (const s of SEASONS) this.sw[s] += (this.swT[s] - this.sw[s]) * ek;
    this.ffLevel += (this.ffT - this.ffLevel) * Math.min(1, dt * 0.8);
    this.fish.forEach((f, i) => { f.p.speed = this.baseSpeed[i] * (1 - 0.4 * this.sw.winter); });
    this.updateFood(dt);
    this.updateDragonflies(dt);
    this.updateFireflies(dt);
    for (const p of this.petals) {
      const w = this.sw[SEASONS[KIND_SEASON[p.kind]]];
      if (w < 0.01) continue;
      if (p.kind === 3) {
        p.age += dt;
        if (p.age >= SNOW_LIFE) { p.age = 0; p.landed = false; p.x = this.rand() * this.w; p.y = this.rand() * this.h; }
        else if (!p.landed && p.age >= SNOW_FALL) { p.landed = true; if (w > 0.3) this.splash(p.x, p.y, 0.1, U * 0.005); }
      }
      const a = this.push(p.x, p.y), ax = a.x, ay = a.y;
      p.ex = (p.ex + ax * U * 0.08 * dt) * drag; p.ey = (p.ey + ay * U * 0.08 * dt) * drag;
      p.x += (p.vx + p.ex + Math.sin(this.t * 0.2 + p.y * 0.01) * 3) * dt;
      p.y += (p.vy + p.ey + Math.cos(this.t * 0.17 + p.x * 0.01) * 3) * dt;
      p.rot += p.spin * dt;
      if (p.x < -m) p.x += this.w + 2 * m; else if (p.x > this.w + m) p.x -= this.w + 2 * m;
      if (p.y < -m) p.y += this.h + 2 * m; else if (p.y > this.h + m) p.y -= this.h + 2 * m;
    }
    const k = 6, c = 3.5; // tether spring + damping
    for (const p of this.pads) {
      let ax = 0, ay = 0, kick = 0;
      for (let i = 0; i < DISTURBANCES; i++) {
        if (this.dAge[i] >= DISTURB_LIFE) continue;
        const dx = p.nx * this.w + p.ox - this.dX[i], dy = p.ny * this.h + p.oy - this.dY[i];
        nudge(dx, dy, this.dAge[i], this.dS[i], this.dR[i], _n);
        ax += _n.x; ay += _n.y;
        kick += dx * _n.y - dy * _n.x; // off-centre push twists the pad
      }
      const g = U * 0.1;
      p.vx += (ax * g - k * p.ox - c * p.vx) * dt; p.vy += (ay * g - k * p.oy - c * p.vy) * dt;
      p.ox += p.vx * dt; p.oy += p.vy * dt;
      const o = Math.hypot(p.ox, p.oy);
      if (o > maxOff) { p.ox *= maxOff / o; p.oy *= maxOff / o; }
      p.kick = (p.kick + Math.max(-1, Math.min(1, kick / (U * 0.1 + 1))) * 0.05 * dt * 60) * Math.exp(-dt * 2);
      p.rot += (p.spin + p.kick) * dt;
    }
  }

  build(): void {
    const U = this.unit, t = this.t, under = this.under, surf = this.surface;
    under.n = 0; surf.n = 0;
    const sh = U * 0.012;

    // Season mix: how many lotus leaves are out and how big, per pad.
    let padVis = 0, padSc = 0;
    SEASONS.forEach((s, i) => { padVis += this.sw[s] * PAD_FRAC[i]; padSc += this.sw[s] * PAD_SCALE[i]; });
    const np = this.pads.length, padA = (i: number) => clamp01(padVis * np - i + 0.5);

    // Pad shadows on the floor.
    this.pads.forEach((p, i) => {
      const a = padA(i);
      if (a > 0.01) under.sprite(p.nx * this.w + p.ox + sh * 2.5, p.ny * this.h + p.oy + sh * 3, p.size * padSc * U * 0.1 * (0.7 + 0.3 * a), 0, K(4, 0, 0, 0.35 * a));
    });
    // Firefly reflections: drawn under the water so the ripples distort them.
    this.fireflyPos((_i, x, y, a, ph) => under.sprite(x, y + U * 0.014, U * 0.05, 0, K(9, 1, ph, a * 0.5)));
    // Blooms, buds, dragonflies and food cast soft shadows.
    const bloomW = this.sw.summer, budW = Math.min(1, this.sw.summer + this.sw.spring * 0.6);
    this.pads.forEach((p, i) => {
      if (!p.flower) return;
      const a = padA(i) * (p.flower.bud ? itemAlpha(budW, p.flower.seed) : itemAlpha(bloomW, p.flower.seed));
      if (a < 0.01) return;
      const r = p.size * padSc * U * 0.1, ang = p.rot + 2.4;
      under.sprite(p.nx * this.w + p.ox + Math.cos(ang) * r * 0.3 + sh * 3, p.ny * this.h + p.oy + Math.sin(ang) * r * 0.3 + sh * 4.5, r * (p.flower.bud ? 0.22 : 0.45), 0, K(4, 0, 0, 0.3 * a));
    });
    if (this.sw.summer > 0.02) for (const d of this.dragonflies) under.sprite(d.x + sh * (1 + d.z * 6), d.y + sh * (1.5 + d.z * 9), U * 0.03, d.ang, K(4, 0, 0, 0.22 * this.sw.summer * (1 - 0.5 * d.z)));
    for (const p of this.pellets) if (p.alive) under.sprite(p.x + sh * 0.5, p.y + sh * 0.8, U * 0.007, 0, K(4, 0, 0, 0.3));

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
          // Two-joint fin: base angle and a lagging tip angle (swept further back), so it trails the stroke.
          const a1 = base + s * f.pec[0].x, a2 = base * 0.55 + s * f.pec[1].x, ll = L * len * 0.5 * (i === 2 ? 1.3 : 1);
          _fp[0].x = pts[i].x + nx * s * hw[i] * 0.7; _fp[0].y = pts[i].y + ny * s * hw[i] * 0.7;
          for (let j = 1; j < 3; j++) {
            const a = j === 1 ? a1 : a2;
            _fp[j].x = _fp[j - 1].x + back.x * Math.cos(a) * ll + nx * s * Math.sin(a) * ll;
            _fp[j].y = _fp[j - 1].y + back.y * Math.cos(a) * ll + ny * s * Math.sin(a) * ll;
          }
          _fw[0] = _fw[1] = _fw[2] = L * w * 1.15;
          under.ribbon(_fp, _fw, 0, 0, k(1));
        }
      }
      // Butterfly tail: a chain of lagging joints, each bending a little after the one before.
      const d = dirAt(n - 2);
      let ang = Math.atan2(d.y, d.x);
      _tp[0].x = pts[n - 1].x - d.x * L * 0.03; _tp[0].y = pts[n - 1].y - d.y * L * 0.03;
      _tw[0] = L * 0.05;
      for (let j = 1; j <= TAIL_SEGS; j++) {
        ang += f.tail[j - 1].x;
        _tp[j].x = _tp[j - 1].x + Math.cos(ang) * L * 0.1; _tp[j].y = _tp[j - 1].y + Math.sin(ang) * L * 0.1;
        _tw[j] = L * (0.05 + 0.15 * Math.sin(Math.min(1, j / 3.2) * Math.PI * 0.5));
      }
      under.ribbon(_tp, _tw, 0, 0, k(2));
      under.ribbon(pts, hw, L, maxHw, k(0));
    }

    // Surface: pads, flowers, petals (bob with the ripples in the vertex shader).
    const aged = this.sw.autumn * 0.5 + this.sw.winter * 0.3;
    this.pads.forEach((p, i) => {
      const a = padA(i);
      if (a > 0.01) surf.sprite(p.nx * this.w + p.ox, p.ny * this.h + p.oy, p.size * padSc * U * 0.1 * (0.7 + 0.3 * a), p.rot, K(6, p.seed, Math.min(1, p.age * 0.5 + aged), a));
    });
    this.pads.forEach((p, i) => {
      if (!p.flower) return;
      const bud = p.flower.bud, a = padA(i) * itemAlpha(bud ? budW : bloomW, p.flower.seed);
      if (a < 0.01) return;
      const r = p.size * padSc * U * 0.1, ang = p.rot + 2.4;
      const fx = p.nx * this.w + p.ox + Math.cos(ang) * r * 0.3, fy = p.ny * this.h + p.oy + Math.sin(ang) * r * 0.3;
      if (bud) surf.sprite(fx, fy, r * 0.22, p.rot + 0.8, K(12, 0, 0, a));
      else surf.sprite(fx, fy, r * 0.5 * (0.6 + 0.4 * a), p.rot * 0.5, K(7, p.flower.seed, p.flower.white ? 1 : 0, a));
    });
    for (const p of this.petals) {
      const w = this.sw[SEASONS[KIND_SEASON[p.kind]]];
      let a = itemAlpha(w, p.q), r = U * p.size * (p.kind === 0 ? 0.027 : p.kind === 1 ? 0.034 : p.kind === 2 ? 0.028 : 0.019);
      if (a < 0.01) continue;
      if (p.kind === 3) { // snowflake: grows and dims while still falling, melts away at the end of its life
        const z = p.landed ? 0 : 1 - p.age / SNOW_FALL;
        r *= 1 + z * 0.8; a *= (1 - 0.6 * z) * clamp01((SNOW_LIFE - p.age) / 1.5);
      }
      surf.sprite(p.x, p.y, r, p.rot, K(8, p.kind, p.q, a));
    }
    for (const p of this.pellets) {
      if (!p.alive) continue;
      surf.sprite(p.x, p.y, U * 0.0075, p.age * 0.3, K(11, 0, 0, clamp01(p.age / 0.3) * clamp01((PELLET_LIFE - p.age) / 2)));
    }
    if (this.sw.summer > 0.02) for (const d of this.dragonflies) surf.sprite(d.x, d.y, U * 0.026 * (1 + d.z * 0.5), d.ang, K(10, 0, d.hue, this.sw.summer));
    this.fireflyPos((_i, x, y, a, ph) => surf.sprite(x, y, U * 0.038, 0, K(9, 0, ph, a)));
  }

  /** Visits each visible firefly with its position, alpha (from the eased count) and flicker phase. */
  private fireflyPos(cb: (i: number, x: number, y: number, a: number, ph: number) => void): void {
    const n = Math.ceil(this.ffLevel), U = this.unit;
    for (let i = 0; i < n && i < this.fireflies.length; i++) {
      const f = this.fireflies[i], a = clamp01(this.ffLevel - i);
      cb(i, f.hx * this.w + Math.sin(this.t * f.fx + f.ph) * U * 0.1 + f.ox, f.hy * this.h + Math.cos(this.t * f.fy + f.ph * 1.7) * U * 0.08 + f.oy, a, f.ph / 6.28);
    }
  }
}
