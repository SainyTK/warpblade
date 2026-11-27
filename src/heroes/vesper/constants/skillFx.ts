import type { VesperFxLook } from "../types/skillFx";

export const VESPER_FX: Readonly<Record<string, VesperFxLook>> = {
  ve_edge: { shape: "slash", reach: 18, lift: 0, layer: "none" },
  ve_keen: { shape: "slash", reach: 16, lift: 0, layer: "none" },
  ve_sky: { shape: "trail", reach: 0, lift: 0, layer: "none" },
  ve_storm: { shape: "slash", reach: 22, lift: 0, layer: "none" },
  ve_turn: { shape: "slash", reach: 16, lift: 0, layer: "ward" },
  ve_ascend: { shape: "pillar", reach: 30, lift: -16, layer: "none" },
  ve_warp: { shape: "pillar", reach: 34, lift: -16, layer: "none" },
  ve_slip: { shape: "trail", reach: 0, lift: 0, layer: "none" },
  ve_moon: { shape: "bolt", reach: 60, lift: -14, layer: "crescent" },
  ve_gale: { shape: "nova", reach: 22, lift: -16, layer: "spiral" },
  ve_thread: { shape: "trail", reach: 0, lift: 0, layer: "none" },
  ve_hex: { shape: "mark", reach: 8, lift: 0, layer: "sigil" },
  ve_night: { shape: "mark", reach: 8, lift: 0, layer: "stars" },
  ve_glow: { shape: "burst", reach: 9, lift: 0, layer: "none" },
  ve_shade: { shape: "trail", reach: 0, lift: 0, layer: "phantoms" },
  ve_swallow: { shape: "bolt", reach: 40, lift: 0, layer: "swallows" },
  ve_twin: { shape: "slash", reach: 15, lift: 0, layer: "phantoms" },
  ve_waltz: { shape: "nova", reach: 34, lift: -18, layer: "spiral" },
  ve_rhythm: { shape: "pillar", reach: 28, lift: -16, layer: "none" },
  ve_grace: { shape: "burst", reach: 9, lift: 0, layer: "ward" },
};

export const VESPER_FX_MERGE = 0.08;
