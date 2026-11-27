import { ARMORY_ITEMS } from "../constants/armory";
import { FUSIONS } from "../constants/resonance";
import { CHARACTERS } from "../heroes/roster";
import { STAGES } from "../stages";
import { ARTS } from "../stages/arts";
import type { GoalSource } from "../types/achievement";
import type { PickToolKey } from "../types/build";
import type { Discovery, GoalStep, UnlockDef, UnlockReward } from "../types/unlock";
import { goalProgress } from "./achievements";
import { findSkill } from "./skills";

const TOOL_NAMES: Readonly<Record<PickToolKey, string>> = { rerolls: "Reroll", skips: "Skip", banishes: "Banish" };

export function rewardName(reward: UnlockReward): string {
  switch (reward.kind) {
    case "stage":
    case "hyper":
      return STAGES[reward.stage].name;
    case "art":
      return ARTS[reward.art].name;
    case "pickTool":
      return `${TOOL_NAMES[reward.tool]} +${reward.amount}`;
    case "hero":
      return CHARACTERS.find((c) => c.id === reward.hero)?.name ?? reward.hero;
    case "skill":
      return findSkill(reward.skill)?.name ?? reward.skill;
    case "item":
      return ARMORY_ITEMS.find((i) => i.id === reward.item)?.name ?? reward.item;
  }
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
  hero: { toast: "New hero", list: "Hero" },
  skill: { toast: "New skill", list: "Skill" },
  item: { toast: "New in the Armory", list: "Armory" },
};

const SALE_LABEL: Readonly<Record<UnlockReward["kind"], DiscoveryLabel>> = {
  ...REWARD_LABEL,
  hyper: { toast: "Hyper for sale", list: "Hyper for sale" },
  hero: { toast: "Hero for sale", list: "Hero for sale" },
  skill: { toast: "Skill for sale in the Armory", list: "Skill for sale" },
};

const FOUND_LABEL: Readonly<Record<Exclude<Discovery["type"], "unlock">, DiscoveryLabel>> = {
  fusion: { toast: "Fusion found", list: "Fusion" },
  recipe: { toast: "Recipe learned", list: "Recipe" },
  job: { toast: "New job", list: "New job" },
};

export function discoveryLabel(d: Discovery): DiscoveryLabel {
  if (d.type !== "unlock") return FOUND_LABEL[d.type];
  const label = (d.forSale ? SALE_LABEL : REWARD_LABEL)[d.unlock.reward.kind];
  return d.unlock.reward.kind === "skill" && !d.forSale ? { ...label, list: rewardKindLabel(d.unlock.reward) } : label;
}

export function rewardKindLabel(reward: UnlockReward): string {
  if (reward.kind === "skill") return `${rewardName({ kind: "hero", hero: reward.hero })}'s skill`;
  return REWARD_LABEL[reward.kind].list;
}

export function closestSteps(
  open: readonly UnlockDef[],
  src: GoalSource,
  haveAtStart: ReadonlyMap<string, number>,
  count: number,
): GoalStep[] {
  const steps = open.map((unlock): GoalStep => {
    const { have, need } = goalProgress(unlock, src);
    return { unlock, have, need, gained: Math.max(0, have - (haveAtStart.get(unlock.id) ?? have)) };
  });
  const share = (s: GoalStep): number => s.have / s.need;
  return steps
    .filter((s) => s.have < s.need)
    .sort((a, b) => Number(b.gained > 0) - Number(a.gained > 0) || share(b) - share(a))
    .slice(0, count);
}
