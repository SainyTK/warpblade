import { game, progress } from "../../../../../game/state";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { createRoseLine } from "../../effects/roseLine";
import { atFloor, ceriseFx } from "../../fx";
import { roseMark } from "../../mark";
import { foesNear } from "./strike";

const ID = "ce_tempest";

export const ROSE_TEMPEST_DRILL: CeriseDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.tierDamage *= 1 + values.tier;
    m.tierReach *= 1 + (values.reach ?? 0);
    m.chargeRate *= 1 + (values.charge ?? 0);
  },
  released(cast, { values, evolved }) {
    const reach = cast.tier.reach * (1 + (values.reach ?? 0));
    const blow = (cast.tier.damage / 10) * progress.stats.ad * (1 + values.tier);
    ceriseFx(ID, "pillar", atFloor(cast.x + cast.face * 14, cast.y, 30 + cast.tier.level * 4, cast.face), {
      damage: blow,
      sigil: "rose",
      lift: 34,
    });
    ceriseFx(ID, "nova", atFloor(cast.x, cast.y, reach * 0.6, cast.face), { damage: blow, quiet: true });
    for (const side of evolved ? [-1, 1] : []) {
      ceriseFx(ID, "pillar", atFloor(cast.x + side * reach * 0.6, cast.y, 26, cast.face), {
        damage: blow,
        quiet: true,
        delay: 0.08,
      });
    }
    const struck = foesNear(cast.x, cast.y - 20, reach);
    if (values.mark) {
      for (const foe of struck) {
        roseMark(foe);
      }
    }
    if (values.pull) {
      for (const foe of struck) {
        foe.x += Math.sign(cast.x - foe.x) * Math.max(0, Math.min(Math.abs(cast.x - foe.x) - 10, values.pull));
      }
    }
    const damage = (cast.tier.damage / 10) * progress.stats.ad * (values.echo ?? 0);
    if (damage > 0) {
      game.fx.push(createRoseLine(cast.x, cast.y - 30, cast.face, damage, ID, roseMark));
    }
    if (evolved) {
      for (const height of [-12, -38]) {
        game.fx.push(createRoseLine(cast.x, cast.y + height, cast.face, damage || progress.stats.ad * 2, ID, roseMark));
        game.fx.push(
          createRoseLine(cast.x, cast.y + height, -cast.face, damage || progress.stats.ad * 2, ID, roseMark),
        );
      }
    }
  },
};
