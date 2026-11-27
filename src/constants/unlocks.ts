import type { Goal } from "../types/achievement";
import type { StageId, StageTier } from "../types/campaign";
import type { UnlockDef, UnlockReward } from "../types/unlock";
import { OPENS_WITH_ALL, STAGE_OPENS, STAGE_ORDER, STAGE_TIER } from "./stageGraph";

export const HYPER_PRICE: Readonly<Record<StageTier, number>> = { 1: 150, 2: 300, 3: 450, 4: 600, 5: 900 };

const HYPER_REWARD: Readonly<Record<StageId, UnlockReward>> = {
  prologue: { kind: "pickTool", tool: "rerolls", amount: 1 },
  marsh: { kind: "art", art: "mirespit" },
  foundry: { kind: "art", art: "forgeflare" },
  glacier: { kind: "art", art: "rimefang" },
  skyway: { kind: "art", art: "galecall" },
  archive: { kind: "art", art: "inkwave" },
  moonlit: { kind: "art", art: "gloamlantern" },
  veil: { kind: "art", art: "riftlance" },
  blight: { kind: "art", art: "sporeburst" },
  citadel: { kind: "pickTool", tool: "banishes", amount: 1 },
};

const cleared = (stage: StageId, hyper = false): Goal => ({ kind: "stageClears", stage, hyper, need: 1 });

export const stageOpeners = (stage: StageId): StageId[] => STAGE_ORDER.filter((id) => STAGE_OPENS[id].includes(stage));

function openGoal(stage: StageId): Goal {
  const from = stageOpeners(stage);
  return {
    kind: "goalsMet",
    of: from.map((id) => cleared(id)),
    need: OPENS_WITH_ALL.includes(stage) ? from.length : 1,
  };
}

export const stageUnlockId = (stage: StageId): string => `stage:${stage}`;
export const hyperUnlockId = (stage: StageId): string => `hyper:${stage}`;
export const hyperRewardId = (stage: StageId): string => `hyperReward:${stage}`;

export const UNLOCKS: readonly UnlockDef[] = STAGE_ORDER.flatMap((stage): UnlockDef[] => [
  ...(stageOpeners(stage).length
    ? [{ id: stageUnlockId(stage), reward: { kind: "stage" as const, stage }, goal: openGoal(stage) }]
    : []),
  {
    id: hyperUnlockId(stage),
    reward: { kind: "hyper", stage },
    goal: cleared(stage),
    price: HYPER_PRICE[STAGE_TIER[stage]],
  },
  { id: hyperRewardId(stage), reward: HYPER_REWARD[stage], goal: cleared(stage, true) },
]);
