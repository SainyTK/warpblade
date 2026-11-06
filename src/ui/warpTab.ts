import { SNARE } from "../constants/sable/snare";
import { VAULT } from "../constants/ysra/stance";
import { sable } from "../game/hero/sable/memory";
import { warpCooldown } from "../game/hero/warp";
import { hasPerk } from "../game/progress";
import { character, hero } from "../game/state";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/**
 * The K tab: Kael's warp once Warp Strike is learned, Ysra's vault from the start, Sable's snare (on I) from the start. It shows the recharge,
 * and jolts when a press is refused while it recharges.
 */
const el = byId("warpTab");
const tab = createRechargeTab(el);
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;

export function updateWarpTab(): void {
  const kit = character.kit;
  const vault = kit === "ysra";
  const snare = kit === "sable";
  const label = snare ? "SNARE" : vault ? "VAULT" : "WARP";
  if (el.textContent !== label) el.textContent = label;
  const known = vault || snare || hasPerk("warpStrike");
  if (el.hidden === known) el.hidden = !known;
  const recharge = snare
    ? sable.snareCd / (hasPerk("twinSnare") ? SNARE.twinCooldown : SNARE.cooldown)
    : hero.warpCd / (vault ? VAULT.cooldown : warpCooldown());
  tab.update(Math.min(1, recharge));
  const denied = snare ? hero.denied.cast : hero.denied.warp;
  if (denied > lastDenied) tab.jolt();
  lastDenied = denied;
}
