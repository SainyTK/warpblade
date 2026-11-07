import { GRIT } from "../constants/hulda/grit";
import { gritShare, maxGrit, plates } from "../game/hero/hulda/grit";
import { hulda } from "../game/hero/hulda/memory";
import { character } from "../game/state";
import { byId } from "./dom";

/** Hulda's Grit bar under stamina, split into its plates (four, or Iron Hide's five or six): full plates bright, the one
 *  filling dim */
const bar = byId("gritBar");
const fill = byId("gritFill");
const full = byId("gritPlates");
let last = "";

export function updateGritBar(): void {
  const shown = character.kit === "hulda";
  if (bar.hidden === shown) bar.hidden = !shown;
  if (!shown) return;
  const share = gritShare();
  const most = maxGrit();
  const broke = hulda.flinch > 0;
  const key = [Math.round(share * most), most, plates(), broke].join();
  if (key === last) return;
  last = key;
  fill.style.width = `${share * 100}%`;
  full.style.width = `${((plates() * GRIT.plate) / most) * 100}%`;
  bar.style.setProperty("--plate", `${(GRIT.plate / most) * 100}%`);
  bar.classList.toggle("broke", broke);
}
