import { HOVER } from "../../../constants/mirel/hover";
import { MIREL_STRIDE } from "../../../constants/mirel/motion";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { isHeld, use } from "../../input";
import { skillValues } from "../../skills/query";
import { hero, progress } from "../../state";
import { isFree } from "../actions";
import { resetMotion } from "../kael/motion";
import { MIREL_SLOTS, tickAbilities } from "./abilities";
import { landDive } from "./dive";
import { drawMirel } from "./draw";
import { keepGuardBubble } from "./guardBubble";
import { MIREL_GUARD } from "./guardStyle";
import { clearHeldStaggers, releaseHeldStaggers } from "./heldStagger";
import { runHour } from "./hour";
import { hoverGravity, tickHover } from "./hover";
import { pressJump } from "./jump";
import { mirel, resetMirel } from "./memory";
import { mirelPose } from "./pose";
import { quickRate } from "./quicken";
import { recordPath, rewinding, runRewind, secondChance } from "./rewind";
import { refillSand } from "./sand";
import { runHandCast } from "./secondHand";
import { runSpellCast } from "./spells/castSpell";
import { closeField, runStillCast, tickField } from "./stillfield";
import { runClockCast } from "./stoppedClock";
import { cutString, givePendantBack, inRecovery, pressPendant, pressString, runPendant, runString } from "./string";
import { MIREL_WARP_STYLE } from "./warpStyle";

/** the side held now */
const heldSide = (): number => (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);

/** where the last blow aimed at her came from, read by the contact rule of Steady Pace in the same call */
let blowFrom = 0;

/** her casts, which the shared actions may cut once the cast has gone off */
const CASTS = new Set(["stillCast", "clockCast", "handCast", "spellCast"]);

/** she stands inside her own field */
function inOwnField(): boolean {
  const f = mirel.field;
  return !!f && Math.hypot(hero.x - f.x, hero.y - 16 - f.y) <= f.radius;
}

/** her walk: Steady Pace inside her own field and Quickened after a rewind; her drift while hovering */
function walkSpeed(shared: number): number {
  if (mirel.hovering) return (skillValues("m_suspend").drift ?? HOVER.drift) * progress.stats.move;
  const pace = inOwnField() ? 1 + (skillValues("m_pace").walk ?? 0) : 1;
  return shared * pace * quickRate();
}

/** Steady Pace: a blow from a foe inside her field lands softer */
function hurtScale(): number {
  const f = mirel.field;
  const contact = skillValues("m_pace").contact ?? 0;
  if (!f || !contact) return 1;
  return Math.abs(blowFrom - f.x) <= f.radius ? 1 - contact : 1;
}

function tick(dt: number): void {
  const h = hero;
  recordPath();
  refillSand(dt);
  tickField(dt);
  tickAbilities(rechargeStep(dt));
  mirel.sinceRewind += dt;
  mirel.quickLeft = Math.max(0, mirel.quickLeft - dt);
  if (h.state !== "staff") mirel.link = Math.max(0, mirel.link - dt);
  if (h.state !== "staff" && mirel.link <= 0) h.chain = 0;
  if (h.state === "hurt" || h.state === "dead") {
    mirel.hovering = false;
    mirel.diving = false;
  }
  if (h.state === "dead") closeField(false);
  if (h.ground) givePendantBack();
  releaseHeldStaggers();
  tickHover(dt, heldSide());
  keepGuardBubble();
}

function runState(dt: number): boolean {
  switch (hero.state) {
    case "staff":
      runString(dt);
      return true;
    case "pendant":
      if (hero.ground) landDive();
      runPendant(dt);
      return true;
    case "stillCast":
      runStillCast();
      return true;
    case "rewind":
      runRewind();
      return true;
    case "clockCast":
      runClockCast();
      return true;
    case "handCast":
      runHandCast();
      return true;
    case "spellCast":
      runSpellCast();
      return true;
    case "hour":
      runHour();
      return true;
    default:
      return false;
  }
}

/**
 * The shared actions may cut in when she is free, once a blow of her string has struck, and once a cast has gone off;
 * Second Chance's rewind and the special play out.
 */
const mayAct = (): boolean => isFree() || inRecovery() || (CASTS.has(hero.state) && hero.hitDone);

/**
 * Mirel: a staff string whose every blow echoes half a second later; her staff flung like a pendulum and an arrival
 * that echoes too; a time-bubble guard whose parry, the Stopped Moment, stops the attacker and rewinds the HP she lost;
 * a hover at the top of her one jump; the Stillfield, Stopped Clock, Second Hand and her spell skills on I; and Sand,
 * the hourglass that pays for bending time.
 */
export const MIREL_KIT: HeroKit = {
  warp: MIREL_WARP_STYLE,
  guard: MIREL_GUARD,
  abilities: MIREL_SLOTS,
  tick,
  readActions: () => {
    use("up", pressJump);
    use("attack", () => (hero.ground ? pressString() : pressPendant()));
  },
  chooseMove: () => null,
  runState,
  pose: mirelPose,
  afterStrike: () => {},
  mayAct,
  cutForAction: cutString,
  absorbHurt: (dmg, fromX) => {
    blowFrom = fromX;
    return rewinding() || secondChance(dmg * hurtScale());
  },
  walkSpeed,
  stride: () => MIREL_STRIDE,
  hurtScale,
  drivesMotion: () => hero.state === "rewind" || (mirel.hovering && !isFree()) || mirel.diving,
  gravityScale: () => (hero.state === "rewind" ? 0 : hoverGravity()),
  draw: drawMirel,
  reset: () => {
    closeField(false);
    resetMirel();
    clearHeldStaggers();
    resetMotion();
  },
};
