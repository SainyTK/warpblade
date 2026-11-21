import { hero, progress } from "../../../../../game/state";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { storeCut } from "../../store";
import { later } from "../later";
import { cutAngle, foesAlong, skillStrike } from "../targets";

const BEHIND = 36;
const LAUNCH = 230;

function cutAround(power: number, store: number, pull: boolean, all: boolean): void {
  for (const foe of foesAlong(-BEHIND, all ? BEHIND : -2)) {
    skillStrike(foe, power, SKILL.reverse, { kx: -hero.face * 20 });
    if (store) {
      storeCut(foe, progress.stats.ad * store, cutAngle(foe));
    }
    if (pull && (foe.x - hero.x) * hero.face < 0) {
      foe.x = hero.x + hero.face * 12;
    }
  }
}

export const REVERSE_EDGE_DRILL: SayaDrillSkill = {
  id: SKILL.reverse,
  swordHit(foe, blow, _infusion, { values }) {
    if (blow !== "second") {
      return;
    }
    skillStrike(foe, values.second ?? 0, SKILL.reverse, values.launch ? { launch: LAUNCH } : {});
    if (values.launch && !values.second) {
      foe.vy = -LAUNCH;
    }
    if (values.chill) {
      foe.chill = Math.max(foe.chill, values.chill);
    }
  },
  slashed(blow, _landed, { values, evolved }) {
    if (blow !== "second") {
      return;
    }
    cutAround(values.behind, values.behindStore ?? 0, !!values.pull, false);
    if (evolved) {
      later(0.12, () => cutAround(values.behind, values.behindStore ?? 0, false, true));
    }
  },
};
