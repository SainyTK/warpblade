import { FUSION, HERO_MOVE } from "../../constants/combat";
import { sfx } from "../../services/audio";
import { enemyBox } from "../enemies/enemy";
import { hasPerk, maxDashes } from "../progress";
import { game, hero, progress } from "../state";
import { boxHit, heroBox } from "../world";
import { isFree, leaveHang, setState, settle } from "./actions";
import { dropDashGhost } from "./afterimages";
import { endCombo } from "./combo";

/** L: a short dash that nothing can touch. On the ground only, until Jump Dash. It cancels attacks and casts. */
export function tryDash(dir: number): boolean {
  const h = hero;
  const air = !h.ground && h.state !== "hang";
  if (h.dashes <= 0 || (air && (!hasPerk("airDash") || h.airDashed))) return false;
  if (!isFree() && h.state !== "hang" && h.state !== "move" && h.state !== "cast") return false;
  if (h.state === "hang") leaveHang();
  if (h.state === "move") {
    h.move = null;
    endCombo(false);
  }
  if (dir) h.face = dir;
  if (air) h.airDashed = true;
  h.dashes--;
  setState("dash");
  Object.assign(h, {
    vx: h.face * HERO_MOVE.dashSpeed * progress.stats.move,
    vy: 0,
    ghostTimer: 0,
    perfectUsed: false,
  });
  sfx.dodge();
  return true;
}

/** seconds for one dash charge to come back */
export const dashRechargeTime = (): number => HERO_MOVE.dashRecharge * (hasPerk("quickstep") ? 0.55 : 1);

/** dash charges come back one at a time */
export function rechargeDash(dt: number): void {
  const h = hero;
  h.sinceDash += dt;
  if (h.dashes >= maxDashes()) {
    h.dashCd = 0;
    return;
  }
  h.dashCd += dt;
  if (h.dashCd < dashRechargeTime()) return;
  h.dashes++;
  h.dashCd = 0;
}

/** Static Step: foes Kael dashes through are charged */
function chargeFoes(): void {
  if (!hasPerk("staticStep")) return;
  const box = heroBox();
  for (const e of game.enemies) if (e.charged <= 0 && boxHit(box, enemyBox(e))) e.charged = FUSION.staticMark;
}

export function runDash(dt: number): void {
  const h = hero;
  chargeFoes();
  h.ghostTimer -= dt;
  if (h.ghostTimer <= 0) {
    h.ghostTimer = 0.045;
    dropDashGhost();
  }
  if (h.st < HERO_MOVE.dashTime) return;
  h.vx *= 0.4;
  h.sinceDash = 0;
  settle();
}
