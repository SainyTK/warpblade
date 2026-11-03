import { HEAD_START_LEVEL } from "../constants/shopSkills";
import { ownsSkill } from "../store/meta";
import { xpToReach } from "../utils/progression";
import { gainXp } from "./progress";
import { resetRun } from "./run";

/** a fresh run with everything bought in the shop: stats come in through the progress, Head Start's levels here */
export function startRun(banner: string): void {
  resetRun(banner);
  if (ownsSkill("headStart")) gainXp(xpToReach(HEAD_START_LEVEL));
}
