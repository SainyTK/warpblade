import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { createCrystalWave } from "../../effects/crystalWave";
import { later } from "../later";
import { skillStrike } from "../strike";

const ID = "k_keen";
const keen = { finishers: 0, freeUntil: 0, clock: 0 };

export const KEEN_EDGE_DRILL: KaelDrillSkill = {
  id: ID,
  modify(m, { values, evolved }) {
    m.finisherDamage *= 1 + values.finisher;
    if (evolved && keen.clock < keen.freeUntil) {
      m.strikeDamage *= 1 + values.finisher;
    }
  },
  tick(dt) {
    keen.clock += dt;
  },
  swordHit(foe, _infusion, { values }) {
    const strike = drillFighter()?.swing?.kind;
    if (strike === "third" && values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    if (strike === "second" && values.second) {
      skillStrike(foe, values.second, ID, { sureCrit: true });
    }
  },
  slashed(strike, landed, { values, evolved }) {
    if (strike !== "third") {
      return;
    }
    const damage = progress.stats.ad * (values.wave ?? 0);
    if (damage > 0) {
      game.fx.push(createCrystalWave(hero.x, hero.y - 16, hero.face, damage, ID));
      if (values.twin) {
        later(0.08, () => game.fx.push(createCrystalWave(hero.x, hero.y - 26, hero.face, damage, ID)));
      }
    }
    if (evolved && landed) {
      keen.finishers++;
      if (keen.finishers % values.crossEvery === 0) {
        keen.freeUntil = keen.clock + values.free;
        game.fx.push(createCrystalWave(hero.x, hero.y - 20, hero.face, progress.stats.ad * values.cross, ID));
      }
    }
  },
};
