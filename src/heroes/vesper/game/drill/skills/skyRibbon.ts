import { drillFighter } from "../../../../../drill";
import { game, hero, progress } from "../../../../../game/state";
import type { Enemy } from "../../../../../types/enemy";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { createDuskWave } from "../../effects/duskWave";
import { echo } from "../effects";
import { skillStrike } from "../strike";

const ID = "ve_sky";
const DIVE = { speed: 230, life: 0.45, rise: 0.7 } as const;

export const SKY_RIBBON_DRILL: VesperDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airSlashes += values.air;
  },
  swordHit(foe, _infusion, strike, { values }) {
    if (strike !== "air") {
      return;
    }
    skillStrike(foe, values.bonus ?? 0, ID);
    if (values.echo && foe.air) {
      echo(foe, values.echo, ID);
    }
  },
  slashed(strike, _landed, { values, evolved }) {
    const h = drillFighter();
    if (!evolved || strike !== "air" || !h) {
      return;
    }
    game.fx.push(
      createDuskWave({
        x: hero.x + h.face * 6,
        y: hero.y - 18,
        face: h.face,
        rise: DIVE.rise,
        damage: progress.stats.ad * values.ribbon,
        speed: DIVE.speed,
        life: DIVE.life,
        struck: new Set<Enemy>(),
        source: ID,
      }),
    );
  },
};
