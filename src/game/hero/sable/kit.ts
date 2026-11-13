import { CLIPS } from "../../../constants/clips";
import { STRIDE } from "../../../constants/kael/motion";
import { MUZZLE } from "../../../constants/sable/bolt";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { isHeld, use } from "../../input";
import { skillValues } from "../../skills/query";
import { hero } from "../../state";
import { isFree } from "../actions";
import { resetMotion } from "../kael/motion";
import { releaseWeapon } from "../warp";
import { SABLE_SLOTS } from "./abilities";
import { drawCord } from "./effects/cord";
import { evadeAbsorbs, evadeDrives, runHop, runSlide, tickHop } from "./evade";
import { SABLE_GUARD_STYLE } from "./guardStyle";
import { doubleTapRun, pressJump } from "./jump";
import { looseBolt } from "./loose";
import { bowString, resetSable, sable } from "./memory";
import { sablePose } from "./pose";
import { quiverSize } from "./quiver";
import { startReload, tickReload } from "./reload";
import { hovering, pressShoot, runShoot, tickString } from "./shoot";
import { resetSpells, runCast, tickSpells } from "./spells/cast";
import { SABLE_WARP } from "./warpStyle";

/** Skyhunter's hover: almost no gravity, and her rise or fall dies away this much each step at 120 steps a second */
const HOVER_GRAVITY = 0.05;
const HOVER_DAMP = 0.9;

/** Featherdraw: landing after air shots looses a bolt each way low along the floor */
function landingVolley(power: number): void {
  const y = hero.y + MUZZLE.low.y;
  for (const angle of [0, Math.PI]) looseBolt({ x: hero.x, y, angle, share: 1, power, prime: null, plain: true });
}

/** the air string, the air jumps and the hover come back on landing */
function land(): void {
  const v = skillValues("s_featherdraw");
  if (sable.airShots > 0 && v.landing) landingVolley(v.landing);
  Object.assign(sable, { airShots: 0, airJumps: 0, hover: v.hover ?? 0 });
}

function tick(dt: number): void {
  const step = rechargeStep(dt);
  tickReload(dt);
  tickSpells(step);
  tickHop(step);
  tickString(dt);
  sable.haste = Math.max(0, sable.haste - dt);
  sable.shade = Math.max(0, sable.shade - dt);
  sable.sincePerfect += dt;
  sable.sinceDown = isHeld("down") ? 0 : sable.sinceDown + dt;
  if (hovering()) {
    sable.hover = Math.max(0, sable.hover - dt);
    hero.vy *= HOVER_DAMP ** (dt * 120);
  }
  if (hero.ground) land();
  if (sable.ammo <= 0 && !sable.reload && hero.state !== "shoot") startReload();
}

/** the grapple bolt leaves the crossbow, which stays in her hands while the bolt flies */
function runThrow(): void {
  if (hero.st < CLIPS.throw.hit) return;
  releaseWeapon();
  hero.hasSword = true;
}

function runState(dt: number): boolean {
  switch (hero.state) {
    case "shoot":
      runShoot(dt);
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
    case "throw":
      runThrow();
      return true;
    default:
      return false;
  }
}

/**
 * The warp, guard, dodge, abilities and ultimate may cut in when she is free, at any part of a shot (a bolt's draw is the
 * longest part of a beat), once a hop or a slide has landed, and once a spell is set.
 */
function mayAct(): boolean {
  const h = hero;
  if (isFree() || h.state === "shoot") return true;
  if (h.state === "hop" || h.state === "slide") return sable.landed;
  return h.state === "snare" && h.hitDone;
}

/** a shared action cuts in: a shot under way is dropped and the next tap starts the string again */
function cutForAction(): void {
  if (hero.state !== "shoot") return;
  Object.assign(bowString, { queued: false, link: 0 });
  Object.assign(sable, { cock: 0, string: 0 });
}

/** blows do not throw her: Clockwork Cadence while primed bolts remain, Twin Shadows while a shade stands */
const steadfast = (): boolean =>
  (sable.primed > 0 && !!skillValues("s_rhythm").steadfast) || (sable.shade > 0 && !!skillValues("s_shade").steadfast);

/**
 * Sable: a repeating crossbow that looses a three-bolt string one tap at a time from a quiver with a timed reload, a
 * grapple warp that zips her away and fires a heavy bolt back, a light stock guard whose parry kicks and reloads, the
 * hop back and her spells on I. She fights at range and wins by keeping it. The bolts aim themselves at the foe ahead,
 * so Up and Down only jump, drop and, with J on the floor, reload.
 */
export const SABLE_KIT: HeroKit = {
  warp: SABLE_WARP,
  guard: SABLE_GUARD_STYLE,
  abilities: SABLE_SLOTS,
  tick,
  readActions: (_dir, tap) => {
    use("up", pressJump);
    if (tap) doubleTapRun(tap);
    use("attack", pressShoot);
  },
  chooseMove: () => null,
  runState,
  pose: sablePose,
  afterStrike: () => {},
  mayAct,
  cutForAction,
  absorbHurt: () => evadeAbsorbs(),
  stride: (running) => (running ? STRIDE.run : STRIDE.walk),
  hurtScale: () => 1,
  steadfast,
  drivesMotion: evadeDrives,
  gravityScale: () => (hovering() ? HOVER_GRAVITY : 1),
  draw: drawCord,
  reset: () => {
    resetSable(quiverSize());
    resetSpells();
    resetMotion();
  },
};
