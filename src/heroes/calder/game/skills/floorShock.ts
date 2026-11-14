import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { game, hero } from "../../../../game/state";
import { dust } from "../../../../game/world";
import type { SourceId } from "../../../../types/build";
import type { Enemy } from "../../../../types/enemy";
import { PHOSPHOR } from "../../constants/colors";
import { roundBlast } from "../effects/roundBlast";

/** a shock along the floor from x: its damage, its reach each way and what it does to the foes it strikes */
export interface FloorShock {
  damage: number;
  reach: number;
  launch?: boolean;
  stun?: number;
  source?: SourceId;
}

/** a round fired into the floor at x: a blast there, a ring running out both ways, and every foe near the floor inside
 *  the ring struck and thrown away from it. Returns the foes it struck. */
export function floorShock(x: number, y: number, s: FloorShock): Enemy[] {
  roundBlast(x, y - 3, hero.face, false, true);
  game.fx.push(createFloorRing(x, y, s.reach, PHOSPHOR, 0.4));
  dust(x - 6, y, 4, -1);
  dust(x + 6, y, 4, 1);
  const struck = game.enemies.filter((e) => {
    if (e.hp <= 0) return false;
    const [ex] = enemyCenter(e);
    return Math.abs(ex - x) <= s.reach && Math.abs(e.y - y) < 30;
  });
  for (const e of struck) {
    const dir = Math.sign(enemyCenter(e)[0] - x) || hero.face;
    dealDamage(e, s.damage, {
      fromX: x,
      kx: dir * 80,
      ky: s.launch ? -260 : -60,
      stun: s.stun,
      heavy: true,
      source: s.source,
    });
  }
  return struck;
}
