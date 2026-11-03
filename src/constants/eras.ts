import type { EnemyType } from "../types/enemy";

/** the five looks of the stage, in the order a run passes through them */
export type EraId = "day" | "rain" | "night" | "twilight" | "abyss";

export interface Era {
  id: EraId;
  /** shown in the banner of the era's first wave */
  name: string;
  first: number;
  last: number;
  /** the foe that walks the floor and the foe that floats, in every normal wave of the era */
  ground: EnemyType;
  flyer: EnemyType;
  /** the mini boss of the era's fifth wave, when that wave is not a boss wave */
  mini: EnemyType;
  /** foes of the era before that still come early in this one, fewer each wave */
  carry?: { ground: EnemyType; flyer: EnemyType };
}

export const ERAS: readonly Era[] = [
  { id: "day", name: "Sunlit Ruins", first: 1, last: 5, ground: "thornback", flyer: "moth", mini: "oakheart" },
  { id: "rain", name: "The Storm Rolls In", first: 6, last: 10, ground: "mire", flyer: "stormkite", mini: "boghulk" },
  { id: "night", name: "Nightfall", first: 11, last: 15, ground: "husk", flyer: "wisp", mini: "brute" },
  {
    id: "twilight",
    name: "The Veil Thins",
    first: 16,
    last: 20,
    ground: "golem",
    flyer: "sprite",
    mini: "brute",
    carry: { ground: "husk", flyer: "wisp" },
  },
  { id: "abyss", name: "The Abyss", first: 21, last: 30, ground: "stalker", flyer: "eye", mini: "maw" },
];

/** the share of a twilight wave's foes still from the night at the era's first wave; it falls to none by its last */
export const CARRY_SHARE = 0.7;
