import { RITES } from "../constants/ysra/rites";
import { heat, heatFlash } from "../game/hero/ysra/pyre/heat";
import { knowsRite, riteCost, selectedRite } from "../game/hero/ysra/pyre/riteChoice";
import { character } from "../game/state";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/** Ysra's rite tabs in place of the element tabs: the selected rite, and a bar that fills as Heat comes to cover each */
const box = byId("riteTabs");
const tabs = RITES.map((rite) => {
  const el = document.createElement("span");
  el.className = "el rite";
  el.textContent = rite.tab;
  el.style.setProperty("--tint", rite.tint);
  box.append(el);
  return { rite, el, tab: createRechargeTab(el) };
});
/** the Heat flash time last seen; a rise means a new refused press */
let lastFlash = 0;

export function updateRiteTabs(): void {
  const shown = character.kit === "ysra";
  if (box.hidden === shown) box.hidden = !shown;
  if (!shown) return;
  const selected = selectedRite();
  for (const { rite, el, tab } of tabs) {
    const known = knowsRite(rite);
    if (el.hidden === known) el.hidden = !known;
    el.classList.toggle("on", rite === selected);
    tab.update(Math.max(0, 1 - heat() / riteCost(rite)));
  }
  const flash = heatFlash();
  if (flash > lastFlash) tabs.find((t) => t.rite === selected)?.tab.jolt();
  lastFlash = flash;
}
