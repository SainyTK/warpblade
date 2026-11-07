import type { Discovery, UnlockTarget } from "../../types/unlock";
import { iconUrl } from "../skills/icons/iconImage";
import { slotIconUrl } from "./slotIcon";

/** the icon of a relic, a charm or a slot */
export const targetIconUrl = (t: UnlockTarget): string =>
  t.type === "relic" ? iconUrl(`relic_${t.id}`) : t.type === "charm" ? iconUrl(`charm_${t.id}`) : slotIconUrl(t.slot);

/** the icon of something found: the unlock's, or the evolution's for a recipe */
export const discoveryIconUrl = (d: Discovery): string =>
  d.type === "unlock" ? targetIconUrl(d.unlock.target) : iconUrl(`relic_${d.relic}_evo`);

/** a 16 by 16 icon image, scaled by its CSS */
export function iconImage(url: string, cls = ""): HTMLImageElement {
  const img = document.createElement("img");
  img.className = cls;
  img.src = url;
  img.alt = "";
  img.width = 16;
  img.height = 16;
  return img;
}
