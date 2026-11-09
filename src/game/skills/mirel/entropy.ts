import { PAL } from "../../../constants/palette";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, markFoe, stacksOf } from "../../enemies/skillStatus";
import { stopFoe } from "../../enemies/timeStop";
import { game, particles, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";

const ID = "m_entropy";
/** Heat Death's reach, and the mark's length while a foe decays */
const DECAY = { death: 50, mark: 0.5 } as const;

/** a foe starts to decay, one stack more up to the most */
function decay(e: Enemy, stacks = 1): void {
  const v = skillValues(ID);
  if (!v.damage || e.hp <= 0) return;
  addStacks(e, ID, {
    stacks,
    max: v.max,
    damage: progress.stats.ap * v.damage,
    every: 1,
    duration: withCharms("duration", v.life),
  });
}

/**
 * Entropy: a foe restarting from a stop or thrown out by a field's snap decays; levels lengthen and strengthen it, make
 * decaying foes take more and spread it on a kill. Heat Death stops every foe near a decaying foe that dies.
 */
export const entropy: SkillBehavior = {
  create: () => ({}),
  update() {
    const v = skillValues(ID);
    for (const e of game.enemies) {
      if (e.hp <= 0 || !stacksOf(e, ID)) continue;
      if (v.taken) markFoe(e, ID, DECAY.mark, v.taken);
      if (rng.chance(0.15)) {
        const [cx, cy] = enemyCenter(e);
        particles.spawn(PK.MOTE, cx + rng.range(-5, 5), cy + rng.range(-6, 4), 0, -8, 0.5, {
          col: PAL.hour[2],
          size: 0.5,
        });
      }
    }
  },
  on: {
    restart(_memory, event) {
      decay(event.foe);
    },
    field(_memory, event) {
      if (event.open) return;
      for (const e of game.enemies) {
        const [cx, cy] = enemyCenter(e);
        if (Math.hypot(cx - event.x, cy - event.y) <= event.radius + 30) decay(e);
      }
    },
    kill(_memory, event, state) {
      const v = skillValues(ID);
      const n = stacksOf(event.foe, ID);
      if (!n) return;
      const [cx, cy] = enemyCenter(event.foe);
      if (v.spread) {
        const next = nearestFoe(cx, cy, [event.foe]);
        if (next) decay(next, n);
      }
      if (!state.evolved || !v.stop) return;
      for (const e of game.enemies) {
        const [ox, oy] = enemyCenter(e);
        if (e !== event.foe && Math.hypot(ox - cx, oy - cy) <= withCharms("area", DECAY.death)) stopFoe(e, v.stop, 0);
      }
    },
  },
};
