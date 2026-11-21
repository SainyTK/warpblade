import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero } from "../../../../../game/state";
import { shake } from "../../../../../game/world";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { roundBlast } from "../../effects/roundBlast";
import { later } from "../later";
import { fireRound } from "../round";
import { skillStrike } from "../strike";
import { foesNear } from "../targets";
import { struckThisSwing } from "../trigger";

const ID = "ca_breech";

export const BREECH_SLAM_DRILL: CalderDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.finisherDamage *= 1 + values.finisher;
  },
  slashed(strike, landed, { values, evolved }) {
    if (strike !== "third") {
      return;
    }
    const x = hero.x + hero.face * 22;
    if (values.quake) {
      shake(0.12, 2);
      for (const foe of foesNear(x, hero.y - 8, values.reach || 40)) {
        skillStrike(foe, values.quake, ID, { ky: -80, kx: 0 });
        if (values.stagger) {
          staggerFoe(foe, values.stagger);
        }
      }
    }
    const foe = struckThisSwing()[0];
    if (values.twin && landed && foe) {
      later(0.06, () => fireRound(foe, { power: 0.8, kind: "trigger", hot: true, source: ID }));
    }
    if (evolved) {
      for (let i = 1; i <= 4; i++) {
        later(i * 0.06, () => {
          const fx = hero.x + hero.face * (22 + i * 28);
          roundBlast(fx, hero.y - 4, hero.face, true, false);
          for (const hit of game.enemies.filter(
            (e) => e.hp > 0 && Math.abs(e.x - fx) < 16 && Math.abs(e.y - hero.y) < 20,
          )) {
            skillStrike(hit, values.fault, ID, { ky: -120, kx: 0 });
          }
        });
      }
    }
  },
};
