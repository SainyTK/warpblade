import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { aldricFx } from "../../fx";
import { foesNear } from "../../strike";
import { attackStrike } from "../strike";

const ID = "al_step";
const RING = 36;

export const SHIELD_STEP_DRILL: AldricDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes ?? 0;
  },
  dashed(foes, { values, evolved }) {
    const h = drillFighter();
    const streak = { x: hero.x - hero.face * 40, y: hero.y - 15, face: hero.face, toX: hero.x, toY: hero.y - 15 };
    aldricFx(ID, "trail", streak, {
      damage: progress.stats.ad * (values.bash ?? 1),
      quiet: foes.length === 0,
      sigil: "shield",
    });
    if (evolved) {
      aldricFx(
        ID,
        "nova",
        { x: hero.x, y: surfaceBelow(hero.x, hero.y - 2), reach: RING },
        { quiet: true, delay: 0.05 },
      );
    }
    for (const foe of foes) {
      attackStrike(foe, values.bash, ID, { kx: hero.face * (values.knock ?? 30) });
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
      if (values.warp && h) {
        h.warpReadyIn = Math.max(0, h.warpReadyIn - values.warp);
      }
    }
    if (evolved) {
      for (const foe of foesNear(hero.x, hero.y - 14, RING)) {
        attackStrike(foe, values.ring, ID, { ky: -50 });
      }
    }
  },
};
