import type { ElementId } from "../types/campaign";
import { PK } from "../types/particle";
import type { ElementLook, FxTier, TierFeel } from "../types/skillFx";
import { hex, ramp, WHITE } from "../utils/color";
import { SPARKS } from "./palette";

export const FX_TIER_ORDER: readonly FxTier[] = ["early", "mid", "late", "evolved"];

export const FX_TIERS: Readonly<Record<FxTier, TierFeel>> = {
  early: {
    rank: 0,
    size: 1,
    life: 0.26,
    particles: 6,
    light: 18,
    lightStrength: 0.25,
    bloom: 0,
    shake: null,
    stop: 0,
    flash: 0,
    afterimages: 0,
    debris: 0,
    cracks: 0,
    embers: 0,
    sounds: 1,
  },
  mid: {
    rank: 1,
    size: 1.35,
    life: 0.34,
    particles: 14,
    light: 26,
    lightStrength: 0.32,
    bloom: 0.08,
    shake: [0.08, 1],
    stop: 0.015,
    flash: 0,
    afterimages: 1,
    debris: 0,
    cracks: 0,
    embers: 4,
    sounds: 1,
  },
  late: {
    rank: 2,
    size: 1.85,
    life: 0.46,
    particles: 26,
    light: 40,
    lightStrength: 0.4,
    bloom: 0.16,
    shake: [0.16, 2.4],
    stop: 0.045,
    flash: 0,
    afterimages: 2,
    debris: 8,
    cracks: 3,
    embers: 10,
    sounds: 2,
  },
  evolved: {
    rank: 3,
    size: 2.6,
    life: 0.62,
    particles: 44,
    light: 60,
    lightStrength: 0.5,
    bloom: 0.24,
    shake: [0.3, 4],
    stop: 0.08,
    flash: 0.3,
    afterimages: 3,
    debris: 16,
    cracks: 5,
    embers: 18,
    sounds: 3,
  },
};

export const FX_INTENSITY = {
  levelWeight: 1,
  masteryStep: 0.1,
  evolvedBonus: 1,
  punchPerDoubling: 1 / 3,
  punchLow: -0.3,
  punchHigh: 0.6,
  most: 3,
  midFrom: 0.35,
  lateFrom: 0.8,
  evolvedFrom: 1.8,
  minorDrop: 0.5,
  fillsScreenFrom: 2.4,
  gradeSpan: 0.3,
} as const;

export const FX_BUDGET = {
  liveSoftCap: 18,
  liveHardCap: 32,
  particlesPerFrame: 180,
  lightsLive: 8,
  feelGap: 0.12,
  stopGap: 0.3,
  soundGap: 0.06,
  maxGlow: 80,
  maxShakeAmp: 5,
} as const;

export const FX_READABILITY = {
  threatVeil: 0.35,
  threatMargin: 14,
  windupReach: 48,
  grace: 0.08,
} as const;

export const FX_REDUCED_MOTION = { stopScale: 0.5, afterimages: 0 } as const;

const STORM_SPARKS = [hex("#fff6c0"), hex("#ffe066"), hex("#ffc21f"), hex("#e0901a")];
const VENOM_SPARKS = [WHITE, hex("#d4ff9a"), hex("#9fe05a"), hex("#5aa82a")];
const VOID_SPARKS = [hex("#efe0ff"), hex("#c79bff"), hex("#9a5cff"), hex("#6a35d0")];

export const ELEMENT_FX: Readonly<Record<ElementId, ElementLook>> = {
  blaze: {
    ramp: ramp(["#4a1712", "#c9281f", "#f2561d", "#ff8a2a", "#ffe26b", "#fff8d8"]),
    sparks: SPARKS.hot,
    core: hex("#fff3a6"),
    dark: hex("#3a1a0c"),
    particle: PK.FIRE,
    linger: PK.EMBER,
    sound: "spellBlaze",
    rumble: "boom",
  },
  frost: {
    ramp: ramp(["#102a48", "#2b5a99", "#4f9bd4", "#8fd3f2", "#cbf1ff", "#f4fdff"]),
    sparks: SPARKS.ice,
    core: hex("#f4fdff"),
    dark: hex("#102a48"),
    particle: PK.SHARD,
    linger: PK.FLAKE,
    sound: "spellFrost",
    rumble: "shatter",
  },
  storm: {
    ramp: ramp(["#3a2408", "#8a5410", "#e0901a", "#ffc21f", "#ffe066", "#fff6c0"]),
    sparks: STORM_SPARKS,
    core: hex("#fff6c0"),
    dark: hex("#3a3010"),
    particle: PK.SPARK,
    linger: PK.STAR,
    sound: "spellStorm",
    rumble: "thunder",
  },
  venom: {
    ramp: ramp(["#1c3410", "#2f6a1a", "#5aa82a", "#9fe05a", "#d4ff9a", "#f4ffe0"]),
    sparks: VENOM_SPARKS,
    core: hex("#f4ffe0"),
    dark: hex("#1c3410"),
    particle: PK.MOTE,
    linger: PK.VAPOUR,
    sound: "spellVenom",
    rumble: "boom",
  },
  void: {
    ramp: ramp(["#1a0f3d", "#3d1f8a", "#6a35d0", "#9a5cff", "#c79bff", "#efe0ff"]),
    sparks: VOID_SPARKS,
    core: hex("#efe0ff"),
    dark: hex("#120a1e"),
    particle: PK.STAR,
    linger: PK.MOTE,
    sound: "spellVoid",
    rumble: "warp",
  },
};
