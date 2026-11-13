import { HERO_MOVE } from "../../constants/combat";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { enemyBox } from "../enemies/enemy";
import { objectMemory, rememberPerSeat } from "../seatMemory";
import { emitSkillEvent } from "../skills/events";
import { skillValues } from "../skills/query";
import { game, hero, progress } from "../state";
import { boxHit, heroBox } from "../world";
import { leaveHang, setState, settle } from "./actions";
import { dropDashGhost } from "./afterimages";
import { cutPassed, endPassingCut, startPassingCut } from "./kael/passingCut";
import { cutForSharedAction, maySharedAct } from "./sharedCut";
import { canPayDash, refuseDash, spendDashStamina } from "./stamina";
import { travelEnded } from "./travelEnd";

/**
 * L: the front dodge every hero shares, a short dash toward the side held that nothing can touch, paid with stamina. On
 * the ground only, until Kael's Sky Dance. It cancels a blow's follow-through, a cast and the guard.
 */
export function tryDash(dir: number): boolean {
  const h = hero;
  const air = !h.ground && h.state !== "hang";
  if (air && (!skillValues("k_skydance").airDash || h.airDashed)) return false;
  if (!maySharedAct() && h.state !== "hang" && h.state !== "cast" && h.state !== "guard") return false;
  if (!canPayDash()) {
    refuseDash();
    return false;
  }
  if (h.state === "hang") leaveHang();
  cutForSharedAction();
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
  startPassingCut();
  return true;
}

/** the foes the dash in progress has passed through, for the skills' `dash` event when it ends */
const passed: { foes: Enemy[] } = { foes: [] };
rememberPerSeat(objectMemory(passed, true));

/** note the foes the dash passes through; with Passing Cut each is cut as Kael goes by */
function passThrough(): void {
  const box = heroBox();
  for (const e of game.enemies) {
    if (e.hp <= 0 || !boxHit(box, enemyBox(e)) || passed.foes.includes(e)) continue;
    passed.foes = [...passed.foes, e];
    cutPassed(e);
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
  endPassingCut();
  h.vx *= 0.4;
  settle();
  travelEnded();
}
