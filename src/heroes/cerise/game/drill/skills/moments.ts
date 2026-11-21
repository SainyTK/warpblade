import { drillFighter } from "../../../../../drill";
import type { DrillMoment } from "../../../types/drillSkill";

const seen = { parry: false, arrival: false, grounded: true, kick: false, airDash: false };

export function readMoments(): DrillMoment[] {
  const h = drillFighter();
  if (!h) {
    return [];
  }
  const now = {
    parry: h.parryAge !== null,
    arrival: h.warp?.phase === "arrival",
    grounded: h.grounded,
    kick: h.wallLock > 0,
    airDash: h.airDashActive,
  };
  const moments: DrillMoment[] = [];
  if (now.parry && !seen.parry) moments.push("parry");
  if (now.arrival && !seen.arrival) moments.push("arrival");
  if (now.grounded && !seen.grounded) moments.push("landing");
  if (now.kick && !seen.kick) moments.push("wallKick");
  if (now.airDash && !seen.airDash) moments.push("airDash");
  Object.assign(seen, now);
  return moments;
}

export function resetMoments(): void {
  Object.assign(seen, { parry: false, arrival: false, grounded: true, kick: false, airDash: false });
}
