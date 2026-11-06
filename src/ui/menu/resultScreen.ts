import { STAGE_WAVES } from "../../constants/waves";
import { lastRun } from "../../game/runEnd";
import "../achievements/achievements.css";
import { runAchievements } from "../../store/achievements";
import { inRoom } from "../../store/coop";
import { bank } from "../../store/meta";
import type { Achievement } from "../../types/achievement";
import type { MenuView } from "../../types/menu";
import type { RunOutcome } from "../../types/run";
import { medalIcon } from "../achievements/medalIcon";
import { coinAmount } from "../coinIcon";
import { menuItem } from "./menuItem";
import { showScreen } from "./menuState";

const RESULT_TITLES: Record<RunOutcome, string> = { clear: "Stage clear", fallen: "Fallen", left: "Left the room" };

function line(label: string, value: HTMLElement): HTMLElement {
  const row = document.createElement("div");
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.append(value);
  row.append(dt, dd);
  return row;
}

/** at most this many earned achievements are named; the rest are counted */
const SHOWN = 3;

/** the achievements earned since the run began, each with its trophy and coins */
function earnedList(list: readonly Achievement[]): HTMLElement {
  const box = document.createElement("ul");
  box.className = "result-ach";
  box.setAttribute("aria-label", "Achievements earned");
  for (const a of list.slice(0, SHOWN)) {
    const row = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = a.name;
    row.append(medalIcon(true), name, coinAmount(a.reward));
    box.append(row);
  }
  if (list.length > SHOWN) {
    const more = document.createElement("li");
    more.className = "result-ach-more";
    more.textContent = `and ${list.length - SHOWN} more`;
    box.append(more);
  }
  return box;
}

/** how the last run ended and what it earned, then on to the start menu or the shop */
export function resultScreen(): MenuView {
  const run = lastRun();
  const summary = document.createElement("dl");
  summary.className = "result";
  summary.append(line("Coins earned", coinAmount(run.coins)), line("Bank", coinAmount(bank())));
  const list = document.createElement("nav");
  list.className = "menu-list";
  list.setAttribute("aria-label", "After the run");
  const shop = menuItem("Shop", () => showScreen("shop"));
  shop.dataset.opens = "shop";
  list.append(
    inRoom() ? menuItem("Back to the room", () => showScreen("coop")) : menuItem("Continue", () => showScreen("main")),
    shop,
  );
  const content = document.createElement("div");
  content.className = "menu-main";
  const earned = inRoom() ? [] : runAchievements();
  content.append(summary);
  if (earned.length) content.append(earnedList(earned));
  content.append(list);
  return {
    title: RESULT_TITLES[run.outcome],
    subtitle: `Wave ${run.wave} of ${STAGE_WAVES}`,
    content,
  };
}
