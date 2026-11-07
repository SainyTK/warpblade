import { ANCHOR_PIN, WHIRLWALL } from "../../../constants/orrin/abilities";
import type { OrrinAbility } from "../../../types/orrin";
import { skillLevel, skillValues } from "../../skills/query";
import { createRotation } from "../../skills/rotation";
import { pressPin } from "./anchorPin";
import { orrin } from "./memory";
import { pressAnchorFall } from "./spells/anchorFall";
import { pressFence } from "./spells/chainFence";
import { pressTether } from "./spells/tether";
import { pressWhirl } from "./whirlwall";

/** his abilities on I in the order O turns through them: Whirlwall and Anchor Pin from the start, then his spell skills */
export const ABILITIES: readonly OrrinAbility[] = ["whirlwall", "anchorPin", "o_chainfence", "o_tether", "o_anchorfall"];

/** an ability he has now: his own two always, a spell skill once held */
const known = (id: OrrinAbility): boolean => id === "whirlwall" || id === "anchorPin" || skillLevel(id) > 0;

const rotation = createRotation(ABILITIES, (id) => known(id as OrrinAbility));

/** the ability I uses now */
export const selectedAbility = (): OrrinAbility => (rotation.selected() as OrrinAbility | null) ?? "whirlwall";

/** O: turn to the next ability he has */
export const nextAbility = (): boolean => rotation.next();

/** a fresh run: back to Whirlwall */
export const resetAbilities = (): void => rotation.reset();

/** what an ability costs in MP */
export function abilityMp(id: OrrinAbility): number {
  if (id === "whirlwall") return WHIRLWALL.mp;
  if (id === "anchorPin") return ANCHOR_PIN.mp;
  return skillValues(id).mp ?? 0;
}

/** an ability's own recharge time, for the HUD */
function abilityCooldown(id: OrrinAbility): number {
  if (id === "whirlwall") return WHIRLWALL.cooldown;
  if (id === "anchorPin") return ANCHOR_PIN.cooldown;
  return skillValues(id).cooldown ?? 1;
}

/** seconds an ability still waits */
function abilityWait(id: OrrinAbility): number {
  switch (id) {
    case "whirlwall":
      return orrin.whirlCd;
    case "anchorPin":
      return orrin.pinCd;
    case "o_chainfence":
      return orrin.fenceCd;
    case "o_tether":
      return orrin.tetherCd;
    case "o_anchorfall":
      return orrin.anchorCd;
  }
}

/** the share of an ability's recharge still to run, 0 when ready */
export const abilityRecharge = (id: OrrinAbility): number => Math.min(1, abilityWait(id) / abilityCooldown(id));

/** I: use the selected ability */
export function pressAbility(): boolean {
  switch (selectedAbility()) {
    case "anchorPin":
      return pressPin();
    case "o_chainfence":
      return pressFence();
    case "o_tether":
      return pressTether();
    case "o_anchorfall":
      return pressAnchorFall();
    default:
      return pressWhirl();
  }
}

/** every ability he knows, for the HUD */
export const knownAbilities = (): OrrinAbility[] => ABILITIES.filter(known);
