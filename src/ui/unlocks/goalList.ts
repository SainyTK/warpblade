import "./unlocks.css";
import type { GoalStep } from "../../types/unlock";
import { goalText } from "../../utils/goalText";
import { rewardKindLabel, rewardName } from "../../utils/unlocks";
import { el } from "../dom";
import { goalBar } from "../menu/goalBar";
import { iconImage, unlockIconUrl } from "./unlockIcon";

export function goalList(steps: readonly GoalStep[]): HTMLElement {
  const list = el("ul", "result-goals");
  list.setAttribute("aria-label", "Closest goals");
  for (const step of steps) {
    const row = el("li", "");
    const name = el("span", "result-goal-name", rewardName(step.unlock.reward));
    name.append(el("small", "", rewardKindLabel(step.unlock.reward)));
    const goal = el("span", "result-goal-text", goalText(step.unlock.goal));
    const icon = iconImage(unlockIconUrl(step.unlock), "result-goal-icon");
    row.append(icon, name, goal, goalBar(step.have, step.need, step.gained));
    list.append(row);
  }
  return list;
}
