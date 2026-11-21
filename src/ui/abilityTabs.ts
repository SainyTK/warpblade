import { drillSession, usesDrill } from "../drill";
import { selectedSlot } from "../game/hero/abilityBar";
import { kit } from "../game/hero/kits";
import { character, hero } from "../game/state";
import type { DrillSpell, Session } from "../types/drill";
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

let drillTabs: Array<{ spell: DrillSpell; el: HTMLElement; tab: ReturnType<typeof createRechargeTab> }> = [];

function updateDrillTabs(session: Session): void {
  const { profile, fighter } = session;
  if (built.hero !== `drill:${character.id}`) {
    const elements = profile.spells.map((spell) => tabEl(spell.name.toUpperCase()));
    reserve.replaceChildren(...elements.map((el) => el.cloneNode(true)));
    box.replaceChildren(...elements);
    drillTabs = profile.spells.map((spell, i) => {
      const el = elements[i];
      el.style.setProperty("--tint", `#${spell.color.toString(16).padStart(6, "0")}`);
      return { spell, el, tab: createRechargeTab(el) };
    });
    built = { hero: `drill:${character.id}`, tabs: [] };
  }
  const { selected, preparation } = fighter.spellBook;
  const known = profile.known();
  for (const { spell, el, tab } of drillTabs) {
    const hidden = !known.includes(spell);
    if (el.hidden !== hidden) {
      el.hidden = hidden;
    }
    const on = spell === selected;
    el.classList.toggle("on", on);
    tab.update(on && preparation && preparation.duration > 0 ? preparation.remaining / preparation.duration : 0);
  }
}

export function updateAbilityTabs(): void {
  const session = drillSession();
  if (session && usesDrill()) {
    updateDrillTabs(session);
    return;
  }
  if (built.hero !== character.id) build();
  const selected = selectedSlot();
  for (const { slot, el, tab } of built.tabs) {
    const known = slot.known();
    if (el.hidden === known) el.hidden = !known;
    if (!known) continue;
    const on = slot === selected;
    el.classList.toggle("on", on);
    const evolved = slot.evolved?.() ?? false;
    if (el.classList.contains("evolved") !== evolved) el.classList.toggle("evolved", evolved);
    el.classList.toggle("poor", !slot.affordable());
    if (el.textContent !== slot.label) el.textContent = slot.label;
    tab.update(Math.min(1, slot.wait() / slot.full()));
  }
  const denied = Math.max(hero.denied.cast, hero.denied.mp);
  if (denied > lastDenied) built.tabs.find((t) => t.slot === selected)?.tab.jolt();
  lastDenied = denied;
}
