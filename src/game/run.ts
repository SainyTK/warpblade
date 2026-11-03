import { GROUND } from "../constants/stage";
import { bankCoins } from "./coins";
import { resetProgress } from "./progress";
import { game, hero, ponytail, progress, scarf, showBanner } from "./state";

/** where Kael stands at the start of a run */
const START_X = 70;

/** after a fall, a cleared stage or a restart from the menu: Kael starts over at level 1 from wave 1 */
export function resetRun(banner = "Rise again"): void {
  bankCoins();
  resetProgress();
  Object.assign(game, {
    mode: "play",
    enemies: [],
    wave: 0,
    kills: 0,
    lull: "toNext",
    waveTimer: 1.5,
    pickups: [],
    coinDrops: [],
    revived: false,
    numbers: [],
    blazes: [],
    fx: [],
    ghosts: [],
    freeze: 0,
    slow: 0,
    shake: 0,
  });
  // the scarf and ponytail move with Kael back to the start, so they do not trail across the stage
  scarf.shift(START_X - hero.x, GROUND - hero.y);
  ponytail.shift(START_X - hero.x, GROUND - hero.y);
  Object.assign(hero, {
    hp: progress.stats.hp,
    mp: progress.stats.mp,
    stamina: progress.stats.stamina,
    staminaWait: 0,
    staminaFlash: 0,
    x: START_X,
    y: GROUND,
    vx: 0,
    vy: 0,
    inv: 1.5,
    hasSword: true,
    sword: null,
    anchor: null,
    ground: true,
    running: false,
    move: null,
    queued: null,
    chain: 0,
    link: 0,
    comboCd: 0,
    warpCd: 0,
    spellCd: { fire: 0, ice: 0, volt: 0 },
    spellCdFull: { fire: 1, ice: 1, volt: 1 },
    denied: { cast: 0, warp: 0, mp: 0 },
    charge: 0,
    chargeLevel: 0,
    lastHit: null,
  });
  hero.state = "idle";
  hero.st = 0;
  showBanner(banner, banner ? 1.2 : 0);
}
