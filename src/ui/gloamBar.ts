import { VEIL } from "../constants/tallis/veil";
import { gloamShare } from "../game/hero/tallis/gloam";
import { tallis } from "../game/hero/tallis/memory";
import { character } from "../game/state";
import { byId } from "./dom";

/** Tallis's Gloam bar under stamina: an ink fill whose rose edge glows while he is Unseen, rose while the Veil drains it,
 *  blinking when a press asked for more than it holds */
const bar = byId("gloamBar");
const fill = byId("gloamFill");
let last = "";

export function updateGloamBar(): void {
  const shown = character.kit === "tallis";
  if (bar.hidden === shown) bar.hidden = !shown;
  if (!shown) return;
  const share = gloamShare();
  const empty = tallis.gloamFlash > 0;
  const key = [Math.round(share * 100), tallis.unseen, tallis.veil, empty, tallis.gloam < VEIL.enter].join();
  if (key === last) return;
  last = key;
  fill.style.width = `${share * 100}%`;
  bar.classList.toggle("unseen", tallis.unseen);
  bar.classList.toggle("veil", tallis.veil);
  bar.classList.toggle("empty", empty);
}
