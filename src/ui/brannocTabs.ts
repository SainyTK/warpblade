import { abilityCost, abilityRecharge, knownAbilities, selectedAbility } from "../game/hero/brannoc/abilities";
import { canSpend } from "../game/hero/brannoc/debt";
import { skillEvolved } from "../game/skills/query";
import { character, hero } from "../game/state";
import type { BrannocAbility } from "../types/brannoc";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/** each ability's tab label */
const LABELS: Readonly<Record<BrannocAbility, string>> = {
  warCry: "CRY",
  redCrescent: "CRESCENT",
  b_geyser: "GEYSER",
  b_axeThrow: "AXE",
  b_pact: "PACT",
};

/** Brannoc's ability tabs in place of the element tabs: the one I uses now, each one's recharge, a dimmed tab while
 *  his HP cannot pay for it, a gold top edge once a spell skill evolves, and the jolt of a refused press */
const box = byId("brannocTabs");
const tabs = (Object.keys(LABELS) as BrannocAbility[]).map((id) => {
  const el = document.createElement("span");
  el.className = "el rite";
  el.id = `brannoc-${id}`;
  el.textContent = LABELS[id];
  el.style.setProperty("--tint", "var(--rage-pale)");
  box.append(el);
  return { id, el, tab: createRechargeTab(el) };
});
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;

export function updateBrannocTabs(): void {
  const shown = character.kit === "brannoc";
  if (box.hidden === shown) box.hidden = !shown;
  if (!shown) return;
  const known = knownAbilities();
  const selected = selectedAbility();
  for (const { id, el, tab } of tabs) {
    const has = known.includes(id);
    if (el.hidden === has) el.hidden = !has;
    el.classList.toggle("on", id === selected);
    el.classList.toggle("evolved", id.startsWith("b_") && skillEvolved(id));
    el.classList.toggle("poor", !canSpend(abilityCost(id)));
    tab.update(abilityRecharge(id));
  }
  const denied = Math.max(hero.denied.cast, hero.denied.hp);
  if (denied > lastDenied) tabs.find((t) => t.id === selected)?.tab.jolt();
  lastDenied = denied;
}
