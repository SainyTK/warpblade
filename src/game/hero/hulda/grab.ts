import { ENEMIES } from "../../../constants/enemies";
import { CRUSH, GRAB } from "../../../constants/hulda/grab";
import { GRIT } from "../../../constants/hulda/grit";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { game, hero, progress } from "../../state";
import { boxAhead, boxHit, hitStop, shake } from "../../world";
import { isFree, setState, settle } from "../actions";
import { gainGrit } from "./grit";
import { canHold, take } from "./hold";
import { hulda } from "./memory";

/** the nearest live foe whose box meets this one, held by nobody */
export function nearestIn(box: readonly [number, number, number, number], ok: (e: Enemy) => boolean): Enemy | null {
  const [x0, y0, x1, y1] = box;
  const zone = boxAhead(x0, y0, x1, y1);
  let best: Enemy | null = null;
  let near = Number.POSITIVE_INFINITY;
  for (const e of game.enemies) {
    if (e.hp <= 0 || !ok(e) || !boxHit(zone, enemyBox(e))) continue;
    const d = Math.abs(enemyCenter(e)[0] - hero.x);
    if (d < near) {
      near = d;
      best = e;
    }
  }
  return best;
}

/** K on the floor: both hands reach out */
export function pressGrab(): boolean {
  if (!isFree() || !hero.ground) return false;
  hulda.struck = false;
  hero.vx = 0;
  setState("grab");
  sfx.swing(0.7);
  return true;
}

/** a minion is taken into her hands; a foe too big to hold is crushed instead */
function catchFoe(e: Enemy): void {
  hulda.struck = true;
  gainGrit(GRIT.grab);
  emitSkillEvent({ type: "grab", foe: e });
  if (ENEMIES[e.type].launchable) {
    take(e);
    setState("hold");
    sfx.tone(160, 110, 0.08, "square", 0.06);
    return;
  }
  hero.vx = 0;
  setState("crush");
  hulda.crushed = e;
}

/** the hands are live for a few frames and close on the nearest foe; a whiff runs to the end of the clip */
export function runGrab(): void {
  const h = hero;
  if (!hulda.struck && h.st >= GRAB.from && h.st < GRAB.to) {
    const e = nearestIn(GRAB.box, (f) => !ENEMIES[f.type].launchable || canHold(f));
    if (e) {
      catchFoe(e);
      return;
    }
  }
  if (h.st >= GRAB.dur) settle();
}

/** both hands squeeze a big foe on the clip's hit frame: a heavy blow that breaks a guard and a wind-up */
export function runCrush(): void {
  const h = hero;
  if (!h.hitDone && h.st >= CRUSH.hit) {
    h.hitDone = true;
    const e = hulda.crushed;
    hulda.crushed = null;
    if (e && e.hp > 0) {
      const [cx, cy] = enemyCenter(e);
      dealDamage(e, progress.stats.ad * CRUSH.power, { fromX: h.x, kx: 0, heavy: true, melee: true });
      h.lastHit = e;
      game.fx.push(createImpact(cx - h.face * 4, cy, h.face, true));
      hitStop(CRUSH.stop);
      shake(0.15, 2);
      sfx.hit(true, 0.7);
    }
  }
  if (h.st >= CRUSH.dur) settle();
}
