import { BELLOW } from "../../../constants/hulda/bellow";
import { TAUNT } from "../../../constants/hulda/taunt";
import type { HuldaAbility } from "../../../types/hulda";
import { skillLevel, skillValues } from "../../skills/query";
import { createRotation } from "../../skills/rotation";
import { pressBellow } from "./bellow";
import { pressChain } from "./ironChain";
import { pressBrace } from "./ironWall";
import { hulda } from "./memory";
import { pressTaunt } from "./taunt";
import { pressStomp } from "./tremorStomp";

/** her abilities on I in the order O turns through them: Bellow and the taunt from the start, then her spell skills */
export const ABILITIES: readonly HuldaAbility[] = ["bellow", "taunt", "h_ironChain", "h_tremorStomp", "h_ironWall"];

/** an ability she has now: her own two always, a spell skill once held */
const known = (id: HuldaAbility): boolean => id === "bellow" || id === "taunt" || skillLevel(id) > 0;

const rotation = createRotation(ABILITIES, (id) => known(id as HuldaAbility));

/** the ability I uses now */
export const selectedAbility = (): HuldaAbility => (rotation.selected() as HuldaAbility | null) ?? "bellow";

/** O: turn to the next ability she has */
export const nextAbility = (): boolean => rotation.next();

/** a fresh run: back to Bellow */
export const resetAbilities = (): void => rotation.reset();

/** what an ability costs in MP */
export function abilityMp(id: HuldaAbility): number {
  if (id === "bellow") return BELLOW.mp;
  if (id === "taunt") return 0;
  return skillValues(id).mp ?? 0;
}

/** an ability's own recharge time, for the HUD */
function abilityCooldown(id: HuldaAbility): number {
  if (id === "bellow") return BELLOW.cooldown;
  if (id === "taunt") return TAUNT.cooldown;
  return skillValues(id).cooldown ?? 1;
}

/** seconds an ability still waits */
function abilityWait(id: HuldaAbility): number {
  switch (id) {
    case "bellow":
      return hulda.bellowCd;
    case "taunt":
      return hulda.tauntCd;
    case "h_ironChain":
      return hulda.chainCd;
    case "h_tremorStomp":
      return hulda.stompCd;
    case "h_ironWall":
      return hulda.wallCd;
  }
}

/** the share of an ability's recharge still to run, 0 when ready */
export const abilityRecharge = (id: HuldaAbility): number => Math.min(1, abilityWait(id) / abilityCooldown(id));

/** I: use the selected ability */
export function pressAbility(): boolean {
  switch (selectedAbility()) {
    case "taunt":
      return pressTaunt();
    case "h_ironChain":
      return pressChain();
    case "h_tremorStomp":
      return pressStomp();
    case "h_ironWall":
      return pressBrace();
    default:
      return pressBellow();
  }
}

/** every ability she knows, for the HUD */
export const knownAbilities = (): HuldaAbility[] => ABILITIES.filter(known);
