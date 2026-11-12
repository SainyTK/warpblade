export const POSE_KEYS = [
  "hx",
  "hy",
  "cb",
  "nx",
  "ny",
  "fx",
  "fy",
  "fe",
  "bx",
  "by",
  "be",
  "ffx",
  "ffy",
  "fa",
  "bfx",
  "bfy",
  "ba",
  "sa",
  "tw",
  "mr",
  "dr",
  "ah",
] as const;
export type PoseKey = (typeof POSE_KEYS)[number];
/**
 * A body pose, facing right, in pixels from the feet: hip (hx, hy), neck (nx, ny), near hand (fx, fy), far hand (bx, by),
 * near foot (ffx, ffy), far foot (bfx, bfy) and the sword angle sa in radians.
 * The spine runs from hip to neck through the chest. cb pushes the chest that many pixels toward the front, arching the
 * back, or toward the back when negative, hunching it. A neck far ahead of the hip is a body leaning flat into a lunge.
 * fe and be at 1 bend the near and far elbow the other way. fa and ba tilt the near and far foot in radians: positive
 * points the toes down, negative lifts them onto the heel.
 * tw at 1 turns Kael's back to the camera, mid-spin. mr at 1 draws the whole pose mirrored, facing behind him.
 * dr swings a drum worn at the hip round to the front of the belly, 0 at the hip to 1 in front (Jory's war drum).
 * ah at 1 turns a great axe's head to the other side of its haft, so its edge leads a backhand sweep (Brannoc's Reave).
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
