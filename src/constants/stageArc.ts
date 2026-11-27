import type { AreaArc, StageKind, StageTier } from "../types/campaign";

const OPENING: AreaArc = {
  enter: 1,
  gate: 4,
  beats: [
    { kind: "surge", foes: 40, to: 9 },
    { kind: "surge", foes: 50, to: 14 },
    { kind: "elite", to: 15 },
  ],
};

const MIDDLE: AreaArc = {
  enter: 15,
  gate: 18,
  beats: [
    { kind: "surge", foes: 60, to: 25 },
    { kind: "surge", foes: 70, to: 32 },
    { kind: "surge", foes: 80, to: 38 },
    { kind: "surge", foes: 90, to: 44 },
    { kind: "mini", to: 50 },
  ],
};

const FINAL: AreaArc = {
  enter: 50,
  gate: 54,
  beats: [
    { kind: "surge", foes: 80, to: 64 },
    { kind: "surge", foes: 90, to: 74 },
    { kind: "surge", foes: 100, to: 84 },
    { kind: "surge", foes: 110, to: 94 },
    { kind: "boss", to: 99 },
  ],
};

export const STAGE_ARCS: Readonly<Record<StageKind, readonly AreaArc[]>> = {
  prologue: [{ enter: 1, gate: 4, beats: [...OPENING.beats, ...MIDDLE.beats] }, FINAL],
  rift: [OPENING, MIDDLE, FINAL],
  citadel: [
    OPENING,
    MIDDLE,
    {
      enter: 50,
      gate: 54,
      beats: [
        { kind: "surge", foes: 80, to: 63 },
        { kind: "surge", foes: 90, to: 72 },
        { kind: "boss", foe: "maw", to: 78 },
      ],
    },
    {
      enter: 78,
      gate: 80,
      beats: [
        { kind: "surge", foes: 100, to: 88 },
        { kind: "surge", foes: 110, to: 95 },
        { kind: "boss", to: 99 },
      ],
    },
  ],
};

export const TIER_SCALE: Readonly<Record<StageTier, { hp: number; damage: number }>> = {
  1: { hp: 1, damage: 1 },
  2: { hp: 1.3, damage: 1.1 },
  3: { hp: 1.7, damage: 1.25 },
  4: { hp: 2.2, damage: 1.4 },
  5: { hp: 3, damage: 1.6 },
};

export const EXPECTED_HERO_DAMAGE: readonly (readonly [level: number, times: number])[] = [
  [1, 1],
  [15, 3],
  [30, 24],
  [50, 125],
  [80, 2500],
  [99, 6000],
];

export const CROWD_TOUGHNESS: readonly (readonly [level: number, times: number])[] = [
  [1, 1],
  [45, 1],
  [55, 5.5],
  [80, 2.9],
  [99, 2.8],
];

export const HERO_DPS_AT_LEVEL_1 = 30;

export const TIME_TO_KILL = { minion: 4.5, elite: 20, mini: 85, boss: 150 } as const;

export const FOE_BAND = {
  damagePerLevel: 0.015,
  eliteWeight: 3,
  goldShare: 0.4,
  summonXpOfLevel: 0.1,
} as const;

export const BIG_FOE_POWER = 1.25;

export const HYPER = { foePace: 1.25, coins: 2 } as const;

export const ROOM_BEATS = {
  pickDelay: 0.9,
  pause: 2,
  defaultCap: 10,
  capPerLevel: 0.12,
  mostCap: 26,
  parPerSurgeFoe: 1.6,
  parPerBigFoe: 60,
} as const;
