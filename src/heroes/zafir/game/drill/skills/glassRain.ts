import { drillSession } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { game } from "../../../../../game/state";
import type { ElementImpact } from "../../../../../types/drill";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { blindMinion, fighterAt, foesNear, spellStrike } from "../strike";

const ID = "za_glass";
const SHARD_REACH = 50;
const SPRAY_REACH = 28;
const BEHIND_REACH = 120;
const seen = new WeakSet<ElementImpact>();

export const GLASS_RAIN_DRILL: ZafirDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.preparation *= values.preparation ?? 1;
  },
  spellHit(foe, spell, { values }) {
    if (spell.id !== "glass") {
      return;
    }
    blindMinion(foe, values.blind);
    spellStrike(foe, values.power ?? 0, ID);
  },
  swordHit(foe, infusion, { values }) {
    if (infusion?.id !== "glass" || !values.spray) {
      return;
    }
    const [x, y] = enemyCenter(foe);
    for (const near of foesNear(x, y, SPRAY_REACH)) {
      if (near !== foe) {
        spellStrike(near, values.spray, ID);
      }
    }
  },
  tick(_dt, { values, evolved }) {
    const session = drillSession();
    if (!session) {
      return;
    }
    for (const blast of session.elementImpacts) {
      if (blast.spell.id !== "glass" || blast.fromSword || seen.has(blast)) {
        continue;
      }
      seen.add(blast);
      const shards = foesNear(blast.x, blast.y - 12, SHARD_REACH).slice(0, values.shards ?? 0);
      for (const foe of shards) {
        const [x, y] = enemyCenter(foe);
        session.elementImpacts.push({ ...blast, x, y, fromSword: true });
        spellStrike(foe, blast.spell.damage / 20, ID);
      }
      if (evolved && values.behind) {
        const { x, face } = fighterAt();
        const back = game.enemies.find((e) => e.hp > 0 && (x - e.x) * face > 0 && (x - e.x) * face < BEHIND_REACH);
        if (back) {
          const [bx, by] = enemyCenter(back);
          session.elementImpacts.push({ ...blast, x: bx, y: by, fromSword: true });
          spellStrike(back, blast.spell.damage / 10, ID);
          blindMinion(back, values.blind + 1.4);
        }
      }
    }
  },
};
