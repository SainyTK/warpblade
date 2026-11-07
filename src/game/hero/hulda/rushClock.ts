import { RUSH } from "../../../constants/hulda/rush";
import { skillLevel, skillValues } from "../../skills/query";
import { hero } from "../../state";

/** seconds the charge runs: Bull Horns' time, stretched by Stampede's reach */
export function rushTime(): number {
  const time = skillLevel("h_bullHorns") ? skillValues("h_bullHorns").time : RUSH.time;
  return time * (skillLevel("h_stampede") ? skillValues("h_stampede").reach : 1);
}

/** seconds into the rush the charge ends and the skid starts */
export const rushEnd = (): number => RUSH.load + rushTime();

/** the clip's own end of the charge */
const CLIP_END = RUSH.load + RUSH.time;

/**
 * Where the rush clip is sampled: its load, then its stride looped for as long as the charge runs, then the clip's own
 * last stride and skid lined up on the charge's end, so a longer rush strides on in step and still skids the same way.
 */
export function rushClipTime(st: number): number {
  const end = rushEnd();
  if (st >= end) return CLIP_END + (st - end);
  const [a, b] = RUSH.stride;
  const tail = CLIP_END - (RUSH.load + b);
  if (st < RUSH.load + b) return st;
  if (st > end - tail) return CLIP_END - (end - st);
  return RUSH.load + a + ((st - RUSH.load - a) % (b - a));
}

/** the load and the charge drive her own speed; the skid slows under the floor's own friction */
export const rushDrives = (): boolean => hero.state === "rush" && hero.st < rushEnd();
