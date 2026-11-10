import { PAL } from "../../../constants/palette";
import { VEIL } from "../../../constants/tallis/veil";
import { sfx } from "../../../services/audio";
import { PK } from "../../../types/particle";
import type { VeilCause } from "../../../types/tallis";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero, particles, rng } from "../../state";
import { denyGloam } from "./gloam";
import { tallis } from "./memory";

/** Gloam to raise the Veil: Shroud lowers it, and Quiet Step's first Veil of a wave is free */
export function veilCost(): number {
  if (skillValues("t_quietStep").free && tallis.freeVeilWave !== game.wave) return 0;
  return Math.max(0, VEIL.enter - (skillValues("t_shroud").cost ?? 0));
}

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

/** the Veil comes on: no cost here, for a press already paid for or a skill that raises it for free */
export function raiseVeil(cause: VeilCause): void {
  tallis.veil = true;
  tallis.veilT = 0;
  tallis.veilEnd = -1;
  tallis.ambushNext = true;
  flicker();
  sfx.evade();
  emitSkillEvent({ type: "veil", on: true, cause });
}

/** the Veil ends; K waits a moment before it can raise it again */
export function endVeil(cause: VeilCause): void {
  if (!tallis.veil) return;
  tallis.veil = false;
  tallis.veilLock = VEIL.lock;
  tallis.veilEnd = -1;
  tallis.ambushNext = false;
  flicker();
  emitSkillEvent({ type: "veil", on: false, cause });
}

/** K: the Veil on, paid in Gloam, or off again; refused while it waits or with too little Gloam */
export function pressVeil(): boolean {
  const st = hero.state;
  if (st === "dead" || st === "hurt" || st === "charge" || st === "gloaming" || st === "eclipse") return false;
  if (tallis.veil) {
    endVeil("press");
    return true;
  }
  if (tallis.veilLock > 0) {
    denyGloam();
    return true;
  }
  const cost = veilCost();
  if (tallis.gloam < cost || tallis.gloam <= 0) {
    denyGloam();
    return true;
  }
  if (cost === 0) tallis.freeVeilWave = game.wave;
  tallis.gloam -= cost;
  raiseVeil("press");
  return true;
}

/** his first blow out of the Veil landed: the Veil holds a moment longer, then ends */
export function veilStruck(): void {
  if (tallis.veil && tallis.veilEnd < 0) tallis.veilEnd = VEIL.strikeEnd;
}

/** a skill keeps the Veil up after a blow (an Ambush kill): its end is called off */
export function keepVeil(): void {
  if (tallis.veil) tallis.veilEnd = -1;
}

/** Gloam a second the Veil drains: Quiet Step and Shroud slow it, Endless Night stops it while he stands still */
function drain(): number {
  if (skillValues("t_shroud").endless && hero.ground && Math.abs(hero.vx) < 1) return 0;
  const quiet = skillValues("t_quietStep").drain ?? 0;
  const shroud = skillValues("t_shroud").drain ?? 0;
  return VEIL.drain * (1 - quiet) * (1 - shroud);
}

/** the Veil drains Gloam and ends when it runs out or after his first blow out of it; K's wait runs down */
export function tickVeil(dt: number): void {
  if (!tallis.veil) {
    tallis.veilLock = Math.max(0, tallis.veilLock - dt);
    return;
  }
  tallis.veilT += dt;
  tallis.gloam = Math.max(0, tallis.gloam - drain() * dt);
  if (tallis.gloam <= 0) return endVeil("empty");
  if (tallis.veilEnd < 0) return;
  tallis.veilEnd -= dt;
  if (tallis.veilEnd <= 0) endVeil("strike");
}
