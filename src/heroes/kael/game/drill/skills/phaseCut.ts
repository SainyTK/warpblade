import { drillFighter } from "../../../../../drill";
import { clampHeroX } from "../../../../../game/hero/terrain";
import { skillFx } from "../../../../../game/skillFx";
import { hero, progress } from "../../../../../game/state";
import type { Enemy } from "../../../../../types/enemy";
import type { KaelDrillSkill } from "../../../types/drillSkill";
import { foesAhead, skillStrike } from "../strike";

const ID = "k_phase";
const phase = { primed: false };

export const PHASE_CUT_DRILL: KaelDrillSkill = {
  id: ID,
  swordHit(foe, _infusion, { values }) {
    if (drillFighter()?.swing?.kind === "third" && phase.primed && values.after) {
      skillStrike(foe, values.after, ID);
    }
  },
  slashed(strike, landed, { values, evolved }) {
    const h = drillFighter();
    if (strike === "third") {
      phase.primed = false;
    }
    if (!h || strike !== "second" || !landed || !h.grounded) {
      return;
    }
    const targets = foesAhead(evolved ? values.passage : 44);
    const nearest = targets.reduce<Enemy | null>(
      (best, foe) => (best && Math.abs(best.x - h.x) <= Math.abs(foe.x - h.x) ? best : foe),
      null,
    );
    const far = evolved
      ? targets.reduce<Enemy | null>(
          (best, foe) => (best && Math.abs(best.x - h.x) >= Math.abs(foe.x - h.x) ? best : foe),
          null,
        )
      : nearest;
    if (!far) {
      return;
    }
    for (const foe of evolved ? targets : [far]) {
      skillStrike(foe, values.cut ?? 0, ID);
    }
    const fromX = h.x;
    h.x = clampHeroX(far.x + h.face * 12);
    const damage = progress.stats.ad * (values.cut ?? 0) * (evolved ? targets.length : 1);
    skillFx(ID, "trail", { x: fromX, y: h.y - 16, face: h.face, toX: h.x, toY: h.y - 16 }, { damage });
    skillFx(ID, "mark", { x: fromX, y: h.y - 16 }, { quiet: true });
    skillFx(ID, "mark", { x: h.x, y: h.y - 16 }, { quiet: true, delay: 0.06 });
    h.face = h.face === 1 ? -1 : 1;
    hero.inv = Math.max(hero.inv, values.inv ?? 0);
    phase.primed = true;
  },
};
