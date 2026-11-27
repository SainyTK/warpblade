import { drillFighter } from "../../../../../drill";
import { createFloorRing } from "../../../../../game/effects/floorRing";
import { game, hero, progress } from "../../../../../game/state";
import { CRIMSON } from "../../../constants/colors";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { ARMOUR, brynnFx } from "../../fx";
import { foesNear, skillStrike } from "../strike";

const ID = "br_ironskin";
const RING = 34;
const skin = { dashing: false, from: 0 };

export const IRON_SKIN_DRILL: BrynnDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airDashes += values.airDashes ?? 0;
  },
  slashed(strike, _landed, { values }) {
    if (strike === "warp" && values.warp) {
      hero.inv = Math.max(hero.inv, values.warp);
    }
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    const dashing = h.dashTime > 0;
    if (dashing) {
      hero.inv = Math.max(hero.inv, values.inv);
    }
    if (!dashing && skin.dashing) {
      const at = { x: skin.from, y: h.y - 16, face: h.face, toX: h.x, toY: h.y - 16 };
      brynnFx(ID, "trail", at, { damage: progress.stats.ad * 1.2 });
      brynnFx(ID, "mark", { x: h.x, y: h.y - 16, face: h.face }, { quiet: true, signature: ARMOUR });
    }
    if (dashing && !skin.dashing) {
      skin.from = h.x;
      if (h.airDashActive && values.refresh) {
        h.airSlashes = 0;
      }
      if (evolved) {
        game.fx.push(createFloorRing(h.x, h.y, RING, CRIMSON, 0.35));
        brynnFx(
          ID,
          "nova",
          { x: h.x, y: h.y, reach: RING * 0.8 },
          { damage: progress.stats.ad * values.ring, quiet: true, signature: ARMOUR },
        );
        for (const foe of foesNear(h.x, h.y - 12, RING)) {
          skillStrike(foe, values.ring, ID);
        }
      }
    }
    skin.dashing = dashing;
  },
};
