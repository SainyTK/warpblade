import { RED_CRESCENT, WAR_CRY } from "../../../constants/brannoc/moves";
import type { BrannocAbility } from "../../../types/brannoc";
import { skillLevel, skillValues } from "../../skills/query";
import { createRotation } from "../../skills/rotation";
import { pressCast } from "./cast";
import { brannoc } from "./memory";

/** his abilities on I in the order O turns through them: War Cry and Red Crescent from the start, then his spells */
export const ABILITIES: readonly BrannocAbility[] = ["warCry", "redCrescent", "b_geyser", "b_axeThrow", "b_pact"];

/** an ability he has now: his own two always, a spell skill once held */
const known = (id: BrannocAbility): boolean => id === "warCry" || id === "redCrescent" || skillLevel(id) > 0;

const rotation = createRotation(ABILITIES, (id) => known(id as BrannocAbility));

/** the ability I uses now */
export const selectedAbility = (): BrannocAbility => (rotation.selected() as BrannocAbility | null) ?? "warCry";

/** O: turn to the next ability he has */
export const nextAbility = (): boolean => rotation.next();

/** a fresh run: back to War Cry */
export const resetAbilities = (): void => rotation.reset();

/** what an ability costs, as a share of his max HP */
export function abilityCost(id: BrannocAbility): number {
  if (id === "warCry") return WAR_CRY.cost;
  if (id === "redCrescent") return RED_CRESCENT.cost;
  return skillValues(id).hp ?? 0;
}

/** an ability's own recharge time */
export function abilityCooldown(id: BrannocAbility): number {
  if (id === "warCry") return WAR_CRY.cooldown;
  if (id === "redCrescent") return RED_CRESCENT.cooldown;
  return skillValues(id).cooldown ?? 1;
}

const WAITS = {
  warCry: "cryCd",
  redCrescent: "crescentCd",
  b_geyser: "geyserCd",
  b_axeThrow: "axeCd",
  b_pact: "pactCd",
} as const satisfies Record<BrannocAbility, keyof typeof brannoc>;

/** seconds an ability still waits */
export const abilityWait = (id: BrannocAbility): number => brannoc[WAITS[id]];

/** start an ability's wait */
export function startWait(id: BrannocAbility): void {
  brannoc[WAITS[id]] = abilityCooldown(id);
}

/** the share of an ability's recharge still to run, 0 when ready */
export const abilityRecharge = (id: BrannocAbility): number => Math.min(1, abilityWait(id) / abilityCooldown(id));

/** I: use the selected ability */
export const pressAbility = (): boolean => pressCast(selectedAbility());

/** every ability he knows, for the HUD */
export const knownAbilities = (): BrannocAbility[] => ABILITIES.filter(known);

/** recharges run down */
export function tickAbilities(recharge: number): void {
  for (const id of ABILITIES) brannoc[WAITS[id]] = Math.max(0, brannoc[WAITS[id]] - recharge);
}
