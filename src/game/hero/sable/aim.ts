import { AIM_ANGLE, AIM_ASSIST, BOLT, MUZZLE } from "../../../constants/sable/bolt";
import type { SableAim } from "../../../types/sable";
import { enemyCenter } from "../../enemies/enemy";
import { isHeld } from "../../input";
import { game, hero } from "../../state";

/** the aim the held keys ask for: Up angles the shot up, Down kneels on the floor or slants it down in the air */
export function heldAim(): SableAim {
  if (isHeld("up")) return "up";
  if (isHeld("down")) return "low";
  return "level";
}

/** where a bolt leaves the crossbow and at what angle, for an aim, in world pixels and radians */
export function muzzle(aim: SableAim): { x: number; y: number; angle: number } {
  const air = aim === "low" && !hero.ground;
  const m = air ? MUZZLE.air : MUZZLE[aim];
  const a = air ? AIM_ANGLE.air : AIM_ANGLE[aim];
  const angle = hero.face > 0 ? a : Math.PI - a;
  const x = hero.x + hero.face * m.x;
  const y = hero.y + m.y;
  const to = assisted(y, angle);
  if (to === angle) return { x, y, angle };
  // a bent shot leaves from the chest side of the crossbow toward its foe
  return { x: hero.x + Math.cos(to) * 6, y: y + Math.sin(to) * 6, angle: to };
}

/** the aim bent toward the foe nearest to it, ahead and in range, within the assist cone; the aim itself otherwise */
function assisted(y: number, angle: number): number {
  const { cone, closeCone, close } = AIM_ASSIST;
  let best = angle;
  let off = Number.POSITIVE_INFINITY;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    const dist = Math.hypot(cx - hero.x, cy - y);
    if ((cx - hero.x) * hero.face <= 0 || dist > BOLT.range) continue;
    const to = Math.atan2(cy - y, cx - hero.x);
    const d = Math.abs(Math.atan2(Math.sin(to - angle), Math.cos(to - angle)));
    const reach = cone + Math.max(0, 1 - dist / close) * (closeCone - cone);
    if (d < reach && d < off) {
      off = d;
      best = to;
    }
  }
  return best;
}
