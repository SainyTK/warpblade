import { staggerFoe } from "../../../../../game/enemies/stagger";
import { game, progress } from "../../../../../game/state";
import type { ZafirDrillSkill } from "../../../types/drillSkill";
import { sandBurst } from "../../effects/spout";
import { zafirFx } from "../../skillFx";
import { createStorm } from "../../ultimate/sandstorm";
import { openWounds } from "../../wounds";
import { arriving, blindMinion, fighterAt, foesAround, skillStrike } from "../strike";

const ID = "za_arrival";
const AROUND = { wounds: 34, ring: 40, height: 30 };
const DEVIL = { reach: 36, cut: 0.2 };

export const WHIRLWIND_ARRIVAL_DRILL: ZafirDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.warpCooldown *= values.cooldown;
    m.warpDamage *= values.damage;
  },
  swordHit(foe, _infusion, { values }) {
    if (values.stagger && arriving()) {
      staggerFoe(foe, values.stagger);
    }
  },
  slashed(strike, _landed, { values, evolved }) {
    if (strike !== "warp") {
      return;
    }
    const at = fighterAt();
    const vortex = { x: at.x, y: at.y, face: at.face, reach: values.ring ? AROUND.ring * 0.7 : 16 };
    zafirFx(ID, "nova", vortex, { damage: progress.stats.ad * (values.ring || values.damage) });
    for (const foe of foesAround(AROUND.wounds, AROUND.height)) {
      openWounds(foe, values.wounds ?? 0);
    }
    if (values.ring) {
      const { x, y } = fighterAt();
      for (const foe of foesAround(AROUND.ring, AROUND.height)) {
        skillStrike(foe, values.ring, ID);
        blindMinion(foe, values.blind ?? 0);
      }
      sandBurst(x, y - 8, 12);
    }
    if (evolved) {
      zafirFx(ID, "pillar", { x: at.x, y: at.y, face: at.face, reach: DEVIL.reach }, { quiet: true, delay: 0.05 });
      game.fx.push(
        createStorm(1, DEVIL.reach, values.storm, progress.stats.ad * DEVIL.cut, {
          grains: 0.6,
          wounds: 0,
          blind: false,
        }),
      );
    }
  },
};
