import { LIGHT } from "../constants/wenna/wax";
import { wenna } from "../game/hero/wenna/memory";
import { waxShare } from "../game/hero/wenna/wax";
import { wickCap } from "../game/hero/wenna/wicks";
import { character } from "../game/state";
import { byId } from "./dom";

/** Wenna's Wax bar under stamina: a wax fill with a violet edge, dimmer under the cost of a Wick, blinking when short;
 *  her Wicks lit out of her cap after it */
const bar = byId("waxBar");
const fill = byId("waxFill");
const count = byId("wickCount");
let last = "";

export function updateWaxBar(): void {
  const shown = character.kit === "wenna";
  if (bar.hidden === shown) bar.hidden = !shown;
  if (!shown) return;
  const share = waxShare();
  const low = wenna.wax < LIGHT.cost;
  const empty = wenna.waxFlash > 0;
  const wicks = `${wenna.wicks}/${wickCap()}`;
  const key = [Math.round(share * 100), low, empty, wicks].join();
  if (key === last) return;
  last = key;
  fill.style.width = `${share * 100}%`;
  count.textContent = wicks;
  bar.classList.toggle("low", low);
  bar.classList.toggle("empty", empty);
}
