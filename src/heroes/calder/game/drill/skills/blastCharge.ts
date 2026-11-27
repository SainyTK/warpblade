import { drillSession } from "../../../../../drill";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { calderFx } from "../../skillFx";
import { later } from "../later";
import { fireRound } from "../round";
import { skillStrike } from "../strike";
import { foesNear } from "../targets";

const ID = "ca_charge";

export const BLAST_CHARGE_DRILL: CalderDrillSkill = {
  id: ID,
  spellHit(foe, spell, { values, evolved }) {
    if (spell.id !== "charge") {
      return;
    }
    skillStrike(foe, values.bonus * 5, "abilities", {
      heavy: !!values.heavy,
      kx: Math.sign(foe.x - (drillSession()?.fighter.x ?? foe.x)) * 120,
    });
    if (values.stagger) {
      staggerFoe(foe, values.stagger);
    }
    const session = drillSession();
    const [x, y] = enemyCenter(foe);
    const boom = progress.stats.ap * (spell.damage / 10 + values.bonus * 5);
    calderFx(ID, "burst", { x, y, reach: 10 }, { damage: boom });
    if (evolved) {
      calderFx(ID, "pillar", { x, y: surfaceBelow(x, y), reach: 34 }, { damage: boom, quiet: true, delay: 0.05 });
    }
    if (values.second && session && !values.chained) {
      const other = foesNear(x, y, 90, [foe])[0];
      if (other) {
        const [ox, oy] = enemyCenter(other);
        session.elementImpacts.push({ spell, x: ox, y: oy, face: session.fighter.face, age: 0, fromSword: true });
        skillStrike(other, (spell.damage / 10) * 0.6, "abilities");
      }
    }
    if (evolved) {
      for (let i = 0; i < values.rounds; i++) {
        const angle = (i / values.rounds) * Math.PI * 2;
        later(0.05 * i, () =>
          fireRound(null, { power: 0.8, kind: "shot", hot: true, source: ID }, [
            x + Math.cos(angle) * 26,
            y + Math.sin(angle) * 12,
          ]),
        );
      }
    }
  },
  swordHit(foe, infusion, { values }) {
    if (infusion?.id === "charge" && values.plant) {
      later(0.25, () =>
        fireRound(foe.hp > 0 ? foe : null, { power: values.plant, kind: "shot", source: ID }, enemyCenter(foe)),
      );
    }
  },
};
