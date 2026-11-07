import { RUST_BITE } from "../../../constants/orrin/skillEffects";
import type { Enemy } from "../../../types/enemy";
import { addStacks, markFoe, stacksOf } from "../../enemies/skillStatus";
import { skillLevel, skillValues, withCharms } from "../../skills/query";
import { progress } from "../../state";

export const RUST_ID = "o_rust";

/** the foe carries Rust Bite's rust */
export const rusted = (e: Enemy): boolean => stacksOf(e, RUST_ID) > 0;

/** Rust Bite: the foe rusts for a while, and from level 2 takes more from every source as long as it does */
export function rustFoe(e: Enemy): void {
  if (!skillLevel(RUST_ID) || e.hp <= 0) return;
  const v = skillValues(RUST_ID);
  const life = withCharms("duration", v.life);
  addStacks(e, RUST_ID, {
    stacks: 1,
    max: 1,
    damage: progress.stats.ad * v.damage * RUST_BITE.tick,
    every: RUST_BITE.tick,
    duration: life,
  });
  if (v.taken) markFoe(e, RUST_ID, life, v.taken);
}
