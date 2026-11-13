import { BECKON, KINDLE } from "../../../constants/wenna/abilities";
import type { AbilitySlot } from "../../../types/moveset";
import { skillEvolved, skillLevel, skillValues } from "../../skills/query";
import { hero } from "../../state";
import { beckonReach, castBeckon } from "./beckon";
import { castKindle, kindleMp, kindleTarget } from "./kindle";
import { castLight, lightAffordable, lightCost } from "./light";
import { wenna } from "./memory";
import { castSpell, spellMp, spellWait, type WennaSpell } from "./spells/castSpell";

/** Light, Kindle and Beckon: her abilities from the start */
const BASE: readonly AbilitySlot[] = [
  {
    id: "light",
    label: "LIGHT",
    tint: "var(--wax)",
    known: () => true,
    wait: () => 0,
    full: () => 0.01,
    affordable: lightAffordable,
    cast: castLight,
    cost: () => `${Math.ceil(lightCost())} WX`,
  },
  {
    id: "kindle",
    label: "KINDLE",
    known: () => true,
    wait: () => wenna.kindleCd,
    full: () => KINDLE.cooldown,
    affordable: () => hero.mp >= kindleMp(false) && !!kindleTarget(),
    cast: castKindle,
  },
  {
    id: "beckon",
    label: "BECKON",
    known: () => true,
    wait: () => wenna.beckonCd,
    full: () => BECKON.cooldown,
    affordable: () => hero.mp >= BECKON.mp && beckonReach(),
    cast: () => castBeckon(),
  },
];

/** her spell skills on I and their tab labels */
const SPELLS: readonly { id: WennaSpell; label: string }[] = [
  { id: "w_lampVolley", label: "VOLLEY" },
  { id: "w_waxPool", label: "POOL" },
  { id: "w_effigy", label: "EFFIGY" },
];

/** her abilities on I in the order O turns through them: Light, Kindle and Beckon, then the spell skills she holds */
export const WENNA_SLOTS: readonly AbilitySlot[] = [
  ...BASE,
  ...SPELLS.map(
    ({ id, label }): AbilitySlot => ({
      id,
      label,
      known: () => skillLevel(id) > 0,
      wait: () => spellWait(id),
      full: () => Math.max(0.01, skillValues(id).cooldown ?? 1),
      affordable: () => hero.mp >= spellMp(id),
      cast: () => castSpell(id),
      evolved: () => skillEvolved(id),
    }),
  ),
];

/** recharges run down */
export function tickAbilities(recharge: number): void {
  wenna.kindleCd = Math.max(0, wenna.kindleCd - recharge);
  wenna.beckonCd = Math.max(0, wenna.beckonCd - recharge);
  wenna.volleyCd = Math.max(0, wenna.volleyCd - recharge);
  wenna.poolCd = Math.max(0, wenna.poolCd - recharge);
  wenna.effigyCd = Math.max(0, wenna.effigyCd - recharge);
}
