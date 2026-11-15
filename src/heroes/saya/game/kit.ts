import { STRIDE } from "../../../constants/motion";
import { rechargeStep } from "../../../game/build/recharge";
import { resetMotion } from "../../../game/hero/motion";
import { hero } from "../../../game/state";
import type { HeroKit } from "../../../types/kit";
import { rechargeAbilities, SAYA_SLOTS } from "./abilities";
import { lineDrives } from "./brushline";
import { tickCalm } from "./calm";
import { chooseMove } from "./chooseMove";
import { SAYA_DODGE, sayaAirDodge } from "./dodge";
import { breathWalk, tickFocus } from "./focus";
import { SAYA_GUARD } from "./guardStyle";
import { sayaPose } from "./pose";
import { readActions } from "./readActions";
import { runState } from "./runState";
import { sayaCutForAction, sayaMayAct } from "./sharedCut";
import { stillTakes } from "./spells";
import { resetSayaState } from "./state";
import { drawStoredCuts, resetStore, tickStore } from "./store";
import { afterStrike, hitBonus, keenWindow, landed, shapeHit } from "./strike";
import { drawTrails, resetTrails, tickTrails } from "./trail";
import { SAYA_WARP_STYLE } from "./warpStyle";

/**
 * Saya: a three-press string whose cuts are stored in the foes and released by the sheathe, Focus that fills while the
 * blade rests, a scabbard guard whose parry is the counter draw, a warp that lands her past the foe, and two sword
 * abilities that end in a sheathe of their own.
 */
export const SAYA_KIT: HeroKit = {
  tick: (dt) => {
    rechargeAbilities(rechargeStep(dt));
    tickFocus(dt);
    tickCalm(dt);
    tickStore(dt);
    tickTrails(dt);
  },
  readActions,
  warp: SAYA_WARP_STYLE,
  guard: SAYA_GUARD,
  abilities: SAYA_SLOTS,
  chooseMove,
  runState,
  pose: sayaPose,
  afterStrike,
  shapeHit,
  landed,
  hitBonus,
  keenWindow,
  mayAct: sayaMayAct,
  cutForAction: sayaCutForAction,
  absorbHurt: (_dmg, fromX) => stillTakes(fromX),
  dodge: SAYA_DODGE,
  airDodge: sayaAirDodge,
  walkSpeed: (speed) => speed * breathWalk(),
  drawFloor: drawTrails,
  drawOver: drawStoredCuts,
  stride: (running) => (running ? STRIDE.run : STRIDE.walk),
  hurtScale: () => 1,
  drivesMotion: lineDrives,
  gravityScale: () => (hero.state === "line" ? 0 : 1),
  reset: () => {
    resetMotion();
    resetSayaState();
    resetStore();
    resetTrails();
  },
};
