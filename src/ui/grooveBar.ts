import { GROOVE } from "../constants/jory/beat";
import { tier } from "../game/hero/jory/beat";
import { flashing } from "../game/hero/jory/draw";
import { jory } from "../game/hero/jory/memory";
import { character } from "../game/state";
import { byId } from "./dom";

/** Jory's Groove bar under stamina: twelve pips in three groups of four, coloured by tier, a lost pip blinking grey, and
 *  a lamp after the bar that flashes on every beat */
const bar = byId("grooveBar");
const track = byId("groovePips");
const lamp = byId("beatLamp");
/** each group of four pips is followed by a gap cell, except the last */
const pips = Array.from({ length: GROOVE.max }, (_, i) => {
  const pip = document.createElement("i");
  track.append(pip);
  if (i % 4 === 3 && i < GROOVE.max - 1) {
    const gap = document.createElement("i");
    gap.className = "gap";
    track.append(gap);
  }
  return pip;
});
let last = "";

export function updateGrooveBar(): void {
  const shown = character.kit === "jory";
  if (bar.hidden === shown) bar.hidden = !shown;
  if (!shown) return;
  const lit = flashing();
  const t = tier();
  const key = [jory.groove, jory.lostFrom, t, lit].join();
  if (key === last) return;
  last = key;
  pips.forEach((pip, i) => {
    pip.classList.toggle("on", i < jory.groove);
    pip.classList.toggle("lost", i >= jory.groove && i < jory.lostFrom);
  });
  for (let k = 1; k <= 4; k++) bar.classList.toggle(`t${k}`, k === t);
  lamp.classList.toggle("on", lit);
}
