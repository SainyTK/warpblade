import type { DrillPoses } from "../../../../types/drill";
import type { Pose } from "../../../../types/pose";
import { TAU } from "../../../../utils/math";
import { sampleKeys } from "../../../../utils/sampleKeys";
import { ALDRIC_ACTION_CLIPS } from "../../constants/clips";

const { throw: THROW, arrive: ARRIVE } = ALDRIC_ACTION_CLIPS;
const THROWN = sampleKeys(THROW.keys, THROW.dur);
const BREATH = { depth: 0.4, rate: 1.5 } as const;

function flight(age: number): Pose {
  const breath = Math.sin(age * TAU * BREATH.rate) * BREATH.depth;
  return { ...THROWN, hy: THROWN.hy + breath, ny: THROWN.ny + breath, fy: THROWN.fy + breath, by: THROWN.by + breath };
}

export const ALDRIC_WARP_POSES: Pick<DrillPoses, "warpThrow" | "warpFlight" | "warpArrival"> = {
  warpThrow: (age) => sampleKeys(THROW.keys, age),
  warpFlight: flight,
  warpArrival: (age) => sampleKeys(ARRIVE.keys, age),
};
