// Pond mood from the local clock and calendar. Pure: no DOM, no network.

export const PHASES = ["dawn", "day", "golden", "dusk", "night"] as const;
export const SEASONS = ["spring", "summer", "autumn", "winter"] as const;
export type Phase = (typeof PHASES)[number];
export type Season = (typeof SEASONS)[number];
type V3 = [number, number, number];

interface Look { light: V3; ambient: number; waterTint: V3; skyGlow: V3; caustics: number; moon: number; fireflies: number; bloomGain: number; bloomThr: number }

const LOOKS: Record<Phase, Look> = {
  dawn: { light: [1.0, 0.86, 0.84], ambient: 0.88, waterTint: [0.2, 0.52, 0.46], skyGlow: [1.0, 0.78, 0.84], caustics: 0.5, moon: 0.05, fireflies: 0.15, bloomGain: 0.8, bloomThr: 0.7 },
  day: { light: [1.0, 0.98, 0.92], ambient: 1.05, waterTint: [0.1, 0.44, 0.5], skyGlow: [0.62, 0.82, 0.98], caustics: 1.0, moon: 0, fireflies: 0, bloomGain: 0.6, bloomThr: 0.78 },
  golden: { light: [1.0, 0.8, 0.55], ambient: 1.0, waterTint: [0.68, 0.45, 0.26], skyGlow: [1.0, 0.72, 0.48], caustics: 0.85, moon: 0, fireflies: 0.1, bloomGain: 1.0, bloomThr: 0.65 },
  dusk: { light: [0.78, 0.68, 1.0], ambient: 0.72, waterTint: [0.3, 0.24, 0.56], skyGlow: [0.6, 0.5, 0.9], caustics: 0.3, moon: 0.1, fireflies: 0.85, bloomGain: 1.0, bloomThr: 0.62 },
  night: { light: [0.45, 0.58, 1.0], ambient: 0.62, waterTint: [0.04, 0.09, 0.22], skyGlow: [0.08, 0.12, 0.28], caustics: 0, moon: 1, fireflies: 1, bloomGain: 0.9, bloomThr: 0.6 },
};

// Hour-of-day keyframes; neighbours are smoothstep-blended.
const KEYS: [number, Phase][] = [[0, "night"], [5.5, "night"], [6.8, "dawn"], [9, "day"], [16, "day"], [17.6, "golden"], [19, "dusk"], [20.6, "night"], [24, "night"]];

export interface Mood extends Look {
  phase: Phase; // dominant phase
  weights: Record<Phase, number>;
  season: Season;
  seasonT: number; // 0..1 progress through the season
}
export interface Overrides { time?: Phase; season?: Season }

const NUM = ["ambient", "caustics", "moon", "fireflies", "bloomGain", "bloomThr"] as const;
const VEC = ["light", "waterTint", "skyGlow"] as const;

export function seasonOf(d: Date): { season: Season; seasonT: number } {
  const m = d.getMonth(), idx = Math.floor(((m + 1) % 12) / 3); // Dec-Feb winter, Mar-May spring, ...
  const order: Season[] = ["winter", "spring", "summer", "autumn"];
  const into = ((m + 1) % 3) + (d.getDate() - 1) / 31;
  return { season: order[idx], seasonT: Math.min(1, into / 3) };
}

export function mood(date: Date = new Date(), o: Overrides = {}): Mood {
  const w: Record<Phase, number> = { dawn: 0, day: 0, golden: 0, dusk: 0, night: 0 };
  if (o.time) w[o.time] = 1;
  else {
    const h = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
    let i = 0;
    while (i < KEYS.length - 2 && h >= KEYS[i + 1][0]) i++;
    const [h0, p0] = KEYS[i], [h1, p1] = KEYS[i + 1];
    const t = Math.min(1, Math.max(0, (h - h0) / (h1 - h0))), s = t * t * (3 - 2 * t);
    w[p0] += 1 - s; w[p1] += s;
  }
  const out = { weights: w } as Mood;
  const acc = out as unknown as Record<string, number | V3>;
  for (const k of NUM) acc[k] = 0;
  for (const k of VEC) acc[k] = [0, 0, 0];
  let best: Phase = "night";
  for (const p of PHASES) if (w[p] > w[best]) best = p;
  for (const p of PHASES) {
    if (!w[p]) continue;
    const L = LOOKS[p];
    for (const k of NUM) (acc[k] as number) += L[k] * w[p];
    for (const k of VEC) for (let c = 0; c < 3; c++) (acc[k] as V3)[c] += L[k][c] * w[p];
  }
  out.phase = best;
  const s = seasonOf(date);
  out.season = o.season ?? s.season;
  out.seasonT = o.season ? 0.5 : s.seasonT;
  return out;
}

/** `?time=` and `?season=` test overrides; anything not on the fixed lists is ignored. */
export function parseOverrides(search: string): Overrides {
  const q = new URLSearchParams(search), o: Overrides = {};
  const t = q.get("time"), s = q.get("season");
  if (t && (PHASES as readonly string[]).includes(t)) o.time = t as Phase;
  if (s && (SEASONS as readonly string[]).includes(s)) o.season = s as Season;
  return o;
}
