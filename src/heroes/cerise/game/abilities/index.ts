import { rechargeStep } from "../../../../game/build/recharge";
import { skillEvolved, skillLevel } from "../../../../game/skills/query";
import { hero } from "../../../../game/state";
import type { AbilitySlot } from "../../../../types/moveset";
import {
  ABILITY_COLOR,
  ABILITY_LABEL,
  ABILITY_SKILL,
  BASE_RECHARGE,
  CERISE_ABILITIES,
} from "../../constants/abilities";
import { FLURRY_CLIP, LINE_CLIP } from "../../constants/clips/abilities";
import type { CeriseAbility } from "../../types/ability";
import { cerise } from "../state";
import { beginCast, castCost, payAbility } from "./cast";
import { startFlurry } from "./flurry";
import { castSpell, spellRecharge } from "./spells";

/** she has an ability when it is a base one or its spell skill is held */
export const knowsAbility = (a: CeriseAbility): boolean =>
  a === "flurry" || a === "line" || skillLevel(ABILITY_SKILL[a]) > 0;

const evolved = (a: CeriseAbility): boolean => a !== "flurry" && a !== "line" && skillEvolved(ABILITY_SKILL[a]);

/** I on `a`: the base abilities start their own states, the spells go through their skills */
function cast(a: CeriseAbility, wide: boolean): boolean {
  if (a === "flurry") {
    if (!beginCast(a, wide, { state: "flurry", skipTo: FLURRY_CLIP.hit - 0.02 }, BASE_RECHARGE.flurry)) return false;
    startFlurry();
    return true;
  }
  if (a === "line") return beginCast(a, wide, { state: "lineCast", skipTo: LINE_CLIP.hit - 0.02 }, BASE_RECHARGE.line);
  return castSpell(a, wide, spellRecharge(a));
}

/** Cerise's abilities on I, in the order O turns through them: Flurry and Rose Line, then the spells she learns */
export const CERISE_SLOTS: readonly AbilitySlot[] = CERISE_ABILITIES.map((a) => ({
  id: a,
  label: ABILITY_LABEL[a],
  tint: `#${ABILITY_COLOR[a].toString(16).padStart(6, "0")}`,
  known: () => knowsAbility(a),
  wait: () => cerise.abilityCd[a],
  full: () => Math.max(0.01, cerise.abilityFull[a]),
  affordable: () => hero.mp >= castCost(a, false),
  cast: (wide: boolean) => cast(a, wide),
  evolved: () => evolved(a),
}));

/** every ability's wait runs down with the shared recharge step */
export function spendForInfusion(id: string): boolean {
  const ability = CERISE_ABILITIES.find((a) => a === id);
  if (!ability) return false;
  const recharge = ability === "flurry" || ability === "line" ? BASE_RECHARGE[ability] : spellRecharge(ability);
  payAbility(ability, false, recharge);
  return true;
}

export function rechargeAbilities(dt: number): void {
  const step = rechargeStep(dt);
  for (const a of CERISE_ABILITIES) cerise.abilityCd[a] = Math.max(0, cerise.abilityCd[a] - step);
}
