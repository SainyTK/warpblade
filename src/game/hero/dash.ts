import { FUSION, HERO_MOVE } from "../../constants/combat";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { enemyBox } from "../enemies/enemy";
import { hasPerk } from "../progress";
import { objectMemory, rememberPerSeat } from "../seatMemory";
import { emitSkillEvent } from "../skills/events";
import { game, hero, progress } from "../state";
import { boxHit, heroBox } from "../world";
import { isFree, leaveHang, setState, settle } from "./actions";
import { dropDashGhost } from "./afterimages";
import { endCombo } from "./combo";
import { canPayDash, refuseDash, spendDashStamina } from "./stamina";
import { travelEnded } from "./travelEnd";

/** L: a short dash that nothing can touch, paid with stamina. On the ground only, until Jump Dash. It cancels attacks and casts. */
export function tryDash(dir: number): boolean {
  const h = hero;
  const air = !h.ground && h.state !== "hang";
  if (air && (!hasPerk("airDash") || h.airDashed)) return false;
  if (!isFree() && h.state !== "hang" && h.state !== "move" && h.state !== "cast") return false;
  if (!canPayDash()) {
    refuseDash();
    return false;
  }
  if (h.state === "hang") leaveHang();
  if (h.state === "move") {
    h.move = null;
    endCombo(false);
  }
  if (dir) h.face = dir;
  if (air) h.airDashed = true;
  spendDashStamina();
  setState("dash");
  Object.assign(h, {
    vx: h.face * HERO_MOVE.dashSpeed * progress.stats.move,
    vy: 0,
    ghostTimer: 0,
    perfectUsed: false,
  });
  sfx.dodge();
  passed.foes = [];
  return true;
}

/** the foes the dash in progress has passed through, for the skills' `dash` event when it ends */
const passed: { foes: Enemy[] } = { foes: [] };
rememberPerSeat(objectMemory(passed, true));

/** note the foes the dash passes through; with Static Step they are charged */
function passThrough(): void {
  const box = heroBox();
  for (const e of game.enemies) {
    if (e.hp <= 0 || !boxHit(box, enemyBox(e))) continue;
    if (!passed.foes.includes(e)) passed.foes = [...passed.foes, e];
    if (e.charged <= 0 && hasPerk("staticStep")) e.charged = FUSION.staticMark;
  }
}

export function runDash(dt: number): void {
  const h = hero;
  passThrough();
  h.ghostTimer -= dt;
  if (h.ghostTimer <= 0) {
    h.ghostTimer = 0.045;
    dropDashGhost();
  }
  if (h.st < HERO_MOVE.dashTime) return;
  emitSkillEvent({ type: "dash", dir: h.face, foes: passed.foes });
  h.vx *= 0.4;
  h.sinceDash = 0;
  settle();
  travelEnded();
}
