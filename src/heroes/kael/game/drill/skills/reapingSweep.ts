import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { skillFx } from "../../../../../game/skillFx";
import { game, hero, progress } from "../../../../../game/state";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { skillStrike } from "../strike";

const ID = "k_reap";

export const REAPING_SWEEP_DRILL: KaelDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.strikeReach *= 1 + (values.reach ?? 0);
  },
  swordHit(foe, _infusion, { values }) {
    if (drillFighter()?.swing?.kind !== "first") {
      return;
    }
    foe.vx += (hero.x - foe.x > 0 ? 1 : -1) * values.pull;
    skillStrike(foe, values.sweep ?? 0, ID);
    if (values.trip) {
      staggerFoe(foe, values.trip);
    }
    if (values.chill) {
      foe.chill = Math.max(foe.chill, values.chill);
    }
  },
  slashed(strike, landed, { values, evolved }) {
    if (strike === "first") {
      const at = { x: hero.x, y: hero.y - 16, face: hero.face, reach: 24 * (1 + (values.reach ?? 0)) };
      skillFx(ID, "slash", at, { damage: progress.stats.ad * (1 + (values.sweep ?? 0)), quiet: !landed });
      if (evolved) {
        skillFx(ID, "wave", { x: hero.x, y: hero.y, face: hero.face, reach: values.harvest }, { quiet: true });
      }
    }
    if (strike !== "first" || !values.behind) {
      return;
    }
    const reach = evolved ? values.harvest : 34;
    for (const foe of game.enemies) {
      const behind = (hero.x - foe.x) * hero.face;
      const ahead = -behind;
      const caught = evolved ? ahead > 40 && ahead <= reach : behind > 0 && behind <= reach;
      if (foe.hp > 0 && caught && Math.abs(foe.y - hero.y) <= 20) {
        foe.vx += (hero.x - foe.x > 0 ? 1 : -1) * values.pull;
        skillStrike(foe, values.sweep ?? values.behind, ID);
      }
    }
  },
};
