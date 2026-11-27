import { drillFighter } from "../../../../../drill";
import { createFloorRing } from "../../../../../game/effects/floorRing";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, progress } from "../../../../../game/state";
import { CRIMSON } from "../../../constants/colors";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { createQuake } from "../../effects/quake";
import { brynnFx, PLANTED, SPUN } from "../../fx";
import { foesNear, skillStrike } from "../strike";

const ID = "br_spin";

export const SPINNING_THROW_DRILL: BrynnDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.warpCooldown *= values.cooldown;
    m.warpDamage *= 1 + values.damage;
  },
  slashed(strike, _landed, { values, evolved }) {
    const h = drillFighter();
    if (strike !== "warp" || !h) {
      return;
    }
    brynnFx(
      ID,
      "slash",
      { x: h.x + h.face * 12, y: h.y - 18, face: h.face, reach: 20 },
      {
        damage: progress.stats.ad * (1 + values.damage) * 2,
        signature: SPUN,
      },
    );
    if (values.ring) {
      brynnFx(
        ID,
        "nova",
        { x: h.x, y: h.y, reach: values.radius * 0.7 },
        { damage: progress.stats.ad * values.ring, quiet: true },
      );
      game.fx.push(createFloorRing(h.x, h.y, values.radius, CRIMSON, 0.35));
      for (const foe of foesNear(h.x, h.y - 12, values.radius)) {
        skillStrike(foe, values.ring, ID);
        if (values.stagger) {
          staggerFoe(foe, values.stagger);
        }
      }
    }
    if (values.refresh) {
      h.airDashes = Math.max(h.airDashes, 1);
      h.airSlashes = 0;
    }
    if (evolved) {
      brynnFx(
        ID,
        "pillar",
        { x: h.x, y: h.y, reach: 40 },
        {
          damage: progress.stats.ad * values.quake,
          quiet: true,
          delay: 0.05,
          signature: PLANTED,
        },
      );
      game.fx.push(
        createQuake({
          x: h.x,
          y: h.y,
          reach: 60,
          damage: progress.stats.ad * values.quake,
          delay: 0.05,
          launch: -240,
          height: 30,
          source: ID,
        }),
      );
    }
  },
};
