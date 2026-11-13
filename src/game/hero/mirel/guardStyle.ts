import { TIME_GUARD } from "../../../constants/mirel/guard";
import { PAL, SAND } from "../../../constants/palette";
import type { Enemy } from "../../../types/enemy";
import type { GuardStyle } from "../../../types/moveset";
import { PK } from "../../../types/particle";
import { hero, particles, rng } from "../../state";
import { stoppedMoment } from "./moment";

/** sand knocked loose from the bubble where the blow met it */
function spill(fromX: number): void {
  const side = Math.sign(fromX - hero.x) || hero.face;
  for (let i = 0; i < 6; i++)
    particles.spawn(
      PK.MOTE,
      hero.x + side * TIME_GUARD.radius * 0.8,
      hero.y - 18 + rng.range(-8, 8),
      side * rng.range(10, 40),
      rng.range(-20, 20),
      rng.range(0.25, 0.45),
      { col: rng.chance(0.5) ? SAND.light : PAL.hour[4], size: 0.5 },
    );
}

/**
 * Mirel's time-bubble guard: blows and shots slow as they reach her, a block lets a fair share through for a fair bit of
 * stamina, and her parry is the Stopped Moment, which stops the attacker in time and rewinds the HP she lost lately.
 */
export const MIREL_GUARD: GuardStyle = {
  chip: TIME_GUARD.chip,
  blockCost: TIME_GUARD.blockCost,
  blocked: (fromX: number) => spill(fromX),
  parried: (_fromX: number, foe: Enemy | null) => stoppedMoment(foe),
};
