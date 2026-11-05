import type { ActionClip, Pose, PoseKeyframe } from "../../../types/pose";
import { aimAt } from "../../../utils/glaiveGrip";
import { lerp } from "../../../utils/math";
import { frame } from "../../hero";
import { yFree } from "./stanceBase";

/** where the glaive's point rests on the floor ahead of her */
const TIP = { x: 24, y: -1.5 } as const;

/**
 * Ysra hurt and heaving: her guard broken, shoulders slumped forward, the glaive sagging in the near hand with its
 * point dragged down onto the floor ahead, and the far hand off the haft, pressed to her side. b is the breath, 0
 * breathed out and 1 a full breath in: the shoulders heave and the hand rides up with them, the point staying on the floor.
 */
const sag = (b: number): Pose => {
  const fx = 5;
  const fy = lerp(-12.75, -13.5, b);
  return yFree({
    hx: -1,
    hy: lerp(-11.75, -12.5, b),
    cb: lerp(-2.5, -1.5, b),
    nx: lerp(3.5, 2.5, b),
    ny: lerp(-20.5, -22.5, b),
    fx,
    fy,
    sa: aimAt(fx, fy, TIP.x, TIP.y),
    bx: lerp(1.5, 1, b),
    by: lerp(-16, -17.5, b),
    ffx: 5,
    bfx: -5.5,
  });
};

/** the breath on every second frame: two deep, slow heaves, the second shuddering on the way out */
const BREATHS = [
  0, 0.25, 0.6, 0.9, 1, 1, 0.85, 0.65, 0.45, 0.28, 0.12, 0.03, 0, 0.3, 0.65, 0.92, 1, 0.9, 0.75, 0.8, 0.5, 0.3, 0.12,
  0.03,
] as const;

/** Ysra's idle at low HP, in place of her guard's breathing; it loops, and its last key flows into the first */
export const YSRA_WOUNDED_IDLE: ActionClip = {
  dur: frame(BREATHS.length * 2),
  hit: 0,
  keys: BREATHS.map((b, i): PoseKeyframe => [frame(i * 2), sag(b)]),
};
