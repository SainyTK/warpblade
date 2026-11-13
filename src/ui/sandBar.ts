import { selectedSlot } from "../game/hero/abilityBar";
import { mirel } from "../game/hero/mirel/memory";
import { sandShare } from "../game/hero/mirel/sand";
import { character, hero } from "../game/state";
import { byId } from "./dom";

/** Mirel's Sand bar under stamina: a sand fill with a teal edge, glowing while her field holds it, blinking when short */
const bar = byId("sandBar");
const fill = byId("sandFill");
let last = "";

export function updateSandBar(): void {
  const shown = character.kit === "mirel";
  if (bar.hidden === shown) bar.hidden = !shown;
  if (!shown) return;
  const share = sandShare();
  const held = !!mirel.field;
  // a refused press of the Stillfield, which Sand pays for
  const empty = hero.denied.mp > 0 && selectedSlot()?.id === "stillfield";
  const key = [Math.round(share * 100), held, empty].join();
  if (key === last) return;
  last = key;
  fill.style.width = `${share * 100}%`;
  bar.classList.toggle("held", held);
  bar.classList.toggle("empty", empty);
}
