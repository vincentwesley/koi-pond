import { describe, it, expect } from "vitest";
import { ambience } from "./audio";
import { mood } from "./mood";

const a = (time: "day" | "dusk" | "night", season: "summer" | "winter") => ambience(mood(new Date(), { time, season }));

describe("ambience", () => {
  it("no crickets by day, some at dusk, most at night", () => {
    expect(a("day", "summer").crickets).toBe(0);
    expect(a("dusk", "summer").crickets).toBeGreaterThan(0);
    expect(a("night", "summer").crickets).toBe(1);
  });
  it("winter is quieter", () => {
    const s = a("night", "summer"), w = a("night", "winter");
    expect(w.crickets).toBeLessThan(s.crickets);
    expect(w.water).toBeLessThan(s.water);
  });
  it("gains stay bounded", () => {
    for (const t of ["day", "dusk", "night"] as const) for (const g of Object.values(a(t, "summer"))) expect(g).toBeLessThanOrEqual(1);
  });
});
