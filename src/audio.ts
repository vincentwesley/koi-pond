// Optional pond sound, synthesised in code. Nothing plays until the user turns it on.

const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];

export class PondAudio {
  on = false;
  private ctx?: AudioContext;
  private out?: GainNode;
  private last = 0;

  private init(): void {
    const ctx = (this.ctx = new AudioContext());
    const out = (this.out = ctx.createGain());
    out.gain.value = 0;
    out.connect(ctx.destination);

    // Brown noise loop as the water bed.
    const len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    let v = 0;
    for (let i = 0; i < len; i++) { v = (v + (Math.random() * 2 - 1) * 0.02) * 0.998; d[i] = v * 3.5; }
    const layer = (type: BiquadFilterType, freq: number, gain: number, lfoHz: number, lfoDepth: number) => {
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
      src.connect(f).connect(g).connect(out);
      src.start(); lfo.start();
    };
    layer("lowpass", 420, 0.5, 0.06, 0.15);
    layer("bandpass", 1400, 0.12, 0.23, 0.08);
  }

  async toggle(): Promise<boolean> {
    if (!this.ctx) this.init();
    const ctx = this.ctx!, g = this.out!.gain;
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
