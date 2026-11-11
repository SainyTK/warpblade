import { abilityRecharge, knownAbilities, selectedAbility } from "../game/hero/jory/abilities";
import { skillEvolved } from "../game/skills/query";
import { character, hero } from "../game/state";
import type { JoryAbility } from "../types/jory";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/** each ability's tab label */
const LABELS: Readonly<Record<JoryAbility, string>> = {
  steadyHand: "STEADY",
  thunderSkin: "THUNDER",
  j_gong: "GONG",
  j_tuning: "TUNING",
  j_echo: "ECHO",
};

/** Jory's ability tabs in place of the element tabs: the one I uses now, each one's recharge, a gold top edge once a
 *  spell skill evolves, and the jolt of a refused press */
const box = byId("joryTabs");
const tabs = (Object.keys(LABELS) as JoryAbility[]).map((id) => {
  const el = document.createElement("span");
  el.className = "el rite";
  el.id = `jory-${id}`;
  el.textContent = LABELS[id];
  el.style.setProperty("--tint", "var(--beat-pale)");
  box.append(el);
  return { id, el, tab: createRechargeTab(el) };
});
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;

export function updateJoryTabs(): void {
  const shown = character.kit === "jory";
  if (box.hidden === shown) box.hidden = !shown;
  if (!shown) return;
  const known = knownAbilities();
  const selected = selectedAbility();
  for (const { id, el, tab } of tabs) {
    const has = known.includes(id);
    if (el.hidden === has) el.hidden = !has;
    el.classList.toggle("on", id === selected);
    el.classList.toggle("evolved", id.startsWith("j_") && skillEvolved(id));
    tab.update(abilityRecharge(id));
  }
  const denied = Math.max(hero.denied.cast, hero.denied.mp);
  if (denied > lastDenied) tabs.find((t) => t.id === selected)?.tab.jolt();
  lastDenied = denied;
}
