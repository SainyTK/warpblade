import type { Goal } from "../../types/achievement";
import type { StageId } from "../../types/campaign";
import type { UnlockDef } from "../../types/unlock";
import { ARMORY_ITEMS } from "../armory";
import { STAGE_ORDER } from "../stageGraph";

export const itemUnlockId = (item: string): string => `item:${item}`;

const stagesCleared = (need: number): Goal => ({
  kind: "goalsMet",
  of: STAGE_ORDER.map((stage: StageId): Goal => ({ kind: "stageClears", stage, need: 1 })),
  need,
});

const ITEM_GOALS: Readonly<Record<string, { goal: Goal; secret?: boolean }>> = {
  vitality: { goal: { kind: "count", stat: "kills", need: 25 } },
  edge: { goal: { kind: "best", stat: "level", need: 12 } },
  arcana: { goal: { kind: "count", stat: "coinsBanked", need: 150 } },
  skips: { goal: { kind: "count", stat: "kills", need: 400 } },
  wellspring: { goal: { kind: "best", stat: "level", need: 30 } },
  rerolls: { goal: { kind: "count", stat: "kills", need: 1000 } },
  precision: { goal: { kind: "count", stat: "miniKills", need: 1 } },
  fleet: { goal: { kind: "foeKills", foe: "moth", need: 500 } },
  lungs: { goal: { kind: "foeKills", foe: "thornback", need: 800 } },
  lodestone: { goal: { kind: "count", stat: "coinsBanked", need: 1000 } },
  warpShock: { goal: { kind: "count", stat: "bossKills", need: 1 } },
  banishes: { goal: { kind: "skillsFound", need: 15 } },
  growth: { goal: { kind: "fusionsFound", need: 1 } },
  greed: { goal: { kind: "count", stat: "coinsBanked", need: 2500 } },
  curse: { goal: stagesCleared(3), secret: true },
};

export const ITEM_UNLOCKS: readonly UnlockDef[] = ARMORY_ITEMS.map((item) => {
  const opens = ITEM_GOALS[item.id];
  if (!opens) throw new Error(`No unlock goal for Armory item ${item.id}`);
  return { id: itemUnlockId(item.id), reward: { kind: "item", item: item.id }, ...opens };
});
