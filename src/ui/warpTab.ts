import { BELLOW } from "../constants/hulda/bellow";
import { SNARE } from "../constants/sable/snare";
import { VAULT } from "../constants/ysra/stance";
import { hulda } from "../game/hero/hulda/memory";
import { sable } from "../game/hero/sable/memory";
import { warpRecharge } from "../game/hero/warp";
import { hasPerk } from "../game/progress";
import { character, hero } from "../game/state";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/**
 * The K tab: Kael's warp from the start, Ysra's vault from the start, Sable's snare and Hulda's Bellow (both
 * on I) from the start. It shows the recharge,
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
      const full = hasPerk("twinSnare") ? SNARE.twinCooldown : SNARE.cooldown;
      return { label: "SNARE", known: true, recharge: sable.snareCd / full, denied: hero.denied.cast };
    }
    case "hulda":
      return { label: "BELLOW", known: true, recharge: hulda.bellowCd / BELLOW.cooldown, denied: hero.denied.cast };
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
