import { describe, expect, it } from "vitest";
import { Koi, followChain, steer, wrapAngle, SEGMENTS, type Vec } from "./spine";
import { dropShape, rippleStep } from "./ripple";

describe("spine", () => {
  it("wraps angles into [-pi, pi)", () => {
    expect(wrapAngle(3 * Math.PI)).toBeCloseTo(-Math.PI);
    expect(wrapAngle(-0.5)).toBeCloseTo(-0.5);
    expect(wrapAngle(7)).toBeCloseTo(7 - 2 * Math.PI);
  });

  it("steer limits turn rate and takes the short way round", () => {
    expect(steer(0, 1, 2, 0.1)).toBeCloseTo(0.2);
    expect(steer(3, -3, 10, 1)).toBeCloseTo(wrapAngle(-3)); // reaches target when allowed
    expect(steer(3, -3, 0.1, 1)).toBeCloseTo(3.1); // crosses +pi, not back through 0
  });

  it("followChain keeps every segment at exactly segLen", () => {
    const pts: Vec[] = [{ x: 0, y: 0 }, { x: 3, y: 4 }, { x: 3, y: 4 }, { x: 9, y: 1 }];
    followChain(pts, 2);
    for (let i = 1; i < pts.length; i++) expect(Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)).toBeCloseTo(2);
  });

  it("followChain limits the joint angle so the body cannot fold", () => {
    const pts: Vec[] = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0.1 }, { x: -1, y: 0 }];
    followChain(pts, 1, 0.3);
    for (let i = 2; i < pts.length; i++) {
      const a = Math.atan2(pts[i - 1].y - pts[i - 2].y, pts[i - 1].x - pts[i - 2].x);
      const b = Math.atan2(pts[i].y - pts[i - 1].y, pts[i].x - pts[i - 1].x);
      expect(Math.abs(wrapAngle(b - a))).toBeLessThanOrEqual(0.3 + 1e-9);
    }
  });

  it("koi stay inside the pond and keep their length over a long swim", () => {
    const w = 800, h = 500;
    const fish = [0, 1, 2].map((i) => new Koi(100 + i * 200, 250, i, 120, i, { speed: 0.5, turn: 1.5, wander: 1, shy: 1, seed: 7 + i }));
    for (let s = 0; s < 6000; s++) {
      for (const f of fish) f.update(1 / 60, { w, h, pointer: s % 500 < 100 ? { x: 400, y: 250 } : null, others: fish });
    }
    for (const f of fish) {
      expect(f.pts).toHaveLength(SEGMENTS);
      expect(f.head.x).toBeGreaterThan(0); expect(f.head.x).toBeLessThan(w);
      expect(f.head.y).toBeGreaterThan(0); expect(f.head.y).toBeLessThan(h);
      for (let i = 1; i < SEGMENTS; i++) expect(Math.hypot(f.pts[i].x - f.pts[i - 1].x, f.pts[i].y - f.pts[i - 1].y)).toBeCloseTo(f.segLen);
      expect(Number.isFinite(f.phase)).toBe(true);
    }
  });
});

describe("ripple", () => {
  const W = 33, H = 33;
  const run = (steps: number, damping: number) => {
    let prev = new Float32Array(W * H), cur = new Float32Array(W * H), out = new Float32Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) cur[y * W + x] = dropShape(Math.hypot(x - 16, y - 16), 4);
    const energy: number[] = [];
    for (let s = 0; s < steps; s++) {
      rippleStep(cur, prev, out, W, H, damping);
      [prev, cur, out] = [cur, out, prev];
      energy.push(cur.reduce((a, v) => a + v * v, 0));
    }
    return { cur, energy };
  };

  it("keeps flat water flat", () => {
    const z = new Float32Array(W * H), out = new Float32Array(W * H).fill(9);
    rippleStep(z, z, out, W, H, 0.99);
    expect(out.every((v) => v === 0)).toBe(true);
  });

  it("spreads a drop symmetrically", () => {
    const { cur } = run(10, 0.99);
    const at = (x: number, y: number) => cur[y * W + x];
    expect(at(16 + 7, 16)).toBeCloseTo(at(16 - 7, 16), 5);
    expect(at(16, 16 + 7)).toBeCloseTo(at(16 + 7, 16), 5);
    expect(Math.abs(at(16 + 7, 16))).toBeGreaterThan(0);
  });

  it("loses energy with damping and stays bounded", () => {
    const { cur, energy } = run(400, 0.98);
    expect(energy[energy.length - 1]).toBeLessThan(energy[0] * 0.01);
    expect(cur.every((v) => Number.isFinite(v) && Math.abs(v) < 2)).toBe(true);
  });

  it("drop profile is 1 at the centre and 0 at the radius", () => {
    expect(dropShape(0, 5)).toBe(1);
    expect(dropShape(5, 5)).toBe(0);
    expect(dropShape(2.5, 5)).toBeCloseTo(0.5);
  });
});
