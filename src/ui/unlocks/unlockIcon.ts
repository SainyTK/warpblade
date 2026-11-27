import { FUSIONS } from "../../constants/resonance";
import { CHARACTERS } from "../../heroes/roster";
import { STAGES } from "../../stages";
import { ARTS } from "../../stages/arts";
import type { StageId } from "../../types/campaign";
import type { Discovery, UnlockDef, UnlockReward } from "../../types/unlock";
import { artIcon, elementIcon } from "../skills/icons/elements";
import { iconUrl, skillIcon } from "../skills/icons/iconImage";

function stageIcon(stage: StageId): string {
  const art = STAGES[stage].grantsArt;
  return elementIcon(art ? ARTS[art].element : "void");
}

function rewardIcon(reward: UnlockReward): string {
  switch (reward.kind) {
    case "art":
      return artIcon(reward.art);
    case "pickTool":
      return reward.tool;
    case "hero":
      return CHARACTERS.find((c) => c.id === reward.hero)?.sourceIcons.attacks ?? "vitality";
    case "skill":
      return reward.skill;
    case "item":
      return reward.item;
    case "stage":
    case "hyper":
      return stageIcon(reward.stage);
  }
}

export const unlockIconUrl = (def: UnlockDef): string => iconUrl(rewardIcon(def.reward));

export function discoveryIconUrl(d: Discovery): string {
  if (d.type === "fusion") {
    const fusion = FUSIONS.find((f) => f.id === d.id);
    return iconUrl(elementIcon(fusion?.pair[0] ?? "void"));
  }
  if (d.type === "job") return iconUrl(d.job.icon);
  if (d.type === "unlock") return unlockIconUrl(d.unlock);
  return iconUrl(skillIcon(d.skill, true));
}

export function iconImage(url: string, cls = ""): HTMLImageElement {
  const img = document.createElement("img");
  img.className = cls;
  img.src = url;
  img.alt = "";
  img.width = 16;
  img.height = 16;
  return img;
}
