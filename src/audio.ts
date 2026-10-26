// Optional pond sound, synthesised in code. Nothing plays until the user turns it on.
import type { Mood } from "./mood";

export interface Ambience { water: number; wind: number; crickets: number }
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Mood -> layer gains (0..1). Day: water + light wind; dusk/night add crickets; winter is quieter. */
export function ambience(m: Pick<Mood, "weights" | "season">): Ambience {
  const w = m.weights, winter = m.season === "winter";
  const dark = clamp01(w.dusk * 0.8 + w.night);
  const k = winter ? 0.55 : 1;
  return {
    water: (0.5 + 0.1 * (w.day + w.golden)) * k,
    wind: (0.1 + 0.1 * (w.dawn + w.day + w.golden)) * k,
    crickets: dark * (winter ? 0.1 : m.season === "autumn" ? 0.6 : 1),
  };
}

const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
type Layers = Record<keyof Ambience, GainNode>;

export class PondAudio {
  on = false;
  private ctx?: AudioContext;
  private out?: GainNode;
  private last = 0;
  private hooked = false;
  private lay?: Layers;
  private target: Ambience = { water: 0.5, wind: 0.1, crickets: 0 };

  /** Called about once a second with the current mood; glides the layer gains. */
  setMood(m: Mood): void {
    this.target = ambience(m);
    this.apply();
  }

  private apply(): void {
    if (!this.ctx || !this.lay) return;
    const t = this.ctx.currentTime;
    for (const k of ["water", "wind", "crickets"] as const) this.lay[k].gain.setTargetAtTime(this.target[k], t, 2);
  }

  private init(): void {
    const ctx = (this.ctx = new AudioContext());
    const out = (this.out = ctx.createGain());
    out.gain.value = 0;
    out.connect(ctx.destination);

    // Brown noise loop as the water bed.
    const len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    let v = 0;
    for (let i = 0; i < len; i++) { v = (v + (Math.random() * 2 - 1) * 0.02) * 0.998; d[i] = v * 3.5; }
    const layer = (type: BiquadFilterType, freq: number, gain: number, lfoHz: number, lfoDepth: number, bus: GainNode) => {
      const src = ctx.createBufferSource();
      src.buffer = buf; src.loop = true;
      src.playbackRate.value = 0.9 + Math.random() * 0.2;
      const f = ctx.createBiquadFilter();
      f.type = type; f.frequency.value = freq; f.Q.value = 0.7;
      const g = ctx.createGain();
      g.gain.value = gain;
      const lfo = ctx.createOscillator(), lg = ctx.createGain();
      lfo.frequency.value = lfoHz; lg.gain.value = lfoDepth;
      lfo.connect(lg).connect(g.gain);
      src.connect(f).connect(g).connect(bus);
      src.start(); lfo.start();
    };
    const bus = () => { const b = ctx.createGain(); b.gain.value = 0; b.connect(out); return b; };
    const water = bus(), wind = bus(), crickets = bus();
    layer("lowpass", 420, 1, 0.06, 0.3, water);
    layer("bandpass", 1400, 0.24, 0.23, 0.16, water);
    layer("bandpass", 600, 1, 0.05, 0.4, wind);
    // Crickets: two persistent tones, chirp-gated by a fast and a slow LFO (no per-chirp nodes).
    for (const [hz, rate, slow] of [[4300, 7, 0.13], [3700, 5.5, 0.09]]) {
      const o = ctx.createOscillator(), amp = ctx.createGain(), fast = ctx.createOscillator(), fg = ctx.createGain(),
        gate = ctx.createOscillator(), gg = ctx.createGain(), gb = ctx.createGain();
      o.frequency.value = hz; amp.gain.value = 0.015;
      fast.frequency.value = rate; fg.gain.value = 0.015; fast.connect(fg).connect(amp.gain);
      gate.frequency.value = slow; gg.gain.value = 0.5; gb.gain.value = 0.5; gate.connect(gg).connect(gb.gain);
      o.connect(amp).connect(gb).connect(crickets);
      o.start(); fast.start(); gate.start();
    }
    this.lay = { water, wind, crickets };
    this.apply();
  }

  async toggle(): Promise<boolean> {
    if (!this.ctx) this.init();
    const ctx = this.ctx!, g = this.out!.gain;
    if (!this.hooked) {
      this.hooked = true;
      // Pause with the page when hidden.
      document.addEventListener("visibilitychange", () => { if (this.on) void (document.hidden ? ctx.suspend() : ctx.resume()); });
    }
    this.on = !this.on;
    if (this.on) await ctx.resume();
    g.cancelScheduledValues(ctx.currentTime);
    g.setTargetAtTime(this.on ? 0.6 : 0, ctx.currentTime, 0.25);
    return this.on;
  }

  /** Soft water "plink" for a ripple. pan in [-1, 1]. */
  plink(strength: number, pan: number): void {
    if (!this.on || !this.ctx || !this.out) return;
    const ctx = this.ctx, now = ctx.currentTime;
    if (now - this.last < 0.12) return;
    this.last = now;
    const f = PENTA[Math.floor(Math.random() * PENTA.length)] * (Math.random() < 0.3 ? 0.5 : 1);
    const o = ctx.createOscillator(), g = ctx.createGain(), p = ctx.createStereoPanner();
    o.type = "sine";
    o.frequency.setValueAtTime(f, now);
    o.frequency.exponentialRampToValueAtTime(f * 1.5, now + 0.09);
    const peak = Math.min(0.25, 0.08 + strength * 0.15);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(peak, now + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    p.pan.value = Math.max(-1, Math.min(1, pan));
    o.connect(g).connect(p).connect(this.out);
    o.start(now); o.stop(now + 0.5);
  }
}
