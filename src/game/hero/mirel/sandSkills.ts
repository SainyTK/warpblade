import { skillValues } from "../../skills/query";
import { mirel } from "./memory";

/** Patience: the hourglass holds more */
export const sandMaxBonus = (): number => skillValues("m_patience").max ?? 0;

/**
 * How fast Sand refills right now, as a share of the usual rate. While her own field stands it does not, unless Steady
 * Pace lets some through or Timeless lets all of it. Patience speeds it always, Quickened while it lasts.
 */
export function sandRefillScale(fieldStands: boolean): number {
  const patience = skillValues("m_patience");
  let scale = 1 + (patience.refill ?? 0);
  if (mirel.quickLeft > 0) scale *= 1 + (skillValues("m_quicken").refill ?? 0);
  if (!fieldStands || patience.timeless) return scale;
  return scale * (skillValues("m_pace").refill ?? 0);
}
