import { clampStageX } from "../../../../game/adventure";
import { game, lights, progress } from "../../../../game/state";
import type { SkillCast } from "../../../../types/drill";
import { TIER_SHARE, TIER_STORM } from "../../constants/drill/tiers";
import { SAND_RAMP } from "../../constants/palette";
import { createSandWave } from "../effects/sandWave";
import { createSpout } from "../effects/spout";
import { createStorm } from "../ultimate/sandstorm";

export interface StormBoost {
  storm: number;
  blind: boolean;
  twin: number;
}

export function releaseSandstorm({ tier, x, y }: SkillCast, boost: StormBoost): void {
  const plan = TIER_STORM[tier.level - 1];
  const power = (tier.damage / 10) * progress.stats.ad;
  for (let i = 0; i < plan.crescents; i++) {
    for (const dir of [-1, 1]) {
      game.fx.push(
        createSandWave({
          x,
          y: y - 8 - i * 9,
          dir,
          damage: power * TIER_SHARE.crescent,
          range: tier.reach,
          pierce: true,
          wounds: 1,
          source: "ultimate",
        }),
      );
    }
  }
  for (let i = 0; i < plan.spouts; i++) {
    for (const dir of [-1, 1]) {
      const from = clampStageX(x + dir * (10 + i * 22), 8);
      game.fx.push(
        createSpout(from, y, dir, { damage: power * TIER_SHARE.spout, range: 1 + i * 0.4, source: "ultimate" }),
      );
    }
  }
  const life = plan.storm * (1 + boost.storm);
  if (life > 0) {
    const cuts = life / 0.25;
    const cut = (power * TIER_SHARE.storm) / cuts;
    const traits = { grains: 1 + tier.level * 0.25, wounds: 0, blind: boost.blind };
    game.fx.push(createStorm(tier.level, plan.reach, life, cut, traits));
    if (boost.twin) {
      game.fx.push(createStorm(tier.level, plan.reach * 1.6, life, cut * boost.twin, traits));
    }
  }
  lights.add(x, y - 16, 30 + tier.level * 10, SAND_RAMP[4], 0.9, 0.4);
}
