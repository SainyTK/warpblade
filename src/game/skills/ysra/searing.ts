import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { enemyCenter } from "../../enemies/enemy";
import { consumeStacks, markFoe } from "../../enemies/skillStatus";
import { searing } from "../../hero/ysra/pyre/heat";
import { burstEmbers } from "../../spells/rites/emberBurst";
import { game, hero, progress } from "../../state";
import { skillValues } from "../query";
import { attackerAt, foesWithin, isHeavy, memoryAs, SPREAD_LOCK } from "./memory";
import { scorch, scorchOf } from "./scorch";

const ID = "y_searing";

interface SearingMemory {
  /** foes a spread reached, and when: they may not spread or burst again until SPREAD_LOCK has passed */
  locked: Map<Enemy, number>;
}

const locked = (m: SearingMemory, e: Enemy): boolean => game.t - (m.locked.get(e) ?? -Infinity) < SPREAD_LOCK;

/** Wildfire: a foe at full stacks bursts for twice their remaining damage around it and drops back to none */
function burstAtMax(m: SearingMemory, e: Enemy): void {
  const v = skillValues(ID);
  if (!v.burst || locked(m, e) || scorchOf(e) < v.max) return;
  const n = consumeStacks(e, ID);
  const [x, y] = enemyCenter(e);
  burstEmbers(x, y, progress.stats.ap * v.perSecond * v.duration * n * v.burst, v.burstRadius, 1, ID);
}

/** lay stacks on a foe; at full stacks it flares (more damage taken) or, evolved, bursts */
function sear(m: SearingMemory, e: Enemy, stacks: number): void {
  const v = skillValues(ID);
  scorch(e, stacks);
  if (v.flare && scorchOf(e) >= v.max) markFoe(e, ID, 1, v.flare);
  burstAtMax(m, e);
}

/** Wildfire: a scorched foe that falls throws its stacks onto every foe near it */
function spread(m: SearingMemory, e: Enemy): void {
  const v = skillValues(ID);
  if (!v.spread || locked(m, e)) return;
  const n = scorchOf(e);
  if (!n) return;
  const [x, y] = enemyCenter(e);
  for (const o of foesWithin(x, y, v.spread, e)) {
    scorch(o, n);
    m.locked.set(o, game.t);
  }
}

/** Searing Edge: hot glaive blows lay Scorch, heavy ones more; the guard scorches the attacker; Wildfire spreads it */
export const searingEdge: SkillBehavior = {
  create: () => ({ locked: new Map() }),
  on: {
    blow(memory, e) {
      if (!e.melee || e.source !== "attacks" || !searing()) return;
      const heavy = isHeavy(e.move, hero.state === "dive");
      sear(memoryAs(memory), e.foe, heavy ? (skillValues(ID).heavy ?? 1) : 1);
    },
    parry(memory, { fromX }) {
      const foe = skillValues(ID).guard ? attackerAt(fromX) : null;
      if (foe) sear(memoryAs(memory), foe, 1);
    },
    block(memory, { fromX }) {
      const foe = skillValues(ID).guard ? attackerAt(fromX) : null;
      if (foe) sear(memoryAs(memory), foe, 1);
    },
    kill(memory, { foe }) {
      spread(memoryAs(memory), foe);
    },
  },
};
