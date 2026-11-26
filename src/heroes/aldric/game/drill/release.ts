import { clampStageX } from "../../../../game/adventure";
import { markFoe } from "../../../../game/enemies/skillStatus";
import { staggerFoe } from "../../../../game/enemies/stagger";
import { game, hero, lights, progress } from "../../../../game/state";
import type { SkillCast } from "../../../../types/drill";
import { DAWN_RELEASE } from "../../constants/drill/release";
import { DAWN_RAMP } from "../../constants/light";
import { createSunPillar } from "../abilities/pillar";
import { createDawnGround } from "../effects/dawnGround";
import { createLightWave } from "../effects/lightWave";

function caught({ tier, x, y, face }: SkillCast) {
  return game.enemies.filter((foe) => {
    const along = tier.around ? Math.abs(foe.x - x) : (foe.x - x) * face;
    return foe.hp > 0 && along >= -6 && along <= tier.reach && Math.abs(foe.y - y) <= tier.height;
  });
}

export function releaseSanctuary(cast: SkillCast): void {
  const { tier, x, y, face } = cast;
  const power = (tier.damage / 10) * progress.stats.ap;
  if (tier.level === 1) {
    for (const lift of DAWN_RELEASE.waveLifts) {
      game.fx.push(
        createLightWave(x + face * 10, y - lift, face, {
          speed: 260,
          reach: tier.reach * 2,
          half: 10,
          damage: power * DAWN_RELEASE.waveShare,
          source: "ultimate",
          pierce: true,
        }),
      );
    }
  } else if (tier.level === 2) {
    DAWN_RELEASE.pillarSteps.forEach((step, i) => {
      game.fx.push(
        createSunPillar({
          x: clampStageX(x + face * step, -8),
          delay: 0.08 + i * 0.09,
          damage: power * DAWN_RELEASE.pillarShare,
          stun: 0.6,
          half: 12,
          source: "ultimate",
        }),
      );
    });
  } else if (tier.level === 3) {
    for (const foe of caught(cast)) {
      markFoe(foe, "ultimate", DAWN_RELEASE.verdictTime, DAWN_RELEASE.verdictMark);
      staggerFoe(foe, DAWN_RELEASE.verdictStun);
    }
  } else {
    hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * DAWN_RELEASE.heal);
    game.fx.push(createDawnGround(x, tier.reach * 1.4, DAWN_RELEASE.groundTime, power * DAWN_RELEASE.groundShare));
  }
  lights.add(x, y - 18, 34 + tier.level * 10, DAWN_RAMP[5], 1, 0.4);
}
