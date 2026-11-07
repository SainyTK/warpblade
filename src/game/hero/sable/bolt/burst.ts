import { sfx } from "../../../../services/audio";
import type { SourceId } from "../../../../types/build";
import type { Enemy } from "../../../../types/enemy";
import { dealDamage } from "../../../damage";
import { createFloorRing } from "../../../effects/floorRing";
import { createImpact } from "../../../effects/impact";
import { enemyCenter } from "../../../enemies/enemy";
import { game, lights, progress } from "../../../state";
import { shake } from "../../../world";
import { skin } from "../../skin";

export interface Burst {
  x: number;
  y: number;
  radius: number;
  /** damage as a multiple of attack damage */
  power: number;
  /** thrown up this hard, pixels a second */
  launch?: number;
  source?: SourceId;
}

/** a jade burst: every foe whose middle is inside the ring takes the damage, pushed out from the middle; returns them */
export function burst(b: Burst): Enemy[] {
  const hit: Enemy[] = [];
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - b.x, (cy - b.y) * 1.4) > b.radius) continue;
    hit.push(e);
  }
  for (const e of hit) {
    const [cx] = enemyCenter(e);
    const dir = Math.sign(cx - b.x) || 1;
    dealDamage(e, progress.stats.ad * b.power, {
      fromX: b.x,
      kx: dir * 90,
      ky: -40,
      launch: b.launch ? -b.launch : undefined,
      heavy: true,
      source: b.source,
    });
  }
  game.fx.push(createFloorRing(b.x, b.y, b.radius, skin.ramp, 0.35, 0.5));
  game.fx.push(createImpact(b.x, b.y, 1, true));
  lights.add(b.x, b.y, b.radius + 12, skin.ramp[4], 0.9, 0.2);
  shake(0.1, 1 + b.radius / 40);
  sfx.boom();
  return hit;
}
