import { drillSession } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { ElementProjectile } from "../../../../../types/drill";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { vesperFx } from "../../skillFx";
import { liftFoe } from "../statuses";
import { foesNear, skillStrike } from "../strike";

const ID = "ve_gale";
const seen = new WeakSet<ElementProjectile>();

export const DUSK_GALE_DRILL: VesperDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.spellArea *= 1 + (values.area ?? 0);
  },
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "gale") {
      return;
    }
    const [fx, fy] = enemyCenter(foe);
    const gusts = 1 + (values.gusts ?? 0) + (evolved ? 2 : 0);
    vesperFx(
      ID,
      { x: fx, y: surfaceBelow(fx, fy), face: hero.face },
      { damage: progress.stats.ad * (1 + (values.bonus ?? 0)) * gusts },
    );
    skillStrike(foe, values.bonus, ID);
    if (evolved) {
      liftFoe(foe, -values.lift);
      const [x, y] = enemyCenter(foe);
      for (const near of foesNear(x, y, 40)) {
        if (near !== foe) {
          skillStrike(near, values.bonus, ID);
          liftFoe(near, -values.lift);
        }
      }
    }
  },
  tick(_dt, { values }) {
    const session = drillSession();
    if (!session || !values.gusts) {
      return;
    }
    for (const bolt of [...session.elementProjectiles]) {
      if (bolt.spell.id !== "gale" || seen.has(bolt)) {
        continue;
      }
      seen.add(bolt);
      const twins: ElementProjectile[] = [{ ...bolt, y: bolt.y - 10 }];
      if (values.behind) {
        twins.push({ ...bolt, face: bolt.face === 1 ? -1 : 1 });
      }
      for (const twin of twins.slice(0, values.gusts)) {
        seen.add(twin);
        session.elementProjectiles.push(twin);
      }
    }
  },
};
