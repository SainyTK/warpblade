import { RUST } from "../../constants/characters/hulda/look";
import { JADE } from "../../constants/characters/sable/look";
import { ELEMENTS } from "../../constants/combat";
import { ELEMENT_COLOR } from "../../constants/palette";
import { RITES } from "../../constants/ysra/rites";
import { knowsRite, selectedRite } from "../../game/hero/ysra/pyre/riteChoice";
import { character, game } from "../../game/state";
import type { Color } from "../../types/color";
import type { Element } from "../../types/spell";
import type { RiteId } from "../../types/ysra/pyre";
import { hex } from "../../utils/color";

/** what the cast and cycle buttons show: Kael's selected element, Ysra's selected rite, or nothing to select for Sable
 *  and Hulda */
export type TouchSelection =
  | { kit: "kael"; element: Element }
  | { kit: "ysra"; rite: RiteId; known: string }
  | { kit: "sable" }
  | { kit: "hulda" };

export function touchSelection(): TouchSelection {
  if (character.kit === "sable") return { kit: "sable" };
  if (character.kit === "hulda") return { kit: "hulda" };
  if (character.kit === "ysra")
    return {
      kit: "ysra",
      rite: (selectedRite() ?? RITES[0]).id,
      known: RITES.filter(knowsRite)
        .map((r) => r.id)
        .join(),
    };
  return { kit: "kael", element: ELEMENTS[game.spell] };
}

/** a key that changes whenever the selection does */
export function selectionKey(s: TouchSelection): string {
  if (s.kit === "sable" || s.kit === "hulda") return s.kit;
  return s.kit === "ysra" ? `ysra:${s.rite}:${s.known}` : `kael:${s.element}`;
}

/** the rim colour of buttons without an accent of their own */
export function selectionTint(s: TouchSelection): Color {
  if (s.kit === "kael") return ELEMENT_COLOR[s.element];
  if (s.kit === "sable") return JADE[4];
  if (s.kit === "hulda") return RUST[4];
  const rite = RITES.find((r) => r.id === s.rite) ?? RITES[0];
  return hex(rite.tint);
}
