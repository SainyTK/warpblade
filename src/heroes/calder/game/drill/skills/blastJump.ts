import { drillFighter } from "../../../../../drill";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { roundBlast } from "../../effects/roundBlast";
import { calderFx, calderRing } from "../../skillFx";
import { skillStrike } from "../strike";
import { foesNear } from "../targets";

const ID = "ca_blastjump";
const air = { grounded: true, falling: 0 };

function blast(power: number, reach: number, stagger: number): void {
  roundBlast(hero.x, hero.y - 2, hero.face, false, reach > 40);
  const at = { x: hero.x, y: surfaceBelow(hero.x, hero.y - 2), face: hero.face, reach: reach * 0.9 };
  if (reach > 40) {
    calderRing(ID, "wave", at, { damage: progress.stats.ad * power });
  } else {
    calderFx(ID, "pillar", at, { damage: progress.stats.ad * power });
  }
  if (reach > 40) {
    calderFx(ID, "pillar", { ...at, reach: 40 }, { damage: progress.stats.ad * power, quiet: true });
  }
  for (const foe of foesNear(hero.x, hero.y - 8, reach)) {
    skillStrike(foe, power, ID, { ky: -100, kx: Math.sign(foe.x - hero.x) * 60 });
    if (stagger) {
      staggerFoe(foe, stagger);
    }
  }
}

export const BLAST_JUMP_DRILL: CalderDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airSlashes += values.air;
    m.airDashes += values.airDashes ?? 0;
  },
  tick(_dt, { values, evolved }) {
    const h = drillFighter();
    if (!h) {
      return;
    }
    if (air.grounded && !h.grounded && h.vy < 0 && values.blast) {
      blast(values.blast, 30, values.stagger ?? 0);
    }
    if (!air.grounded && h.grounded && evolved && air.falling > 300) {
      blast(values.land, 70, 0.5);
    }
    air.falling = h.grounded ? 0 : Math.max(air.falling, h.vy);
    air.grounded = h.grounded;
  },
};
