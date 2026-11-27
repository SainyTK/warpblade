import { STAGE_WAVES } from "../constants/waves";
import { track } from "../services/analytics";
import { isPlaytestSession, readPlaytestJob, readPlaytestStart, readTrainingHero } from "../services/playtestStart";
import { STAGES } from "../stages";
import { startRunAchievements } from "../store/achievements";
import { chosenJob } from "../store/jobs";
import { foundArts, foundTools, startRunUnlocks } from "../store/unlocks";
import type { StageChoice, StageId } from "../types/campaign";
import { parseStartBuild } from "../utils/build";
import { findJob } from "../utils/jobs";
import { xpToReach } from "../utils/progression";
import { beginAdventure, isAdventure, startAdventureAt } from "./adventure";
import { earnArt } from "./arts";
import { gainXp, openPicks, refreshGrowing } from "./progress";
import { resetRun } from "./run";
import { character, game, progress, rng, setCharacter } from "./state";
import { beginTraining } from "./training";

let choice: StageChoice = { stage: "prologue", hyper: false };

export const stageChoice = (): StageChoice => choice;

function runJob(): string | null {
  const asked = findJob(character, readPlaytestJob());
  if (asked) return asked.id;
  return readTrainingHero() === null ? chosenJob(character.id) : null;
}

const playtestStage = (asked: string | null, fallback: StageId): StageId =>
  asked && asked in STAGES ? (asked as StageId) : fallback;

function grantUnlocks(): void {
  for (const art of foundArts()) earnArt(art);
  const tools = foundTools();
  progress.build.rerolls += tools.rerolls ?? 0;
  progress.build.skips += tools.skips ?? 0;
  progress.build.banishes += tools.banishes ?? 0;
}

export function startRun(banner: string, next: StageChoice = choice): void {
  choice = next;
  setCharacter(character, runJob());
  resetRun(banner);
  if (readTrainingHero() !== null) {
    beginTraining();
    return;
  }
  startRunAchievements();
  startRunUnlocks();
  track("run_start", { hero: character.id, coop: false, stage: next.stage, hyper: next.hyper ? 1 : 0 });
  const playtest = readPlaytestStart();
  if (playtest?.section || playtest?.stage || (!playtest?.wave && !isPlaytestSession())) {
    beginAdventure(rng, playtestStage(playtest?.stage ?? null, next.stage), next.hyper);
    grantUnlocks();
    startAdventureAt(playtest?.section ?? 1);
  } else if (playtest?.wave) {
    game.wave = Math.min(playtest.wave, STAGE_WAVES) - 1;
  }
  if (!playtest) return;
  if (playtest.level > progress.level) gainXp(xpToReach(playtest.level) - xpToReach(progress.level));
  if (playtest.build) {
    Object.assign(progress.build, parseStartBuild(playtest.build, character));
    refreshGrowing();
  }
  if (!isAdventure()) openPicks();
}
