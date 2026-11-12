import { SKILL_BLEED } from "../../../constants/brannoc/skills";
import type { Enemy } from "../../../types/enemy";
import { addStacks } from "../../enemies/skillStatus";
import { progress } from "../../state";

/** a bleed one of his skills lays on a foe it strikes, under that skill's own id */
export function layBleed(e: Enemy, source: string): void {
  if (e.hp <= 0) return;
  addStacks(e, source, {
    stacks: SKILL_BLEED.stacks,
    max: SKILL_BLEED.max,
    damage: progress.stats.ad * SKILL_BLEED.power * SKILL_BLEED.every,
    every: SKILL_BLEED.every,
    duration: SKILL_BLEED.duration,
  });
}
