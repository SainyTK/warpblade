import { COMBO } from "../../../constants/combat";
import { PAL } from "../../../constants/palette";
import type { SourceId } from "../../../types/build";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { enemyCenter } from "../../enemies/enemy";
import { game } from "../../state";

/** what a ring of sound does to each foe it reaches */
export interface SoundRingHit {
  damage: number;
  /** the hit's source: the hero's own press when left out */
  source?: SourceId;
  /** minions stagger */
  stagger?: boolean;
  /** seconds foes are stunned */
  stun?: number;
  /** a minion is thrown up this fast (a knockdown) */
  launch?: number;
  /** a foe it leaves out, already struck by the blow that sent the ring */
  skip?: Enemy | null;
}

/**
 * A ring of sound round a point on the floor: a cobalt floor ring, and every foe whose middle is within `r` of the
 * point takes the hit once. Returns the foes it reached.
 */
export function soundRing(x: number, floor: number, r: number, hit: SoundRingHit): Enemy[] {
  game.fx.push(createFloorRing(x, floor, r, PAL.beat, 0.3));
  const reached: Enemy[] = [];
  for (const e of game.enemies) {
    if (e === hit.skip || e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.abs(cx - x) > r || Math.abs(cy - (floor - 12)) > r * 0.8 + 12) continue;
    reached.push(e);
    dealDamage(e, hit.damage, {
      fromX: x,
      kx: Math.sign(cx - x) * 30,
      stagger: hit.stagger ? COMBO.stagger : undefined,
      stun: hit.stun || undefined,
      launch: hit.launch && e.rank === "minion" ? hit.launch : undefined,
      source: hit.source,
    });
  }
  return reached;
}
