import { NUMBER_WORDS, WORD_LIFT } from "../constants/damageNumbers";
import { FEEDBACK_EDGE, NUMBER_INK, NUMBER_INK_QUIET } from "../constants/effectColors";
import { NUMBER_LOOK as L } from "../constants/effectLook";
import { game } from "../game/state";
import { settings } from "../store/settings";
import type { DamageNumber } from "../types/game";
import { scale, WHITE } from "../utils/color";
import { numberFigure } from "../utils/numberFigure";
import { drawFineText } from "./numberText";

/** how much darker the lower rows of a figure are */
const SHADE = 0.78;

/** a hero's own number pops white for a moment, then settles into its ink */
function drawFigure(n: DamageNumber, a: number): void {
  const popping = !n.quiet && n.age < L.pop;
  const ink = n.quiet ? (NUMBER_INK_QUIET[n.tag] ?? NUMBER_INK[n.tag]) : NUMBER_INK[n.tag];
  const cell = n.big ? L.bigCell : L.cell;
  drawFineText(
    numberFigure(n.value),
    n.x,
    n.y,
    popping ? WHITE : ink,
    popping ? ink : scale(ink, SHADE),
    FEEDBACK_EDGE,
    cell,
    a,
  );
}

/** damage numbers rise and fade over the foes; crits are drawn larger and special hits carry their word for a moment.
 * Numbers of a skill's own hits are duller and carry no word, so the hero's own hits read first.
 * With damage numbers off in the options, only the words without a number (EVADE, PERFECT, PARRY) still show. */
export function drawNumbers(): void {
  for (const n of game.numbers) {
    if (n.value && !settings.damageNumbers) continue;
    const ink = NUMBER_INK[n.tag];
    const word = NUMBER_WORDS[n.tag];
    const a = Math.min(1, n.life / L.fade);
    if (!n.value) {
      drawFineText(word, n.x, n.y, ink, scale(ink, SHADE), FEEDBACK_EDGE, L.cell, a);
      continue;
    }
    drawFigure(n, a);
    const wordAlpha = Math.min(a, (L.wordShow - n.age) / L.wordFade);
    if (word && !n.quiet && wordAlpha > 0)
      drawFineText(word, n.x, n.y - WORD_LIFT, ink, scale(ink, SHADE), FEEDBACK_EDGE, L.cell, wordAlpha);
  }
}
