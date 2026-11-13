import { selectedSlot } from "../game/hero/abilityBar";
import { kit } from "../game/hero/kits";
import { character, hero } from "../game/state";
import type { AbilitySlot } from "../types/moveset";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/**
 * The ability tabs every hero shares, one per ability on I from the kit's list: the selected one lit (with its cost when
 * it is not MP), each one's recharge, a struck-through tab while it cannot be paid for, a gold top edge once its spell
 * skill evolves, and the jolt of a refused press. The row is rebuilt when the hero changes.
 */
const box = byId("abilityTabs");
let built: { kit: string; tabs: { slot: AbilitySlot; el: HTMLElement; tab: ReturnType<typeof createRechargeTab> }[] } =
  {
    kit: "",
    tabs: [],
  };
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;

function build(): void {
  box.replaceChildren();
  built = {
    kit: character.kit,
    tabs: kit().abilities.map((slot) => {
      const el = document.createElement("span");
      el.className = "el ability";
      el.textContent = slot.label;
      el.style.setProperty("--tint", slot.tint ?? character.accent);
      box.append(el);
      return { slot, el, tab: createRechargeTab(el) };
    }),
  };
}

export function updateAbilityTabs(): void {
  if (built.kit !== character.kit) build();
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
    const cost = on ? slot.cost?.() : undefined;
    const text = cost ? `${slot.label} ${cost}` : slot.label;
    if (el.textContent !== text) el.textContent = text;
    tab.update(Math.min(1, slot.wait() / slot.full()));
  }
  const denied = Math.max(hero.denied.cast, hero.denied.mp, hero.denied.hp);
  if (denied > lastDenied) built.tabs.find((t) => t.slot === selected)?.tab.jolt();
  lastDenied = denied;
}
