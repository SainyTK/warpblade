import { STAGE_WAVES } from "../../constants/waves";
import { lastRun } from "../../game/runEnd";
import "../achievements/achievements.css";
import "../results/results.css";
import { STAGES } from "../../stages";
import { runAchievements } from "../../store/achievements";
import { inRoom } from "../../store/coop";
import { bank } from "../../store/meta";
import { stageBest } from "../../store/stageRecords";
import { closestGoals, unlockedThisRun } from "../../store/unlocks";
import type { Achievement } from "../../types/achievement";
import type { MenuView } from "../../types/menu";
import type { RunOutcome, StageResult } from "../../types/run";
import { EMPTY_STAGE_BEST } from "../../utils/stageRecords";
import { medalIcon } from "../achievements/medalIcon";
import { coinAmount } from "../coinIcon";
import { el } from "../dom";
import { runFacts } from "../results/runFacts";
import { sourceTable } from "../results/sourceTable";
import { stageBestTable } from "../results/stageBest";
import { foundList } from "../unlocks/foundList";
import { goalList } from "../unlocks/goalList";
import { startGame, startStage } from "./menuActions";
import { menuItem } from "./menuItem";
import { showScreen } from "./menuState";

const RESULT_TITLES: Record<RunOutcome, string> = {
  clear: "Stage clear",
  beyond: "The eye is shut",
  fallen: "Fallen",
  left: "Left the room",
};

const STAGE_RESULT_TITLES: Record<RunOutcome, string> = {
  ...RESULT_TITLES,
  beyond: RESULT_TITLES.clear,
  fallen: "Crystal lost",
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

const SHOWN = 3;
const UNLOCKED_SHOWN = 8;
const GOALS_SHOWN = 3;

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

const stageName = (stage: StageResult): string => `${STAGES[stage.stage].name}${stage.hyper ? " Hyper" : ""}`;

const stageLine = (stage: StageResult): string =>
  stage.cleared ? stageName(stage) : stage.where ? `Lost in ${stage.where}` : stageName(stage);

function unlockedSection(): HTMLElement | null {
  const found = unlockedThisRun();
  if (!found.length) return null;
  const box = el("section", "result-unlocked");
  box.append(el("h3", "result-heading", "Unlocked"), foundList(found, UNLOCKED_SHOWN));
  return box;
}

function goalsSection(): HTMLElement | null {
  const steps = closestGoals(GOALS_SHOWN);
  if (!steps.length) return null;
  const box = el("section", "result-unlocked");
  box.append(el("h3", "result-heading", "Next goals"), goalList(steps));
  return box;
}

function navigation(stage: StageResult | undefined): HTMLElement {
  const list = document.createElement("nav");
  list.className = "menu-list";
  list.setAttribute("aria-label", "After the run");
  const armory = menuItem("Armory", () => showScreen("armory"));
  armory.dataset.opens = "armory";
  if (inRoom()) {
    list.append(
      menuItem("Back to the room", () => showScreen("coop")),
      armory,
    );
    return list;
  }
  const again = stage ? () => startStage({ stage: stage.stage, hyper: stage.hyper }) : startGame;
  const choose = menuItem("Choose stage", () => showScreen("stage"));
  choose.dataset.opens = "stage";
  list.append(
    menuItem("Play again", again),
    choose,
    menuItem("Main menu", () => showScreen("main")),
    armory,
  );
  return list;
}

export function resultScreen(): MenuView {
  const run = lastRun();
  const summary = document.createElement("dl");
  summary.className = "result";
  summary.append(line("Gold earned", coinAmount(run.coins)), line("Bank", coinAmount(bank())));
  const scroll = document.createElement("div");
  scroll.className = "menu-scroll result-body";
  const edges = (): void => {
    scroll.toggleAttribute("data-scrolled", scroll.scrollTop > 0);
    scroll.toggleAttribute("data-more", scroll.scrollTop + scroll.clientHeight < scroll.scrollHeight - 1);
  };
  scroll.addEventListener("scroll", edges, { passive: true });
  requestAnimationFrame(edges);
  const earned = runAchievements();
  if (run.report) scroll.append(runFacts(run.report, run.coins, run.stage));
  const unlocked = unlockedSection();
  if (unlocked) scroll.append(unlocked);
  const goals = goalsSection();
  if (goals) scroll.append(goals);
  if (run.stage) {
    const best = stageBest(run.stage.stage, run.stage.hyper) ?? EMPTY_STAGE_BEST;
    scroll.append(stageBestTable(`Best run, ${stageName(run.stage)}`, best, run.stage.beaten));
  }
  if (run.report?.sources.length) scroll.append(sourceTable(run.report));
  scroll.append(summary);
  if (earned.length) scroll.append(earnedList(earned));
  const content = document.createElement("div");
  content.className = "menu-sub";
  content.append(scroll, navigation(run.stage));
  return {
    title: run.stage ? STAGE_RESULT_TITLES[run.outcome] : RESULT_TITLES[run.outcome],
    subtitle: run.stage ? stageLine(run.stage) : run.outcome === "left" ? "" : `Wave ${run.wave} of ${STAGE_WAVES}`,
    content,
  };
}
