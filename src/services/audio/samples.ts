import { AUDIO_DIR, SAME_SOUND_GAP, SOUNDS } from "../../constants/audio";
import type { PlayOptions, SoundId } from "../../types/audio";
import { type AudioGraph, audioGraph, onAudioStart } from "./graph";
import { soundOn } from "./mix";

const buffers = new Map<string, AudioBuffer>();
const voiceEnds = new Map<SoundId, number[]>();
const lastStart = new Map<SoundId, number>();
const lastFile = new Map<SoundId, number>();

export async function loadAudioBuffer(ctx: AudioContext, path: string): Promise<AudioBuffer | null> {
  try {
    const response = await fetch(`${AUDIO_DIR}/${path}.ogg`);
    if (!response.ok) return null;
    return await ctx.decodeAudioData(await response.arrayBuffer());
  } catch {
    return null;
  }
}

function loadSamples({ ctx }: AudioGraph): void {
  const files = new Set(Object.values(SOUNDS).flatMap((sound) => sound.files));
  for (const file of files) {
    loadAudioBuffer(ctx, `sfx/${file}`).then((buffer) => {
      if (buffer) buffers.set(file, buffer);
    });
  }
}

function pickFile(id: SoundId, files: readonly string[]): number {
  if (files.length === 1) return 0;
  const previous = lastFile.get(id) ?? -1;
  const next = (previous + 1 + Math.floor(Math.random() * (files.length - 1))) % files.length;
  lastFile.set(id, next);
  return next;
}

function liveVoices(id: SoundId, now: number): number[] {
  const live = (voiceEnds.get(id) ?? []).filter((ends) => ends > now);
  voiceEnds.set(id, live);
  return live;
}

export function playSample(id: SoundId, { pitch = 1, volume = 1 }: PlayOptions = {}): boolean {
  const graph = audioGraph();
  if (!graph) return true;
  if (!soundOn()) return true;
  const sound = SOUNDS[id];
  const file = sound.files[pickFile(id, sound.files)];
  const buffer = buffers.get(file);
  if (!buffer) return false;
  const { ctx, effects } = graph;
  const now = ctx.currentTime;
  if (now - (lastStart.get(id) ?? -1) < SAME_SOUND_GAP) return true;
  const live = liveVoices(id, now);
  if (live.length >= sound.voices) return true;
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  const rate = pitch * (1 + (Math.random() * 2 - 1) * sound.pitchSpread);
  source.buffer = buffer;
  source.playbackRate.value = rate;
  gain.gain.value = sound.volume * volume;
  source.connect(gain).connect(effects);
  source.start(now);
  live.push(now + buffer.duration / rate);
  lastStart.set(id, now);
  return true;
}

onAudioStart(loadSamples);
