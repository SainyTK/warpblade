import type { FusionId } from "../constants/resonance";
import type { Goal } from "./achievement";
import type { PickToolKey } from "./build";
import type { ArtId, StageId } from "./campaign";
import type { HeroJob } from "./job";

export type UnlockReward =
  | { kind: "stage"; stage: StageId }
  | { kind: "hyper"; stage: StageId }
  | { kind: "art"; art: ArtId }
  | { kind: "pickTool"; tool: PickToolKey; amount: number };

export interface UnlockDef {
  id: string;
  reward: UnlockReward;
  goal: Goal;
  price?: number;
}

export type UnlockState = "locked" | "forSale" | "found";

export type Discovery =
  | { type: "fusion"; id: FusionId }
  | { type: "recipe"; skill: string }
  | ({ type: "job" } & HeroJob)
  | { type: "unlock"; unlock: UnlockDef; forSale: boolean };
