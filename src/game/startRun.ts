import { HEAD_START_LEVEL } from "../constants/shopSkills";
import { STAGE_WAVES } from "../constants/waves";
import { track } from "../services/analytics";
import { readPlaytestStart } from "../services/playtestStart";
import { startRunAchievements } from "../store/achievements";
import { ownsSkill } from "../store/meta";
import { startRunUnlocks } from "../store/unlocks";
import { xpToReach } from "../utils/progression";
import { gainXp, openPicks, refreshGrowing } from "./progress";
import { resetRun } from "./run";
import { character, game, progress } from "./state";

/** a fresh run with everything bought in the shop: stats come in through the progress, Head Start's levels here */
export function startRun(banner: string): void {
  resetRun(banner);
  startRunAchievements();
  startRunUnlocks();
  track("run_start", { hero: character.id, coop: false });
  if (ownsSkill("headStart")) gainXp(xpToReach(HEAD_START_LEVEL));
  const playtest = readPlaytestStart();
  if (!playtest) return;
  // dev builds only: the next wave to open is the one asked for, and the levels' picks are made before it
  game.wave = Math.min(playtest.wave, STAGE_WAVES) - 1;
  if (playtest.level > progress.level) gainXp(xpToReach(playtest.level) - xpToReach(progress.level));
  if (playtest.build) {
    Object.assign(progress.build, playtest.build);
    refreshGrowing();
  }
  openPicks();
}
