import { drillSession } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { addStacks, markFoe } from "../../../../../game/enemies/skillStatus";
import { game, hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { ElementProjectile } from "../../../../../types/drill";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { aldricFx } from "../../fx";
import { createVerdictSword } from "../../skills/verdict";
import { foesNear } from "../../strike";
import { abilityStrike } from "../strike";

const ID = "al_lance";
const BURST = 30;
const seen = new WeakSet<ElementProjectile>();

export const DAWN_LANCE_DRILL: AldricDrillSkill = {
  id: ID,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "lance") {
      return;
    }
    abilityStrike(foe, values.extra, ID);
    const [lx, ly] = enemyCenter(foe);
    aldricFx(
      ID,
      "burst",
      { x: lx, y: ly, face: hero.face, reach: 12 },
      {
        damage: progress.stats.ap * (spell.damage / 10 + (values.extra ?? 0)),
        sigil: "sword",
      },
    );
    const flight = { x: lx - hero.face * 34, y: ly, face: hero.face, toX: lx, toY: ly };
    aldricFx(ID, "trail", flight, { quiet: true });
    if (evolved) {
      aldricFx(ID, "pillar", { x: lx, y: surfaceBelow(lx, ly), reach: 30 }, { quiet: true, delay: 0.12 });
    }
    if (values.burn) {
      addStacks(foe, ID, { stacks: 1, max: 5, damage: progress.stats.ap * values.burn, every: 0.5, duration: 3 });
    }
    if (values.mark) {
      markFoe(foe, ID, 3, values.mark);
    }
    if (values.burst) {
      const [x, y] = enemyCenter(foe);
      for (const near of foesNear(x, y, BURST)) {
        if (near !== foe) {
          abilityStrike(near, values.burst, ID);
        }
      }
    }
    if (evolved) {
      game.fx.push(createVerdictSword(foe, 0.05));
    }
  },
  tick(_dt, { values }) {
    const session = drillSession();
    if (!session || !values.twin) {
      return;
    }
    for (const bolt of session.elementProjectiles) {
      if (bolt.spell.id === "lance" && !seen.has(bolt)) {
        seen.add(bolt);
        const twin = { ...bolt, y: bolt.y - 9 };
        seen.add(twin);
        session.elementProjectiles.push(twin);
      }
    }
  },
};
