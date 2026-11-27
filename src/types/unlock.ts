import type { FusionId } from "../constants/resonance";
import type { Goal } from "./achievement";
import type { PickToolKey } from "./build";
import type { ArtId, StageId } from "./campaign";
import type { HeroJob } from "./job";

export type UnlockReward =
  | { kind: "stage"; stage: StageId }
  | { kind: "hyper"; stage: StageId }
  | { kind: "art"; art: ArtId }
  | { kind: "pickTool"; tool: PickToolKey; amount: number }
  | { kind: "hero"; hero: string }
  | { kind: "skill"; hero: string; skill: string }
  | { kind: "item"; item: string };

export interface UnlockDef {
  id: string;
  reward: UnlockReward;
  goal: Goal;
  price?: number;
  secret?: boolean;
}

export type UnlockState = "locked" | "forSale" | "found";

export interface GoalStep {
  unlock: UnlockDef;
  have: number;
  need: number;
  gained: number;
}

export type Discovery =
  | { type: "fusion"; id: FusionId }
  | { type: "recipe"; skill: string }
  | ({ type: "job" } & HeroJob)
  | { type: "unlock"; unlock: UnlockDef; forSale: boolean };
