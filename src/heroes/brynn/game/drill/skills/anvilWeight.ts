import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createFloorWave } from "../../effects/floorWave";
import { createPillars } from "../../effects/pillars";
import { later } from "../later";

const ID = "br_slam";
const REACH = 90;
const SPEED = 300;
const TWIN_AFTER = 0.18;

function shockwave(face: number, damage: number): void {
  game.fx.push(
    createFloorWave({ x: hero.x, y: hero.y, face, reach: REACH, speed: SPEED, damage, kind: "shock", source: ID }),
  );
}

export const ANVIL_WEIGHT_DRILL: BrynnDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.finisherDamage *= 1 + (values.finisher ?? 0);
  },
  swordHit(foe, _infusion, { values }) {
    if (values.stagger && drillFighter()?.swing?.kind === "third") {
      staggerFoe(foe, values.stagger);
    }
  },
  slashed(strike, _landed, { values, evolved }) {
    if (strike !== "third") {
      return;
    }
    const damage = progress.stats.ad * values.wave;
    const faces = values.both ? [hero.face, -hero.face] : [hero.face];
    const send = () => {
      for (const face of faces) {
        shockwave(face, damage);
      }
    };
    send();
    if (values.twin) {
      later(TWIN_AFTER, send);
    }
    if (evolved) {
      game.fx.push(
        createPillars({
          x: hero.x + hero.face * 20,
          y: hero.y,
          face: hero.face,
          count: 4,
          gap: 24,
          every: 0.07,
          delay: 0.05,
          damage: progress.stats.ad * values.pillars,
          launch: -220,
        }),
      );
    }
  },
};
