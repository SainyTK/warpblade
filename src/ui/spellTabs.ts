import { ELEMENTS } from "../constants/combat";
import { selectedElement, spellRecharge } from "../game/hero/spell";
import { game, hero } from "../game/state";
import { byId } from "./dom";

/** The FIRE ICE BOLT tabs: the selected element, each element's recharge, and the flash of a refused cast. */
const tabs = [byId("elFire"), byId("elIce"), byId("elVolt")];
const mpBar = byId("mpBar");
/** the recharge bar moves in this many steps across a tab */
const CHARGE_STEPS = 16;
const lastCharge = tabs.map(() => CHARGE_STEPS);
let lastSelected = -1;
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;
/** the last refused press was for MP, so the MP bar blinks while the flash lasts */
let mpShort = false;
let mpBlinking = false;

/** recharged share of an element in whole steps, CHARGE_STEPS when ready */
const chargeSteps = (i: number): number => CHARGE_STEPS - Math.ceil(spellRecharge(ELEMENTS[i]) * CHARGE_STEPS);

/** restart a one-shot CSS animation class */
function replay(el: HTMLElement, name: string): void {
  el.classList.remove(name);
  void el.offsetWidth;
  el.classList.add(name);
}

/** dim recharging tabs and fill their bars, blink a tab when it is ready, jolt a recharging tab that refused a cast and blink the MP bar when MP was short;
 *  the DOM is touched only when something shown changes */
export function updateSpellTabs(): void {
  if (game.spell !== lastSelected) {
    lastSelected = game.spell;
    tabs.forEach((tab, i) => {
      tab.classList.toggle("on", i === game.spell);
    });
  }
  tabs.forEach((tab, i) => {
    const charge = chargeSteps(i);
    if (charge === lastCharge[i]) return;
    const ready = charge === CHARGE_STEPS;
    tab.classList.toggle("wait", !ready);
    tab.style.setProperty("--charged", String(charge / CHARGE_STEPS));
    if (ready) replay(tab, "ready");
    lastCharge[i] = charge;
  });
  if (hero.castDenied > lastDenied) {
    mpShort = hero.spellCd[selectedElement()] <= 0;
    if (!mpShort) replay(tabs[game.spell], "deny");
  }
  lastDenied = hero.castDenied;
  const blink = mpShort && hero.castDenied > 0;
  if (blink === mpBlinking) return;
  mpBlinking = blink;
  mpBar.classList.toggle("empty", blink);
}
