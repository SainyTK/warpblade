import { STRIDE } from "../../../constants/kael/motion";
import { BOLT } from "../../../constants/sable/bolt";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { isHeld, take, use } from "../../input";
import { hero } from "../../state";
import { resetMotion } from "../kael/motion";
import { startCharge } from "../ultimate";
import { evadeDrives, evadeGuarded, pressEvade, runHop, runSlide } from "./evade";
import { doubleTapRun, pressJump } from "./jump";
import { pressKick, runKick } from "./kick";
import { resetSable, sable } from "./memory";
import { sablePose } from "./pose";
import { pressReload, startReload, tickReload } from "./reload";
import { pressShoot, runShoot } from "./shoot";
import { pressSnare, runSnare } from "./snare";

/** Up and Down aim while J is held or a shot is out, so a held Up angles the shot instead of jumping */
const aiming = (): boolean => isHeld("attack") || hero.state === "shoot";

function tick(dt: number): void {
  tickReload(dt);
  sable.snareCd = Math.max(0, sable.snareCd - rechargeStep(dt));
  if (hero.ground) sable.airHopped = false;
  if (sable.ammo <= 0 && !sable.reload && hero.state !== "shoot") startReload();
}

function runState(dt: number): boolean {
  switch (hero.state) {
    case "shoot":
      runShoot(dt);
      return true;
    case "kick":
      runKick();
      return true;
    case "hop":
      runHop();
      return true;
    case "slide":
      runSlide();
      return true;
    case "snare":
      runSnare();
      return true;
    default:
      return false;
  }
}

/**
 * Sable: a repeating crossbow with a quiver and a timed reload, a kick that makes space, a hop back that shoots and a
 * slide under blows, and snares paid with MP. She fights at range and wins by keeping it.
 */
export const SABLE_KIT: HeroKit = {
  tick,
  readActions: (dir, tap) => {
    use("dash", () => pressEvade(dir));
    if (aiming()) take("up");
    else use("up", pressJump);
    if (tap) doubleTapRun(tap);
    use("attack", pressShoot);
    use("warp", pressKick);
    use("cast", pressSnare);
    use("cycle", pressReload);
    use("ultimate", startCharge);
  },
  chooseMove: () => null,
  runState,
  pose: sablePose,
  afterStrike: () => {},
  absorbHurt: () => evadeGuarded(),
  stride: (running) => (running ? STRIDE.run : STRIDE.walk),
  hurtScale: () => 1,
  drivesMotion: evadeDrives,
  gravityScale: () => 1,
  reset: () => {
    resetSable(BOLT.quiver);
    resetMotion();
  },
};
