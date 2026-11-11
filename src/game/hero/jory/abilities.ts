import { STEADY_HAND, THUNDER_SKIN } from "../../../constants/jory/moves";
import type { JoryAbility } from "../../../types/jory";
import { skillLevel, skillValues } from "../../skills/query";
import { createRotation } from "../../skills/rotation";
import { pressCast } from "./cast";
import { jory } from "./memory";

/** his abilities on I in the order O turns through them: Steady Hand and Thunder Skin from the start, then his spells */
export const ABILITIES: readonly JoryAbility[] = ["steadyHand", "thunderSkin", "j_gong", "j_tuning", "j_echo"];

/** an ability he has now: his own two always, a spell skill once held */
const known = (id: JoryAbility): boolean => id === "steadyHand" || id === "thunderSkin" || skillLevel(id) > 0;

const rotation = createRotation(ABILITIES, (id) => known(id as JoryAbility));

/** the ability I uses now */
export const selectedAbility = (): JoryAbility => (rotation.selected() as JoryAbility | null) ?? "steadyHand";

/** O: turn to the next ability he has */
export const nextAbility = (): boolean => rotation.next();

/** a fresh run: back to Steady Hand */
export const resetAbilities = (): void => rotation.reset();

/** what an ability costs in MP */
export function abilityMp(id: JoryAbility): number {
  if (id === "steadyHand") return STEADY_HAND.mp;
  if (id === "thunderSkin") return THUNDER_SKIN.mp;
  return skillValues(id).mp ?? 0;
}

/** an ability's own recharge time */
export function abilityCooldown(id: JoryAbility): number {
  if (id === "steadyHand") return STEADY_HAND.cooldown;
  if (id === "thunderSkin") return THUNDER_SKIN.cooldown;
  return skillValues(id).cooldown ?? 1;
}

const WAITS = {
  steadyHand: "steadyCd",
  thunderSkin: "thunderCd",
  j_gong: "gongCd",
  j_tuning: "tuningCd",
  j_echo: "echoCd",
} as const satisfies Record<JoryAbility, keyof typeof jory>;

/** seconds an ability still waits */
export const abilityWait = (id: JoryAbility): number => jory[WAITS[id]];

/** start an ability's wait */
export function startWait(id: JoryAbility): void {
  jory[WAITS[id]] = abilityCooldown(id);
}

/** the share of an ability's recharge still to run, 0 when ready */
export const abilityRecharge = (id: JoryAbility): number => Math.min(1, abilityWait(id) / abilityCooldown(id));

/** I: use the selected ability */
export const pressAbility = (): boolean => pressCast(selectedAbility());

/** every ability he knows, for the HUD */
export const knownAbilities = (): JoryAbility[] => ABILITIES.filter(known);

/** recharges run down */
export function tickAbilities(recharge: number): void {
  for (const id of ABILITIES) jory[WAITS[id]] = Math.max(0, jory[WAITS[id]] - recharge);
}
