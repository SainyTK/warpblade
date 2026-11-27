import { recordFeat } from "../store/achievements";
import type { Feat } from "../types/achievement";
import { coop } from "./coopHooks";

export function feat(f: Feat): void {
  const room = coop();
  if (room) room.shareFeat(f);
  else recordFeat(f);
}
