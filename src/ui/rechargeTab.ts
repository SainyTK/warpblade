/** the recharge bar moves in this many steps across a tab */
const CHARGE_STEPS = 16;

/** restart a one-shot CSS animation class */
function replay(el: HTMLElement, name: string): void {
  el.classList.remove(name);
  void el.offsetWidth;
  el.classList.add(name);
}

/** A HUD tab that recharges: it dims while waiting with a bar along its bottom filling up, blinks when ready,
 *  and jolts when a press is refused. The DOM is touched only when something shown changes. */
export function createRechargeTab(el: HTMLElement): { update(left: number): void; jolt(): void } {
  let shown = CHARGE_STEPS;
  return {
    /** `left` is the share of the wait still to go, 0 when ready */
    update(left) {
      const charge = CHARGE_STEPS - Math.ceil(left * CHARGE_STEPS);
      if (charge === shown) return;
      const ready = charge === CHARGE_STEPS;
      el.classList.toggle("wait", !ready);
      el.style.setProperty("--charged", String(charge / CHARGE_STEPS));
      if (ready) replay(el, "ready");
      shown = charge;
    },
    jolt() {
      replay(el, "deny");
    },
  };
}
