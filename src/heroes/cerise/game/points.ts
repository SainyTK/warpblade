import { skillValues } from "../../../game/skills/query";
import { POINTS } from "../constants/points";
import { cerise } from "./state";

/** the most Points she can hold: five, more with Poise */
export const pointCap = (): number => POINTS.most + (skillValues("ce_poise").most ?? 0);

/** gain Points up to the cap; the bar flashes */
export function gainPoints(n: number): void {
  if (n <= 0) return;
  const before = cerise.points;
  cerise.points = Math.min(pointCap(), cerise.points + n);
  if (cerise.points !== before) cerise.pointFlash = POINTS.flash;
}

/** spend up to `most` Points; returns how many were spent */
export function spendPoints(most: number): number {
  const spent = Math.min(cerise.points, Math.max(0, most));
  if (!spent) return 0;
  cerise.points -= spent;
  cerise.pointFlash = POINTS.flash;
  return spent;
}
