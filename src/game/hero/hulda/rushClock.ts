import { RUSH } from "../../../constants/hulda/rush";
import { skillLevel, skillValues } from "../../skills/query";
import { hero } from "../../state";
import { hulda } from "./memory";

/** seconds the charge runs: Bull Horns' time, stretched by Stampede's reach */
export function rushTime(): number {
  const time = skillLevel("h_bullHorns") ? skillValues("h_bullHorns").time : RUSH.time;
  return time * (skillLevel("h_stampede") ? skillValues("h_stampede").reach : 1);
}

/** seconds into the rush the full charge ends */
const fullEnd = (): number => RUSH.load + rushTime();

/** seconds into the rush the charge ends and the skid starts: early when it stopped past a lone foe */
export const rushEnd = (): number => (hulda.rushStop > 0 ? hulda.rushStop : fullEnd());

/** the clip's own end of the charge */
const CLIP_END = RUSH.load + RUSH.time;

/**
 * The stride keys after the load where the charge may stop, each with the clip time from which the clip's own last
 * stride runs on from the same pose into the skid: the stride's two outer keys match the key that starts the last
 * stride, its middle key matches the charge's last key.
 */
const STOPS: readonly (readonly [number, number])[] = [
  [RUSH.stride[0], RUSH.load + RUSH.stride[1]],
  [RUSH.midStride, CLIP_END - RUSH.lastKey],
  [RUSH.stride[1], RUSH.load + RUSH.stride[1]],
];

/** the clip time of the full charge: its load, the stride looped while the charge runs, its last stride and skid */
function strideTime(st: number, end: number): number {
  if (st >= end) return CLIP_END + (st - end);
  const [a, b] = RUSH.stride;
  const tail = CLIP_END - (RUSH.load + b);
  if (st < RUSH.load + b) return st;
  if (st > end - tail) return CLIP_END - (end - st);
  return RUSH.load + a + ((st - RUSH.load - a) % (b - a));
}

/**
 * Where the rush clip is sampled: its load, then its stride looped for as long as the charge runs, then the clip's own
 * last stride and skid lined up on the charge's end, so a longer rush strides on in step and still skids the same way.
 * A charge stopped early strides on to its next key and joins the last stride from the same pose.
 */
export function rushClipTime(st: number): number {
  if (hulda.rushStop > 0) {
    const join = hulda.rushStop - (CLIP_END - hulda.rushJoin);
    if (st >= join) return hulda.rushJoin + (st - join);
  }
  return strideTime(st, fullEnd());
}

/**
 * Stop the charge at the stride's next key: from there the clip's last stride and skid play as at a full charge's end.
 * Late in the charge, when its own end comes first, it runs on.
 */
export function stopCharge(st: number): void {
  if (hulda.rushStop > 0) return;
  const end = fullEnd();
  const clip = strideTime(st, end) - RUSH.load;
  const stop = STOPS.find(([key]) => key >= clip - 1e-6);
  if (!stop) return;
  const [key, join] = stop;
  const stopAt = st + (key - clip) + (CLIP_END - join);
  if (stopAt >= end) return;
  hulda.rushStop = stopAt;
  hulda.rushJoin = join;
}

/** the load and the charge drive her own speed; the skid slows under the floor's own friction */
export const rushDrives = (): boolean => hero.state === "rush" && hero.st < rushEnd();
