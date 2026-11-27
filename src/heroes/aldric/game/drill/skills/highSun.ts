import { enemyCenter } from "../../../../../game/enemies/enemy";
import { addStacks } from "../../../../../game/enemies/skillStatus";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { game, hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { createSunPillar } from "../../abilities/pillar";
import { aldricFx } from "../../fx";
import { abilityStrike } from "../strike";

const ID = "al_rally";
const GAP = 24;
const ECHO = 0.35;
const cast = { called: false };
rememberPerSeat(hostMemory(cast));

function pillar(x: number, delay: number, power: number, stun: number): void {
  game.fx.push(
    createSunPillar({ x, delay, damage: progress.stats.ap * power, stun: 0.5 + stun, half: 10, source: ID }),
  );
}

export const HIGH_SUN_DRILL: AldricDrillSkill = {
  id: ID,
  tick() {
    cast.called = false;
  },
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "pillar") {
      return;
    }
    staggerFoe(foe, 0.55 + values.stun);
    abilityStrike(foe, values.extra ?? 0, ID);
    if (values.burn) {
      addStacks(foe, ID, { stacks: 1, max: 4, damage: progress.stats.ap * values.burn, every: 0.5, duration: 3 });
    }
    if (evolved) {
      pillar(foe.x, ECHO, (spell.damage / 10) * 0.6, values.stun);
    }
    if (cast.called) {
      return;
    }
    cast.called = true;
    const [x] = enemyCenter(foe);
    aldricFx(
      ID,
      "pillar",
      { x, y: surfaceBelow(x, foe.y - 2), face: hero.face, reach: 34 },
      {
        damage: progress.stats.ap * (spell.damage / 10 + (values.extra ?? 0)),
        sigil: "sun",
        lift: 34,
      },
    );
    if (evolved) {
      for (const side of [-1, 1]) {
        const sx = x + side * GAP;
        aldricFx(ID, "pillar", { x: sx, y: surfaceBelow(sx, foe.y - 2), reach: 26 }, { quiet: true, delay: ECHO });
      }
    }
    const power = (spell.damage / 10) * 0.6 + (values.extra ?? 0);
    if (values.second) {
      pillar(x + hero.face * GAP, 0.1, power, values.stun);
    }
    if (values.third) {
      pillar(x - hero.face * GAP, 0.18, power, values.stun);
    }
  },
};
