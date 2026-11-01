import { MAX_HP, MAX_MP } from "../constants/combat";
import { GROUND } from "../constants/stage";
import { saveBest } from "../services/bestScore";
import { game, hero, showBanner } from "./state";

/** after a fall: keep the best score, clear the stage and start again from wave 1 */
export function resetRun(): void {
  game.best = Math.max(game.best, game.kills);
  saveBest(game.best);
  Object.assign(game, { enemies: [], wave: 0, kills: 0, waveTimer: 1.5, pickups: [] });
  Object.assign(hero, {
    hp: MAX_HP,
    mp: MAX_MP,
    x: 70,
    y: GROUND,
    vx: 0,
    vy: 0,
    inv: 1.5,
    hasSword: true,
    sword: null,
    anchor: null,
    ground: true,
  });
  hero.state = "idle";
  hero.st = 0;
  showBanner("Rise again", 1.2);
}
