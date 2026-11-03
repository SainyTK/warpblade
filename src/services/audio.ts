/** Sound effects synthesized with Web Audio. The context starts on the first key or tap. */
class SoundEffects {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private master: GainNode | null = null;
  private gain = 1;
  enabled = true;

  /** 0 to 1; the curve is squared so each step sounds about as far apart, and 0.9 is the original loudness */
  setVolume(volume: number): void {
    this.gain = (volume / 0.9) ** 2;
    if (this.master) this.master.gain.value = this.gain;
  }

  start(): void {
    if (this.ctx) return;
    try {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.gain;
      this.master.connect(this.ctx.destination);
      const n = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, n, n);
      const d = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    } catch {
      this.ctx = null;
      this.master = null;
    }
  }
  private envelope(g: GainNode, vol: number, dur: number): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  tone(f0: number, f1: number, dur: number, type: OscillatorType = "sine", vol = 0.1): void {
    if (!this.ctx || !this.master || !this.enabled) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const t = this.ctx.currentTime;
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    this.envelope(g, vol, dur);
    o.connect(g).connect(this.master);
    o.start();
    o.stop(t + dur + 0.02);
  }
  noise(dur: number, f0: number, f1: number, vol = 0.15, type: BiquadFilterType = "bandpass", q = 1.2): void {
    if (!this.ctx || !this.master || !this.enabled || !this.noiseBuffer) return;
    const s = this.ctx.createBufferSource();
    const f = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    const t = this.ctx.currentTime;
    s.buffer = this.noiseBuffer;
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(f0, t);
    f.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
    this.envelope(g, vol, dur);
    s.connect(f).connect(g).connect(this.master);
    s.start();
    s.stop(t + dur + 0.02);
  }

  swing(pitch = 1): void {
    this.noise(0.12, 2600 * pitch, 700 * pitch, 0.12);
  }
  hit(big = false, pitch = 1): void {
    this.tone((big ? 140 : 180) * pitch, 50 * pitch, big ? 0.16 : 0.09, "square", 0.08);
    this.noise(0.08, 1800 * pitch, 300 * pitch, 0.12, "lowpass");
  }
  warp(): void {
    this.tone(500, 1700, 0.12, "sine", 0.07);
    this.tone(1700, 260, 0.22, "triangle", 0.05);
  }
  boom(): void {
    this.noise(0.6, 1200, 60, 0.32, "lowpass", 0.7);
    this.tone(90, 35, 0.35, "sine", 0.18);
  }
  chime(i = 0): void {
    this.tone(1400 + i * 160, 1300 + i * 160, 0.3, "triangle", 0.045);
  }
  shatter(): void {
    this.noise(0.25, 6000, 2000, 0.08, "highpass");
  }
  thunder(): void {
    this.noise(0.08, 5000, 2500, 0.25, "highpass");
    this.noise(0.8, 900, 50, 0.3, "lowpass", 0.6);
  }
  pickup(): void {
    this.tone(900, 1500, 0.08, "sine", 0.04);
  }
  hurt(): void {
    this.tone(240, 90, 0.2, "sawtooth", 0.07);
  }
  cast(): void {
    this.tone(300, 900, 0.25, "triangle", 0.04);
  }
  /** a spell press refused: still recharging or short of MP */
  denied(): void {
    this.tone(180, 150, 0.05, "square", 0.03);
  }
  dodge(): void {
    this.noise(0.18, 3000, 900, 0.08);
  }
  doubleJump(): void {
    this.tone(600, 1100, 0.1, "sine", 0.04);
  }
  lunge(): void {
    this.noise(0.15, 900, 300, 0.06);
  }
  death(): void {
    this.noise(0.4, 600, 80, 0.18, "lowpass");
  }
  /** a blow stopped by a guard */
  block(): void {
    this.tone(1300, 900, 0.07, "square", 0.05);
    this.noise(0.06, 5000, 3000, 0.07, "highpass");
  }
  perfect(): void {
    this.tone(880, 1760, 0.25, "sine", 0.06);
  }
  evade(): void {
    this.noise(0.12, 2500, 1200, 0.05);
  }
  levelUp(): void {
    this.tone(660, 990, 0.12, "triangle", 0.05);
    this.tone(990, 1320, 0.25, "triangle", 0.045);
  }
  learn(): void {
    this.tone(520, 1040, 0.18, "triangle", 0.05);
  }
  /** a rising note for each ultimate level reached while charging */
  chargeStep(level: number): void {
    this.tone(220 * 1.26 ** level, 260 * 1.26 ** level, 0.18, "sawtooth", 0.035);
  }
  ultimate(level: number): void {
    this.noise(0.3 + level * 0.15, 3000, 200, 0.12 + level * 0.04, "lowpass", 0.8);
    this.tone(500, 1500 + level * 300, 0.2, "triangle", 0.06);
  }
}

export const sfx = new SoundEffects();
