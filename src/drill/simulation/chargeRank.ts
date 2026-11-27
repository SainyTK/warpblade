import { CHARGE_RANK } from "../../constants/growth";
import { progress } from "../../game/state";
import type { DrillModifiers } from "../../types/drill";

export function withChargeRank(modifiers: DrillModifiers): DrillModifiers {
  const rank = progress.build.chargeRank;
  if (!rank) {
    return modifiers;
  }
  return {
    ...modifiers,
    tierDamage: modifiers.tierDamage * (1 + CHARGE_RANK.damage * rank),
    chargeRate: modifiers.chargeRate * (1 + CHARGE_RANK.chargeRate * rank),
  };
}
