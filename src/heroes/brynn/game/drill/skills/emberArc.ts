import { drillFighter, drillSession } from "../../../../../drill";
import { ignite } from "../../../../../game/enemies/burn";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { game, hero, progress } from "../../../../../game/state";
import type { ElementProjectile } from "../../../../../types/drill";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createCrescentWave } from "../../effects/heavyWave";
import { skillStrike } from "../strike";

const ID = "br_arc";
const CRESCENT_REACH = 140;
const thrown = new WeakSet<ElementProjectile>();

function crescent(x: number, y: number, face: number, power: number): void {
  game.fx.push(
    createCrescentWave({ x, y, face, reach: CRESCENT_REACH, damage: progress.stats.ad * power, source: ID }),
  );
}

export const EMBER_ARC_DRILL: BrynnDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.spellArea *= 1 + (values.area ?? 0);
  },
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "arc") {
      return;
    }
    ignite(foe, values.burn);
    skillStrike(foe, values.blast ?? 0, ID);
    if (evolved) {
      const [x, y] = enemyCenter(foe);
      crescent(x, y, hero.face, values.chain);
    }
  },
  swordHit(foe, _infusion, { values }) {
    if (values.flare && foe.burn > 0) {
      skillStrike(foe, values.flare, ID);
    }
  },
  tick(_dt, { values }) {
    const session = drillSession();
    const h = drillFighter();
    if (!session || !h || !values.crescent) {
      return;
    }
    for (const bolt of session.elementProjectiles) {
      if (bolt.spell.id === "arc" && !thrown.has(bolt)) {
        thrown.add(bolt);
        crescent(h.x, h.y - 18, bolt.face, values.crescent);
      }
    }
  },
};
