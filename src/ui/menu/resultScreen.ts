import { STAGE_WAVES } from "../../constants/waves";
import { lastRun } from "../../game/runEnd";
import "../achievements/achievements.css";
import "../results/results.css";
import { runAchievements } from "../../store/achievements";
import { inRoom } from "../../store/coop";
import { bank } from "../../store/meta";
import { unlockedThisRun } from "../../store/unlocks";
import type { Achievement } from "../../types/achievement";
import type { MenuView } from "../../types/menu";
import type { RunOutcome } from "../../types/run";
import { medalIcon } from "../achievements/medalIcon";
import { coinAmount } from "../coinIcon";
import { runFacts } from "../results/runFacts";
import { sourceTable } from "../results/sourceTable";
import { foundList } from "../unlocks/foundList";
import { menuItem } from "./menuItem";
import { showScreen } from "./menuState";

const RESULT_TITLES: Record<RunOutcome, string> = {
  clear: "Stage clear",
  beyond: "The eye is shut",
  fallen: "Fallen",
  left: "Left the room",
};

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

/** how the last run ended: time, level and foes, the damage of every source, what it earned; then on to the start menu or the shop */
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
  const scroll = document.createElement("div");
  scroll.className = "menu-scroll result-body";
  const earned = inRoom() ? [] : runAchievements();
  if (run.report) scroll.append(runFacts(run.report));
  if (run.report?.sources.length) scroll.append(sourceTable(run.report));
  scroll.append(summary);
  if (earned.length) scroll.append(earnedList(earned));
  const found = inRoom() ? [] : unlockedThisRun();
  if (found.length) scroll.append(foundList(found));
  const content = document.createElement("div");
  content.className = "menu-sub";
  content.append(scroll, list);
  return {
    title: RESULT_TITLES[run.outcome],
    subtitle: `Wave ${run.wave} of ${STAGE_WAVES}`,
    content,
  };
}
