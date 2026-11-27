import { game, hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { AldricDrillSkill } from "../../../types/drillSkill";
import { aldricFx } from "../../fx";
import { later } from "../later";
import { abilityStrike } from "../strike";

const ID = "al_sanctuary";

export const SANCTUARY_DRILL: AldricDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.tierDamage *= 1 + values.tier;
    m.tierReach *= 1 + (values.reach ?? 0);
    m.chargeRate *= 1 + (values.charge ?? 0);
  },
  released({ tier, x, y, face }, { values, evolved }) {
    const reach = tier.reach * (1 + (values.reach ?? 0));
    const caught = () =>
      game.enemies.filter((foe) => {
        const delta = foe.x - x;
        const along = tier.around ? Math.abs(delta) : delta * face;
        return foe.hp > 0 && along >= -5 && along <= reach && Math.abs(foe.y - y) <= tier.height;
      });
    if (values.pull) {
      for (const foe of caught()) {
        foe.vx += (x - foe.x > 0 ? 1 : -1) * values.pull;
      }
    }
    if (values.heal) {
      hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * values.heal);
    }
    const floor = surfaceBelow(x, y - 2);
    const power = (tier.damage / 10) * progress.stats.ap;
    aldricFx(
      ID,
      "nova",
      { x, y: floor, face, reach: Math.min(reach, 70) },
      { damage: power, sigil: "shield", lift: 26 },
    );
    if (evolved) {
      aldricFx(ID, "pillar", { x, y: floor, reach: 40 }, { quiet: true, delay: 0.1 });
    }
    const echo = (share: number) => () => {
      aldricFx(ID, "nova", { x, y: floor, reach: Math.min(reach, 60) * 0.8 }, { quiet: true, damage: power * share });
      for (const foe of caught()) {
        abilityStrike(foe, (tier.damage / 10) * share, ID);
      }
    };
    if (values.echo) {
      later(0.4, echo(values.echo));
    }
    if (evolved) {
      later(0.7, echo(values.burst));
      later(1, echo(values.burst));
    }
  },
};
