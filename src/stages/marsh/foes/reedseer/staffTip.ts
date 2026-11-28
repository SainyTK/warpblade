import type { Enemy } from "../../../../types/enemy";
import { seerPose } from "./pose";

export function staffTip(e: Enemy): [number, number] {
  const { tip } = seerPose(e, 0);
  return [e.x + e.face * tip[0], e.y + tip[1] + 2];
}
