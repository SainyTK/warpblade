import { FURY } from "../../../constants/brannoc/fury";
import { BERSERK, FRENZY } from "../../../constants/brannoc/moves";
import { sfx } from "../../../services/audio";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { hero, progress } from "../../state";
import { brannoc } from "./memory";

/** the share of his max HP he is missing, 0 at full and near 1 at the edge, read every frame */
export const missing = (): number => Math.max(0, Math.min(1, 1 - hero.hp / Math.max(1, progress.stats.hp)));

/** the HP share he is Bloodied at: 35%, or Scarred Hide's line */
export const bloodiedLine = (): number => skillValues("b_scarred").line || FURY.bloodied;

/** he is at or under the Bloodied line and still standing */
export const isBloodied = (): boolean => hero.hp > 0 && hero.hp <= progress.stats.hp * bloodiedLine();

/** Fury added by Scarred Hide and, in it, Blood Pact */
const extraFury = (): number =>
  (skillValues("b_scarred").fury ?? 0) + (brannoc.pactT > 0 ? (skillValues("b_pact").fury ?? 0) : 0);

/** every hit he deals, from any source: up to 60% more as his HP falls */
export const furyDamage = (): number => 1 + (FURY.damage + extraFury()) * missing();

/** his string swings faster as his HP falls, and faster again in Frenzy and Berserk */
export function attackRate(): number {
  let rate = 1 + FURY.rate * missing();
  if (brannoc.frenzyT > 0) rate += FRENZY.rate;
  if (brannoc.berserkT > 0) rate += BERSERK.rate;
  return rate;
}

/** his walk quickens as his HP falls */
export const walkSpeed = (shared: number): number => shared * (1 + FURY.walk * missing());

/**
 * Bloodied crossings: in, a low growl and a one-frame crimson rim; out, nothing. Bloodied's look and the double Cleave
 * read `isBloodied` every frame.
 */
export function watchBloodied(dt: number): void {
  brannoc.rimFlash = Math.max(0, brannoc.rimFlash - dt);
  const now = isBloodied();
  if (now === brannoc.bloodied) return;
  brannoc.bloodied = now;
  if (now) {
    sfx.tone(70, 160, 0.08, "sawtooth", 0.05);
    brannoc.rimFlash = FURY.rim;
  }
  emitSkillEvent({ type: "bloodied", on: now });
}
