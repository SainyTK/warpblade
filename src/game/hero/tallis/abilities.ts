import { HAMSTRING, SMOKE_KNOT } from "../../../constants/tallis/abilities";
import type { TallisAbility } from "../../../types/tallis";
import { skillLevel, skillValues } from "../../skills/query";
import { createRotation } from "../../skills/rotation";
import { pressHamstring } from "./hamstring";
import { tallis } from "./memory";
import { pressSmokeKnot } from "./smokeKnot";
import { pressSpell } from "./spells/castSpell";

/** his abilities on I in the order O turns through them: Smoke Knot and Hamstring from the start, then his spells */
export const ABILITIES: readonly TallisAbility[] = ["smokeKnot", "hamstring", "t_needles", "t_markDusk", "t_caltrops"];

/** an ability he has now: his own two always, a spell skill once held */
const known = (id: TallisAbility): boolean => id === "smokeKnot" || id === "hamstring" || skillLevel(id) > 0;

const rotation = createRotation(ABILITIES, (id) => known(id as TallisAbility));

/** the ability I uses now */
export const selectedAbility = (): TallisAbility => (rotation.selected() as TallisAbility | null) ?? "smokeKnot";

/** O: turn to the next ability he has */
export const nextAbility = (): boolean => rotation.next();

/** a fresh run: back to Smoke Knot */
export const resetAbilities = (): void => rotation.reset();

/** what an ability costs in MP */
export function abilityMp(id: TallisAbility): number {
  if (id === "smokeKnot") return SMOKE_KNOT.mp;
  if (id === "hamstring") return HAMSTRING.mp;
  return skillValues(id).mp ?? 0;
}

/** an ability's own recharge time, for the HUD */
function abilityCooldown(id: TallisAbility): number {
  if (id === "smokeKnot") return SMOKE_KNOT.cooldown;
  if (id === "hamstring") return HAMSTRING.cooldown;
  return skillValues(id).cooldown ?? 1;
}

/** seconds an ability still waits */
function abilityWait(id: TallisAbility): number {
  switch (id) {
    case "smokeKnot":
      return tallis.knotCd;
    case "hamstring":
      return tallis.hamCd;
    case "t_needles":
      return tallis.needlesCd;
    case "t_markDusk":
      return tallis.markCd;
    case "t_caltrops":
      return tallis.caltropsCd;
  }
}

/** the share of an ability's recharge still to run, 0 when ready */
export const abilityRecharge = (id: TallisAbility): number => Math.min(1, abilityWait(id) / abilityCooldown(id));

/** I: use the selected ability */
export function pressAbility(): boolean {
  const id = selectedAbility();
  if (id === "smokeKnot") return pressSmokeKnot();
  if (id === "hamstring") return pressHamstring();
  return pressSpell(id);
}

/** every ability he knows, for the HUD */
export const knownAbilities = (): TallisAbility[] => ABILITIES.filter(known);

/** recharges run down */
export function tickAbilities(recharge: number): void {
  tallis.knotCd = Math.max(0, tallis.knotCd - recharge);
  tallis.hamCd = Math.max(0, tallis.hamCd - recharge);
  tallis.needlesCd = Math.max(0, tallis.needlesCd - recharge);
  tallis.markCd = Math.max(0, tallis.markCd - recharge);
  tallis.caltropsCd = Math.max(0, tallis.caltropsCd - recharge);
}
