import { ANIM_FPS } from "../constants/hero";
import { POSE_KEYS, type Pose, type PoseKeyframe } from "../types/pose";
import { ease, lerp } from "./math";

/** sample keyframes in whole animation frames, so limbs move in pixel-art beats */
export function sampleKeys(keys: readonly PoseKeyframe[], time: number): Pose {
  const t = Math.floor(time * ANIM_FPS) / ANIM_FPS;
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, p0] = keys[i];
    const [t1, p1, mode] = keys[i + 1];
    if (t >= t1) continue;
    if (mode === "snap") return p0;
    const u = ease.outQuad((t - t0) / (t1 - t0));
    const o = { ...p0 };
    for (const k of POSE_KEYS) o[k] = lerp(p0[k], p1[k], u);
    return o;
  }
  return keys[keys.length - 1][1];
}
