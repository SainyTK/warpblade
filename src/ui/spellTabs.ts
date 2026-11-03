import { ELEMENTS } from "../constants/combat";
import { spellRecharge } from "../game/hero/spell";
import { game, hero } from "../game/state";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/** The FIRE ICE BOLT tabs: the selected element, each element's recharge, and the jolt of a refused cast. */
const elements = [byId("elFire"), byId("elIce"), byId("elVolt")];
const tabs = elements.map(createRechargeTab);
let lastSelected = -1;
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;

export function updateSpellTabs(): void {
  if (game.spell !== lastSelected) {
    lastSelected = game.spell;
    elements.forEach((el, i) => {
      el.classList.toggle("on", i === game.spell);
    });
  }
  tabs.forEach((tab, i) => {
    tab.update(spellRecharge(ELEMENTS[i]));
  });
  if (hero.denied.cast > lastDenied) tabs[game.spell].jolt();
  lastDenied = hero.denied.cast;
}
