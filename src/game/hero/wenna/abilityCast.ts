import { BECKON, KINDLE, WENNA_SPELL } from "../../../constants/wenna/abilities";
import { hero } from "../../state";
import { setState } from "../actions";
import { wenna } from "./memory";
import { castSpellNow } from "./spells/castSpell";

/** the cast pose of the ability under way: Kindle and Beckon act on the press, a spell on its frame */
export function runAbilityCast(): void {
  const h = hero;
  const dur = h.state === "kindleCast" ? KINDLE.dur : h.state === "beckonCast" ? BECKON.dur : WENNA_SPELL.dur;
  if (h.state === "spellCast" && !h.hitDone && h.st >= WENNA_SPELL.hit) {
    h.hitDone = true;
    castSpellNow(wenna.casting);
  }
  if (h.st >= dur) setState(h.ground ? "idle" : "fall");
}
