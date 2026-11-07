import { ENEMIES } from "../../../constants/enemies";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { game, lights, progress } from "../../state";
import { dust, hitStop, shake } from "../../world";
import { skin } from "../skin";
import { spreadFracture, throwPower } from "./fracture";

export interface Slam {
  x: number;
  floor: number;
  /** the foe driven into the floor, spared by its own ring; a fractured one passes its Fracture to foes the ring strikes */
  body: Enemy | null;
  /** other foes the ring spares, such as foes slammed down with the body */
  skip?: readonly Enemy[];
  radius: number;
  /** each other foe in the ring takes this share of attack damage and lies stunned this long */
  power: number;
  stun: number;
  /** minions in the ring are thrown up at this speed, when set */
  launch?: number;
  stop: number;
  shake: readonly [number, number];
}

/** a body driven into the floor: a ring that runs out along it, hurting every other foe it reaches, and dust */
export function slamRing(s: Slam): number {
  let hits = 0;
  for (const e of game.enemies) {
    if (e === s.body || e.hp <= 0 || s.skip?.includes(e)) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.abs(cx - s.x) > s.radius || cy < s.floor - 40) continue;
    hits++;
    const minion = ENEMIES[e.type].launchable;
    dealDamage(e, progress.stats.ad * throwPower(e, s.power), {
      fromX: s.x,
      kx: Math.sign(cx - s.x) * 60,
      stun: s.stun,
      launch: minion ? s.launch : undefined,
      heavy: true,
    });
    if (s.body) spreadFracture(s.body, e);
    game.fx.push(createImpact(cx, cy, Math.sign(cx - s.x) || 1, false));
  }
  game.fx.push(createFloorRing(s.x, s.floor, s.radius, skin.ramp, 0.4));
  lights.add(s.x, s.floor - 4, s.radius + 10, skin.ramp[4], 0.8, 0.2);
  dust(s.x, s.floor, 10);
  hitStop(s.stop);
  shake(s.shake[0], s.shake[1]);
  sfx.hit(true, 0.55);
  sfx.boom();
  return hits;
}
