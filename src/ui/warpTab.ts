import { warpCooldown } from "../game/hero/warp";
import { hero } from "../game/state";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/** The WARP tab: the warp's recharge, and the jolt of a press refused while it recharges. */
const tab = createRechargeTab(byId("warpTab"));
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;

export function updateWarpTab(): void {
  tab.update(Math.min(1, hero.warpCd / warpCooldown()));
  if (hero.denied.warp > lastDenied) tab.jolt();
  lastDenied = hero.denied.warp;
}
