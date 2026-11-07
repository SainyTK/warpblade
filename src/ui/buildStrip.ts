import { progress } from "../game/state";
import { byId } from "./dom";
import { buildKey, heldSlots } from "./skills/buildSlots";

/** the relics and charms the hero holds, as small icons with their levels under the bars */
const strip = byId("buildStrip");
let last = "";

export function updateBuildStrip(): void {
  const key = buildKey(progress.build);
  if (key === last) return;
  last = key;
  strip.replaceChildren(...heldSlots(progress.build));
  strip.hidden = !strip.childElementCount;
}
