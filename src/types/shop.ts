import type { TrackedStats } from "./achievement";
import type { StatKey } from "./stats";

/** a passive stat bought in levels, each level adding the same amount */
export interface StatUpgrade {
  kind: "stat";
  id: string;
  name: string;
  text: string;
  stat: StatKey;
  /** added to the stat per level */
  per: number;
  levels: number;
  /** price of the first level; later levels cost more */
  price: number;
}

export type SkillId = "lastLight" | "headStart" | "lodestone" | "warpShock";

/** a skill bought once and kept for every run; none of them is offered on level up */
export interface ShopSkill {
  kind: "skill";
  id: SkillId;
  name: string;
  text: string;
  price: number;
}

export type ShopItem = StatUpgrade | ShopSkill;

/** what the player keeps between runs: the coin bank, the level of every item bought, heroes and achievements */
export interface MetaSave {
  coins: number;
  owned: Record<string, number>;
  /** heroes unlocked with coins; free heroes are never listed */
  heroes: string[];
  /** achievements earned, by id */
  achievements: string[];
  tracked: TrackedStats;
  /** relics, charms and slots found, by unlock id */
  unlocks: string[];
  /** relics whose evolution the player has made, so its recipe shows */
  recipes: string[];
}
