import { GROUND } from "../constants/stage";
import { resetProgress } from "./progress";
import { game, hero, progress, showBanner } from "./state";

/** after a fall, a cleared stage or a restart from the menu: Kael starts over at level 1 from wave 1 */
export function resetRun(banner = "Rise again"): void {
  resetProgress();
  Object.assign(game, {
    mode: "play",
    enemies: [],
    wave: 0,
    kills: 0,
    lull: "toNext",
    waveTimer: 1.5,
    pickups: [],
    numbers: [],
    blazes: [],
    fx: [],
    ghosts: [],
    freeze: 0,
    slow: 0,
    shake: 0,
  });
  Object.assign(hero, {
    hp: progress.stats.hp,
    mp: progress.stats.mp,
    x: 70,
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
    dashes: 1,
    dashCd: 0,
    warpCd: 0,
    spellCd: { fire: 0, ice: 0, volt: 0 },
    spellCdFull: { fire: 1, ice: 1, volt: 1 },
    castDenied: 0,
    charge: 0,
    chargeLevel: 0,
    lastHit: null,
  });
  hero.state = "idle";
  hero.st = 0;
  showBanner(banner, banner ? 1.2 : 0);
}
