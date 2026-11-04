import { drawText } from "../engine/font";
import { game } from "../game/state";
import { settings } from "../store/settings";
import type { CueWord, DamageTag } from "../types/game";
import { hex } from "../utils/color";

const OUTLINE = hex("#120d1c");
/** the color of each kind of number, and the word shown over it */
const STYLE: Record<DamageTag | CueWord, { c: number; word: string }> = {
  normal: { c: hex("#f4f0ff"), word: "" },
  crit: { c: hex("#ffe26b"), word: "CRIT" },
  back: { c: hex("#ff9a4a"), word: "BACK" },
  air: { c: hex("#7fe3ff"), word: "AIR" },
  burn: { c: hex("#c98a3a"), word: "" },
  block: { c: hex("#8a84a8"), word: "BLOCK" },
  break: { c: hex("#ff6a5a"), word: "BREAK" },
  shatter: { c: hex("#cbf1ff"), word: "SHATTER" },
  evade: { c: hex("#b673e8"), word: "EVADE" },
  perfect: { c: hex("#a8ecff"), word: "PERFECT" },
  parry: { c: hex("#ffd27a"), word: "PARRY" },
  broken: { c: hex("#ff6a5a"), word: "GUARD BROKEN" },
};
const FADE = 0.15;

/** damage numbers rise and fade over the foes; crits are drawn double size and special hits carry their word.
 * With damage numbers off in the options, only the words without a number (EVADE, PERFECT, PARRY) still show. */
export function drawNumbers(): void {
  for (const n of game.numbers) {
    if (n.value && !settings.damageNumbers) continue;
    const s = STYLE[n.tag];
    const a = Math.min(1, n.life / FADE);
    if (!n.value) {
      drawText(s.word, n.x, n.y, s.c, OUTLINE, 1, a);
      continue;
    }
    drawText(String(n.value), n.x, n.y, s.c, OUTLINE, n.big ? 2 : 1, a);
    if (s.word) drawText(s.word, n.x, n.y - 7, s.c, OUTLINE, 1, a);
  }
}
