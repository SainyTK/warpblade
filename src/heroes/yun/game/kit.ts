import { STRIDE } from "../../../constants/motion";
import { rechargeStep } from "../../../game/build/recharge";
import { resetMotion } from "../../../game/hero/motion";
import { skillValues } from "../../../game/skills/query";
import { hero } from "../../../game/state";
import type { HeroKit } from "../../../types/kit";
import { SKILL } from "../constants/skillIds";
import { FLOAT_FALL } from "../constants/string";
import { rechargeAbilities, runCast, YUN_SLOTS } from "./abilities";
import { afterStrike } from "./afterStrike";
import { chooseMove } from "./chooseMove";
import { drawHeldSwords } from "./drawSwords";
import { YUN_GUARD_STYLE } from "./guardStyle";
import { yunPose } from "./pose";
import { readActions } from "./readActions";
import { tickScreen } from "./screen";
import { shapeHit } from "./shapeHit";
import { DRIFT_DODGE } from "./skills/driftingLeaf";
import { keenWindow } from "./skills/flowingWater";
import { harmonyDamage, harmonyGuard } from "./skills/harmony";
import { touchedFloor } from "./skills/petalStorm";
import { resetYunState } from "./state";
import { tickSwords } from "./swords";
import { settleTassel, swingTassel } from "./tassel";
import { YUN_WARP } from "./warpStyle";

/** the fall is floatier while he comes down from a jump, more so with Cloud Step */
const falling = (): boolean => (hero.state === "jump" || hero.state === "fall") && hero.vy > 0;
const fallGravity = (): number => skillValues(SKILL.cloud).float ?? FLOAT_FALL;

/** Yun: a flowing string of four cuts that his spirit swords echo at range, a warp the swords arrive with, a sword
 *  screen whose parry sends a qi wave, the shared dodge, and abilities that send the swords out */
export const YUN_KIT: HeroKit = {
  tick: (dt) => {
    rechargeAbilities(rechargeStep(dt));
    tickSwords(dt);
    swingTassel(dt);
    tickScreen(dt);
    if (hero.ground) touchedFloor();
  },
  readActions,
  warp: YUN_WARP,
  guard: YUN_GUARD_STYLE,
  abilities: YUN_SLOTS,
  chooseMove,
  // the cast is a shared state: his kit sends the swords in it, and the shared runner ends it
  runState: () => {
    if (hero.state === "cast") runCast();
    return false;
  },
  pose: yunPose,
  afterStrike,
  shapeHit,
  keenWindow,
  absorbHurt: () => false,
  airDodge: () => !!skillValues(SKILL.cloud).airDodge,
  dodge: DRIFT_DODGE,
  damageScale: harmonyDamage,
  drawBack: () => drawHeldSwords(false),
  draw: () => drawHeldSwords(true),
  stride: (running) => (running ? STRIDE.run : STRIDE.walk),
  hurtScale: harmonyGuard,
  drivesMotion: () => false,
  gravityScale: () => (falling() ? fallGravity() : 1),
  reset: () => {
    resetMotion();
    resetYunState();
    settleTassel();
  },
};
