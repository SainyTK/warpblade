import { selectedSlot } from "../../game/hero/abilityBar";
import { heroCode, kit } from "../../game/hero/kits";
import { character } from "../../game/state";
import { drillFighter, SPELL_ORDER, SPELLS, usesKaelDrill } from "../../kaelDrill";
import type { Color } from "../../types/color";

/** what the cast and cycle buttons show: the hero, their selected ability on I and the abilities they know */
export interface TouchSelection {
  hero: string;
  ability: string;
  known: readonly string[];
}

const drillIcon = (kind: (typeof SPELL_ORDER)[number]): string => (kind === "thunder" ? "volt" : kind);

export function touchSelection(drill = usesKaelDrill()): TouchSelection {
  if (drill) {
    const kind = drillFighter()?.spellBook.selected ?? SPELL_ORDER[0];
    return { hero: character.id, ability: drillIcon(kind), known: SPELL_ORDER.map(drillIcon) };
  }
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
export const selectionTint = (s: TouchSelection): Color =>
  usesKaelDrill()
    ? SPELLS[drillFighter()?.spellBook.selected ?? SPELL_ORDER[0]].color
    : heroCode().touch.tint(s.ability);
