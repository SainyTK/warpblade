import type { TrackedStats } from "./achievement";
import type { PickToolKey } from "./build";
import type { StatKey } from "./stats";

export type ArmorySection = "Stats" | "Picks" | "Gear" | "Fortune";

interface ItemBase {
  id: string;
  name: string;
  levelText: string;
  levels: number;
  firstPrice: number;
}

export interface StatItem extends ItemBase {
  kind: "stat";
  stat: StatKey;
  perLevel: number;
}

export interface ToolItem extends ItemBase {
  kind: "tool";
  tool: PickToolKey;
}

export type GearId = "lodestone" | "warpShock";

export interface GearItem extends ItemBase {
  kind: "gear";
  id: GearId;
}

export interface ArmoryRates {
  gold: number;
  xp: number;
  foeHp: number;
  foeDamage: number;
}

export interface FortuneItem extends ItemBase {
  kind: "fortune";
  perLevel: Partial<ArmoryRates>;
}

export type ArmoryItem = StatItem | ToolItem | GearItem | FortuneItem;

export interface MetaSave {
  coins: number;
  owned: Record<string, number>;
  spentOnOwned: number;
  switchedOff: string[];
  achievements: string[];
  tracked: TrackedStats;
  unlocks: string[];
  recipes: string[];
}

export interface LegacyShopPrice {
  firstPrice: number;
  levels: number;
}
