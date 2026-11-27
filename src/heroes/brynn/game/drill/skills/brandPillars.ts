import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createPillars } from "../../effects/pillars";
import { createQuake } from "../../effects/quake";
import { brynnFx, PLANTED } from "../../fx";

const ID = "br_pillars";
const GAP = 22;
const AGAIN_AFTER = 0.5;

export const BRAND_PILLARS_DRILL: BrynnDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.spellArea *= 1 + (values.area ?? 0);
  },
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "quake") {
      return;
    }
    if (values.stagger) {
      staggerFoe(foe, 0.55 + values.stagger);
    }
    const damage = progress.stats.ad * values.power;
    const first = foe.x - hero.face * GAP * (values.count / 2);
    for (let i = 0; i < values.count; i++) {
      const at = { x: first + hero.face * GAP * i, y: foe.y, reach: 30 };
      const options = { damage, quiet: i !== Math.floor(values.count / 2), delay: 0.04 + i * 0.06 };
      brynnFx(ID, "pillar", at, options.quiet ? options : { ...options, signature: PLANTED });
    }
    game.fx.push(
      createPillars({
        x: foe.x - hero.face * GAP * (values.count / 2),
        y: foe.y,
        face: hero.face,
        count: values.count,
        gap: GAP,
        every: 0.06,
        delay: 0.04,
        damage,
        launch: -200,
        burn: values.burn,
      }),
    );
    if (evolved) {
      brynnFx(ID, "nova", { x: foe.x, y: foe.y, reach: 40 }, { damage, quiet: true, delay: AGAIN_AFTER });
      game.fx.push(
        createQuake({
          x: foe.x,
          y: foe.y,
          reach: 40,
          damage: (spell.damage / 10) * progress.stats.ap,
          delay: AGAIN_AFTER,
          launch: -220,
          height: 30,
          source: ID,
        }),
      );
    }
  },
};
