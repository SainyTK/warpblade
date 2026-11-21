import { WARP } from "../constants/combat";
import { usesDrill } from "../drill";
import { warpCost, warpRecharge } from "../game/hero/warp";
import { hero } from "../game/state";
import { byId } from "./dom";
import { createRechargeTab } from "./rechargeTab";

/**
 * The warp tab every hero shares (J held): its recharge, struck through while MP cannot pay for it, and a jolt when a
 * press is refused while it recharges.
 */
const el = byId("warpTab");
const tab = createRechargeTab(el);
/** the deny flash time last seen; a rise means a new refused press */
let lastDenied = 0;

export function updateWarpTab(): void {
  const drill = usesDrill();
  tab.update(Math.min(1, drill ? hero.warpCd / WARP.cooldown : warpRecharge()));
  el.classList.toggle("poor", !drill && hero.mp < warpCost());
  if (hero.denied.warp > lastDenied) tab.jolt();
  lastDenied = hero.denied.warp;
}
