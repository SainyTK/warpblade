import { HEAD_START_LEVEL } from "../constants/shopSkills";
import { STAGE_WAVES } from "../constants/waves";
import { track } from "../services/analytics";
import { isPlaytestSession, readPlaytestJob, readPlaytestStart } from "../services/playtestStart";
import { startRunAchievements } from "../store/achievements";
import { chosenJob } from "../store/jobs";
import { clearHeroRefund, ownsSkill } from "../store/meta";
import { startRunUnlocks } from "../store/unlocks";
import { parseStartBuild } from "../utils/build";
import { findJob } from "../utils/jobs";
import { xpToReach } from "../utils/progression";
import { beginAdventure, isAdventure, startAdventureAt } from "./adventure";
import { gainXp, openPicks, refreshGrowing } from "./progress";
import { resetRun } from "./run";
import { character, game, progress, rng, setCharacter } from "./state";

/** the job a solo run plays: a dev build's `?job=` when the hero has that job, otherwise the one chosen */
function runJob(): string | null {
  const asked = findJob(character, readPlaytestJob());
  return asked ? asked.id : chosenJob(character.id);
}

/** a fresh solo run with everything bought in the shop: the chosen job, stats through the progress, Head Start's levels
 *  here */
export function startRun(banner: string): void {
  setCharacter(character, runJob());
  resetRun(banner);
  startRunAchievements();
  startRunUnlocks();
  clearHeroRefund();
  track("run_start", { hero: character.id, coop: false });
  if (ownsSkill("headStart")) gainXp(xpToReach(HEAD_START_LEVEL));
  const playtest = readPlaytestStart();
  if (playtest?.section || (!playtest?.wave && !isPlaytestSession())) {
    beginAdventure(rng);
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
