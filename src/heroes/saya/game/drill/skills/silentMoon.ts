import { game, progress } from "../../../../../game/state";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";
import { sayaFx } from "../../skillFx";
import { storeCut } from "../../store";
import { later } from "../later";
import { sheathe } from "../sheathe";
import { cutAngle } from "../targets";

export const SILENT_MOON_DRILL: SayaDrillSkill = {
  id: SKILL.moon,
  modify(m, { values }) {
    m.tierDamage *= 1 + values.damage;
    m.chargeRate *= values.rate ?? 1;
    m.tierReach *= 1 + (values.reach ?? 0);
  },
  released({ tier, x, y, face }, { values, evolved }) {
    const blow = (tier.damage / 10) * progress.stats.ap * (1 + (values.damage ?? 0)) * (evolved ? 2 : 1);
    sayaFx(SKILL.moon, { x, y, face, reach: 24 + tier.reach * 0.3 }, { damage: blow });
    if (values.store) {
      for (const foe of game.enemies) {
        const ahead = tier.around ? Math.abs(foe.x - x) : (foe.x - x) * face;
        if (foe.hp > 0 && ahead >= -5 && ahead <= tier.reach && Math.abs(foe.y - y) <= tier.height) {
          storeCut(foe, progress.stats.ap * values.store * tier.level, cutAngle(foe), "ultimate");
        }
      }
    }
    if (values.release && tier.level < 3) {
      sheathe("ultimate");
    }
    if (evolved) {
      later(0.3, () => sheathe("ultimate"));
    }
  },
};
