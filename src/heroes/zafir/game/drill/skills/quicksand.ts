import { drillSession } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { game, progress } from "../../../../../game/state";
import type { ElementProjectile } from "../../../../../types/drill";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { createSpout } from "../../effects/spout";
import { openWounds } from "../../wounds";
import { fighterAt, foesNear, spellStrike } from "../strike";

const ID = "za_quicksand";
const DRAG_REACH = 30;
const TWIN_GAP = 12;
const seen = new WeakSet<ElementProjectile>();

export const QUICKSAND_DRILL: ZafirDrillSkill = {
  id: ID,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "spout") {
      return;
    }
    foe.halt = Math.max(foe.halt, values.halt);
    spellStrike(foe, values.power ?? 0, ID);
    openWounds(foe, values.wounds ?? 0);
    const [x, y] = enemyCenter(foe);
    if (values.drag) {
      for (const near of foesNear(x, y, DRAG_REACH)) {
        near.halt = Math.max(near.halt, values.halt);
        near.chill = Math.max(near.chill, values.halt * 2);
      }
    }
    if (evolved) {
      game.fx.push(
        createSpout(foe.x, foe.y, fighterAt().face, { damage: progress.stats.ap * values.sea, range: 0.8, source: ID }),
      );
    }
  },
  tick(_dt, { values }) {
    const session = drillSession();
    if (!session || !values.twin) {
      return;
    }
    for (const bolt of session.elementProjectiles) {
      if (bolt.spell.id === "spout" && !seen.has(bolt)) {
        seen.add(bolt);
        const twin = { ...bolt, x: bolt.x - bolt.face * TWIN_GAP, distance: bolt.distance - TWIN_GAP };
        seen.add(twin);
        session.elementProjectiles.push(twin);
      }
    }
  },
};
