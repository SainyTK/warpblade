import { drillSession } from "../../../../../drill";
import { hero, progress } from "../../../../../game/state";
import type { DefenseCue } from "../../../../../types/drill";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { storeCut } from "../../store";
import { sheathe } from "../sheathe";
import { cutAngle, foesAlong, skillStrike } from "../targets";

const calm = { cue: null as DefenseCue | null, focusUntil: 0, clock: 0 };
const COUNTER_REACH = 48;

export const CALM_MIND_DRILL: SayaDrillSkill = {
  id: SKILL.calm,
  modify(m, { values }) {
    m.parryWindow *= values.window;
  },
  swordHit(foe, _blow, _infusion, { evolved }) {
    if (evolved && calm.clock < calm.focusUntil) {
      skillStrike(foe, 0.6, SKILL.calm, { sureCrit: true });
    }
  },
  tick(dt, { values, evolved }) {
    calm.clock += dt;
    const cue = drillSession()?.defenseCue ?? null;
    if (!cue || cue === calm.cue) {
      calm.cue = cue;
      return;
    }
    calm.cue = cue;
    const foes = foesAlong(-4, COUNTER_REACH);
    if (cue.kind === "block") {
      if (values.blockStore) {
        for (const foe of foes.slice(0, 1)) {
          storeCut(foe, progress.stats.ad * values.blockStore, cutAngle(foe));
        }
      }
      return;
    }
    if (cue.kind === "hit") {
      return;
    }
    if (values.counter) {
      for (const foe of foes.slice(0, 1)) {
        skillStrike(foe, values.counter, SKILL.calm, { sureCrit: true, heavy: true });
      }
    }
    if (values.mp) {
      hero.mp = Math.min(progress.stats.mp, hero.mp + values.mp);
    }
    if (values.release) {
      sheathe();
    }
    if (evolved) {
      calm.focusUntil = calm.clock + values.focus;
    }
  },
};
