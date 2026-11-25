import { PAL, SPARKS } from "../../../../constants/palette";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { skillValues } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { fxRng, game, particles, progress } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import { PK } from "../../../../types/particle";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { TAU } from "../../../../utils/math";
import { isLocked, lockFoe, pruneLock, type SpreadLock } from "./spreadLock";

const ID = "k_frost";
/** a frozen foe's death burst: how far it reaches and how long it freezes the foes it hits */
const BURST = { reach: 36, freeze: 0.6 } as const;

interface FrostMemory {
  lock: SpreadLock;
}

const memoryOf = (m: SkillMemory): FrostMemory => m as unknown as FrostMemory;

/** Ice Spikes: a frozen foe that dies bursts into shards that hurt and freeze the foes around it; a foe frozen by a
 *  burst cannot burst in turn straight away */
export const iceSpikes: SkillBehavior = {
  create: () => ({ lock: new Map() }),
  update(memory) {
    pruneLock(memoryOf(memory).lock);
  },
  on: {
    kill(memory, ev) {
      const v = skillValues(ID);
      const m = memoryOf(memory);
      if (!v.burst || ev.foe.frozen <= 0 || isLocked(m.lock, ev.foe)) return;
      const [x, y] = enemyCenter(ev.foe);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU;
        particles.spawn(PK.SHARD, x, y, Math.cos(a) * fxRng.range(90, 180), Math.sin(a) * fxRng.range(90, 180), 0.5, {
          col: fxRng.pick(PAL.ice.slice(3)),
          size: fxRng.range(1.5, 3),
        });
      }
      game.fx.push(createImpact(x, y, 1, true, SPARKS.ice));
      sfx.shatter();
      for (const f of foesOnScreen()) {
        const [fx, fy] = enemyCenter(f);
        if (f === ev.foe || Math.hypot(fx - x, fy - y) > BURST.reach) continue;
        dealDamage(f, progress.stats.ap * v.burst, { fromX: x, kx: Math.sign(fx - x) * 60, source: ID });
        f.frozen = Math.max(f.frozen, BURST.freeze);
        lockFoe(m.lock, f);
      }
    },
  },
};
