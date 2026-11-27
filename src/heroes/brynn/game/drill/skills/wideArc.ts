import { drillFighter } from "../../../../../drill";
import { ignite } from "../../../../../game/enemies/burn";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../../game/state";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createCrescentWave } from "../../effects/heavyWave";
import { brynnFx, CRESCENT } from "../../fx";
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
    const damage = progress.stats.ad * (values.cut ?? 1);
    brynnFx(ID, "slash", { x: hero.x + hero.face * 12, y: hero.y - 16, face: hero.face, reach: 22 }, { damage });
    brynnFx(ID, "nova", { x: hero.x + hero.face * 8, y: hero.y, reach: 22 }, { damage, quiet: true, delay: 0.05 });
    if (values.behind) {
      brynnFx(
        ID,
        "slash",
        { x: hero.x - hero.face * 10, y: hero.y - 16, face: -hero.face, reach: 16 },
        { quiet: true },
      );
      for (const foe of game.enemies) {
        const behind = (hero.x - foe.x) * hero.face;
        if (foe.hp > 0 && behind > 0 && behind <= BEHIND && Math.abs(foe.y - hero.y) <= 20) {
          skillStrike(foe, values.cut, ID);
        }
      }
    }
    if (evolved) {
      for (const face of [-1, 1]) {
        const wave = { x: hero.x, y: hero.y - 16, face, reach: 20 };
        brynnFx(ID, "slash", wave, {
          damage: progress.stats.ad * values.wave,
          quiet: true,
          signature: CRESCENT,
        });
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
