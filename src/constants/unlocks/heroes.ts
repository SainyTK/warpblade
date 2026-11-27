import { CHARACTERS } from "../../heroes/roster";
import type { Goal } from "../../types/achievement";
import type { StageId } from "../../types/campaign";
import type { UnlockDef } from "../../types/unlock";
import { STAGE_ORDER } from "../stageGraph";

export const heroUnlockId = (hero: string): string => `hero:${hero}`;

const anyHyperClear: Goal = {
  kind: "goalsMet",
  of: STAGE_ORDER.map((stage: StageId): Goal => ({ kind: "stageClears", stage, hyper: true, need: 1 })),
  need: 1,
};

const HERO_GOALS: Readonly<Record<string, { goal: Goal; secret?: boolean }>> = {
  aldric: { goal: { kind: "stageClears", stage: "prologue", need: 1 } },
  vesper: { goal: { kind: "count", stat: "kills", need: 2500 } },
  saya: { goal: { kind: "count", stat: "miniKills", need: 3 } },
  yun: { goal: { kind: "skillsFound", need: 30 } },
  brynn: { goal: { kind: "stageClears", stage: "foundry", need: 1 } },
  zafir: { goal: { kind: "count", stat: "bossKills", need: 6 } },
  calder: { goal: anyHyperClear, secret: true },
};

export const HERO_UNLOCKS: readonly UnlockDef[] = CHARACTERS.filter((c) => c.price > 0).map((c) => {
  const opens = HERO_GOALS[c.id];
  if (!opens) throw new Error(`No unlock goal for hero ${c.id}`);
  return { id: heroUnlockId(c.id), reward: { kind: "hero", hero: c.id }, price: c.price, ...opens };
});
