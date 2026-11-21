import { drillFighter, drillSession } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hero } from "../../../../../game/state";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { duskThread } from "../statuses";
import { foesNear, skillStrike } from "../strike";

const ID = "ve_thread";
const ARC = 70;

export const DUSK_THREAD_DRILL: VesperDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.preparation *= values.preparation ?? 1;
  },
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "thread") {
      return;
    }
    skillStrike(foe, values.bonus, ID);
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    const session = drillSession();
    const [x, y] = enemyCenter(foe);
    const arcs = foesNear(x, y, ARC)
      .filter((near) => near !== foe)
      .slice(0, values.arcs ?? 0);
    for (const near of arcs) {
      const [nx, ny] = enemyCenter(near);
      session?.elementImpacts.push({ spell, x: nx, y: ny, face: 1, age: 0, fromSword: true });
      skillStrike(near, values.bonus, ID);
      duskThread(near);
    }
    const h = drillFighter();
    if (evolved && h) {
      h.warpReadyIn = 0;
      hero.warpCd = 0;
    }
  },
};
