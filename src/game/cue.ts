import type { CueWord } from "../types/game";
import { game } from "./state";

/** a word that pops at a point without a number: an evade, a perfect dodge */
export function cue(x: number, y: number, word: CueWord): void {
  game.numbers.push({ x, y, vy: -40, value: 0, tag: word, big: false, life: 0.8, age: 0 });
}
