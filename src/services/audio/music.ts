import { MUSIC_FADE, MUSIC_FILES } from "../../constants/audio";
import type { MusicTrack } from "../../types/audio";
import { type AudioGraph, audioGraph, onAudioStart } from "./graph";
import { loadAudioBuffer } from "./samples";

interface Playing {
  track: MusicTrack;
  source: AudioBufferSourceNode;
  gain: GainNode;
}

const loaded = new Map<MusicTrack, Promise<AudioBuffer | null>>();
let wanted: MusicTrack | null = null;
let playing: Playing | null = null;

function bufferFor(ctx: AudioContext, track: MusicTrack): Promise<AudioBuffer | null> {
  const known = loaded.get(track);
  if (known) return known;
  const loading = loadAudioBuffer(ctx, `music/${MUSIC_FILES[track]}`);
  loaded.set(track, loading);
  return loading;
}

function fadeOut({ ctx }: AudioGraph, { source, gain }: Playing): void {
  const now = ctx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.linearRampToValueAtTime(0, now + MUSIC_FADE);
  source.stop(now + MUSIC_FADE);
}

function fadeIn(graph: AudioGraph, track: MusicTrack, buffer: AudioBuffer): void {
  const { ctx, music } = graph;
  const now = ctx.currentTime;
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = buffer;
  source.loop = true;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(1, now + MUSIC_FADE);
  source.connect(gain).connect(music);
  source.start(now);
  playing = { track, source, gain };
}

async function follow(graph: AudioGraph): Promise<void> {
  const track = wanted;
  if (playing?.track === track) return;
  if (playing) fadeOut(graph, playing);
  playing = null;
  if (!track) return;
  const buffer = await bufferFor(graph.ctx, track);
  if (!buffer || wanted !== track || playing) return;
  fadeIn(graph, track, buffer);
}

export function playMusic(track: MusicTrack | null): void {
  if (wanted === track) return;
  wanted = track;
  const graph = audioGraph();
  if (graph) follow(graph);
}

onAudioStart(follow);
