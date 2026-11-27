import "../achievements/achievements.css";
import { el } from "../dom";

export function goalBar(have: number, need: number, gained = 0): HTMLSpanElement {
  const box = el("span", "ach-progress");
  const bar = el("span", "hero-bar");
  const fill = el("span", "");
  fill.style.width = `${Math.round((Math.min(have, need) / need) * 100)}%`;
  bar.append(fill);
  const count = el("span", "ach-count", `${have.toLocaleString("en-US")} / ${need.toLocaleString("en-US")}`);
  if (gained > 0) count.append(el("b", "goal-gain", ` +${gained.toLocaleString("en-US")}`));
  box.append(bar, count);
  return box;
}
