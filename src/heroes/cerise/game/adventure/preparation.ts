import { cycleAbility, selectedSlot } from "../../../../game/hero/abilityBar";
import { deny } from "../../../../game/hero/deny";
import { isHeld, take } from "../../../../game/input";
import { game, hero } from "../../../../game/state";
import { SPELL_PREPARATION } from "../../../../kaelDrill/spells";
import { sfx } from "../../../../services/audio";
import type { AbilitySlot } from "../../../../types/moveset";
import { spendForInfusion } from "../abilities";
import { infuseRapier } from "./infusion";

let preparation: { slot: AbilitySlot; readyAt: number } | null = null;

export const preparationShare = (): number | null =>
  preparation === null ? null : Math.max(0, preparation.readyAt - game.clock) / SPELL_PREPARATION;

export function resetPreparation(): void {
  preparation = null;
}

export function readPreparation(): void {
  if (take("cycle") && !preparation && cycleAbility()) sfx.pickup();
  if (!take("cast") || hero.state === "hurt") return;
  if (!preparation) {
    const slot = selectedSlot();
    if (slot) {
      preparation = { slot, readyAt: game.clock + SPELL_PREPARATION };
      sfx.pickup();
    }
    return;
  }
  const { slot, readyAt } = preparation;
  if (game.clock < readyAt || !slot.known()) return;
  if (slot.wait() > 0 || !slot.affordable()) {
    deny(slot.wait() > 0 ? "cast" : "mp");
    return;
  }
  if (hero.ground && hero.state === "move") {
    if (!spendForInfusion(slot.id)) return;
    infuseRapier();
    sfx.cast();
  } else if (!slot.cast(isHeld("down"))) {
    return;
  }
  preparation = null;
}
