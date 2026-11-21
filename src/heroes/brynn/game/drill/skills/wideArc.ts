import { drillFighter } from "../../../../../drill";
import { ignite } from "../../../../../game/enemies/burn";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createCrescentWave } from "../../effects/heavyWave";
import { skillStrike } from "../strike";

const ID = "br_cleave";
const BEHIND = 26;
const CRESCENT_REACH = 130;

export const WIDE_ARC_DRILL: BrynnDrillSkill = {
  id: ID,
  swordHit(foe, _infusion, { values }) {
    if (drillFighter()?.swing?.kind !== "first") {
      return;
    }
    skillStrike(foe, values.cut, ID);
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    if (values.drag) {
      foe.vx += Math.sign(hero.x - foe.x) * values.drag;
    }
    if (values.burn) {
      ignite(foe, values.burn);
    }
  },
  slashed(strike, _landed, { values, evolved }) {
    if (strike !== "first") {
      return;
    }
    if (values.behind) {
      for (const foe of game.enemies) {
        const behind = (hero.x - foe.x) * hero.face;
        if (foe.hp > 0 && behind > 0 && behind <= BEHIND && Math.abs(foe.y - hero.y) <= 20) {
          skillStrike(foe, values.cut, ID);
        }
      }
    }
    if (evolved) {
      for (const face of [-1, 1]) {
        game.fx.push(
          createCrescentWave({
            x: hero.x,
            y: hero.y - 16,
            face,
            reach: CRESCENT_REACH,
            damage: progress.stats.ad * values.wave,
            source: ID,
          }),
        );
      }
    }
  },
};
