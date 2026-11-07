import { GRIT } from "../../../constants/hulda/grit";
import { RUSH } from "../../../constants/hulda/rush";
import { skillLevel, skillValues } from "../../skills/query";
import { hero } from "../../state";
import { hulda } from "./memory";

const HIDE = "h_ironHide";

/** the most Grit she can hold: four plates, or Iron Hide's five or six */
export const maxGrit = (): number => (skillLevel(HIDE) ? skillValues(HIDE).plates : 4) * GRIT.plate;

/** full plates of Grit */
export const plates = (): number => Math.floor(hulda.grit / GRIT.plate);

/** the share of the bar filled, 0 to 1 */
export const gritShare = (): number => hulda.grit / maxGrit();

/** Grit a landed J blow gives each foe it strikes */
export const fistGrit = (): number => (skillLevel(HIDE) ? skillValues(HIDE).fist : GRIT.fist);

/** earn Grit, never past full; anything earned keeps the bar from draining for a while */
export function gainGrit(n: number): void {
  hulda.grit = Math.min(maxGrit(), hulda.grit + n);
  hulda.quiet = 0;
}

/** Grit drains once a while has passed with no blow landed or taken */
export function tickGrit(dt: number): void {
  hulda.quiet += dt;
  hulda.safe = Math.max(0, hulda.safe - dt);
  hulda.flinch = Math.max(0, hulda.flinch - dt);
  hulda.healWait = Math.max(0, hulda.healWait - dt);
  const drain = skillLevel(HIDE) ? skillValues(HIDE).drain : 1;
  if (hulda.quiet > GRIT.quietAfter) hulda.grit = Math.max(0, hulda.grit - GRIT.drain * drain * dt);
}

/** the Bull Rush is under way, load to skid */
export const rushing = (): boolean => hero.state === "rush" && !hulda.landed;

/** the share of a blow that reaches her HP: cut under a full plate (more with Iron Hide) or in a rush */
export function gritScale(): number {
  if (plates() > 0) return skillLevel(HIDE) ? skillValues(HIDE).cut : GRIT.plated;
  if (rushing()) return skillLevel("h_bullHorns") ? skillValues("h_bullHorns").armour : RUSH.armour;
  return 1;
}
