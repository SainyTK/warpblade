import { KAEL_ABILITIES } from "../constants/spells";
import { abilityEvolved, knowsAbility, selectedAbility, spellRecharge } from "../game/hero/spell";
import { character, hero } from "../game/state";
import type { KaelAbility } from "../types/spell";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/** each ability's tab: its label and the colour it lights in when selected */
const TAB: Readonly<Record<KaelAbility, { label: string; tint: string }>> = {
  lance: { label: "LANCE", tint: "var(--crystal)" },
  burst: { label: "BURST", tint: "var(--mist)" },
  fire: { label: "FIRE", tint: "var(--fire)" },
  ice: { label: "ICE", tint: "var(--ice)" },
  volt: { label: "BOLT", tint: "var(--volt)" },
};

/** Kael's ability tabs: one per ability he has, the selected one lit, each one's recharge, a gold top edge once an
 *  element evolves, and the jolt of a refused cast */
const box = byId("abilityTabs");
const tabs = KAEL_ABILITIES.map((ability) => {
  const el = document.createElement("span");
  el.className = "el ability";
  el.textContent = TAB[ability].label;
  el.style.setProperty("--tint", TAB[ability].tint);
  box.append(el);
  return { ability, el, tab: createRechargeTab(el) };
});
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;

export function updateSpellTabs(): void {
  const shown = character.kit === "kael";
  if (box.hidden === shown) box.hidden = !shown;
  if (!shown) return;
  const selected = selectedAbility();
  for (const { ability, el, tab } of tabs) {
    const known = knowsAbility(ability);
    if (el.hidden === known) el.hidden = !known;
    el.classList.toggle("on", ability === selected);
    const evolved = abilityEvolved(ability);
    if (el.classList.contains("evolved") !== evolved) el.classList.toggle("evolved", evolved);
    tab.update(spellRecharge(ability));
  }
  if (hero.denied.cast > lastDenied) tabs.find((t) => t.ability === selected)?.tab.jolt();
  lastDenied = hero.denied.cast;
}
