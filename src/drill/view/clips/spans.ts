import type { DrillMotion, DrillStrike, DrillStrikeId } from "../../../types/drill";
import { RUN_STRIDE } from "../runFoot";
import { airSeconds, BRAKING_TIME, LANDING_TIME } from "./curves";

/** the seconds a clip spread over its state lasts: the brake, the landing, the dash, the wall kick's lock */
export const brakeSpan = (): number => BRAKING_TIME;
export const landSpan = (numbers: DrillMotion): number => LANDING_TIME * numbers.landing;
export const dashSpan = (numbers: DrillMotion): number => numbers.dashTime;
export const kickSpan = (numbers: DrillMotion): number => numbers.wallLock;

/** one run stride at full speed; the game plays the run by distance, so slower runs take longer */
export const strideSpan = (numbers: DrillMotion): number => RUN_STRIDE / numbers.run;

/** how long each clip that is not played in time at ANIM_FPS lasts in the game; `loop` clips repeat over their span */
export function clipSpans(numbers: DrillMotion, strikes: Readonly<Record<DrillStrikeId, DrillStrike>>) {
  const spread = (seconds: number) => ({ seconds, loop: false });
  return {
    run: { seconds: strideSpan(numbers), loop: true },
    brake: spread(brakeSpan()),
    land: spread(landSpan(numbers)),
    dash: spread(dashSpan(numbers)),
    airDash: spread(dashSpan(numbers)),
    kick: spread(kickSpan(numbers)),
    jump: spread(airSeconds(numbers)),
    dashJump: spread(airSeconds(numbers)),
    "strikes/first": spread(strikes.first.duration),
    "strikes/second": spread(strikes.second.duration),
    "strikes/third": spread(strikes.third.duration),
    "strikes/air": spread(strikes.air.duration),
  } as const;
}
