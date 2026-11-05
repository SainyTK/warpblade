import { ANIM_FPS } from "../../constants/hero";
import { LOW_HEALTH, WOUND_FRAMES } from "../../constants/lowHealth";
import type { WoundState } from "../../types/lowHealth";
import type { Pose } from "../../types/pose";
import { dangerTarget } from "../../utils/danger";
import { approach, smooth } from "../../utils/math";
import { blendPose } from "../../utils/poseBlend";
import { objectMemory, rememberPerSeat } from "../seatMemory";
import { hero, progress } from "../state";

/** the one owner of how far the hero's idle has sunk into the wounded stance */
const wound: WoundState = { weight: 0, frame: Number.NaN };
// each co-op player's hero sinks into the stance by their own HP; only the host poses heroes
rememberPerSeat(objectMemory(wound, true));

/**
 * How far the idle has sunk into the wounded stance at game time t, 0 to 1. It moves once per animation frame, an
 * even step at a time, toward 1 while HP is at or under the low share and back to 0 after a heal, whatever state the
 * hero is in, so a hero who stops walking at low HP is already wounded.
 */
export function woundWeight(t: number): number {
  const at = Math.floor(t * ANIM_FPS + 1e-6);
  const steps = Number.isNaN(wound.frame) ? 0 : Math.max(0, at - wound.frame);
  wound.frame = at;
  const low = dangerTarget(hero.hp, progress.stats.hp, LOW_HEALTH.low, LOW_HEALTH.critical) > 0;
  wound.weight = approach(wound.weight, low ? 1 : 0, steps / WOUND_FRAMES);
  return wound.weight;
}

/** the idle part of the way into the wounded stance, eased in and out */
export function woundedIdle(idle: Pose, wounded: Pose, weight: number): Pose {
  if (weight <= 0) return idle;
  if (weight >= 1) return wounded;
  return blendPose(idle, wounded, smooth(0, 1, weight));
}

/** a fresh run starts unhurt */
export function resetWound(): void {
  wound.weight = 0;
  wound.frame = Number.NaN;
}
