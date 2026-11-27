import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import { shake, surfaceBelow } from "../../../../../game/world";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { roundBlast } from "../../effects/roundBlast";
import { calderFx } from "../../skillFx";
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
    const floor = surfaceBelow(x, hero.y - 2);
    const slam = progress.stats.ad * ((values.quake ?? 0) + values.finisher + 1);
    calderFx(ID, "spikes", { x, y: floor, face: hero.face, reach: (values.reach || 40) * 0.5 }, { damage: slam });
    calderFx(ID, "pillar", { x, y: floor, face: hero.face, reach: 22 }, { damage: slam, quiet: true });
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
          const fault = { x: fx, y: surfaceBelow(fx, hero.y - 2), face: hero.face, reach: 26 };
          calderFx(ID, i === 4 ? "pillar" : "spikes", fault, {
            damage: progress.stats.ad * values.fault,
            quiet: i < 4,
          });
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
