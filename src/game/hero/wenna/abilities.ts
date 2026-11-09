import { BECKON, KINDLE } from "../../../constants/wenna/abilities";
import type { WennaAbility } from "../../../types/wenna";
import { skillLevel, skillValues } from "../../skills/query";
import { createRotation } from "../../skills/rotation";
import { pressBeckon } from "./beckon";
import { pressKindle } from "./kindle";
import { wenna } from "./memory";
import { pressSpell, spellWait } from "./spells/castSpell";

/** her abilities on I in the order O turns through them: Kindle and Beckon from the start, then her spells */
export const ABILITIES: readonly WennaAbility[] = ["kindle", "beckon", "w_lampVolley", "w_waxPool", "w_effigy"];

/** an ability she has now: her own two always, a spell skill once held */
const known = (id: WennaAbility): boolean => id === "kindle" || id === "beckon" || skillLevel(id) > 0;

const rotation = createRotation(ABILITIES, (id) => known(id as WennaAbility));

/** the ability I uses now */
export const selectedAbility = (): WennaAbility => (rotation.selected() as WennaAbility | null) ?? "kindle";

/** O: turn to the next ability she has */
export const nextAbility = (): boolean => rotation.next();

/** a fresh run: back to Kindle */
export const resetAbilities = (): void => rotation.reset();

/** what an ability costs in MP */
export function abilityMp(id: WennaAbility): number {
  if (id === "kindle") return KINDLE.mp;
  if (id === "beckon") return BECKON.mp;
  return skillValues(id).mp ?? 0;
}

/** an ability's own recharge time, for the HUD */
function abilityCooldown(id: WennaAbility): number {
  if (id === "kindle") return KINDLE.cooldown;
  if (id === "beckon") return BECKON.cooldown;
  return skillValues(id).cooldown ?? 1;
}

/** seconds an ability still waits */
function abilityWait(id: WennaAbility): number {
  if (id === "kindle") return wenna.kindleCd;
  if (id === "beckon") return wenna.beckonCd;
  return spellWait(id);
}

/** the share of an ability's recharge still to run, 0 when ready */
export const abilityRecharge = (id: WennaAbility): number => Math.min(1, abilityWait(id) / abilityCooldown(id));

/** I: use the selected ability */
export function pressAbility(): boolean {
  const id = selectedAbility();
  if (id === "kindle") return pressKindle();
  if (id === "beckon") return pressBeckon();
  return pressSpell(id);
}

/** every ability she knows, for the HUD */
export const knownAbilities = (): WennaAbility[] => ABILITIES.filter(known);

/** recharges run down */
export function tickAbilities(recharge: number): void {
  wenna.kindleCd = Math.max(0, wenna.kindleCd - recharge);
  wenna.beckonCd = Math.max(0, wenna.beckonCd - recharge);
  wenna.volleyCd = Math.max(0, wenna.volleyCd - recharge);
  wenna.poolCd = Math.max(0, wenna.poolCd - recharge);
  wenna.effigyCd = Math.max(0, wenna.effigyCd - recharge);
}
