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

// Packed fixed-point state for RGBA8 targets (no float render support): a height in [-4, 4)
// is stored as a 16-bit integer, high byte then low byte. Mirrors ripEnc/ripDec in shaders.ts.
export const PACK_SCALE = 8192;
export const PACK_ZERO = 32768;

/** Height -> [hi, lo] bytes (clamped, rounded to 1/8192). */
export function pack16(v: number): [number, number] {
  const u = Math.min(65535, Math.max(0, Math.floor(v * PACK_SCALE + 0.5) + PACK_ZERO));
  return [u >> 8, u & 255];
}

export const unpack16 = (hi: number, lo: number): number => (hi * 256 + lo - PACK_ZERO) / PACK_SCALE;
