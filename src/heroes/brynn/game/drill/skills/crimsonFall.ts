import { game } from "../../../../../game/state";
import { shake } from "../../../../../game/world";
import type { BrynnDrillSkill } from "../../../types/drillSkill";
import { brynnFx } from "../../fx";
import { later } from "../later";
import { skillStrike } from "../strike";

const ID = "br_fall";

export const CRIMSON_FALL_DRILL: BrynnDrillSkill = {
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
        foe.vx += Math.sign(x - foe.x) * values.pull;
      }
    }
    const echo = (share: number) => () => {
      shake(0.12, 2);
      brynnFx(ID, "nova", { x, y, face, reach: reach * 0.4 }, { quiet: true, damage: (tier.damage / 10) * share });
      for (const foe of caught()) {
        skillStrike(foe, (tier.damage / 10) * share, ID);
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
