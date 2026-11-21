import { staggerFoe } from "../../../../../game/enemies/stagger";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { later } from "../later";
import { fireRound } from "../round";
import { foesNear } from "../targets";

const ID = "ca_break";

export const CYLINDER_BREAK_DRILL: CalderDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.tierDamage *= 1 + values.tier;
    m.chargeRate *= 1 + (values.rate ?? 0);
    m.tierReach *= 1 + (values.reach ?? 0);
  },
  released({ tier, x, y }, { values, evolved }) {
    const foes = foesNear(x, y - 18, tier.reach * (1 + (values.reach ?? 0)));
    for (let i = 0; i < (values.rounds ?? 0); i++) {
      later(tier.intro + 0.1 * i, () =>
        fireRound(foes[i % Math.max(1, foes.length)] ?? null, {
          power: tier.level * 0.4,
          kind: "ultimate",
          hot: true,
          source: ID,
        }),
      );
    }
    if (values.stagger) {
      later(tier.intro, () => {
        for (const foe of foes) {
          staggerFoe(foe, values.stagger);
        }
      });
    }
    if (evolved) {
      for (let i = 1; i <= values.echo; i++) {
        later(tier.intro + 0.25 * i, () => {
          for (const foe of foes.filter((f) => f.hp > 0)) {
            fireRound(foe, { power: (tier.damage / 10) * 0.3, kind: "ultimate", hot: true, big: true, source: ID });
          }
        });
      }
    }
  },
};
