import { skillValues, withCharms } from "../../skills/query";
import { mirel } from "./memory";

/** Quickened: a rewind (a Stopped Moment or Second Chance) speeds her own walk and blows for a while */
export function quicken(): void {
  const v = skillValues("m_quicken");
  if (v.speed) mirel.quickLeft = withCharms("duration", v.life);
}

/** her own speed right now: 1, or more while Quickened */
export const quickRate = (): number => (mirel.quickLeft > 0 ? 1 + (skillValues("m_quicken").speed ?? 0) : 1);
