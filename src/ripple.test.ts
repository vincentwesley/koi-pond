import { describe, expect, it } from "vitest";
import { pack16, unpack16, PACK_ZERO } from "./ripple";

describe("packed ripple state", () => {
  it("zero packs to the clear value (128, 0)", () => {
    expect(pack16(0)).toEqual([PACK_ZERO >> 8, 0]);
  });
  it("round-trips within 1/8192 and clamps to the range", () => {
    for (const v of [-4, -1.234567, -0.0001, 0, 0.5, 2.718, 3.99]) {
      const [hi, lo] = pack16(v);
      expect(Math.abs(unpack16(hi, lo) - v)).toBeLessThanOrEqual(1 / 8192 / 2 + 1e-9);
    }
    expect(unpack16(...pack16(99))).toBeLessThan(4);
    expect(unpack16(...pack16(-99))).toBe(-4);
  });
  it("re-packing a decoded value is exact", () => {
    const p = pack16(0.3141);
    expect(pack16(unpack16(...p))).toEqual(p);
  });
});
