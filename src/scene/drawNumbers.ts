import { NUMBER_WORDS, WORD_LIFT } from "../constants/damageNumbers";
import { drawText } from "../engine/font";
import { game } from "../game/state";
import { settings } from "../store/settings";
import type { CueWord, DamageTag } from "../types/game";
import { hex } from "../utils/color";
import { numberFigure } from "../utils/numberFigure";

const OUTLINE = hex("#120d1c");
/** the color of each kind of number */
const INK: Record<DamageTag | CueWord, number> = {
  normal: hex("#f4f0ff"),
  crit: hex("#ffe26b"),
  back: hex("#ff9a4a"),
  air: hex("#7fe3ff"),
  burn: hex("#c98a3a"),
  block: hex("#8a84a8"),
  break: hex("#ff6a5a"),
  shatter: hex("#cbf1ff"),
  evade: hex("#b673e8"),
  perfect: hex("#a8ecff"),
  parry: hex("#ffd27a"),
  broken: hex("#ff6a5a"),
};
/** a relic's numbers in duller inks of the same hues, drawn solid so they stay crisp */
const QUIET: Partial<Record<DamageTag | CueWord, number>> = {
  normal: hex("#a29cc4"),
  crit: hex("#c9a74e"),
  air: hex("#5fa8c0"),
};
const FADE = 0.15;

/** damage numbers rise and fade over the foes; crits are drawn double size and special hits carry their word.
 * A relic's numbers are duller and carry no word, so the hero's own hits read first.
 * With damage numbers off in the options, only the words without a number (EVADE, PERFECT, PARRY) still show. */
export function drawNumbers(): void {
  for (const n of game.numbers) {
    if (n.value && !settings.damageNumbers) continue;
    const ink = INK[n.tag];
    const word = NUMBER_WORDS[n.tag];
    const a = Math.min(1, n.life / FADE);
    if (!n.value) {
      drawText(word, n.x, n.y, ink, OUTLINE, 1, a);
      continue;
    }
    const c = n.quiet ? (QUIET[n.tag] ?? ink) : ink;
    drawText(numberFigure(n.value), n.x, n.y, c, OUTLINE, n.big ? 2 : 1, a);
    if (word && !n.quiet) drawText(word, n.x, n.y - WORD_LIFT, ink, OUTLINE, 1, a);
  }
}
