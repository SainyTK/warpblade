import { LOOK_ELEMENT } from "../constants/audio";
import type { ElementId } from "../types/campaign";
import type { DrillSpell } from "../types/drill";

export const spellElement = (spell: Pick<DrillSpell, "element" | "look">): ElementId =>
  spell.element ?? LOOK_ELEMENT[spell.look];
