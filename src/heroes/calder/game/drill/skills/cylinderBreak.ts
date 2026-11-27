import { enemyCenter } from "../../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../../game/enemies/stagger";
import { hero, progress } from "../../../../../game/state";
import { surfaceBelow } from "../../../../../game/world";
import type { CalderDrillSkill } from "../../../types/drillSkill";
import { calderFx, calderRing } from "../../skillFx";
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
    const power = progress.stats.ad * (tier.damage / 10) * (1 + values.tier);
    later(tier.intro, () => {
      const floor = surfaceBelow(x, y - 2);
      calderRing(ID, "wave", { x, y: floor, face: hero.face, reach: tier.reach * 0.5 }, { damage: power });
      calderFx(
        ID,
        "burst",
        { x: x + hero.face * 14, y: y - 18, face: hero.face, reach: 14 },
        { damage: power, quiet: true },
      );
    });
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
            const [ex, ey] = enemyCenter(foe);
            calderFx(ID, "burst", { x: ex, y: ey, reach: 9 }, { damage: power * 0.3, quiet: i < values.echo });
            fireRound(foe, { power: (tier.damage / 10) * 0.3, kind: "ultimate", hot: true, big: true, source: ID });
          }
        });
      }
    }
  },
};
