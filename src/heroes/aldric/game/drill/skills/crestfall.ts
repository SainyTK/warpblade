import { drillFighter } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import { shake } from "../../../../../game/world";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { createSunPillar } from "../../abilities/pillar";
import { foesNear } from "../../strike";
import { attackStrike } from "../strike";

const ID = "al_crest";
const STEP = 28;

function pillar(x: number, delay: number, power: number): void {
  game.fx.push(createSunPillar({ x, delay, damage: progress.stats.ad * power, stun: 0.5, half: 10, source: ID }));
}

export const CRESTFALL_DRILL: AldricDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.finisherDamage *= 1 + values.finisher;
  },
  swordHit(foe, _infusion, { values }) {
    if (drillFighter()?.swing?.kind !== "third") {
      return;
    }
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    if (values.pillar) {
      pillar(enemyCenter(foe)[0], 0.12, values.pillar);
    }
  },
  slashed(strike, _landed, { values, evolved }) {
    if (strike !== "third") {
      return;
    }
    if (values.ring) {
      shake(0.12, 2.5);
      for (const foe of foesNear(hero.x + hero.face * 14, hero.y - 6, values.radius)) {
        attackStrike(foe, values.ring, ID, { ky: -60 });
      }
    }
    if (evolved) {
      for (let i = 0; i < values.pillars; i++) {
        pillar(hero.x + hero.face * STEP * (i + 1), 0.1 + i * 0.08, values.pillar);
      }
    }
  },
};
