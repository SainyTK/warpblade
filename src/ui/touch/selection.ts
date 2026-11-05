import { ELEMENTS } from "../../constants/combat";
import { ELEMENT_COLOR } from "../../constants/palette";
import { RITES } from "../../constants/ysra/rites";
import { selectedRite } from "../../game/hero/ysra/pyre/riteChoice";
import { character, game } from "../../game/state";
import type { Color } from "../../types/color";
import type { Element } from "../../types/spell";
import type { RiteId } from "../../types/ysra/pyre";
import { hex } from "../../utils/color";

/** what the cast and cycle buttons show: Kael's selected element or Ysra's selected rite */
export type TouchSelection = { kit: "kael"; element: Element } | { kit: "ysra"; rite: RiteId };

export function touchSelection(): TouchSelection {
  if (character.kit === "ysra") return { kit: "ysra", rite: (selectedRite() ?? RITES[0]).id };
  return { kit: "kael", element: ELEMENTS[game.spell] };
}

/** a key that changes whenever the selection does */
export const selectionKey = (s: TouchSelection): string => (s.kit === "ysra" ? `ysra:${s.rite}` : `kael:${s.element}`);

/** the rim colour of buttons without an accent of their own */
export function selectionTint(s: TouchSelection): Color {
  if (s.kit === "kael") return ELEMENT_COLOR[s.element];
  const rite = RITES.find((r) => r.id === s.rite) ?? RITES[0];
  return hex(rite.tint);
}
