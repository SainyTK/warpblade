import { selectedSlot } from "../../game/hero/abilityBar";
import { heroCode, kit } from "../../game/hero/kits";
import { character } from "../../game/state";
import type { Color } from "../../types/color";

/** what the cast and cycle buttons show: the hero, their selected ability on I and the abilities they know */
export interface TouchSelection {
  hero: string;
  ability: string;
  known: readonly string[];
}

export function touchSelection(): TouchSelection {
  return {
    hero: character.id,
    ability: selectedSlot()?.id ?? "",
    known: kit()
      .abilities.filter((s) => s.known())
      .map((s) => s.id),
  };
}

/** a key that changes whenever the selection does */
export const selectionKey = (s: TouchSelection): string => `${s.hero}:${s.ability}:${s.known.join()}`;

/** the rim colour of buttons without an accent of their own: the hero's colour for the selected ability */
export const selectionTint = (s: TouchSelection): Color => heroCode().touch.tint(s.ability);
