import { ACHIEVEMENTS } from "../../constants/achievements";
import type { Achievement, GoalSource } from "../../types/achievement";
import { goalProgress, isRevealed } from "../../utils/achievements";
import { coinAmount } from "../coinIcon";
import { medalIcon } from "./medalIcon";

function span(cls: string, text = ""): HTMLSpanElement {
  const el = document.createElement("span");
  el.className = cls;
  el.textContent = text;
  return el;
}

/** a bar and a count for a goal that counts up, such as foes slain */
function progressBar(have: number, need: number): HTMLSpanElement {
  const box = span("ach-progress");
  const bar = span("hero-bar");
  const fill = span("");
  fill.style.width = `${Math.round((have / need) * 100)}%`;
  bar.append(fill);
  box.append(bar, span("ach-count", `${have.toLocaleString("en")} / ${need.toLocaleString("en")}`));
  return box;
}

/** the name of the achievement a hidden one waits on */
const prerequisite = (a: Achievement): string => ACHIEVEMENTS.find((p) => p.id === a.hiddenUntil)?.name ?? "";

/**
 * One achievement on the Achievements page, laid out like a shop row: lit with its reward once earned, dim with its
 * goal and progress before, and ??? with what reveals it while hidden. Arrows and the gamepad move through the rows.
 */
export function achievementRow(a: Achievement, earned: ReadonlySet<string>, src: GoalSource): HTMLElement {
  const done = earned.has(a.id);
  const shown = done || isRevealed(a, earned);
  const row = document.createElement("div");
  row.className = "shop-item ach-item";
  row.tabIndex = -1;
  row.dataset.nav = "";
  row.dataset.state = done ? "earned" : shown ? "open" : "hidden";
  const frame = span("shop-icon");
  if (shown) frame.append(medalIcon(done));
  else frame.append(span("ach-unknown", "?"));
  const head = span("shop-head");
  head.append(span("shop-name", shown ? a.name : "???"));
  const body = span("shop-body");
  body.append(head, span("shop-text", shown ? a.text : `Earn ${prerequisite(a)} to reveal.`));
  const { have, need } = goalProgress(a, src);
  if (shown && !done && need > 1) body.append(progressBar(have, need));
  const reward = coinAmount(a.reward, "shop-price");
  if (!done) reward.classList.add("short");
  row.append(frame, body, reward);
  row.setAttribute(
    "aria-label",
    shown ? `${a.name}. ${a.text} ${done ? "Earned" : "Not earned"}` : "Hidden achievement",
  );
  return row;
}
