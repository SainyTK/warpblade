import type { SayaFxLook } from "../types/skillFx";
import { SKILL } from "./skills/ids";

export const SAYA_FX: Readonly<Record<string, SayaFxLook>> = {
  [SKILL.edge]: { shape: "slash", reach: 18, lift: 0, layer: "none" },
  [SKILL.clean]: { shape: "trail", reach: 0, lift: 0, layer: "ring" },
  [SKILL.reverse]: { shape: "slash", reach: 16, lift: 0, layer: "moon" },
  [SKILL.flow]: { shape: "pillar", reach: 28, lift: -16, layer: "swirl" },
  [SKILL.falling]: { shape: "nova", reach: 24, lift: -16, layer: "moon" },
  [SKILL.pass]: { shape: "trail", reach: 0, lift: 0, layer: "none" },
  [SKILL.step]: { shape: "trail", reach: 0, lift: 0, layer: "moon" },
  [SKILL.stroke]: { shape: "trail", reach: 0, lift: 0, layer: "none" },
  [SKILL.crescent]: { shape: "wave", reach: 50, lift: -18, layer: "moon" },
  [SKILL.rain]: { shape: "bolt", reach: 50, lift: -14, layer: "rain" },
  [SKILL.still]: { shape: "spikes", reach: 22, lift: -16, layer: "ring" },
  [SKILL.weep]: { shape: "mark", reach: 8, lift: 0, layer: "drips" },
  [SKILL.stain]: { shape: "burst", reach: 9, lift: 0, layer: "drips" },
  [SKILL.trail]: { shape: "wave", reach: 36, lift: -10, layer: "drips" },
  [SKILL.crane]: { shape: "burst", reach: 8, lift: 0, layer: "cranes" },
  [SKILL.shade]: { shape: "slash", reach: 16, lift: 0, layer: "none" },
  [SKILL.paper]: { shape: "mark", reach: 8, lift: 0, layer: "papers" },
  [SKILL.breath]: { shape: "pillar", reach: 26, lift: -16, layer: "moon" },
  [SKILL.calm]: { shape: "burst", reach: 10, lift: 0, layer: "ring" },
  [SKILL.moon]: { shape: "nova", reach: 40, lift: -30, layer: "moon" },
};

export const SAYA_FX_MERGE = 0.08;
