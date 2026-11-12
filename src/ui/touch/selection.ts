import { RUST } from "../../constants/characters/hulda/look";
import { HOUR_RAMP } from "../../constants/characters/mirel/look";
import { BRASS } from "../../constants/characters/orrin/look";
import { JADE } from "../../constants/characters/sable/look";
import { ABILITY_COLOR, PAL } from "../../constants/palette";
import { KAEL_ABILITIES } from "../../constants/spells";
import { RITES } from "../../constants/ysra/rites";
import {
  knownAbilities as brannocKnown,
  selectedAbility as brannocSelected,
} from "../../game/hero/brannoc/abilities";
import { knownAbilities, selectedAbility } from "../../game/hero/hulda/abilities";
import { knownAbilities as joryKnown, selectedAbility as jorySelected } from "../../game/hero/jory/abilities";
import { knownAbilities as mirelKnown, selectedAbility as mirelSelected } from "../../game/hero/mirel/abilities";
import { knownAbilities as orrinKnown, selectedAbility as orrinSelected } from "../../game/hero/orrin/abilities";
import { selectedAbility as kaelAbility, knowsAbility } from "../../game/hero/spell";
import { knownAbilities as tallisKnown, selectedAbility as tallisSelected } from "../../game/hero/tallis/abilities";
import { knownAbilities as wennaKnown, selectedAbility as wennaSelected } from "../../game/hero/wenna/abilities";
import { knowsRite, selectedRite } from "../../game/hero/ysra/pyre/riteChoice";
import { character } from "../../game/state";
import type { BrannocAbility } from "../../types/brannoc";
import type { Color } from "../../types/color";
import type { HuldaAbility } from "../../types/hulda";
import type { JoryAbility } from "../../types/jory";
import type { MirelAbility } from "../../types/mirel";
import type { OrrinAbility } from "../../types/orrin";
import type { KaelAbility } from "../../types/spell";
import type { TallisAbility } from "../../types/tallis";
import type { WennaAbility } from "../../types/wenna";
import type { RiteId } from "../../types/ysra/pyre";
import { hex } from "../../utils/color";

/** what the cast and cycle buttons show: Kael's selected ability among those he holds, Ysra's selected rite, Hulda's,
 *  Orrin's, Mirel's, Wenna's, Tallis's, Jory's and Brannoc's selected ability among those they know, or nothing to select for Sable */
export type TouchSelection =
  | { kit: "kael"; ability: KaelAbility; known: readonly KaelAbility[] }
  | { kit: "ysra"; rite: RiteId; known: string }
  | { kit: "sable" }
  | { kit: "hulda"; ability: HuldaAbility; known: readonly HuldaAbility[] }
  | { kit: "orrin"; ability: OrrinAbility; known: readonly OrrinAbility[] }
  | { kit: "mirel"; ability: MirelAbility; known: readonly MirelAbility[] }
  | { kit: "wenna"; ability: WennaAbility; known: readonly WennaAbility[] }
  | { kit: "tallis"; ability: TallisAbility; known: readonly TallisAbility[] }
  | { kit: "jory"; ability: JoryAbility; known: readonly JoryAbility[] }
  | { kit: "brannoc"; ability: BrannocAbility; known: readonly BrannocAbility[] };

export function touchSelection(): TouchSelection {
  if (character.kit === "sable") return { kit: "sable" };
  if (character.kit === "hulda") return { kit: "hulda", ability: selectedAbility(), known: knownAbilities() };
  if (character.kit === "orrin") return { kit: "orrin", ability: orrinSelected(), known: orrinKnown() };
  if (character.kit === "mirel") return { kit: "mirel", ability: mirelSelected(), known: mirelKnown() };
  if (character.kit === "wenna") return { kit: "wenna", ability: wennaSelected(), known: wennaKnown() };
  if (character.kit === "tallis") return { kit: "tallis", ability: tallisSelected(), known: tallisKnown() };
  if (character.kit === "jory") return { kit: "jory", ability: jorySelected(), known: joryKnown() };
  if (character.kit === "brannoc") return { kit: "brannoc", ability: brannocSelected(), known: brannocKnown() };
  if (character.kit === "ysra")
    return {
      kit: "ysra",
      rite: (selectedRite() ?? RITES[0]).id,
      known: RITES.filter(knowsRite)
        .map((r) => r.id)
        .join(),
    };
  return { kit: "kael", ability: kaelAbility(), known: KAEL_ABILITIES.filter(knowsAbility) };
}

/** a key that changes whenever the selection does */
export function selectionKey(s: TouchSelection): string {
  if (s.kit === "sable") return s.kit;
  if (
    s.kit === "hulda" ||
    s.kit === "orrin" ||
    s.kit === "mirel" ||
    s.kit === "wenna" ||
    s.kit === "tallis" ||
    s.kit === "jory" ||
    s.kit === "brannoc"
  )
    return `${s.kit}:${s.ability}:${s.known.join()}`;
  return s.kit === "ysra" ? `ysra:${s.rite}:${s.known}` : `kael:${s.ability}:${s.known.join()}`;
}

/** the rim colour of buttons without an accent of their own */
export function selectionTint(s: TouchSelection): Color {
  if (s.kit === "kael") return ABILITY_COLOR[s.ability];
  if (s.kit === "sable") return JADE[4];
  if (s.kit === "hulda") return RUST[4];
  if (s.kit === "orrin") return BRASS[4];
  if (s.kit === "mirel") return HOUR_RAMP[4];
  if (s.kit === "wenna") return PAL.wick[4];
  if (s.kit === "tallis") return PAL.gloam[4];
  if (s.kit === "jory") return PAL.beat[4];
  if (s.kit === "brannoc") return PAL.rage[4];
  const rite = RITES.find((r) => r.id === s.rite) ?? RITES[0];
  return hex(rite.tint);
}
