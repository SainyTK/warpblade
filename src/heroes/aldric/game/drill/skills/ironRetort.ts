import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import type { Enemy } from "../../../../../types/enemy";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { createLightWave } from "../../effects/lightWave";
import { attackStrike } from "../strike";

const ID = "al_retort";
const REACH = 40;

function attacker(fromX: number): Enemy | undefined {
  return game.enemies
    .filter((foe) => foe.hp > 0 && Math.abs(foe.x - fromX) <= REACH && Math.abs(foe.y - hero.y) <= 40)
    .sort((a, b) => Math.abs(a.x - fromX) - Math.abs(b.x - fromX))[0];
}

function wave(face: number, power: number): void {
  game.fx.push(
    createLightWave(hero.x + face * 8, hero.y - 16, face, {
      speed: 240,
      reach: 120,
      half: 12,
      damage: progress.stats.ad * power,
      source: ID,
      pierce: true,
    }),
  );
}

export const IRON_RETORT_DRILL: AldricDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.parryWindow *= values.window;
  },
  parried(fromX, { values, evolved }) {
    const foe = attacker(fromX);
    if (foe) {
      attackStrike(foe, values.strike ?? 0, ID, { kx: hero.face * 80 });
      if (values.stagger) {
        staggerFoe(foe, values.stagger);
      }
    }
    const h = drillFighter();
    if (values.warp && h) {
      h.warpReadyIn = 0;
      hero.warpCd = 0;
    }
    if (evolved) {
      wave(1, values.waves);
      wave(-1, values.waves);
    }
  },
  blocked(fromX, { values }) {
    const foe = attacker(fromX);
    if (foe && values.block) {
      attackStrike(foe, values.block, ID);
    }
  },
};
