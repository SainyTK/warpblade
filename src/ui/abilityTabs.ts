import { selectedSlot } from "../game/hero/abilityBar";
import { kit } from "../game/hero/kits";
import { character, hero } from "../game/state";
import { preparationShare, usesCeriseDrill } from "../heroes";
import { drillFighter, SPELL_ORDER, SPELLS, usesKaelDrill } from "../kaelDrill";
import type { AbilitySlot } from "../types/moveset";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/**
 * The ability tabs every hero shares, one per ability on I from the kit's list: the selected one lit (with its cost when
 * it is not MP), each one's recharge, a struck-through tab while it cannot be paid for, a gold top edge once its spell
 * skill evolves, and the jolt of a refused press. The row is rebuilt when the hero changes.
 */
const box = byId("abilityTabs");
/** an unseen copy of every tab the hero can learn, so the HUD keeps their room before a pick shows them */
const reserve = byId("abilityReserve");
let built: { hero: string; tabs: { slot: AbilitySlot; el: HTMLElement; tab: ReturnType<typeof createRechargeTab> }[] } =
  {
    hero: "",
    tabs: [],
  };
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;

function tabEl(label: string): HTMLElement {
  const el = document.createElement("span");
  el.className = "el ability";
  el.textContent = label;
  return el;
}

function build(): void {
  box.replaceChildren();
  reserve.replaceChildren(...kit().abilities.map((slot) => tabEl(slot.label)));
  built = {
    hero: character.id,
    tabs: kit().abilities.map((slot) => {
      const el = tabEl(slot.label);
      el.style.setProperty("--tint", slot.tint ?? character.accent);
      box.append(el);
      return { slot, el, tab: createRechargeTab(el) };
    }),
  };
}

let drillTabs: Array<{ el: HTMLElement; tab: ReturnType<typeof createRechargeTab> }> = [];

function updateDrillTabs(): void {
  if (built.hero !== "kael-drill") {
    const elements = SPELL_ORDER.map((kind) => tabEl(SPELLS[kind].name.toUpperCase()));
    reserve.replaceChildren(...elements.map((el) => el.cloneNode(true)));
    box.replaceChildren(...elements);
    drillTabs = elements.map((el, i) => {
      el.style.setProperty("--tint", `#${SPELLS[SPELL_ORDER[i]].color.toString(16).padStart(6, "0")}`);
      return { el, tab: createRechargeTab(el) };
    });
    built = { hero: "kael-drill", tabs: [] };
  }
  const book = drillFighter()?.spellBook;
  const preparation = book?.preparation;
  drillTabs.forEach(({ el, tab }, i) => {
    const selected = SPELL_ORDER[i] === (book?.selected ?? SPELL_ORDER[0]);
    el.classList.toggle("on", selected);
    tab.update(selected && preparation && preparation.duration > 0 ? preparation.remaining / preparation.duration : 0);
  });
}

export function updateAbilityTabs(): void {
  if (usesKaelDrill()) {
    updateDrillTabs();
    return;
  }
  if (built.hero !== character.id) build();
  const selected = selectedSlot();
  const prep = usesCeriseDrill() ? preparationShare() : null;
  for (const { slot, el, tab } of built.tabs) {
    const known = slot.known();
    if (el.hidden === known) el.hidden = !known;
    if (!known) continue;
    const on = slot === selected;
    el.classList.toggle("on", on);
    const evolved = slot.evolved?.() ?? false;
    if (el.classList.contains("evolved") !== evolved) el.classList.toggle("evolved", evolved);
    el.classList.toggle("poor", !slot.affordable());
    const preparation = on ? prep : null;
    const label = preparation === null ? slot.label : `${slot.label} ${preparation > 0 ? "PREPARING" : "READY"}`;
    if (el.textContent !== label) el.textContent = label;
    tab.update(preparation ?? Math.min(1, slot.wait() / slot.full()));
  }
  const denied = Math.max(hero.denied.cast, hero.denied.mp);
  if (denied > lastDenied) built.tabs.find((t) => t.slot === selected)?.tab.jolt();
  lastDenied = denied;
}
