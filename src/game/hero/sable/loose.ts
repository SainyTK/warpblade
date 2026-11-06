import { BOLT } from "../../../constants/sable/bolt";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createCrossbowBolt } from "../../effects/crossbowBolt";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { hasPerk } from "../../progress";
import { game, hero, lights, progress } from "../../state";
import { foesOnSegment } from "../../ultimates/segmentHits";
import { hitStop, shake } from "../../world";
import { skin } from "../skin";
import { rankOf } from "./rank";

export interface Loose {
  x: number;
  y: number;
  angle: number;
  /** share of a normal bolt's damage */
  share: number;
  primed: boolean;
}

/** foes one bolt passes through before it stops: Piercing Bolts adds one per rank */
const pierceOf = (): number => BOLT.pierce + rankOf("m_pierce");

/** a bolt strikes a foe: damage from attack damage (crits come with it), a small push away from Sable and a spark */
function strike(e: Enemy, share: number, primed: boolean, dir: number): boolean {
  const [cx, cy] = enemyCenter(e);
  const power = BOLT.power * share * (primed ? BOLT.primedScale : 1);
  dealDamage(e, progress.stats.ad * power, {
    fromX: hero.x,
    kx: dir * BOLT.kx,
    ky: BOLT.ky,
    heavy: primed,
    stagger: BOLT.stagger,
  });
  hero.lastHit = e;
  game.fx.push(createImpact(cx - dir * 3, cy, dir, primed));
  lights.add(cx, cy, primed ? 22 : 14, skin.ramp[4], 0.7, 0.12);
  return e.hp <= 0;
}

/** loose one bolt; it pierces as many foes as she has learned, and Ricochet lets it bounce and fly on through a kill */
export function looseBolt(b: Loose): void {
  const struck = new Set<Enemy>();
  const dir = Math.cos(b.angle) >= 0 ? 1 : -1;
  let through = pierceOf();
  const ricochet = hasPerk("ricochet");
  game.fx.push(
    createCrossbowBolt({
      x: b.x,
      y: b.y,
      angle: b.angle,
      ramp: skin.ramp,
      primed: b.primed,
      bounces: ricochet ? 1 : 0,
      pass(ax, ay, bx, by) {
        for (const e of foesOnSegment(ax, ay, bx, by, struck)) {
          struck.add(e);
          const killed = strike(e, b.share, b.primed, dir);
          sfx.hit(b.primed, 1.3);
          if (b.primed) {
            hitStop(0.03);
            shake(0.08, 1);
          }
          if (killed && ricochet) continue;
          if (through-- <= 0) return true;
        }
        return false;
      },
    }),
  );
}
