import { RUST } from "../../constants/characters/hulda/look";
import { HOUR_RAMP } from "../../constants/characters/mirel/look";
import { BRASS } from "../../constants/characters/orrin/look";
import { JADE } from "../../constants/characters/sable/look";
import { ABILITY_COLOR, PAL } from "../../constants/palette";
import { RITES } from "../../constants/ysra/rites";
import { selectedSlot } from "../../game/hero/abilityBar";
import { kit } from "../../game/hero/kits";
import { character } from "../../game/state";
import type { Color } from "../../types/color";
import type { KitId } from "../../types/kit";
import type { KaelAbility } from "../../types/spell";
import { hex } from "../../utils/color";

/** what the cast and cycle buttons show: the hero, their selected ability on I and the abilities they know */
export interface TouchSelection {
  kit: KitId;
  ability: string;
  known: readonly string[];
}

export function touchSelection(): TouchSelection {
  return {
    kit: character.kit,
    ability: selectedSlot()?.id ?? "",
    known: kit()
      .abilities.filter((s) => s.known())
      .map((s) => s.id),
  };
}

/** a key that changes whenever the selection does */
export const selectionKey = (s: TouchSelection): string => `${s.kit}:${s.ability}:${s.known.join()}`;

/** each hero's rim colour for buttons without an accent of their own; Kael's and Ysra's follow the selection */
const KIT_TINT: Readonly<Record<Exclude<KitId, "kael" | "ysra">, Color>> = {
  sable: JADE[4],
  hulda: RUST[4],
  orrin: BRASS[4],
  mirel: HOUR_RAMP[4],
  wenna: PAL.wick[4],
  tallis: PAL.gloam[4],
  jory: PAL.beat[4],
  brannoc: PAL.rage[4],
};

/** the rim colour of buttons without an accent of their own */
export function selectionTint(s: TouchSelection): Color {
  if (s.kit === "kael") return ABILITY_COLOR[(s.ability || "lance") as KaelAbility];
  if (s.kit === "ysra") return hex((RITES.find((r) => r.id === s.ability) ?? RITES[0]).tint);
  return KIT_TINT[s.kit];
}
