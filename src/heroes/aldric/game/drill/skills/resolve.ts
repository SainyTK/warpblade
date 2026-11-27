import { drillFighter } from "../../../../../drill";
import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { game, hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { createDawnGround } from "../../effects/dawnGround";
import { aldricFx } from "../../fx";
import { attackStrike } from "../strike";

const ID = "al_resolve";
const AFTER_DASH = 0.6;
const GROUND = { width: 30, time: 2.5 } as const;
const resolve = { since: Infinity, airDashing: false };
rememberPerSeat(hostMemory(resolve));

export const RESOLVE_DRILL: AldricDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes;
  },
  tick(dt, { values }) {
    resolve.since += dt;
    const h = drillFighter();
    const airDashing = Boolean(h?.airDashActive);
    if (h && airDashing && !resolve.airDashing && values.restore) {
      h.airSlashes = 0;
    }
    resolve.airDashing = airDashing;
  },
  dashed(foes, { values, evolved }) {
    resolve.since = 0;
    const streak = { x: hero.x - hero.face * 36, y: hero.y - 8, face: hero.face, toX: hero.x, toY: hero.y - 8 };
    aldricFx(ID, "trail", streak, {
      damage: progress.stats.ad * (1 + (values.after ?? 0)),
      quiet: foes.length === 0 && !values.heal,
      sigil: "shield",
      lift: 8,
    });
    if (evolved) {
      aldricFx(ID, "nova", { x: hero.x, y: surfaceBelow(hero.x, hero.y - 2), reach: GROUND.width }, { quiet: true });
    }
    if (values.heal) {
      hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * values.heal);
    }
    if (values.guard) {
      hero.inv = Math.max(hero.inv, values.guard);
    }
    if (evolved) {
      game.fx.push(createDawnGround(hero.x, GROUND.width, GROUND.time, progress.stats.ap * values.ground));
    }
  },
  swordHit(foe, _infusion, { values }) {
    if (values.after && resolve.since <= AFTER_DASH) {
      resolve.since = Infinity;
      attackStrike(foe, values.after, ID);
    }
  },
};
