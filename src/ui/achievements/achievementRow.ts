import { ACHIEVEMENTS } from "../../constants/achievements";
import type { Achievement, GoalSource } from "../../types/achievement";
import { goalProgress, isRevealed } from "../../utils/achievements";
import { coinAmount } from "../coinIcon";
import { goalBar } from "../menu/goalBar";
import { medalIcon } from "./medalIcon";

function span(cls: string, text = ""): HTMLSpanElement {
  const el = document.createElement("span");
  el.className = cls;
  el.textContent = text;
  return el;
}

/** the name of the achievement a hidden one waits on */
const prerequisite = (a: Achievement): string => ACHIEVEMENTS.find((p) => p.id === a.hiddenUntil)?.name ?? "";

/**
 * One achievement on the Achievements page, laid out like a list row: lit with its reward once earned, dim with its
 * goal and progress before, and ??? with what reveals it while hidden. Arrows and the gamepad move through the rows.
 */
export function achievementRow(a: Achievement, earned: ReadonlySet<string>, src: GoalSource): HTMLElement {
  const done = earned.has(a.id);
  const shown = done || isRevealed(a, earned);
  const row = document.createElement("div");
  row.className = "list-row ach-item";
  row.tabIndex = -1;
  row.dataset.nav = "";
  row.dataset.state = done ? "earned" : shown ? "open" : "hidden";
  const frame = span("row-icon");
  if (shown) frame.append(medalIcon(done));
  else frame.append(span("ach-unknown", "?"));
  const head = span("row-head");
  head.append(span("row-name", shown ? a.name : "???"));
  const body = span("row-body");
  body.append(head, span("row-text", shown ? a.text : `Earn ${prerequisite(a)} to reveal.`));
  const { have, need } = goalProgress(a, src);
  if (shown && !done && need > 1) body.append(goalBar(have, need));
  const reward = coinAmount(a.reward, "row-price");
  if (!done) reward.classList.add("short");
  row.append(frame, body, reward);
  row.setAttribute(
    "aria-label",
    shown ? `${a.name}. ${a.text} ${done ? "Earned" : "Not earned"}` : "Hidden achievement",
  );
  return row;
}
