import { VAULT } from "../constants/ysra/stance";
import { selectedSpell } from "../game/hero/sable/spells/cast";
import { warpRecharge } from "../game/hero/warp";
import { character, hero } from "../game/state";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/**
 * The K tab: Kael's warp from the start, Ysra's vault from the start and Sable's snare (on I) from the start; Hulda's,
 * Orrin's, Mirel's, Wenna's and Tallis's abilities have their own tabs (huldaTabs.ts, orrinTabs.ts, mirelTabs.ts, wennaTabs.ts,
 * tallisTabs.ts). It shows the recharge,
 * and jolts when a press is refused while it recharges.
 */
const el = byId("warpTab");
const tab = createRechargeTab(el);
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;

/** the tab's label, whether it shows, how much of its recharge is left and the deny flash it answers, for each hero */
function tabState(): { label: string; known: boolean; recharge: number; denied: number } {
  switch (character.kit) {
    case "ysra":
      return { label: "VAULT", known: true, recharge: hero.warpCd / VAULT.cooldown, denied: hero.denied.warp };
    case "sable": {
      const { spell } = selectedSpell();
      return { label: spell.label, known: true, recharge: spell.left() / spell.cooldown(), denied: hero.denied.cast };
    }
    case "hulda":
    case "orrin":
    case "mirel":
    case "wenna":
    case "tallis":
      return { label: "", known: false, recharge: 0, denied: 0 };
    default:
      return { label: "WARP", known: true, recharge: warpRecharge(), denied: hero.denied.warp };
  }
}

export function updateWarpTab(): void {
  const { label, known, recharge, denied } = tabState();
  if (el.textContent !== label) el.textContent = label;
  if (el.hidden === known) el.hidden = !known;
  tab.update(Math.min(1, recharge));
  if (denied > lastDenied) tab.jolt();
  lastDenied = denied;
}
