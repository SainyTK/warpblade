import { abilityRecharge, knownAbilities, selectedAbility } from "../game/hero/mirel/abilities";
import { skillEvolved } from "../game/skills/query";
import { character, hero } from "../game/state";
import type { MirelAbility } from "../types/mirel";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/** each ability's tab label */
const LABELS: Readonly<Record<MirelAbility, string>> = {
  stoppedClock: "STOP",
  secondHand: "HAND",
  m_sundial: "DIAL",
  m_foretell: "FORETELL",
  m_handsweep: "HOUR",
};

/** Mirel's ability tabs in place of the element tabs: the one I uses now, each one's recharge, a gold top edge once a
 *  spell skill evolves, and the jolt of a refused press */
const box = byId("mirelTabs");
const tabs = (Object.keys(LABELS) as MirelAbility[]).map((id) => {
  const el = document.createElement("span");
  el.className = "el rite";
  el.id = `mirel-${id}`;
  el.textContent = LABELS[id];
  el.style.setProperty("--tint", "var(--hour-glint)");
  box.append(el);
  return { id, el, tab: createRechargeTab(el) };
});
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;

export function updateMirelTabs(): void {
  const shown = character.kit === "mirel";
  if (box.hidden === shown) box.hidden = !shown;
  if (!shown) return;
  const known = knownAbilities();
  const selected = selectedAbility();
  for (const { id, el, tab } of tabs) {
    const has = known.includes(id);
    if (el.hidden === has) el.hidden = !has;
    el.classList.toggle("on", id === selected);
    el.classList.toggle("evolved", id.startsWith("m_") && skillEvolved(id));
    tab.update(abilityRecharge(id));
  }
  const denied = Math.max(hero.denied.cast, hero.denied.mp);
  if (denied > lastDenied) tabs.find((t) => t.id === selected)?.tab.jolt();
  lastDenied = denied;
}
