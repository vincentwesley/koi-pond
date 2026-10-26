// Koi motion: a head with heading/turn rate drags a chain of fixed-length segments.
// Pure maths (no DOM/GL) so it can be unit tested.

export interface Vec { x: number; y: number }
export const SEGMENTS = 12;
const TAU = Math.PI * 2;

export const wrapAngle = (a: number): number => a - TAU * Math.floor((a + Math.PI) / TAU);

/** Turn `heading` toward `desired`, by at most `maxTurn * dt` radians. */
export function steer(heading: number, desired: number, maxTurn: number, dt: number): number {
  const d = wrapAngle(desired - heading);
  const lim = maxTurn * dt;
  return wrapAngle(heading + Math.max(-lim, Math.min(lim, d)));
}

/** Follow-the-leader: each point is pulled to exactly `segLen` behind the previous one,
 *  and the joint angle is limited to `maxBend` so the body never folds. */
export function followChain(pts: Vec[], segLen: number, maxBend = 0.3): void {
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    let ang = Math.atan2(b.y - a.y, b.x - a.x);
    if (Math.hypot(b.x - a.x, b.y - a.y) < 1e-6) ang = Math.PI;
    if (i > 1) {
      const z = pts[i - 2], prev = Math.atan2(a.y - z.y, a.x - z.x);
      const d = wrapAngle(ang - prev);
      ang = prev + Math.max(-maxBend, Math.min(maxBend, d));
    }
    b.x = a.x + Math.cos(ang) * segLen;
    b.y = a.y + Math.sin(ang) * segLen;
  }
}

/** Seeded PRNG (mulberry32). */
export function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Personality { speed: number; turn: number; wander: number; shy: number; seed: number }

export interface World {
  w: number; h: number;
  pointer: Vec | null; // only set while the pointer is disturbing the water
  others: readonly Koi[];
  pointerShy?: number; // 0..1 scale on shyness of the pointer (hover is milder than a press); default 1
}

/** Steering vector toward a soft target: approach, then circle it at ~0.6 body lengths (nibble).
 *  Written into `out` (no allocation). Zero when sitting on the target. */
export function attractVec(hx: number, hy: number, tx: number, ty: number, L: number, out: Vec): Vec {
  const dx = tx - hx, dy = ty - hy, d = Math.hypot(dx, dy);
  if (d < 1e-3) { out.x = out.y = 0; return out; }
  const ux = dx / d, uy = dy / d, r0 = L * 0.6;
  const w = Math.max(0, Math.min(1, (d - r0) / (r0 * 0.5))); // 1 = far (pure approach), 0 = on the orbit
  const rad = w + (1 - w) * Math.max(-1, Math.min(1, (d - r0) / r0)) * 0.5, tan = (1 - w) * 0.8;
  out.x = ux * rad - uy * tan;
  out.y = uy * rad + ux * tan;
  return out;
}

const _att: Vec = { x: 0, y: 0 };

export class Koi {
  pts: Vec[];
  heading: number;
  speed: number;
  segLen: number;
  phase = 0;
  t = 0;
  depth: number;
  private depthTarget: number;
  private rand: () => number;
  private boost = 0;
  private feedT = 0;
  private feedAge = 0;
  private feedX = 0;
  private feedY = 0;

  length: number;
  variety: number;
  p: Personality;

  constructor(x: number, y: number, heading: number, length: number, variety: number, p: Personality) {
    this.length = length;
    this.variety = variety;
    this.p = p;
    this.rand = rng(p.seed);
    this.heading = heading;
    this.speed = p.speed * length;
    this.segLen = length / (SEGMENTS - 1);
    this.pts = Array.from({ length: SEGMENTS }, (_, i) => ({
      x: x - Math.cos(heading) * this.segLen * i,
      y: y - Math.sin(heading) * this.segLen * i,
    }));
    this.depth = this.depthTarget = this.rand() * 0.7;
  }

  get head(): Vec { return this.pts[0]; }

  /** Speed burst, e.g. when a drop lands nearby. */
  startle(amount: number): void { this.boost = Math.max(this.boost, amount); }

  /** Soft target: ease toward (x,y), circle it for `secs`, then go back to wandering. */
  feed(x: number, y: number, secs: number): void { this.feedX = x; this.feedY = y; this.feedT = secs; this.feedAge = 0; }

  get feeding(): boolean { return this.feedT > 0; }

  update(dt: number, world: World): void {
    const { p } = this;
    const h = this.head;
    this.t += dt;
    const L = this.length;

    // Wander: smooth sum of sines, unique per fish.
    const s = p.seed * 0.001;
    const wander = (Math.sin(this.t * 0.37 * p.wander + s * 7) + 0.6 * Math.sin(this.t * 0.91 * p.wander + s * 13)) * 0.9;
    let dx = Math.cos(this.heading + wander * 0.6);
    let dy = Math.sin(this.heading + wander * 0.6);

    // Soft walls: push back toward the pond inside a margin.
    const m = Math.min(world.w, world.h) * 0.18 + L * 0.5;
    const push = (d: number) => (d < m ? ((m - Math.max(d, 0)) / m) ** 1.5 * 4 : 0);
    const wx = push(h.x) - push(world.w - h.x), wy = push(h.y) - push(world.h - h.y);
    dx += wx;
    dy += wy;
    const urgency = Math.min(2, Math.hypot(wx, wy));

    // Soft target (tap): ease in over ~0.8 s, ignore the pointer while nibbling.
    let slow = 1;
    if (this.feedT > 0) {
      this.feedT -= dt; this.feedAge += dt;
      const ease = Math.min(1, this.feedAge / 0.8) * Math.min(1, this.feedT / 0.6 + 0.3);
      attractVec(h.x, h.y, this.feedX, this.feedY, L, _att);
      dx += _att.x * 2.5 * ease; dy += _att.y * 2.5 * ease;
      if (Math.hypot(this.feedX - h.x, this.feedY - h.y) < L) slow = 0.55;
    }

    // Shy of the pointer.
    let flee = 0;
    if (world.pointer && this.feedT <= 0) {
      const px = h.x - world.pointer.x, py = h.y - world.pointer.y;
      const d = Math.hypot(px, py), r = L * 1.6;
      if (d < r && d > 1e-3) {
        flee = ((r - d) / r) * p.shy * (world.pointerShy ?? 1);
        dx += (px / d) * flee * 3;
        dy += (py / d) * flee * 3;
      }
    }

    // Gentle separation from other koi.
    for (const o of world.others) {
      if (o === this) continue;
      const ox = h.x - o.head.x, oy = h.y - o.head.y;
      const d = Math.hypot(ox, oy), r = (L + o.length) * 0.45;
      if (d < r && d > 1e-3) { dx += (ox / d) * ((r - d) / r) * 0.8; dy += (oy / d) * ((r - d) / r) * 0.8; }
    }

    const desired = Math.atan2(dy, dx);
    const before = this.heading;
    // Turn radius scales with speed (never tighter than ~0.4 body lengths), like a real koi.
    const maxTurn = Math.min(3, (this.speed / L / 0.4) * p.turn) * (1 + flee + urgency);
    this.heading = steer(this.heading, desired, maxTurn, dt);
    const turning = Math.abs(wrapAngle(this.heading - before)) / Math.max(dt, 1e-4);

    this.boost = Math.max(0, this.boost - dt * 0.8);
    const target = p.speed * L * (1 + flee * 2.2 + this.boost * 2) * slow;
    this.speed += (target - this.speed) * Math.min(1, dt * 1.5);

    h.x += Math.cos(this.heading) * this.speed * dt;
    h.y += Math.sin(this.heading) * this.speed * dt;
    // Hard clamp as a safety net; soft walls do the real work.
    h.x = Math.min(world.w - 2, Math.max(2, h.x));
    h.y = Math.min(world.h - 2, Math.max(2, h.y));
    followChain(this.pts, this.segLen);

    // Tail beat speeds up with swim speed and turning.
    this.phase += dt * (2.2 + (this.speed / L) * 6 + turning * 0.8);

    // Drift slowly between depths.
    if (this.rand() < dt * 0.08) this.depthTarget = this.rand() * 0.8;
    this.depth += (this.depthTarget - this.depth) * dt * 0.15;
  }

  /** Spine with the swimming undulation applied (for rendering only). */
  bodyPoints(): Vec[] {
    const n = this.pts.length;
    const amp = this.length * (0.02 + Math.min(0.03, (this.speed / this.length) * 0.025));
    return this.pts.map((q, i) => {
      const a = this.pts[Math.max(0, i - 1)], b = this.pts[Math.min(n - 1, i + 1)];
      const tx = a.x - b.x, ty = a.y - b.y, tl = Math.hypot(tx, ty) || 1;
      const k = amp * (i / (n - 1)) ** 1.6 * Math.sin(this.phase - i * 0.32);
      return { x: q.x - (ty / tl) * k, y: q.y + (tx / tl) * k };
    });
  }
}
