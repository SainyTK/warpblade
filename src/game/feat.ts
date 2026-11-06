import { recordFeat } from "../store/achievements";
import type { Feat } from "../types/achievement";
import { coop } from "./coopHooks";

/** count something that happened in play toward the achievements; a co-op room's run counts only its banked coins */
export function feat(f: Feat): void {
  if (coop()) return;
  recordFeat(f);
}
