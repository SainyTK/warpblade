import { JADE } from "../../constants/characters/sable/look";
import { ELEMENTS } from "../../constants/combat";
import { ELEMENT_COLOR } from "../../constants/palette";
import { RITES } from "../../constants/ysra/rites";
import { selectedRite } from "../../game/hero/ysra/pyre/riteChoice";
import { character, game } from "../../game/state";
import type { Color } from "../../types/color";
import type { Element } from "../../types/spell";
import type { RiteId } from "../../types/ysra/pyre";
import { hex } from "../../utils/color";

/** what the cast and cycle buttons show: Kael's selected element, Ysra's selected rite, or nothing to select for Sable */
export type TouchSelection = { kit: "kael"; element: Element } | { kit: "ysra"; rite: RiteId } | { kit: "sable" };

export function touchSelection(): TouchSelection {
  if (character.kit === "sable") return { kit: "sable" };
  if (character.kit === "ysra") return { kit: "ysra", rite: (selectedRite() ?? RITES[0]).id };
  return { kit: "kael", element: ELEMENTS[game.spell] };
}

/** a key that changes whenever the selection does */
export function selectionKey(s: TouchSelection): string {
  if (s.kit === "sable") return "sable";
  return s.kit === "ysra" ? `ysra:${s.rite}` : `kael:${s.element}`;
}

/** the rim colour of buttons without an accent of their own */
export function selectionTint(s: TouchSelection): Color {
  if (s.kit === "kael") return ELEMENT_COLOR[s.element];
  if (s.kit === "sable") return JADE[4];
  const rite = RITES.find((r) => r.id === s.rite) ?? RITES[0];
  return hex(rite.tint);
}
