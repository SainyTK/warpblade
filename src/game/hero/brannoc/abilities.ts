import { FRENZY, RED_CRESCENT, WAR_CRY, WIDE_HP } from "../../../constants/brannoc/moves";
import type { BrannocAbility } from "../../../types/brannoc";
import type { AbilitySlot } from "../../../types/moveset";
import { skillEvolved, skillLevel, skillValues } from "../../skills/query";
import { pressCast } from "./cast";
import { canSpend } from "./debt";
import { brannoc } from "./memory";

/** his abilities on I in the order O turns through them: Frenzy, War Cry and Red Crescent from the start, then his spells */
const ABILITIES: readonly BrannocAbility[] = ["frenzy", "warCry", "redCrescent", "b_geyser", "b_axeThrow", "b_pact"];

/** each ability's tab label and the colour its tab lights in when selected */
const TAB: Readonly<Record<BrannocAbility, { label: string; tint: string }>> = {
  frenzy: { label: "FRENZY", tint: "var(--rage-hot)" },
  warCry: { label: "CRY", tint: "var(--rage-pale)" },
  redCrescent: { label: "CRESCENT", tint: "var(--rage)" },
  b_geyser: { label: "GEYSER", tint: "var(--rage)" },
  b_axeThrow: { label: "AXE", tint: "var(--rage-pale)" },
  b_pact: { label: "PACT", tint: "var(--rage-hot)" },
};

/** his own three he always has; a spell skill once held */
const known = (id: BrannocAbility): boolean =>
  id === "frenzy" || id === "warCry" || id === "redCrescent" || skillLevel(id) > 0;

/** War Cry and Red Crescent have a wide form on I held */
const hasWide = (id: BrannocAbility): boolean => id === "warCry" || id === "redCrescent";

/** what an ability costs, as a share of his max HP; the wide form costs more */
export function abilityCost(id: BrannocAbility, wide = false): number {
  if (id === "frenzy") return FRENZY.cost;
  if (id === "warCry") return WAR_CRY.cost * (wide ? WIDE_HP : 1);
  if (id === "redCrescent") return RED_CRESCENT.cost * (wide ? WIDE_HP : 1);
  return skillValues(id).hp ?? 0;
}

/** an ability's own recharge time; Frenzy's runs from the cast through the Frenzy and the wait after it */
function abilityCooldown(id: BrannocAbility): number {
  if (id === "frenzy") return FRENZY.time + FRENZY.wait;
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
} as const satisfies Record<Exclude<BrannocAbility, "frenzy">, keyof typeof brannoc>;

/** seconds an ability still waits; Frenzy waits while it runs and through the wait after it */
function abilityWait(id: BrannocAbility): number {
  if (id !== "frenzy") return brannoc[WAITS[id]];
  return brannoc.frenzyT > 0 ? brannoc.frenzyT + FRENZY.wait : brannoc.frenzyWait;
}

/** start an ability's wait; Frenzy's is its own run and the wait after it */
export function startWait(id: BrannocAbility): void {
  if (id !== "frenzy") brannoc[WAITS[id]] = abilityCooldown(id);
}

/** recharges run down */
export function tickAbilities(recharge: number): void {
  for (const id of Object.keys(WAITS) as (keyof typeof WAITS)[])
    brannoc[WAITS[id]] = Math.max(0, brannoc[WAITS[id]] - recharge);
}

/** his abilities on I for the shared ability bar, each paid in HP, with its HP cost on the selected tab */
export const BRANNOC_SLOTS: readonly AbilitySlot[] = ABILITIES.map((id) => ({
  id,
  label: TAB[id].label,
  tint: TAB[id].tint,
  known: () => known(id),
  wait: () => abilityWait(id),
  full: () => Math.max(0.01, abilityCooldown(id)),
  affordable: () => canSpend(abilityCost(id)),
  // held with HP for the plain form only, the plain form goes
  cast: (wide: boolean) => pressCast(id, wide && hasWide(id) && canSpend(abilityCost(id, true))),
  evolved: () => id.startsWith("b_") && skillEvolved(id),
  cost: () => `${Math.round(abilityCost(id) * 100)}%`,
}));
