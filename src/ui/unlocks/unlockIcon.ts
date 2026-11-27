import { FUSIONS } from "../../constants/resonance";
import { STAGES } from "../../stages";
import { ARTS } from "../../stages/arts";
import type { StageId } from "../../types/campaign";
import type { Discovery, UnlockReward } from "../../types/unlock";
import { artIcon, elementIcon } from "../skills/icons/elements";
import { iconUrl, skillIcon } from "../skills/icons/iconImage";

function stageIcon(stage: StageId): string {
  const art = STAGES[stage].grantsArt;
  return elementIcon(art ? ARTS[art].element : "void");
}

function rewardIcon(reward: UnlockReward): string {
  if (reward.kind === "art") return artIcon(reward.art);
  if (reward.kind === "pickTool") return reward.tool;
  return stageIcon(reward.stage);
}

export function discoveryIconUrl(d: Discovery): string {
  if (d.type === "fusion") {
    const fusion = FUSIONS.find((f) => f.id === d.id);
    return iconUrl(elementIcon(fusion?.pair[0] ?? "void"));
  }
  if (d.type === "job") return iconUrl(d.job.icon);
  if (d.type === "unlock") return iconUrl(rewardIcon(d.unlock.reward));
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
