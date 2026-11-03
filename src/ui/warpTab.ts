import { warpCooldown } from "../game/hero/warp";
import { hasPerk } from "../game/progress";
import { hero } from "../game/state";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/** The WARP tab, shown once Warp Strike is learned: the warp's recharge, and the jolt of a press refused while it recharges. */
const el = byId("warpTab");
const tab = createRechargeTab(el);
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;

export function updateWarpTab(): void {
  const known = hasPerk("warpStrike");
  if (el.hidden === known) el.hidden = !known;
  tab.update(Math.min(1, hero.warpCd / warpCooldown()));
  if (hero.denied.warp > lastDenied) tab.jolt();
  lastDenied = hero.denied.warp;
}
