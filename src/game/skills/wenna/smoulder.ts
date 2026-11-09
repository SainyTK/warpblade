import { PAL } from "../../../constants/palette";
import { glow, place } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { enemyBox } from "../../enemies/enemy";
import { addStacks, stacksOf } from "../../enemies/skillStatus";
import { game, particles, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";

const ID = "w_smoulder";
/** seconds between the burn's touches on a foe standing in it; Pyre Path's trail lasts this long */
const TOUCH = 0.5;
const PYRE = 4;

/** lay Smoulder on a foe */
function smoulder(e: Enemy): void {
  const v = skillValues(ID);
  addStacks(e, ID, {
    stacks: 1,
    max: 5,
    damage: progress.stats.ap * v.damage,
    every: 1,
    duration: withCharms("duration", v.life),
  });
}

/** a stretch of floor that burns violet for a while: foes standing in it gain Smoulder */
function burnStrip(x0: number, x1: number, y: number, seconds: number): void {
  let t = 0;
  let touch = 0;
  const lo = Math.min(x0, x1);
  const hi = Math.max(x0, x1);
  game.fx.push({
    update(dt) {
      t += dt;
      touch -= dt;
      if (touch <= 0) {
        touch = TOUCH;
        for (const e of game.enemies) {
          const b = enemyBox(e);
          if (e.hp > 0 && b[2] > lo && b[0] < hi && b[3] > y - 30 && b[1] < y) smoulder(e);
        }
      }
      if (rng.chance(Math.min(1, (hi - lo) / 60)))
        particles.spawn(PK.EMBER, rng.range(lo, hi), y - 1, rng.range(-5, 5), -rng.range(15, 35), 0.5, {
          sparks: [PAL.wick[5], PAL.wick[4], PAL.wick[3], PAL.wick[1]],
        });
      return t < seconds;
    },
    drawBack() {
      place();
      const k = Math.min(1, (seconds - t) * 2);
      glow((lo + hi) / 2, y - 2, Math.max(8, (hi - lo) / 2), PAL.wick[2], 0.18 * k);
    },
    draw() {},
  });
}

/**
 * Smoulder: both ends of a Swap burn for a while; with its levels the thread between burns too, the burn spreads on a
 * kill, and Pyre Path leaves a burning trail along the thread.
 */
export const smoulderSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    swap(_m, event) {
      const v = skillValues(ID);
      const half = withCharms("area", v.width) / 2;
      const seconds = withCharms("duration", v.burn);
      const y = event.to.y;
      for (const end of [event.from, event.to]) burnStrip(end.x - half, end.x + half, end.y, seconds);
      if (v.thread || v.pyre) burnStrip(event.from.x, event.to.x, y, v.pyre ? withCharms("duration", PYRE) : seconds);
    },
    kill(_m, event) {
      if (!skillValues(ID).spread || stacksOf(event.foe, ID) <= 0) return;
      const box = enemyBox(event.foe);
      const next = nearestFoe((box[0] + box[2]) / 2, box[3] - 8, [event.foe]);
      if (next) smoulder(next);
    },
  },
};
