import { CAMPAIGN_THREAT } from "../constants/campaign";
import type { StageDef, StageId } from "../types/campaign";

export function stageBaseThreat(stage: StageDef, riftsCleared: number): number {
  if (stage.kind === "prologue") return CAMPAIGN_THREAT.prologue;
  if (stage.kind === "citadel") return CAMPAIGN_THREAT.citadel;
  return CAMPAIGN_THREAT.firstRift + CAMPAIGN_THREAT.perRiftCleared * riftsCleared;
}

export function openStages(riftStages: readonly StageId[], cleared: readonly StageId[]): StageId[] {
  const left = riftStages.filter((id) => !cleared.includes(id));
  return left.length ? left : ["citadel"];
}

export const stageHpScale = (riftsCleared: number): number => CAMPAIGN_THREAT.hpPerRiftCleared ** riftsCleared;
