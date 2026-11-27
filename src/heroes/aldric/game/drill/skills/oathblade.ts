import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { createLightWave } from "../../effects/lightWave";
import { aldricFx } from "../../fx";
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
  slashed(strike, landed, { values, evolved }) {
    if (strike !== "first" && !(evolved && strike !== "warp")) {
      return;
    }
    const cut = { x: hero.x + hero.face * 6, y: hero.y - 17, face: hero.face, reach: 15 };
    aldricFx(ID, "slash", cut, {
      damage: progress.stats.ad * (1 + (values.extra ?? 0)),
      quiet: strike !== "first" || !landed,
      sigil: "sword",
    });
    if (strike === "first" && values.behind) {
      for (const foe of foesNear(hero.x - hero.face * BEHIND * 0.6, hero.y - 16, BEHIND)) {
        if ((foe.x - hero.x) * hero.face < 0) {
          attackStrike(foe, values.extra || 0.5, ID);
        }
      }
    }
    const wave = evolved ? Math.max(values.wave ?? 0, 1.6) : (values.wave ?? 0);
    if (wave > 0) {
      const crest = { x: hero.x + hero.face * 10, y: surfaceBelow(hero.x, hero.y - 2), face: hero.face, reach: 30 };
      aldricFx(ID, "wave", crest, { damage: progress.stats.ad * wave, quiet: true });
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
