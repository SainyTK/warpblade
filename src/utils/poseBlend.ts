import { POSE_KEYS, type Pose, type PoseKey } from "../types/pose";
import { lerp } from "./math";

/** joints across the body: they change sign when the pose is seen from the other side */
const ACROSS: readonly PoseKey[] = ["hx", "nx", "fx", "bx", "ffx", "bfx", "cb"];
/** flags that switch, never blend */
const FLAGS: ReadonlySet<PoseKey> = new Set(["tw", "mr", "fe", "be"]);

/** the same pose as seen facing the other way, so it can blend into a pose drawn on that side */
export function mirrorPose(p: Pose): Pose {
  const o = { ...p };
  for (const k of ACROSS) o[k] = -p[k];
  o.sa = Math.PI - p.sa;
  o.mr = p.mr >= 0.5 ? 0 : 1;
  return o;
}

/** the shortest turn from angle a to angle b */
function angleTo(a: number, b: number): number {
  const d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) return d - Math.PI * 2;
  if (d < -Math.PI) return d + Math.PI * 2;
  return d;
}

/**
 * Part of the way from pose a to pose b: joints move in straight lines, the blade turns the short way round, and the
 * flags take b's. A pose drawn mirrored the other way from b is turned to b's side first.
 */
export function blendPose(a: Pose, b: Pose, u: number): Pose {
  const from = a.mr >= 0.5 !== b.mr >= 0.5 ? mirrorPose(a) : a;
  const o = { ...b };
  for (const k of POSE_KEYS) {
    if (FLAGS.has(k)) continue;
    o[k] = k === "sa" ? from.sa + angleTo(from.sa, b.sa) * u : lerp(from[k], b[k], u);
  }
  return o;
}

/** pose p moved by part u of the difference from pose a to pose b, joint by joint; flags stay p's */
export function shiftPose(p: Pose, a: Pose, b: Pose, u: number): Pose {
  const o = { ...p };
  for (const k of POSE_KEYS) {
    if (FLAGS.has(k)) continue;
    o[k] = p[k] + (b[k] - a[k]) * u;
  }
  return o;
}
