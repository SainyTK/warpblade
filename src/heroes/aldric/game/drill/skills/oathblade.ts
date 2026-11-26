import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { createLightWave } from "../../effects/lightWave";
import { foesNear } from "../../strike";
import { attackStrike } from "../strike";

const ID = "al_oath";
const BEHIND = 24;

export const OATHBLADE_DRILL: AldricDrillSkill = {
  id: ID,
  swordHit(foe, _infusion, { values }) {
    if (drillFighter()?.swing?.kind !== "first") {
      return;
    }
    attackStrike(foe, values.extra, ID);
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
  },
  slashed(strike, _landed, { values, evolved }) {
    if (strike !== "first" && !(evolved && strike !== "warp")) {
      return;
    }
    if (strike === "first" && values.behind) {
      for (const foe of foesNear(hero.x - hero.face * BEHIND * 0.6, hero.y - 16, BEHIND)) {
        if ((foe.x - hero.x) * hero.face < 0) {
          attackStrike(foe, values.extra || 0.5, ID);
        }
      }
    }
    const wave = evolved ? Math.max(values.wave ?? 0, 1.6) : (values.wave ?? 0);
    if (wave > 0) {
      game.fx.push(
        createLightWave(hero.x + hero.face * 10, hero.y - 16, hero.face, {
          speed: 230,
          reach: 110,
          half: evolved ? 14 : 9,
          damage: progress.stats.ad * wave,
          source: ID,
          pierce: evolved || Boolean(values.pierce),
        }),
      );
    }
  },
};
