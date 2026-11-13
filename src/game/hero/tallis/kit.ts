import { PAL } from "../../../constants/palette";
import { TALLIS_STRIDE } from "../../../constants/tallis/motion";
import { VEIL } from "../../../constants/tallis/veil";
import type { Enemy } from "../../../types/enemy";
import type { HeroState } from "../../../types/hero";
import type { HeroKit } from "../../../types/kit";
import { PK } from "../../../types/particle";
import { rechargeStep } from "../../build/recharge";
import { unseenTouch } from "../../enemies/awareness";
import { use } from "../../input";
import { hero, particles, rng } from "../../state";
import { isFree } from "../actions";
import { resetMotion } from "../kael/motion";
import { TALLIS_SLOTS, tickAbilities } from "./abilities";
import { inCloud, stepClouds } from "./clouds";
import { drawTallis, drawTallisBack, drawTallisOver, tallisAlpha } from "./draw";
import { refillGloam } from "./gloam";
import { forgetDark, liftDark, runGloaming } from "./gloaming";
import { TALLIS_GUARD_STYLE } from "./guardStyle";
import { runHamstring } from "./hamstring";
import "./hooks";
import { pressJump } from "./jump";
import { watchLost } from "./lostCue";
import { isMarked, tickMarks } from "./marks";
import { resetTallis, tallis } from "./memory";
import { tallisPose } from "./pose";
import { poolDodge, riseNow, runSink, stepPlummet, tickSink } from "./sink";
import { runKnotCast } from "./smokeKnot";
import { runSpellCast } from "./spells/castSpell";
import { passMark } from "./spells/markDusk";
import { inRecovery, landed, pressDropStab, pressString, runDropStab, runRisingCut, runString } from "./string";
import { endVeil, tickVeil } from "./veil";
import { TALLIS_WARP_STYLE } from "./warpStyle";

/** foes cannot see him: in the Veil, in the pool, or standing in his own smoke */
const hidden = (): boolean => tallis.veil || hero.state === "sink" || inCloud();

/** his walk: quicker in the Veil */
const walkSpeed = (shared: number): number => (tallis.veil ? shared * VEIL.walk : shared);

/** thin ink wisps rise off his shoulders while he is veiled */
function wisps(): void {
  if (!tallis.veil || !rng.chance(0.3)) return;
  particles.spawn(
    PK.EMBER,
    hero.x + rng.range(-4, 3),
    hero.y - rng.range(17, 22),
    rng.range(-4, 4),
    -rng.range(10, 22),
    rng.range(0.4, 0.7),
    {
      sparks: [PAL.gloam[4], PAL.gloam[3], PAL.gloam[2], PAL.gloam[1]],
    },
  );
}

function tick(dt: number): void {
  const h = hero;
  refillGloam(dt);
  tickVeil(dt);
  tickAbilities(rechargeStep(dt));
  tickSink(dt);
  stepClouds(dt);
  tickMarks(dt);
  tallis.ambushLeft = Math.max(0, tallis.ambushLeft - dt);
  if (h.state !== "knife") tallis.link = Math.max(0, tallis.link - dt);
  if (h.state !== "knife" && tallis.link <= 0) h.chain = 0;
  if (h.state === "hurt" || h.state === "dead") tallis.plummet = false;
  if (h.state === "dead") {
    endVeil("hurt");
    liftDark();
  }
  forgetDark();
  if (h.ground) landed();
  stepPlummet();
  watchLost(hidden(), dt);
  wisps();
}

function runState(dt: number): boolean {
  switch (hero.state) {
    case "knife":
      runString(dt);
      return true;
    case "dropStab":
      runDropStab();
      return true;
    case "risingCut":
      runRisingCut(dt);
      return true;
    case "sink":
      runSink(dt);
      return true;
    case "knotCast":
      runKnotCast();
      return true;
    case "hamstring":
      runHamstring();
      return true;
    case "spellCast":
      runSpellCast();
      return true;
    case "gloaming":
      runGloaming();
      return true;
    default:
      return false;
  }
}

/** states in which the kit moves him itself */
const DRIVEN: ReadonlySet<HeroState> = new Set<HeroState>(["sink", "risingCut", "dropStab", "gloaming"]);

/** his own casts whose recovery a shared action may cut once their frame has come */
const CASTS: ReadonlySet<HeroState> = new Set<HeroState>(["knotCast", "hamstring", "spellCast"]);

/**
 * A shared action (warp, guard, dodge, ability, ultimate) may start: when he is free, once a knife blow or Rising Cut
 * has struck, or once a cast has let go; never in the pool, a Drop Stab's dive or Gloaming.
 */
function mayAct(): boolean {
  if (isFree() || inRecovery()) return true;
  if (hero.state === "risingCut") return tallis.struck;
  return CASTS.has(hero.state) && hero.hitDone;
}

/** a shared action starts: the string's queued blow and a plunge are called off */
function cutForAction(): void {
  tallis.queued = false;
  tallis.plummet = false;
}

/** a double tap starts a run */
function doubleTap(side: number): void {
  if (!isFree() || !hero.ground) return;
  hero.running = true;
  hero.face = side;
}

/** J tapped: in the pool he rises with Rising Cut, on the floor the knife string, in the air Drop Stab */
function pressKnife(): boolean {
  if (riseNow()) return true;
  return hero.ground ? pressString() : pressDropStab();
}

/**
 * A blow meets him: nothing touches him in Gloaming or in the pool, a foe that cannot see him brushes past without harm,
 * and any blow that lands ends the Veil.
 */
function absorbHurt(_dmg: number, fromX: number): boolean {
  if (hero.state === "gloaming") return true;
  if (poolDodge()) return true;
  if (hero.inv > 0) return false;
  if (hidden() && unseenTouch(fromX)) return true;
  endVeil("hurt");
  return false;
}

/** a foe he felled that Mark of Dusk marked passes its mark on */
function onKill(e: Enemy): void {
  if (isMarked(e)) passMark(e);
}

/**
 * Tallis: a knife string that deals more from behind a foe's back; a warp that throws a knife into the foe and steps out
 * of its shadow at its back; crossed knives on K whose parry, Fade, vanishes him into the Veil; the shared dodge; the
 * Veil, Sink, Smoke Knot, Hamstring and his spell skills on I; and Gloaming on U. Gloam refills while no foe faces him.
 */
export const TALLIS_KIT: HeroKit = {
  warp: TALLIS_WARP_STYLE,
  guard: TALLIS_GUARD_STYLE,
  abilities: TALLIS_SLOTS,
  tick,
  readActions: (_dir, tap) => {
    if (tap) doubleTap(tap);
    use("up", pressJump);
    use("attack", pressKnife);
  },
  chooseMove: () => null,
  runState,
  pose: tallisPose,
  afterStrike: () => {},
  mayAct,
  cutForAction,
  absorbHurt,
  walkSpeed,
  stride: () => TALLIS_STRIDE,
  hurtScale: () => 1,
  drivesMotion: () => DRIVEN.has(hero.state) || tallis.plummet,
  gravityScale: () =>
    hero.state === "gloaming" || (hero.state === "dropStab" && !tallis.diving && hero.vy >= 0) ? 0 : 1,
  drawBack: drawTallisBack,
  draw: drawTallis,
  drawOver: drawTallisOver,
  heroAlpha: tallisAlpha,
  hidden,
  onKill,
  reset: () => {
    liftDark();
    resetTallis();
    resetMotion();
  },
};
