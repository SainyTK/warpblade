import { HOVER } from "../../../constants/mirel/hover";
import { MIREL_STRIDE } from "../../../constants/mirel/motion";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { isHeld, use } from "../../input";
import { skillValues } from "../../skills/query";
import { hero, progress } from "../../state";
import { isFree } from "../actions";
import { resetMotion } from "../kael/motion";
import { startCharge } from "../ultimate";
import { nextAbility, pressAbility, resetAbilities, tickAbilities } from "./abilities";
import { landDive } from "./dive";
import { drawMirel } from "./draw";
import { runHour } from "./hour";
import { hoverGravity, tickHover } from "./hover";
import { pressJump } from "./jump";
import { mirel, resetMirel } from "./memory";
import { mirelPose } from "./pose";
import { quickRate } from "./quicken";
import { pressRewind, recordPath, rewindDodge, runRewind, secondChance } from "./rewind";
import { refillSand } from "./sand";
import { runHandCast } from "./secondHand";
import { runSpellCast } from "./spells/castSpell";
import { closeField, pressField, runStillCast, tickField } from "./stillfield";
import { runClockCast } from "./stoppedClock";
import { givePendantBack, pressPendant, pressString, runPendant, runString } from "./string";

/** the side held now */
const heldSide = (): number => (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);

/** where the last blow aimed at her came from, read by the contact rule of Steady Pace in the same call */
let blowFrom = 0;

/** she stands inside her own field */
function inOwnField(): boolean {
  const f = mirel.field;
  return !!f && Math.hypot(hero.x - f.x, hero.y - 16 - f.y) <= f.radius;
}

/** her walk: Steady Pace inside her own field and Quickened after a Rewind; her drift while hovering */
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
  mirel.rewindCd = Math.max(0, mirel.rewindCd - dt);
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
  tickHover(dt, heldSide());
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
    case "noon":
      runHour();
      return true;
    default:
      return false;
  }
}

/** states in which the kit moves her itself */
const DRIVEN = new Set(["rewind"]);

/**
 * Mirel: a staff string whose every blow echoes half a second later, a Stillfield on K that slows foes and their shots
 * while held and snaps shut, Rewind on L back along her own path, a hover at the top of her one jump, Stopped Clock and
 * Second Hand on I (O turns through them and her spell skills), and Sand, the hourglass that pays for bending time.
 */
export const MIREL_KIT: HeroKit = {
  tick,
  readActions: () => {
    use("dash", pressRewind);
    use("up", pressJump);
    use("attack", () => (hero.ground ? pressString() : pressPendant()));
    use("warp", pressField);
    use("cast", pressAbility);
    use("cycle", nextAbility);
    use("ultimate", startCharge);
  },
  chooseMove: () => null,
  runState,
  pose: mirelPose,
  afterStrike: () => {},
  absorbHurt: (dmg, fromX) => {
    blowFrom = fromX;
    return rewindDodge() || secondChance(dmg * hurtScale());
  },
  walkSpeed,
  stride: () => MIREL_STRIDE,
  hurtScale,
  drivesMotion: () => DRIVEN.has(hero.state) || (mirel.hovering && !isFree()) || mirel.diving,
  gravityScale: () => (hero.state === "rewind" ? 0 : hoverGravity()),
  draw: drawMirel,
  reset: () => {
    closeField(false);
    resetMirel();
    resetAbilities();
    resetMotion();
  },
};
