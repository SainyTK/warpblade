import { drillSession } from "../../../../../drill";
import { addStacks, stacksOf } from "../../../../../game/enemies/skillStatus";
import { game, progress } from "../../../../../game/state";
import type { ElementProjectile } from "../../../../../types/drill";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createFloorWave } from "../../effects/floorWave";
import { skillStrike } from "../strike";

const ID = "br_bellows";
const BLEED = { max: 8, damage: 0.12, every: 0.5, duration: 3 };
const SPLIT_RISE = 9;
const seen = new WeakSet<ElementProjectile>();

export const BLOODLETTER_DRILL: BrynnDrillSkill = {
  id: ID,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "rend") {
      return;
    }
    addStacks(foe, "abilities", {
      ...BLEED,
      stacks: values.bleed,
      damage: progress.stats.ap * BLEED.damage,
    });
    skillStrike(foe, values.blast ?? 0, ID);
    if (evolved) {
      game.fx.push(
        createFloorWave({
          x: foe.x,
          y: foe.y,
          face: Math.sign(foe.vx) || 1,
          reach: 90,
          speed: 300,
          damage: progress.stats.ad * values.tide,
          kind: "rend",
          source: ID,
        }),
      );
    }
  },
  swordHit(foe, _infusion, { values }) {
    if (values.open && stacksOf(foe, "abilities") > 0) {
      skillStrike(foe, values.open, ID);
    }
  },
  tick(_dt, { values }) {
    const session = drillSession();
    if (!session || !values.split) {
      return;
    }
    for (const bolt of session.elementProjectiles) {
      if (bolt.spell.id !== "rend" || seen.has(bolt)) {
        continue;
      }
      seen.add(bolt);
      for (let i = 1; i <= values.split; i++) {
        const shard = { ...bolt, y: bolt.y - SPLIT_RISE * i };
        seen.add(shard);
        session.elementProjectiles.push(shard);
      }
    }
  },
};
