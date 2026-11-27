import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, progress } from "../../../../../game/state";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { createSandWave } from "../../effects/sandWave";
import { zafirFx } from "../../skillFx";
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
    const [cx, cy] = enemyCenter(foe);
    const travel = Math.sign(cx - fighterAt().x) || 1;
    zafirFx(
      ID,
      "slash",
      { x: cx - travel * 6, y: cy, face: travel, reach: 16 },
      { damage: progress.stats.ap * values.power },
    );
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    if (evolved) {
      const torn = woundsOf(foe) * values.simoom;
      skillStrike(foe, torn, ID);
      zafirFx(
        ID,
        "burst",
        { x: cx, y: cy, reach: 14 },
        { mark: "both", damage: progress.stats.ad * (torn + 1), delay: 0.05 },
      );
    }
    if (values.back) {
      const [x, y] = [cx, cy];
      const dir = Math.sign(fighterAt().x - x) || -1;
      zafirFx(ID, "slash", { x, y, face: dir, reach: 12 }, { quiet: true, delay: 0.1 });
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
    zafirFx(ID, "wave", { x, y, face, reach: 30 }, { quiet: true, damage: progress.stats.ad * values.gust });
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
