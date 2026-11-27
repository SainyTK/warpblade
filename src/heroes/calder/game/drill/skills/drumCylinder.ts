import { drillFighter } from "../../../../../drill";
import { hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { calderFx, calderRing } from "../../skillFx";
import { later } from "../later";
import { fireRound } from "../round";
import { foesNear } from "../targets";

const ID = "ca_drum";
const dash = { was: 0 };

export const DRUM_CYLINDER_DRILL: CalderDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes;
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    const started = h.dashTime > 0 && dash.was === 0;
    dash.was = h.dashTime;
    if (h.dashTime > 0 && values.inv) {
      hero.inv = Math.max(hero.inv, 0.05);
    }
    if (!started) {
      return;
    }
    const spin = { x: hero.x, y: surfaceBelow(hero.x, hero.y - 2), face: hero.face, reach: 18 };
    calderRing(ID, "wave", spin, { damage: progress.stats.ad * (values.mine ?? 0.5) * (evolved ? 2 : 1) });
    if (h.airDashActive && values.airCut) {
      h.airSlashes = 0;
    }
    if (evolved) {
      h.warpReadyIn = 0;
    }
    if (values.mine) {
      const x = hero.x;
      const y = hero.y - 10;
      later(0.3, () => {
        const foes = foesNear(x, y, 26);
        calderFx(ID, "burst", { x, y, reach: 10 }, { damage: progress.stats.ad * values.mine, quiet: true });
        fireRound(foes[0] ?? null, { power: values.mine, kind: "shot", source: ID }, [x, y]);
      });
    }
  },
};
