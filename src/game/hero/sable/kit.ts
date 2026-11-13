import { STRIDE } from "../../../constants/kael/motion";
import { MUZZLE } from "../../../constants/sable/bolt";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { use } from "../../input";
import { skillValues } from "../../skills/query";
import { hero } from "../../state";
import { resetMotion } from "../kael/motion";
import { PROVISIONAL_GUARD, PROVISIONAL_WARP } from "../provisionalMoveset";
import { startCharge } from "../ultimate";
import { evadeAbsorbs, evadeDrives, pressEvade, runHop, runSlide } from "./evade";
import { doubleTapRun, pressJump } from "./jump";
import { pressKick, runKick } from "./kick";
import { looseBolt } from "./loose";
import { resetSable, sable } from "./memory";
import { sablePose } from "./pose";
import { quiverSize } from "./quiver";
import { pressReload, startReload, tickReload } from "./reload";
import { hovering, pressShoot, runShoot } from "./shoot";
import { pressCast, resetSpells, runCast, tickSpells } from "./spells/cast";

/** Skyhunter's hover: almost no gravity, and her rise or fall dies away this much each step at 120 steps a second */
const HOVER_GRAVITY = 0.05;
const HOVER_DAMP = 0.9;

/** Featherdraw: landing after air shots looses a bolt each way low along the floor */
function landingVolley(power: number): void {
  const y = hero.y + MUZZLE.low.y;
  for (const angle of [0, Math.PI]) looseBolt({ x: hero.x, y, angle, share: 1, power, prime: null, plain: true });
}

/** the air string, the air jumps and hops and the hover come back on landing */
function land(): void {
  const v = skillValues("s_featherdraw");
  if (sable.airShots > 0 && v.landing) landingVolley(v.landing);
  Object.assign(sable, { airShots: 0, airJumps: 0, airHops: 0, hover: v.hover ?? 0 });
}

function tick(dt: number): void {
  tickReload(dt);
  tickSpells(rechargeStep(dt));
  sable.haste = Math.max(0, sable.haste - dt);
  sable.shade = Math.max(0, sable.shade - dt);
  sable.sincePerfect += dt;
  if (hovering()) {
    sable.hover = Math.max(0, sable.hover - dt);
    hero.vy *= HOVER_DAMP ** (dt * 120);
  }
  if (hero.ground) land();
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
      runCast();
      return true;
    default:
      return false;
  }
}

/** blows do not throw her: Clockwork Cadence while primed bolts remain, Twin Shadows while a shade stands */
const steadfast = (): boolean =>
  (sable.primed > 0 && !!skillValues("s_rhythm").steadfast) || (sable.shade > 0 && !!skillValues("s_shade").steadfast);

/**
 * Sable: a repeating crossbow that looses three-bolt strings from a quiver with a timed reload, a kick that makes space,
 * a hop back that shoots and a slide under blows, and spells on I paid with MP. She fights at range and wins by keeping
 * it. The bolts aim themselves at the foe ahead, so Up and Down only jump and drop.
 */
export const SABLE_KIT: HeroKit = {
  warp: PROVISIONAL_WARP,
  guard: PROVISIONAL_GUARD,
  abilities: [],
  tick,
  readActions: (dir, tap) => {
    use("dash", () => pressEvade(dir));
    use("up", pressJump);
    if (tap) doubleTapRun(tap);
    use("attack", pressShoot);
    use("warp", pressKick);
    use("cast", pressCast);
    use("cycle", pressReload);
    use("ultimate", startCharge);
  },
  chooseMove: () => null,
  runState,
  pose: sablePose,
  afterStrike: () => {},
  absorbHurt: () => evadeAbsorbs(),
  stride: (running) => (running ? STRIDE.run : STRIDE.walk),
  hurtScale: () => 1,
  steadfast,
  drivesMotion: evadeDrives,
  gravityScale: () => (hovering() ? HOVER_GRAVITY : 1),
  reset: () => {
    resetSable(quiverSize());
    resetSpells();
    resetMotion();
  },
};
