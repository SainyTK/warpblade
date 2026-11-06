import { GRIT } from "../../../constants/hulda/grit";
import { RUSH } from "../../../constants/hulda/rush";
import { hasPerk } from "../../progress";
import { hero } from "../../state";
import { hulda } from "./memory";

/** full plates of Grit, 0 to 4 */
export const plates = (): number => Math.floor(hulda.grit / GRIT.plate);

/** the share of the bar filled, 0 to 1 */
export const gritShare = (): number => hulda.grit / GRIT.max;

/** earn Grit, never past full; anything earned keeps the bar from draining for a while */
export function gainGrit(n: number): void {
  hulda.grit = Math.min(GRIT.max, hulda.grit + n);
  hulda.quiet = 0;
}

/** Grit drains once a while has passed with no blow landed or taken */
export function tickGrit(dt: number): void {
  hulda.quiet += dt;
  hulda.safe = Math.max(0, hulda.safe - dt);
  hulda.flinch = Math.max(0, hulda.flinch - dt);
  if (hulda.quiet > GRIT.quietAfter) hulda.grit = Math.max(0, hulda.grit - GRIT.drain * dt);
}

/** the Bull Rush is under way, load to skid */
export const rushing = (): boolean => hero.state === "rush" && !hulda.landed;

/** the share of a blow that reaches her HP: halved under a full plate or in a rush, less with Iron Plates */
export function gritScale(): number {
  if (plates() > 0) return hasPerk("ironPlates") ? GRIT.ironPlated : GRIT.plated;
  if (rushing()) return RUSH.armour;
  return 1;
}
