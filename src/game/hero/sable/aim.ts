import { BEAT_DRAW } from "../../../constants/clips/sable/shoot";
import { AIM_ANGLE, AIM_ASSIST, AIM_PICK, BOLT, MUZZLE } from "../../../constants/sable/bolt";
import type { Enemy } from "../../../types/enemy";
import type { SableAim } from "../../../types/sable";
import { enemyCenter } from "../../enemies/enemy";
import { game, hero } from "../../state";

/** the foe a shot goes for: the nearest one ahead and in range, from steeply above to a little below */
function quarry(range: number): Enemy | null {
  const y = hero.y + MUZZLE.level.y;
  let best: Enemy | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    const dx = (cx - hero.x) * hero.face;
    const d = Math.hypot(dx, cy - y);
    if (dx <= 0 || d > range || d >= bestD) continue;
    const a = Math.atan2(cy - y, dx);
    if (a < AIM_PICK.up || a > AIM_PICK.down) continue;
    best = e;
    bestD = d;
  }
  return best;
}

/** the aim the foe ahead asks for: up for one above, kneeling for one low on the floor, slanted down in the air for one
 *  below; level, or slanted down in the air, with no foe in reach */
export function autoAim(range = BOLT.range): SableAim {
  const e = quarry(range);
  if (!e) return hero.ground ? "level" : "low";
  const [cx, cy] = enemyCenter(e);
  const y = hero.y + MUZZLE.level.y;
  const a = Math.atan2(cy - y, Math.abs(cx - hero.x));
  if (a < AIM_PICK.upStance) return "up";
  if (hero.ground) return cy - y > AIM_PICK.kneel ? "low" : "level";
  return a > AIM_PICK.airLevel ? "low" : "level";
}

/** where a bolt leaves the crossbow and at what angle, for an aim and the string's beat (whose draw shifts the crossbow
 *  a little), in world pixels and radians */
export function muzzle(aim: SableAim, beat?: number): { x: number; y: number; angle: number } {
  const air = aim === "low" && !hero.ground;
  const m = air ? MUZZLE.air : MUZZLE[aim];
  const a = air ? AIM_ANGLE.air : AIM_ANGLE[aim];
  const angle = hero.face > 0 ? a : Math.PI - a;
  const draw = beat === undefined ? { fx: 0, fy: 0 } : BEAT_DRAW[beat];
  const x = hero.x + hero.face * (m.x + draw.fx);
  const y = hero.y + m.y + draw.fy;
  const to = assisted(y, angle);
  if (to === angle) return { x, y, angle };
  // a bent shot leaves from the chest side of the crossbow toward its foe
  return { x: hero.x + Math.cos(to) * 6, y: y + Math.sin(to) * 6, angle: to };
}

/** the aim bent toward the foe nearest to it, ahead and in range, within the assist cone; the aim itself otherwise */
export function assisted(y: number, angle: number, from = hero.x, cone: number = AIM_ASSIST.cone): number {
  const { closeCone, close } = AIM_ASSIST;
  const ahead = Math.cos(angle) >= 0 ? 1 : -1;
  let best = angle;
  let off = Number.POSITIVE_INFINITY;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    const dist = Math.hypot(cx - from, cy - y);
    if ((cx - from) * ahead <= 0 || dist > BOLT.range) continue;
    const to = Math.atan2(cy - y, cx - from);
    const d = Math.abs(Math.atan2(Math.sin(to - angle), Math.cos(to - angle)));
    const reach = cone + Math.max(0, 1 - dist / close) * (closeCone - cone);
    if (d < reach && d < off) {
      off = d;
      best = to;
    }
  }
  return best;
}
