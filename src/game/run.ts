import { HERO_START_X } from "../constants/hero";
import { GROUND } from "../constants/stage";
import { emptyStream } from "../utils/waves";
import { clearChests } from "./build/chests";
import { bankCoins } from "./coins";
import { resetLedger } from "./damageLedger";
import { kit } from "./hero/kits";
import { clearTakeoff } from "./hero/takeoff";
import { resetWound } from "./hero/wound";
import { resetDanger } from "./lowHealth";
import { resetProgress } from "./progress";
import { clearWards } from "./shotWards";
import { forgetSkills } from "./skills/runtime";
import { freshHero, game, hero, ponytail, progress, scarf, showBanner } from "./state";
import { clearFields } from "./timeFields";

/** after a fall, a cleared stage or a restart from the menu: Kael starts over at level 1 from wave 1 */
export function resetRun(banner = "Rise again"): void {
  bankCoins();
  resetProgress();
  resetLedger();
  forgetSkills();
  clearChests();
  clearWards();
  clearFields();
  Object.assign(game, {
    mode: "play",
    enemies: [],
    wave: 0,
    kills: 0,
    clock: 0,
    cleared: 0,
    clearedAt: 0,
    lull: "toNext",
    waveTimer: 1.5,
    stream: emptyStream(),
    pickups: [],
    coinDrops: [],
    xpOrbs: [],
    finale: "none",
    revives: 0,
    numbers: [],
    blazes: [],
    fx: [],
    ghosts: [],
    freeze: 0,
    slow: 0,
    shake: 0,
  });
  // the scarf and ponytail move with Kael back to the start, so they do not trail across the stage
  scarf.shift(HERO_START_X - hero.x, GROUND - hero.y);
  ponytail.shift(HERO_START_X - hero.x, GROUND - hero.y);
  // every field starts fresh, so nothing from the last run carries over; the hero stays untouchable a moment
  Object.assign(hero, freshHero(progress.stats), { face: hero.face, inv: 1.5 });
  kit().reset();
  clearTakeoff();
  resetWound();
  resetDanger();
  showBanner(banner, banner ? 1.2 : 0);
}
