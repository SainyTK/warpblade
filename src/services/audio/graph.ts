export interface AudioGraph {
  ctx: AudioContext;
  master: GainNode;
  effects: GainNode;
  music: GainNode;
}

let graph: AudioGraph | null = null;
const startListeners: ((graph: AudioGraph) => void)[] = [];

export const audioGraph = (): AudioGraph | null => graph;

export function onAudioStart(listener: (graph: AudioGraph) => void): void {
  startListeners.push(listener);
}

function followPageVisibility(ctx: AudioContext): void {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      ctx.suspend().catch(() => undefined);
      return;
    }
    ctx.resume().catch(() => undefined);
  });
}

export function startAudioGraph(): void {
  if (graph) {
    if (graph.ctx.state === "suspended" && !document.hidden) graph.ctx.resume().catch(() => undefined);
    return;
  }
  try {
    const ctx = new AudioContext();
    const master = ctx.createGain();
    const effects = ctx.createGain();
    const music = ctx.createGain();
    effects.connect(master);
    music.connect(master);
    master.connect(ctx.destination);
    graph = { ctx, master, effects, music };
  } catch {
    graph = null;
    return;
  }
  followPageVisibility(graph.ctx);
  for (const listener of startListeners) listener(graph);
}
