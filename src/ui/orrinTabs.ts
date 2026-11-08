import { abilityRecharge, knownAbilities, selectedAbility } from "../game/hero/orrin/abilities";
import { skillEvolved } from "../game/skills/query";
import { character, hero } from "../game/state";
import type { OrrinAbility } from "../types/orrin";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/** each ability's tab label */
const LABELS: Readonly<Record<OrrinAbility, string>> = {
  whirlwall: "WHIRL",
  anchorPin: "PIN",
  o_chainfence: "FENCE",
  o_tether: "TETHER",
  o_anchorfall: "ANCHOR",
};

/** Orrin's ability tabs in place of the element tabs: the one I uses now, each one's recharge, a gold top edge once a
 *  spell skill evolves, and the jolt of a refused press */
const box = byId("orrinTabs");
const tabs = (Object.keys(LABELS) as OrrinAbility[]).map((id) => {
  const el = document.createElement("span");
  el.className = "el rite";
  el.id = `orrin-${id}`;
  el.textContent = LABELS[id];
  el.style.setProperty("--tint", "var(--chain-brass)");
  box.append(el);
  return { id, el, tab: createRechargeTab(el) };
});
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;

export function updateOrrinTabs(): void {
  const shown = character.kit === "orrin";
  if (box.hidden === shown) box.hidden = !shown;
  if (!shown) return;
  const known = knownAbilities();
  const selected = selectedAbility();
  for (const { id, el, tab } of tabs) {
    const has = known.includes(id);
    if (el.hidden === has) el.hidden = !has;
    el.classList.toggle("on", id === selected);
    el.classList.toggle("evolved", id.startsWith("o_") && skillEvolved(id));
    tab.update(abilityRecharge(id));
  }
  const denied = Math.max(hero.denied.cast, hero.denied.mp);
  if (denied > lastDenied) tabs.find((t) => t.id === selected)?.tab.jolt();
  lastDenied = denied;
}
