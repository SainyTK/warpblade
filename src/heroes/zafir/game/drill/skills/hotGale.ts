import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, progress } from "../../../../../game/state";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { createSandWave } from "../../effects/sandWave";
import { woundsOf } from "../../wounds";
import { fighterAt, skillStrike, spellStrike } from "../strike";

const ID = "za_gale";
const BACK_RANGE = 120;

export const HOT_GALE_DRILL: ZafirDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.infusionHits += values.infusion ?? 0;
  },
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "crescent") {
      return;
    }
    spellStrike(foe, values.power, ID);
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    if (evolved) {
      skillStrike(foe, woundsOf(foe) * values.simoom, ID);
    }
    if (values.back) {
      const [x, y] = enemyCenter(foe);
      const dir = Math.sign(fighterAt().x - x) || -1;
      game.fx.push(
        createSandWave({
          x,
          y,
          dir,
          damage: progress.stats.ap * values.back,
          range: BACK_RANGE,
          pierce: true,
          wounds: 1,
          source: ID,
        }),
      );
    }
  },
  swordHit(_foe, infusion, { values }) {
    if (infusion?.id !== "crescent" || !values.gust) {
      return;
    }
    const { x, y, face } = fighterAt();
    game.fx.push(
      createSandWave({
        x,
        y: y - 10,
        dir: face,
        damage: progress.stats.ad * values.gust,
        range: BACK_RANGE,
        pierce: true,
        wounds: 0,
        source: ID,
      }),
    );
  },
};
