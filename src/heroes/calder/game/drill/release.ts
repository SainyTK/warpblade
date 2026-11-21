import { enemyCenter } from "../../../../game/enemies/enemy";
import { hero } from "../../../../game/state";
import type { SkillCast } from "../../../../types/drill";
import { later } from "./later";
import { fireRound } from "./round";
import { foesAhead, foesNear } from "./targets";

const ROUND_SHARE = 0.06;

export function releaseRounds({ tier, x, y }: SkillCast): void {
  const power = (tier.damage / 10) * ROUND_SHARE;
  if (tier.level === 4) {
    const foes = foesNear(x, y - 18, tier.reach);
    for (let i = 0; i < 6; i++) {
      const foe = foes[i % Math.max(1, foes.length)] ?? null;
      const angle = (i / 6) * Math.PI * 2;
      const at = foe ? enemyCenter(foe) : ([x + Math.cos(angle) * 40, y - 20 + Math.sin(angle) * 14] as const);
      later(tier.intro * 0.1 + i * 0.07, () =>
        fireRound(foe, { power, kind: "ultimate", hot: true, big: i === 5 }, at),
      );
    }
    return;
  }
  const foes = foesAhead(tier.reach).slice(0, tier.level === 1 ? 1 : 6);
  for (const [i, foe] of foes.entries()) {
    later(i * 0.04, () => fireRound(foe, { power, kind: "ultimate", hot: tier.level === 3 }));
  }
  if (foes.length === 0) {
    fireRound(null, { power, kind: "ultimate" }, [hero.x + hero.face * tier.reach * 0.6, hero.y - 18]);
  }
}
