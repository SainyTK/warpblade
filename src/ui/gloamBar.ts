import { gloamShare } from "../game/hero/tallis/gloam";
import { tallis } from "../game/hero/tallis/memory";
import { character } from "../game/state";
import { byId } from "./dom";

/** Tallis's Gloam bar under stamina: an ink fill whose rose edge glows while he is Unseen, rose while the Veil drains it */
const bar = byId("gloamBar");
const fill = byId("gloamFill");
let last = "";

export function updateGloamBar(): void {
  const shown = character.kit === "tallis";
  if (bar.hidden === shown) bar.hidden = !shown;
  if (!shown) return;
  const share = gloamShare();
  const key = [Math.round(share * 100), tallis.unseen, tallis.veil].join();
  if (key === last) return;
  last = key;
  fill.style.width = `${share * 100}%`;
  bar.classList.toggle("unseen", tallis.unseen);
  bar.classList.toggle("veil", tallis.veil);
}
