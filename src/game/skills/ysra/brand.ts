import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { createFloorRing } from "../../effects/floorRing";
import { enemyCenter } from "../../enemies/enemy";
import { kindOf } from "../../enemies/kinds";
import { addStacks, consumeStacks, markFoe, stacksOf } from "../../enemies/skillStatus";
import { skin } from "../../hero/skin";
import { burstEmbers } from "../../spells/rites/emberBurst";
import { game, progress } from "../../state";
import { skillEvolved, skillValues } from "../query";
import { createBrandMark } from "./brandMark";
import { attackerAt, foesWithin, memoryAs, SPREAD_LOCK } from "./memory";

const ID = "y_brand";
/** seconds between brand ticks, and the stagger a branded foe takes each tick to slow it */
const TICK = 0.5;
const SLOW_STAGGER = 0.1;
/** stacks the Pyre Mark blast lays on every foe it reaches */
const BLAST_STACKS = 2;
/** the moves that set off Pyre Mark */
const DETONATORS = new Set(["impale", "impaleTwist", "counterThrust"]);

interface BrandMemory {
  /** foes branded by a blast, and when: they may not be blasted again until SPREAD_LOCK has passed */
  locked: Map<Enemy, number>;
  /** seconds to the next slowing stagger */
  slow: number;
}

/** brand a foe with stacks, its mark showing while the brand lasts */
function brand(e: Enemy, stacks: number): void {
  const v = skillValues(ID);
  const fresh = stacksOf(e, ID) === 0;
  addStacks(e, ID, {
    stacks,
    max: v.max,
    damage: progress.stats.ap * v.perSecond * TICK,
    every: TICK,
    duration: v.duration,
  });
  if (v.taken) markFoe(e, ID, v.duration, v.taken);
  if (fresh) game.fx.push(createBrandMark(e));
}

/** Pyre Mark: an impale or counter spends the brand in one blast that brands the foes around */
function detonate(m: BrandMemory, e: Enemy): void {
  if (game.t - (m.locked.get(e) ?? -Infinity) < SPREAD_LOCK) return;
  const n = consumeStacks(e, ID);
  if (!n) return;
  const v = skillValues(ID);
  const [x, y] = enemyCenter(e);
  burstEmbers(x, y, progress.stats.ap * v.consume * n, v.radius, 2, ID);
  game.fx.push(createFloorRing(e.x, e.y, v.radius, skin.ramp, 0.4));
  for (const o of foesWithin(x, y, v.radius, e)) {
    brand(o, BLAST_STACKS);
    m.locked.set(o, game.t);
  }
}

/** the parry or block brands the attacker, and from its level 6 the foes around it */
function guard(fromX: number, stacks: number): void {
  const foe = attackerAt(fromX);
  if (!foe || !stacks) return;
  brand(foe, stacks);
  const spread = skillValues(ID).spread ?? 0;
  if (!spread) return;
  const [x, y] = enemyCenter(foe);
  for (const o of foesWithin(x, y, spread, foe)) brand(o, stacks);
}

/** Ember Brand: a parry brands the attacker, her blows feed the brand, and branded foes are slowed */
export const emberBrand: SkillBehavior = {
  create: () => ({ locked: new Map(), slow: 0 }),
  update(memory, _state, dt) {
    const m = memoryAs<BrandMemory>(memory);
    m.slow -= dt;
    if (m.slow > 0 || !skillValues(ID).slow) return;
    m.slow = TICK;
    for (const e of game.enemies)
      if (e.hp > 0 && stacksOf(e, ID) > 0 && kindOf(e.type).staggers) e.stagger = Math.max(e.stagger, SLOW_STAGGER);
  },
  on: {
    parry(_memory, { fromX }) {
      guard(fromX, skillValues(ID).parry);
    },
    block(_memory, { fromX }) {
      guard(fromX, skillValues(ID).block ?? 0);
    },
    blow(memory, e) {
      if (e.source !== "attacks" || stacksOf(e.foe, ID) === 0) return;
      if (skillEvolved(ID) && e.move && DETONATORS.has(e.move)) detonate(memoryAs(memory), e.foe);
      else brand(e.foe, 1);
    },
  },
};
