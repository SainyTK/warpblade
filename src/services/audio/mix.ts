import { MUSIC_LEVEL, SFX_LEVEL } from "../../constants/audio";
import { type AudioGraph, audioGraph, onAudioStart } from "./graph";

export interface AudioMix {
  on: boolean;
  volume: number;
  music: number;
}

const mix: AudioMix = { on: true, volume: 1, music: 1 };

const loudness = (level: number): number => (level / 0.9) ** 2;

function apply({ master, effects, music }: AudioGraph): void {
  master.gain.value = mix.on ? loudness(mix.volume) : 0;
  effects.gain.value = SFX_LEVEL;
  music.gain.value = MUSIC_LEVEL * mix.music ** 2;
}

export const soundOn = (): boolean => mix.on;

export function setAudioMix(next: AudioMix): void {
  Object.assign(mix, next);
  const graph = audioGraph();
  if (graph) apply(graph);
}

onAudioStart(apply);
