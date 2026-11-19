import { progress } from "../game/state";
import { byId } from "./dom";
import { allSlots, buildKey, heldSlots } from "./skills/buildSlots";

/** the skills and charms the hero holds, as small icons with their levels under the bars */
const strip = byId("buildStrip");
let last = "";

/** an unseen strip with every slot a run can fill under the real one, so the HUD keeps the room of a full build */
byId("buildReserve").replaceChildren(...allSlots());

export function updateBuildStrip(): void {
  const key = buildKey(progress.build);
  if (key === last) return;
  last = key;
  strip.replaceChildren(...heldSlots(progress.build));
  strip.hidden = !strip.childElementCount;
}
