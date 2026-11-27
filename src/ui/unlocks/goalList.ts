import "./unlocks.css";
import type { GoalStep } from "../../types/unlock";
import { goalText } from "../../utils/goalText";
import { rewardKindLabel, rewardName } from "../../utils/unlocks";
import { el } from "../dom";
import { iconImage, unlockIconUrl } from "./unlockIcon";

const count = (n: number): string => n.toLocaleString("en-US");

function progress(step: GoalStep): HTMLElement {
  const box = el("span", "result-goal-count", `${count(step.have)} / ${count(step.need)}`);
  if (step.gained > 0) box.append(el("b", "goal-gain", ` +${count(step.gained)}`));
  return box;
}

function bar(step: GoalStep): HTMLElement {
  const track = el("span", "result-goal-bar");
  const fill = el("span", "");
  fill.style.width = `${Math.round((Math.min(step.have, step.need) / step.need) * 100)}%`;
  track.append(fill);
  return track;
}

export function goalList(steps: readonly GoalStep[]): HTMLElement {
  const list = el("ul", "result-goals");
  list.setAttribute("aria-label", "Next goals");
  for (const step of steps) {
    const row = el("li", "");
    const name = el("span", "result-goal-name", rewardName(step.unlock.reward));
    name.append(el("small", "", rewardKindLabel(step.unlock.reward)));
    const goal = el("span", "result-goal-text", goalText(step.unlock.goal));
    row.append(iconImage(unlockIconUrl(step.unlock), "result-goal-icon"), name, progress(step), goal, bar(step));
    list.append(row);
  }
  return list;
}
