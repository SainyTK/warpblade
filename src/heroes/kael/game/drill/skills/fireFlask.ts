import { drillSession } from "../../../../../drill";
import { ignite } from "../../../../../game/enemies/burn";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import type { ElementProjectile } from "../../../../../types/drill";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { foesNear, skillStrike } from "../strike";

const ID = "k_flame";
const seen = new WeakSet<ElementProjectile>();

export const FIRE_FLASK_DRILL: KaelDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.spellArea *= 1 + (values.area ?? 0);
  },
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "fire") {
      return;
    }
    ignite(foe, values.burn);
    skillStrike(foe, values.blast ?? 0, ID);
    if (values.knock) {
      staggerFoe(foe, values.knock);
    }
    const session = drillSession();
    if (evolved && session) {
      const [x, y] = enemyCenter(foe);
      for (const near of foesNear(x, y, 70).slice(0, values.children)) {
        if (near === foe) {
          continue;
        }
        const [nx, ny] = enemyCenter(near);
        session.elementImpacts.push({ spell, x: nx, y: ny, face: 1, age: 0, fromSword: true });
        skillStrike(near, values.blast, ID);
        ignite(near, values.burn);
      }
    }
  },
  swordHit(foe, _infusion, { values }) {
    if (!values.flare || foe.burn <= 0) {
      return;
    }
    const [x, y] = enemyCenter(foe);
    for (const near of foesNear(x, y, 26)) {
      skillStrike(near, values.flare, ID);
    }
  },
  tick(_dt, { values }) {
    const session = drillSession();
    if (!session || !values.flasks) {
      return;
    }
    for (const bolt of session.elementProjectiles) {
      if (bolt.spell.id === "fire" && !seen.has(bolt)) {
        seen.add(bolt);
        const twin = { ...bolt, y: bolt.y - 8 };
        seen.add(twin);
        session.elementProjectiles.push(twin);
      }
    }
  },
};
