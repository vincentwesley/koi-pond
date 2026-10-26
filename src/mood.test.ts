import { describe, expect, it } from "vitest";
import { mood, parseOverrides, seasonOf, PHASES } from "./mood";

const at = (h: number, m = 0, mo = 5) => new Date(2026, mo, 15, h, m);

describe("mood", () => {
  it("picks the dominant phase through the day", () => {
    expect([2, 7.5, 12, 17.7, 19.1, 22].map((h) => mood(at(Math.floor(h), (h % 1) * 60)).phase))
      .toEqual(["night", "dawn", "day", "golden", "dusk", "night"]);
  });
  it("weights sum to 1 and never jump between adjacent minutes", () => {
    let prev = mood(at(0));
    for (let m = 1; m < 1440; m++) {
      const cur = mood(at(Math.floor(m / 60), m % 60));
      expect(PHASES.reduce((a, p) => a + cur.weights[p], 0)).toBeCloseTo(1, 6);
      expect(Math.abs(cur.ambient - prev.ambient)).toBeLessThan(0.05);
      expect(Math.abs(cur.waterTint[2] - prev.waterTint[2])).toBeLessThan(0.05);
      prev = cur;
    }
  });
  it("night has fireflies and no caustics; day the opposite", () => {
    expect(mood(at(2)).fireflies).toBe(1);
    expect(mood(at(2)).caustics).toBe(0);
    expect(mood(at(12)).fireflies).toBe(0);
  });
  it("seasons follow the month", () => {
    expect(["0", "3", "6", "9", "11"].map((m) => seasonOf(new Date(2026, +m, 10)).season)).toEqual(["winter", "spring", "summer", "autumn", "winter"]);
  });
  it("overrides win", () => {
    const m = mood(at(12), { time: "night", season: "winter" });
    expect(m.phase).toBe("night");
    expect(m.season).toBe("winter");
  });
});

describe("parseOverrides", () => {
  it("accepts listed values", () => expect(parseOverrides("?time=dusk&season=autumn")).toEqual({ time: "dusk", season: "autumn" }));
  it("ignores anything else", () => {
    expect(parseOverrides("?time=noon&season=<script>&embed=1")).toEqual({});
    expect(parseOverrides("")).toEqual({});
  });
});
