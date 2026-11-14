import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { createFloorRing } from "../../effects/floorRing";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { addStacks, consumeStacks, markFoe, stacksOf } from "../../enemies/skillStatus";
import { skin } from "../../hero/skin";
import { gainHeat } from "../../hero/ysra/pyre/heat";
import { burstEmbers } from "../../spells/rites/emberBurst";
import { game, particles, progress, rng } from "../../state";
import { skillEvolved, skillValues } from "../query";
import { memoryAs, SPREAD_LOCK } from "./memory";

const ID = "y_smoulder";
/** seconds between Smoulder ticks */
const TICK = 0.5;
/** Ashfall's burst reaches this far round the foe it sets off */
const ASH_RADIUS = 16;
/** chance per step, per stack, that a smouldering foe gives off a wisp of smoke or an ember */
const WISP = 0.012;

interface SmoulderMemory {
  /** foes Ashfall set off, and when: they may not be set off again until SPREAD_LOCK has passed */
  locked: Map<Enemy, number>;
}

/** lay Smoulder stacks on a foe; at full stacks it takes more damage from every source */
function smoulder(e: Enemy, stacks: number): void {
  const v = skillValues(ID);
  addStacks(e, ID, {
    stacks,
    max: v.max,
    damage: progress.stats.ap * v.perSecond * TICK,
    every: TICK,
    duration: v.duration,
  });
  if (v.taken && stacksOf(e, ID) >= v.max) markFoe(e, ID, v.duration, v.taken);
}

/** Ashfall: a rite sets off the Smoulder on a foe it strikes, every stack bursting at once */
function setOff(m: SmoulderMemory, e: Enemy): void {
  if (game.t - (m.locked.get(e) ?? -Infinity) < SPREAD_LOCK) return;
  const n = consumeStacks(e, ID);
  if (!n) return;
  m.locked.set(e, game.t);
  const [x, y] = enemyCenter(e);
  burstEmbers(x, y, progress.stats.ap * skillValues(ID).burst * n, ASH_RADIUS, 1, ID);
  game.fx.push(createFloorRing(e.x, e.y, ASH_RADIUS, skin.ramp, 0.3));
}

/** a smouldering foe gives off smoke and the odd ember, more the more stacks it carries */
function wisps(): void {
  for (const e of game.enemies) {
    const n = e.hp > 0 ? stacksOf(e, ID) : 0;
    if (!n || !rng.chance(WISP * n)) continue;
    const [x0, y0, x1, y1] = enemyBox(e);
    const x = rng.range(x0 + 1, x1 - 1);
    const y = rng.range(y0 + 2, y1 - 2);
    if (rng.chance(0.6))
      particles.spawn(PK.SMOKE, x, y, rng.range(-6, 6), -rng.range(10, 22), rng.range(0.5, 0.8), {
        size: rng.range(1.2, 2.2),
      });
    else particles.spawn(PK.EMBER, x, y, rng.range(-10, 10), -rng.range(20, 40), 0.6);
  }
}

/**
 * Smoulder: her rites leave every foe they strike smouldering; blows on a smouldering foe build Heat and feed it, the
 * warp lays it on its foe, and full stacks make a foe take more. Ashfall: each rite sets the Smoulder off first.
 */
export const smoulderSkill: SkillBehavior = {
  create: () => ({ locked: new Map() }),
  update: wisps,
  on: {
    blow(memory, e) {
      const v = skillValues(ID);
      if (e.source === "abilities") {
        if (skillEvolved(ID)) setOff(memoryAs(memory), e.foe);
        smoulder(e.foe, v.stacks);
        return;
      }
      if (e.source !== "attacks" || stacksOf(e.foe, ID) === 0) return;
      if (v.heat) gainHeat(v.heat);
      if (v.blow) smoulder(e.foe, v.blow);
    },
    warp(_memory, { foe }) {
      const stacks = skillValues(ID).warp ?? 0;
      if (foe && stacks) smoulder(foe, stacks);
    },
  },
};
