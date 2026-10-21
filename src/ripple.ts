// CPU reference of the ripple height-field step. The GPU shader (SIM_FS in shaders.ts)
// runs the same scheme: state = (current, previous), clamp-to-edge boundary.

/** One step of the discrete wave equation. Writes into `out`. */
export function rippleStep(cur: Float32Array, prev: Float32Array, out: Float32Array, w: number, h: number, damping: number): void {
  for (let y = 0; y < h; y++) {
    const yu = Math.max(0, y - 1) * w, yd = Math.min(h - 1, y + 1) * w, row = y * w;
    for (let x = 0; x < w; x++) {
      const l = cur[row + Math.max(0, x - 1)], r = cur[row + Math.min(w - 1, x + 1)];
      out[row + x] = ((l + r + cur[yu + x] + cur[yd + x]) * 0.5 - prev[row + x]) * damping;
    }
  }
}

/** Raised-cosine drop profile, as used by the shader. */
export const dropShape = (dist: number, radius: number): number =>
  dist >= radius ? 0 : 0.5 + 0.5 * Math.cos((Math.PI * dist) / radius);
