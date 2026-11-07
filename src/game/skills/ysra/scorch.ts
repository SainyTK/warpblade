import type { Enemy } from "../../../types/enemy";
import { addStacks, stacksOf } from "../../enemies/skillStatus";
import { progress } from "../../state";
import { skillValues } from "../query";

const ID = "y_searing";
/** seconds between Scorch ticks */
export const SCORCH_TICK = 0.5;
/** Scorch laid without Searing Edge held (Sunheart's bursts): one stack at its first level's strength */
const FALLBACK = { perSecond: 0.3, duration: 3, max: 3 } as const;

/** lay Scorch stacks on a foe: Searing Edge's stacking burn, ticking with its own id as source */
export function scorch(e: Enemy, stacks: number): void {
  const v = skillValues(ID);
  const perSecond = v.perSecond ?? FALLBACK.perSecond;
  addStacks(e, ID, {
    stacks,
    max: v.max ?? FALLBACK.max,
    damage: progress.stats.ap * perSecond * SCORCH_TICK,
    every: SCORCH_TICK,
    duration: v.duration ?? FALLBACK.duration,
  });
}

/** Scorch stacks on a foe */
export const scorchOf = (e: Enemy): number => stacksOf(e, ID);
