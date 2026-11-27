import { FUSIONS } from "../constants/resonance";
import { STAGES } from "../stages";
import { ARTS } from "../stages/arts";
import type { PickToolKey } from "../types/build";
import type { Discovery, UnlockReward } from "../types/unlock";
import { findSkill } from "./skills";

const TOOL_NAMES: Readonly<Record<PickToolKey, string>> = { rerolls: "Reroll", skips: "Skip", banishes: "Banish" };

export function rewardName(reward: UnlockReward): string {
  if (reward.kind === "stage" || reward.kind === "hyper") return STAGES[reward.stage].name;
  if (reward.kind === "art") return ARTS[reward.art].name;
  return `${TOOL_NAMES[reward.tool]} +${reward.amount}`;
}

export function discoveryName(d: Discovery): string {
  if (d.type === "fusion") return FUSIONS.find((f) => f.id === d.id)?.name ?? "";
  if (d.type === "job") return d.job.name;
  if (d.type === "unlock") return rewardName(d.unlock.reward);
  return findSkill(d.skill)?.evolution.name ?? "";
}

interface DiscoveryLabel {
  toast: string;
  list: string;
}

const REWARD_LABEL: Readonly<Record<UnlockReward["kind"], DiscoveryLabel>> = {
  stage: { toast: "Stage open", list: "Stage open" },
  hyper: { toast: "Hyper open", list: "Hyper open" },
  art: { toast: "Rift Art in every run", list: "Rift Art" },
  pickTool: { toast: "Every run starts with", list: "Every run" },
};

const FOUND_LABEL: Readonly<Record<Exclude<Discovery["type"], "unlock">, DiscoveryLabel>> = {
  fusion: { toast: "Fusion found", list: "Fusion" },
  recipe: { toast: "Recipe learned", list: "Recipe" },
  job: { toast: "New job", list: "New job" },
};

const FOR_SALE: DiscoveryLabel = { toast: "Hyper for sale", list: "Hyper for sale" };

export function discoveryLabel(d: Discovery): DiscoveryLabel {
  if (d.type !== "unlock") return FOUND_LABEL[d.type];
  return d.forSale ? FOR_SALE : REWARD_LABEL[d.unlock.reward.kind];
}
