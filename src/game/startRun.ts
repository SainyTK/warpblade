import { HEAD_START_LEVEL } from "../constants/shopSkills";
import { STAGE_WAVES } from "../constants/waves";
import { track } from "../services/analytics";
import { isPlaytestSession, readPlaytestJob, readPlaytestStart, readTrainingHero } from "../services/playtestStart";
import { RIFT_STAGES, STAGES } from "../stages";
import { startRunAchievements } from "../store/achievements";
import { chosenJob } from "../store/jobs";
import { clearHeroRefund, ownsSkill } from "../store/meta";
import { startRunUnlocks } from "../store/unlocks";
import type { StageId } from "../types/campaign";
import { parseStartBuild } from "../utils/build";
import { findJob } from "../utils/jobs";
import { xpToReach } from "../utils/progression";
import { beginAdventure, earnedArtsOrder, isAdventure, startAdventureAt } from "./adventure";
import { earnArt } from "./arts";
import { gainXp, openPicks, refreshGrowing } from "./progress";
import { resetRun } from "./run";
import { character, game, progress, rng, setCharacter } from "./state";
import { beginTraining } from "./training";

/** the job a solo run plays: a dev build's `?job=` when the hero has that job, otherwise the one chosen */
function runJob(): string | null {
  const asked = findJob(character, readPlaytestJob());
  if (asked) return asked.id;
  return readTrainingHero() === null ? chosenJob(character.id) : null;
}

const playtestStage = (asked: string | null): StageId => (asked && asked in STAGES ? (asked as StageId) : "prologue");

function playtestCleared(stage: StageId, count: number): StageId[] {
  const rifts = RIFT_STAGES.filter((id) => id !== stage).slice(0, stage === "citadel" ? RIFT_STAGES.length : count);
  return stage === "prologue" ? [] : ["prologue", ...rifts];
}

function earnClearedArts(): void {
  for (const art of earnedArtsOrder()) earnArt(art);
}

/** a fresh solo run with everything bought in the shop: the chosen job, stats through the progress, Head Start's levels
 *  here */
export function startRun(banner: string): void {
  setCharacter(character, runJob());
  resetRun(banner);
  if (readTrainingHero() !== null) {
    beginTraining();
    return;
  }
  startRunAchievements();
  startRunUnlocks();
  clearHeroRefund();
  track("run_start", { hero: character.id, coop: false });
  if (ownsSkill("headStart")) gainXp(xpToReach(HEAD_START_LEVEL));
  const playtest = readPlaytestStart();
  if (playtest?.section || playtest?.stage || (!playtest?.wave && !isPlaytestSession())) {
    const stage = playtestStage(playtest?.stage ?? null);
    beginAdventure(rng, stage, playtestCleared(stage, playtest?.cleared ?? 0));
    if (stage !== "prologue") earnClearedArts();
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
