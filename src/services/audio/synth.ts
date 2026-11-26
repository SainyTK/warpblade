import { type AudioGraph, audioGraph, onAudioStart } from "./graph";
import { soundOn } from "./mix";

let noiseBuffer: AudioBuffer | null = null;

function makeNoise({ ctx }: AudioGraph): void {
  const n = ctx.sampleRate;
  noiseBuffer = ctx.createBuffer(1, n, n);
  const d = noiseBuffer.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
}

const liveGraph = (): AudioGraph | null => (soundOn() ? audioGraph() : null);

function envelope(ctx: AudioContext, g: GainNode, vol: number, dur: number, delay = 0): void {
  const t = ctx.currentTime + delay;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
}

export function tone(f0: number, f1: number, dur: number, type: OscillatorType = "sine", vol = 0.1, delay = 0): void {
  const graph = liveGraph();
  if (!graph) return;
  const { ctx, master } = graph;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  const t = ctx.currentTime + delay;
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  envelope(ctx, g, vol, dur, delay);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export function noise(
  dur: number,
  f0: number,
  f1: number,
  vol = 0.15,
  type: BiquadFilterType = "bandpass",
  q = 1.2,
): void {
  const graph = liveGraph();
  if (!graph || !noiseBuffer) return;
  const { ctx, master } = graph;
  const s = ctx.createBufferSource();
  const f = ctx.createBiquadFilter();
  const g = ctx.createGain();
  const t = ctx.currentTime;
  s.buffer = noiseBuffer;
  f.type = type;
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  f.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
  envelope(ctx, g, vol, dur);
  s.connect(f).connect(g).connect(master);
  s.start();
  s.stop(t + dur + 0.02);
}

onAudioStart(makeNoise);
