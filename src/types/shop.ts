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

/** what the player keeps between runs: the coin bank and the level of every item bought */
export interface MetaSave {
  coins: number;
  owned: Record<string, number>;
}
