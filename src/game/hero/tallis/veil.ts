import { PAL } from "../../../constants/palette";
import { VEIL } from "../../../constants/tallis/veil";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import type { VeilCause } from "../../../types/tallis";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { hero, particles, rng } from "../../state";
import { tallis } from "./memory";

/** Gloam to raise the Veil: Shroud lowers it */
export const veilCost = (): number => Math.max(0, VEIL.enter - (skillValues("t_shroud").cost ?? 0));

/** a puff of ink as the hood comes down or lifts */
function flicker(): void {
  for (let i = 0; i < 8; i++)
    particles.spawn(
      PK.EMBER,
      hero.x + rng.range(-5, 5),
      hero.y - rng.range(4, 26),
      rng.range(-14, 14),
      -rng.range(6, 20),
      rng.range(0.3, 0.5),
      {
        sparks: [PAL.gloam[5], PAL.gloam[4], PAL.gloam[3], PAL.gloam[1]],
      },
    );
}

/** the Veil comes on with its Ambush primed, or the Ambush is primed on the Veil already up */
function veilOn(cause: VeilCause, ambush: boolean): void {
  if (ambush) tallis.ambushNext = true;
  if (tallis.veil) return;
  tallis.veil = true;
  tallis.veilT = 0;
  tallis.veilEnd = -1;
  flicker();
  sfx.evade();
  emitSkillEvent({ type: "veil", on: true, cause });
}

/** the Veil comes on to stay, draining Gloam: paid for by a press, or free from a skill */
export function raiseVeil(cause: VeilCause): void {
  veilOn(cause, true);
  tallis.veilKept = true;
}

/**
 * The Veil for `seconds` that drain nothing, then it ends, unless it was up to stay already: a Fade (his parry) with its
 * Ambush, or a warp's breath of shadow without one.
 */
export function fadeIn(seconds: number, cause: VeilCause, ambush: boolean): void {
  if (!tallis.veil) tallis.veilKept = false;
  tallis.veilFree = Math.max(tallis.veilFree, seconds);
  veilOn(cause, ambush);
}

/** the Veil ends; I waits a moment before it can raise it again */
export function endVeil(cause: VeilCause): void {
  if (!tallis.veil) return;
  tallis.veil = false;
  tallis.veilKept = false;
  tallis.veilFree = 0;
  tallis.veilLock = VEIL.lock;
  tallis.veilEnd = -1;
  tallis.ambushNext = false;
  flicker();
  emitSkillEvent({ type: "veil", on: false, cause });
}

/** the Veil can be turned on or off now: never while he is down, hurt, gathering or in Gloaming */
function mayToggle(): boolean {
  const st = hero.state;
  return st !== "dead" && st !== "hurt" && st !== "charge" && st !== "gloaming";
}

/** I on the Veil: off when it is up, else on, paid in Gloam. It cuts nothing he is doing. False while he cannot */
export function pressVeil(): boolean {
  if (!mayToggle()) return false;
  if (tallis.veil) {
    endVeil("press");
    return true;
  }
  tallis.gloam -= veilCost();
  raiseVeil("press");
  return true;
}

/** the Veil can be turned on or off: up already, or the Gloam to raise it */
export const veilAffordable = (): boolean => tallis.veil || (tallis.gloam >= veilCost() && tallis.gloam > 0);

/** his first blow out of the Veil landed: the Veil holds a moment longer, then ends */
export function veilStruck(): void {
  if (tallis.veil && tallis.veilEnd < 0) tallis.veilEnd = VEIL.strikeEnd;
}

/** a skill keeps the Veil up after a blow (an Ambush kill): its end is called off */
export function keepVeil(): void {
  if (tallis.veil) tallis.veilEnd = -1;
}

/** Gloam a second the Veil drains: nothing in its free seconds, Shroud slows it and Endless Night stops it while he stands */
function drain(): number {
  if (tallis.veilFree > 0) return 0;
  if (skillValues("t_shroud").endless && hero.ground && Math.abs(hero.vx) < 1) return 0;
  return VEIL.drain * (1 - (skillValues("t_shroud").drain ?? 0));
}

/**
 * The Veil drains Gloam and ends when it runs out, when a free Veil's seconds are up, or after his first blow out of it;
 * the wait before I can raise it again runs down.
 */
export function tickVeil(dt: number): void {
  if (!tallis.veil) {
    tallis.veilLock = Math.max(0, tallis.veilLock - dt);
    return;
  }
  tallis.veilT += dt;
  tallis.gloam = Math.max(0, tallis.gloam - drain() * dt);
  if (tallis.veilFree > 0) {
    tallis.veilFree = Math.max(0, tallis.veilFree - dt);
    if (tallis.veilFree <= 0 && !tallis.veilKept) return endVeil("faded");
  } else if (tallis.gloam <= 0) return endVeil("empty");
  if (tallis.veilEnd < 0) return;
  tallis.veilEnd -= dt;
  if (tallis.veilEnd <= 0) endVeil("strike");
}
