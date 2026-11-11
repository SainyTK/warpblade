import type { Enemy } from "../../../types/enemy";
import { clamp, ease, lerp } from "../../../utils/math";

/** How a husk or a brute holds itself in each state, in the husk's own art pixels with its feet at y 0, facing +x. */
export interface HuskPose {
  /** the near foot's x, and how far each foot is off the floor */
  nearFoot: number;
  nearLift: number;
  farFoot: number;
  farLift: number;
  /** the body rises this far on each step and sinks this far in a crouch */
  bob: number;
  crouch: number;
  /** the upper body leans this far the way it faces, at head height */
  lean: number;
  /** the claw hand */
  hand: readonly [number, number];
  /** how wide the claws spread, 1 at rest */
  spread: number;
  /** the head hangs this far */
  droop: number;
  /** its fire shows hotter while it gathers a blow, 0 to 1 */
  heat: number;
  limp: boolean;
}

const REST_HAND = [8, -6] as const;
const RAISED_HAND = [-3, -27] as const;
const SWIPE_HAND = [14, -7] as const;
/** seconds for the claw to rise at the start of a wind-up, and for the swipe to come down */
const RAISE = 0.22;
const STRIKE = 0.07;
/** steps a second, as the walk cycle's angle */
const STRIDE = { husk: 6 * Math.PI, brute: 4 * Math.PI };

const between = (a: readonly [number, number], b: readonly [number, number], u: number): [number, number] => [
  lerp(a[0], b[0], u),
  lerp(a[1], b[1], u),
];

export function huskPose(e: Enemy, t: number): HuskPose {
  const brute = e.type === "brute";
  const limp = e.stun > 0 || e.air;
  const pose = {
    nearFoot: 3,
    nearLift: 0,
    farFoot: -4,
    farLift: 0,
    bob: 0,
    crouch: 0,
    lean: 0,
    hand: REST_HAND as readonly [number, number],
    spread: 1,
    droop: 0,
    heat: 0,
    limp,
  };
  if (limp) {
    pose.hand = e.air ? [7, -20] : [6, -1];
    pose.droop = 2;
    pose.lean = e.air ? -1 : 1.5;
    pose.nearLift = e.air ? 2 : 0;
    pose.farFoot = e.air ? -5.5 : -4;
    pose.farLift = e.air ? 1 : 0;
    return pose;
  }
  if (e.state === "walk") {
    const stride = (t + e.seed) * (brute ? STRIDE.brute : STRIDE.husk);
    const swing = Math.sin(stride);
    pose.nearFoot = 3 + swing * 1.4;
    pose.farFoot = -4 - swing * 1.4;
    pose.nearLift = Math.max(0, Math.cos(stride)) * 1.2;
    pose.farLift = Math.max(0, -Math.cos(stride)) * 1.2;
    pose.bob = Math.abs(swing) * 0.7;
    pose.hand = [8 - swing * 1.2, -6 - Math.abs(swing)];
    return pose;
  }
  const crouched = e.state === "leap" && e.vy === 0;
  if (e.state === "wind" || crouched) {
    const u = ease.outBack(clamp(e.st / RAISE));
    pose.hand = between(REST_HAND, RAISED_HAND, u);
    pose.lean = -2 * u;
    pose.spread = 1 + u;
    pose.heat = clamp(e.st / RAISE);
    pose.crouch = crouched ? 3 * clamp(e.st / RAISE) : 0;
    return pose;
  }
  if (e.state === "leap") {
    pose.hand = [1, -28];
    pose.spread = 2;
    pose.heat = 1;
    pose.nearLift = 3;
    pose.farLift = 2;
    pose.nearFoot = 4;
    pose.lean = 1.5;
    return pose;
  }
  if (e.state === "swipe") {
    const u = ease.outCubic(clamp(e.st / STRIKE));
    pose.hand = between([10, -22], SWIPE_HAND, u);
    pose.lean = 3 * u;
    pose.spread = 1.6;
    pose.heat = 1 - u * 0.5;
    pose.nearFoot = 4.5;
    return pose;
  }
  // recovering: the claw hangs where the blow ended and the body sags, then it gathers itself
  const back = clamp(e.st / 0.5);
  pose.hand = between([12, -3], REST_HAND, back * back);
  pose.lean = 2 * (1 - back);
  pose.droop = 1 - back;
  pose.crouch = 1 - back;
  return pose;
}
