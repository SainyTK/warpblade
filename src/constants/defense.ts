import type { DefenseSide } from "../types/defense";

type Anchors = readonly (readonly [seconds: number, value: number])[];

export const DEFENSE_SECONDS = 600;

export const FIELD = { screens: 4, edgeClear: 70, crystalClear: 70, spawnInset: 18 } as const;

export const LEVEL_BY_SECOND: Anchors = [
  [0, 1],
  [90, 15],
  [270, 44],
  [480, 80],
  [570, 94],
  [600, 99],
];

export const FOES_PER_SECOND: Anchors = [
  [0, 0.55],
  [85, 0.75],
  [95, 0.3],
  [270, 0.42],
  [480, 0.55],
  [600, 0.7],
];

export const ALIVE_CAP_BY_SECOND: Anchors = [
  [0, 12],
  [270, 18],
  [600, 26],
];

export const PACK_SIZE_BY_SECOND: Anchors = [
  [0, 2],
  [200, 3],
  [450, 4],
  [600, 5],
];

export interface Front {
  from: number;
  sides: readonly DefenseSide[];
  openAtOnce: number;
  turnEvery?: number;
  surgeEvery?: number;
}

export const FRONTS: readonly Front[] = [
  { from: 0, sides: ["west"], openAtOnce: 1 },
  { from: 90, sides: ["west", "east"], openAtOnce: 1, turnEvery: 30 },
  { from: 210, sides: ["west", "east", "sky"], openAtOnce: 2, turnEvery: 25 },
  { from: 360, sides: ["west", "east", "sky", "below"], openAtOnce: 4, surgeEvery: 20 },
];

export const SURGING_SIDE_SHARE = 0.6;

export const SIDE_WARNING_SECONDS = 4;

export interface SideStyle {
  flies: boolean;
  packScale: number;
  eliteEvery: number;
  rungsBack: number;
  label: string;
}

export const SIDE_STYLE: Readonly<Record<DefenseSide, SideStyle>> = {
  west: { flies: false, packScale: 1.5, eliteEvery: 0, rungsBack: 1, label: "West" },
  east: { flies: false, packScale: 0.67, eliteEvery: 3, rungsBack: 0, label: "East" },
  sky: { flies: true, packScale: 1, eliteEvery: 0, rungsBack: 0, label: "Sky" },
  below: { flies: false, packScale: 0.75, eliteEvery: 0, rungsBack: 0, label: "Below" },
};

export const BELOW_RIFT_DISTANCE = { near: 70, far: 150 } as const;

export const SKY_RIFT_DISTANCE = { near: 110, far: 260 } as const;

export interface BigFoeCall {
  at: number;
  kind: "elite" | "mini" | "boss";
  distance: number;
}

export const BIG_FOE_CALLS: readonly BigFoeCall[] = [
  { at: 95, kind: "elite", distance: 240 },
  { at: 255, kind: "mini", distance: 260 },
  { at: 450, kind: "boss", distance: 280 },
];

export const BIG_FOE_XP_SECONDS = { elite: 12, mini: 25, boss: 40 } as const;

export const COOP_ALIVE_CAP_SCALE = 1.5;

export const HERO_HUNT_RANGE = { minion: 70, mini: 150, boss: 200 } as const;

export const CRYSTAL = {
  hp: 1200,
  hpPerTier: 0.15,
  secondsBetweenHitsByOneFoe: 1,
  strikeShare: 0.35,
  siegeReach: 60,
  siegeDamagePerSecond: 1.5,
  lowShare: 0.3,
  flashSeconds: 0.25,
  shatterSeconds: 2.2,
  height: 30,
  floatY: 14,
} as const;

export const REVIVE = { firstSeconds: 3, growth: 1.5, mostSeconds: 30, guardSeconds: 2 } as const;

export const PICK_DELAY_SECONDS = 0.35;
