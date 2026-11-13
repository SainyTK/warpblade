import { BOOM, STEADY_HAND, THUNDER_SKIN } from "../../../constants/jory/moves";
import type { JoryAbility } from "../../../types/jory";
import type { AbilitySlot } from "../../../types/moveset";
import { skillEvolved, skillLevel, skillValues } from "../../skills/query";
import { hero } from "../../state";
import { boomCost } from "./boom";
import { castAbility } from "./cast";
import { jory } from "./memory";

/** his abilities on I in the order O turns through them: Boom, Steady Hand and Thunder Skin from the start, then his spells */
const ABILITIES: readonly JoryAbility[] = ["boom", "steadyHand", "thunderSkin", "j_gong", "j_tuning", "j_echo"];

/** his own three, which he has from the start */
const own = (id: JoryAbility): boolean => id === "boom" || id === "steadyHand" || id === "thunderSkin";

/** what an ability costs in MP (Boom costs stamina), and Thunder Skin's wide form more */
function abilityMp(id: JoryAbility, wide = false): number {
  if (id === "boom") return 0;
  if (id === "steadyHand") return STEADY_HAND.mp;
  if (id === "thunderSkin") return wide ? THUNDER_SKIN.wideMp : THUNDER_SKIN.mp;
  return skillValues(id).mp ?? 0;
}

/** an ability's own recharge time */
function abilityCooldown(id: JoryAbility): number {
  if (id === "boom") return BOOM.wait;
  if (id === "steadyHand") return STEADY_HAND.cooldown;
  if (id === "thunderSkin") return THUNDER_SKIN.cooldown;
  return skillValues(id).cooldown ?? 1;
}

const WAITS = {
  boom: "boomWait",
  steadyHand: "steadyCd",
  thunderSkin: "thunderCd",
  j_gong: "gongCd",
  j_tuning: "tuningCd",
  j_echo: "echoCd",
} as const satisfies Record<JoryAbility, keyof typeof jory>;

/** each ability's HUD tab label */
const LABELS: Readonly<Record<JoryAbility, string>> = {
  boom: "BOOM",
  steadyHand: "STEADY",
  thunderSkin: "THUNDER",
  j_gong: "GONG",
  j_tuning: "TUNING",
  j_echo: "ECHO",
};

/** the hero can pay for an ability now: stamina for Boom, MP for the rest */
const affordable = (id: JoryAbility): boolean =>
  id === "boom" ? hero.stamina >= boomCost() : hero.mp >= abilityMp(id);

/** I held on Thunder Skin with MP for its wide form: a wave each way */
const wideNow = (id: JoryAbility, wide: boolean): boolean =>
  wide && id === "thunderSkin" && hero.mp >= abilityMp(id, true);

/** pay for an ability and start its recharge, then cast it */
function cast(id: JoryAbility, wide: boolean): boolean {
  const both = wideNow(id, wide);
  if (!castAbility(id, both)) return false;
  hero.mp -= abilityMp(id, both);
  jory[WAITS[id]] = abilityCooldown(id);
  return true;
}

/** Jory's abilities on I: Boom (stamina), Steady Hand and Thunder Skin (MP), then the spell skills he holds */
export const JORY_SLOTS: readonly AbilitySlot[] = ABILITIES.map((id) => ({
  id,
  label: LABELS[id],
  known: () => own(id) || skillLevel(id) > 0,
  wait: () => jory[WAITS[id]],
  full: () => Math.max(0.01, abilityCooldown(id)),
  affordable: () => affordable(id),
  cast: (wide: boolean) => cast(id, wide),
  evolved: own(id) ? undefined : () => skillEvolved(id),
  cost: id === "boom" ? () => `${boomCost()} ST` : undefined,
}));

/** recharges run down */
export function tickAbilities(recharge: number): void {
  for (const id of ABILITIES) jory[WAITS[id]] = Math.max(0, jory[WAITS[id]] - recharge);
}
