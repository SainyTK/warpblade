import { RITES } from "../../../constants/ysra/rites";
import type { AbilitySlot } from "../../../types/moveset";
import type { RiteDef } from "../../../types/ysra/pyre";
import { skillEvolved } from "../../skills/query";
import { castRite, riteAffordable } from "./pyre/pyre";
import { knowsRite, riteCost } from "./pyre/riteCost";

/** a rite: paid with Heat, which its tab shows; it waits on nothing but Heat */
const riteSlot = (r: RiteDef): AbilitySlot => ({
  id: r.id,
  label: r.tab,
  tint: r.tint,
  known: () => knowsRite(r),
  wait: () => 0,
  full: () => 1,
  affordable: () => riteAffordable(r.id),
  cast: (wide) => castRite(r.id, wide),
  evolved: () => !!r.skill && skillEvolved(r.skill),
  cost: () => `${Math.round(riteCost(r))}${r.id === "overheat" ? "+" : ""} HT`,
});

/** Ysra's abilities on I in the order O turns through them: her rites */
export const YSRA_SLOTS: readonly AbilitySlot[] = RITES.map(riteSlot);
