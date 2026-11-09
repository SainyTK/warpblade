import { SECOND_HAND, STOPPED_CLOCK } from "../../../constants/mirel/abilities";
import type { MirelAbility } from "../../../types/mirel";
import { skillLevel, skillValues } from "../../skills/query";
import { createRotation } from "../../skills/rotation";
import { mirel } from "./memory";
import { pressSecondHand } from "./secondHand";
import { pressForetell } from "./spells/foretell";
import { pressHourHand } from "./spells/hourHand";
import { pressSundial } from "./spells/sundial";
import { pressStoppedClock } from "./stoppedClock";

/** her abilities on I in the order O turns through them: Stopped Clock and Second Hand from the start, then her spells */
export const ABILITIES: readonly MirelAbility[] = [
  "stoppedClock",
  "secondHand",
  "m_sundial",
  "m_foretell",
  "m_handsweep",
];

/** an ability she has now: her own two always, a spell skill once held */
const known = (id: MirelAbility): boolean => id === "stoppedClock" || id === "secondHand" || skillLevel(id) > 0;

const rotation = createRotation(ABILITIES, (id) => known(id as MirelAbility));

/** the ability I uses now */
export const selectedAbility = (): MirelAbility => (rotation.selected() as MirelAbility | null) ?? "stoppedClock";

/** O: turn to the next ability she has */
export const nextAbility = (): boolean => rotation.next();

/** a fresh run: back to Stopped Clock */
export const resetAbilities = (): void => rotation.reset();

/** what an ability costs in MP */
export function abilityMp(id: MirelAbility): number {
  if (id === "stoppedClock") return STOPPED_CLOCK.mp;
  if (id === "secondHand") return SECOND_HAND.mp;
  return skillValues(id).mp ?? 0;
}

/** an ability's own recharge time, for the HUD */
function abilityCooldown(id: MirelAbility): number {
  if (id === "stoppedClock") return STOPPED_CLOCK.cooldown;
  if (id === "secondHand") return SECOND_HAND.cooldown;
  return skillValues(id).cooldown ?? 1;
}

/** seconds an ability still waits */
function abilityWait(id: MirelAbility): number {
  switch (id) {
    case "stoppedClock":
      return mirel.clockCd;
    case "secondHand":
      return mirel.handCd;
    case "m_sundial":
      return mirel.sundialCd;
    case "m_foretell":
      return mirel.foretellCd;
    case "m_handsweep":
      return mirel.sweepCd;
  }
}

/** the share of an ability's recharge still to run, 0 when ready */
export const abilityRecharge = (id: MirelAbility): number => Math.min(1, abilityWait(id) / abilityCooldown(id));

/** I: use the selected ability */
export function pressAbility(): boolean {
  switch (selectedAbility()) {
    case "secondHand":
      return pressSecondHand();
    case "m_sundial":
      return pressSundial();
    case "m_foretell":
      return pressForetell();
    case "m_handsweep":
      return pressHourHand();
    default:
      return pressStoppedClock();
  }
}

/** every ability she knows, for the HUD */
export const knownAbilities = (): MirelAbility[] => ABILITIES.filter(known);

/** recharges run down */
export function tickAbilities(recharge: number): void {
  mirel.clockCd = Math.max(0, mirel.clockCd - recharge);
  mirel.handCd = Math.max(0, mirel.handCd - recharge);
  mirel.sundialCd = Math.max(0, mirel.sundialCd - recharge);
  mirel.foretellCd = Math.max(0, mirel.foretellCd - recharge);
  mirel.sweepCd = Math.max(0, mirel.sweepCd - recharge);
}
