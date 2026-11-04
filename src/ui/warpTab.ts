import { VAULT } from "../constants/ysra/stance";
import { warpCooldown } from "../game/hero/warp";
import { hasPerk } from "../game/progress";
import { character, hero } from "../game/state";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/**
 * The K tab: Kael's warp once Warp Strike is learned, Ysra's vault from the start. It shows the recharge,
 * and jolts when a press is refused while it recharges.
 */
const el = byId("warpTab");
const tab = createRechargeTab(el);
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;

export function updateWarpTab(): void {
  const vault = character.kit === "ysra";
  const label = vault ? "VAULT" : "WARP";
  if (el.textContent !== label) el.textContent = label;
  const known = vault || hasPerk("warpStrike");
  if (el.hidden === known) el.hidden = !known;
  tab.update(Math.min(1, hero.warpCd / (vault ? VAULT.cooldown : warpCooldown())));
  if (hero.denied.warp > lastDenied) tab.jolt();
  lastDenied = hero.denied.warp;
}
