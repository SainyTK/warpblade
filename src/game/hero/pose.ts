import { CLIPS, POSES, STAND } from "../../constants/hero";
import type { Hero } from "../../types/hero";
import { POSE_KEYS, type Pose, type PoseKeyframe } from "../../types/pose";
import { ease, lerp, TAU } from "../../utils/math";
import { MOVES } from "./moves";

/** sample keyframes at 30 fps steps, so limbs move in pixel-art beats */
export function sampleKeys(keys: readonly PoseKeyframe[], time: number): Pose {
  const t = Math.floor(time * 30) / 30;
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
/** breathing in four steps */
export function idlePose(t: number): Pose {
  const b = [0, 0, 0.6, 1][Math.floor(t * 2.5) % 4];
  return { ...STAND, ny: STAND.ny + b, fy: STAND.fy + b * 0.5, by: STAND.by + b * 0.5 };
}
/** a calm walk: shorter strides, sword held low in front */
export function walkPose(phase: number): Pose {
  const a = (Math.floor(phase * 8) / 8) * TAU;
  const hy = -14 - (1 - Math.abs(Math.sin(a))) * 0.6;
  return {
    ...STAND,
    ffx: 0.5 + 3.5 * Math.sin(a),
    ffy: -Math.max(0, Math.cos(a)) * 2.5,
    bfx: 0.5 + 3.5 * Math.sin(a + Math.PI),
    bfy: -Math.max(0, Math.cos(a + Math.PI)) * 2.5,
    hy,
    ny: hy - 10,
    fy: hy - 1,
    by: hy - 1 + Math.sin(a) * 0.8,
  };
}
/** eight steps per stride, feet lifted on the forward swing, sword trailing behind */
export function runPose(phase: number): Pose {
  const a = (Math.floor(phase * 8) / 8) * TAU;
  const hy = -13.5 - (1 - Math.abs(Math.sin(a))) * 1.2;
  return {
    ...STAND,
    ffx: 1 + 5.5 * Math.sin(a),
    ffy: -Math.max(0, Math.cos(a)) * 4.5,
    bfx: 1 + 5.5 * Math.sin(a + Math.PI),
    bfy: -Math.max(0, Math.cos(a + Math.PI)) * 4.5,
    hx: 1,
    hy,
    nx: 4,
    ny: hy - 9.6,
    fx: -1 + 2 * Math.sin(a + Math.PI),
    fy: hy - 1,
    sa: 2.7,
    bx: 1 + 4.5 * Math.sin(a),
    by: hy - 2 - Math.abs(Math.sin(a)) * 1.5,
  };
}
export function heroPose(h: Hero, t: number): Pose {
  switch (h.state) {
    case "idle":
      return idlePose(t);
    case "walk":
      return walkPose(h.runPhase);
    case "run":
      return runPose(h.runPhase);
    case "jump":
    case "fall":
    case "hurt":
      return POSES[h.state];
    case "dash":
      return POSES.dodge;
    case "charge": {
      const tremble = h.chargeLevel >= 3 && Math.floor(t * 30) % 2 ? 0.5 : 0;
      return { ...POSES.charge, nx: POSES.charge.nx + tremble };
    }
    case "ultimate":
      return POSES.release;
    case "move":
      return h.move ? sampleKeys(CLIPS[MOVES[h.move].clip].keys, h.st) : STAND;
    case "dead":
      return POSES.kneel;
    case "throwWait":
      return POSES.throwHold;
    case "hang": {
      const sway = Math.sin(t * 2.2) * 1.2;
      return { ...POSES.hang, ffx: POSES.hang.ffx + sway, bfx: POSES.hang.bfx + sway * 0.8 };
    }
    default:
      return sampleKeys(CLIPS[h.state].keys, h.st);
  }
}
