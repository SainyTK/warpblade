import type { DrillPoses } from "../../../../types/drill";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { BRYNN_HELD_CLIPS } from "../clips/held";

const { throw: THROW, throwWait: WAIT, warpStrike: ARRIVAL } = BRYNN_HELD_CLIPS;

export const BRYNN_WARP_POSES: Pick<DrillPoses, "warpThrow" | "warpFlight" | "warpArrival"> = {
  warpThrow: (age) => sampleKeys(THROW.keys, age),
  warpFlight: (age) => sampleKeys(WAIT.keys, age % WAIT.dur),
  warpArrival: (age) => sampleKeys(ARRIVAL.keys, age),
};
