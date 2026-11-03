export const POSE_KEYS = [
  "hx",
  "hy",
  "nx",
  "ny",
  "fx",
  "fy",
  "bx",
  "by",
  "ffx",
  "ffy",
  "bfx",
  "bfy",
  "sa",
  "tw",
  "mr",
] as const;
export type PoseKey = (typeof POSE_KEYS)[number];
/**
 * A body pose, facing right, in pixels from the feet: hip (hx, hy), neck (nx, ny), near hand (fx, fy), far hand (bx, by),
 * near foot (ffx, ffy), far foot (bfx, bfy) and the sword angle sa in radians.
 * The torso follows the line from hip to neck, so a neck far ahead of the hip is a body leaning flat into a lunge.
 * tw at 1 turns Kael's back to the camera, mid-spin. mr at 1 draws the whole pose mirrored, facing behind him.
 */
export type Pose = Record<PoseKey, number>;
/** [time, pose, "snap"]: snap holds the previous key and jumps on this one. */
export type PoseKeyframe = readonly [number, Pose, "snap"?];
export interface ActionClip {
  dur: number;
  /** when the blow lands or the spell leaves the hand */
  hit: number;
  keys: readonly PoseKeyframe[];
}
