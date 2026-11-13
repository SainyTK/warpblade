import { FRACTURE } from "../../../constants/hulda/fracture";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, stacksOf } from "../../enemies/skillStatus";
import { skillLevel, skillValues } from "../../skills/query";
import { game, progress } from "../../state";
import { shake } from "../../world";

const ID = "h_fracture";

/** Crushing Grip lays Fractures from level 3 */
const lays = (): boolean => skillLevel(ID) > 0 && skillValues(ID).fracture > 0;

/** lay Fracture stacks on a foe: each ticks the level's damage a second for its time */
export function fracture(e: Enemy, stacks = 1): void {
  if (!lays() || e.hp <= 0) return;
  const v = skillValues(ID);
  addStacks(e, ID, {
    stacks,
    max: v.max,
    damage: progress.stats.ad * v.fracture * FRACTURE.tick,
    every: FRACTURE.tick,
    duration: v.duration,
  });
}

/** Fracture stacks the warp's crush on a big foe lays: one, or a full set once they stack (level 6) */
export const crushFractures = (): number => (skillLevel(ID) ? skillValues(ID).max : 1);

/** a foe a thrown body or a slam ring struck catches the Fracture of the foe thrown, from level 4; it never spreads on */
export function spreadFracture(from: Enemy, to: Enemy): void {
  if (lays() && skillValues(ID).spread && stacksOf(from, ID) > 0) fracture(to);
}

/** throws and slams hit a fractured foe harder, from level 7 */
export function throwPower(e: Enemy, power: number): number {
  const mark = skillLevel(ID) && stacksOf(e, ID) > 0 ? skillValues(ID).mark : 0;
  return power * (1 + mark);
}

/**
 * Bonebreaker: a throw on a foe whose Fractures are full snaps them, dealing all the damage they had left at once
 * times the evolution's share, and gives the foes near it fractures of their own (which never snap on their own).
 */
export function snapFractures(e: Enemy): void {
  const v = skillValues(ID);
  if (!v.snap || e.hp <= 0) return;
  const entry = e.stacks.find((s) => s.source === ID);
  if (!entry || entry.stacks < v.max) return;
  const left = entry.damage * entry.stacks * Math.max(1, entry.left / entry.every);
  e.stacks = e.stacks.filter((s) => s !== entry);
  const [cx, cy] = enemyCenter(e);
  dealDamage(e, left * v.snap, { source: ID, kx: 0, heavy: true });
  game.fx.push(createImpact(cx, cy, 1, true));
  shake(0.14, 2);
  for (const o of game.enemies) {
    if (o === e || o.hp <= 0) continue;
    const [ox, oy] = enemyCenter(o);
    if (Math.hypot(ox - cx, oy - cy) <= FRACTURE.snapRadius) fracture(o, FRACTURE.snapStacks);
  }
}
