import { progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { VesperDrillSkill } from "../../../types/drillSkill";
import { vesperFx } from "../../skillFx";
import { dance } from "../dance";
import { later } from "../later";
import { releaseWaltz } from "../release";
import { foesNear } from "../strike";

const ID = "ve_waltz";

export const DUSK_WALTZ_DRILL: VesperDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.tierDamage *= values.damage;
    m.chargeRate *= values.charge ?? 1;
    m.tierReach *= values.reach ?? 1;
  },
  released(cast, { values, evolved }) {
    const { tier, x, y, face } = cast;
    const foes = foesNear(x, y - 16, tier.reach);
    const blow = (tier.damage / 10) * progress.stats.ap * values.damage;
    vesperFx(ID, { x, y: surfaceBelow(x, y - 4), face, reach: 20 + tier.reach * 0.25 }, { damage: blow });
    if (values.pull) {
      for (const foe of foes) {
        foe.vx += (x - foe.x) * values.pull;
      }
    }
    if (values.cuts) {
      dance(foes.slice(0, 8), values.cuts, (tier.damage / 10) * progress.stats.ap * 0.12, ID);
    }
    if (evolved) {
      later(0.5, () => releaseWaltz(cast, values.again));
    }
  },
};
