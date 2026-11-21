import { clampStageX } from "../../../../game/adventure";
import { game, lights, progress } from "../../../../game/state";
import type { SkillCast } from "../../../../types/drill";
import { ROSE_RAMP } from "../../look/rose";
import { createRoseLine } from "../effects/roseLine";
import { roseMark } from "../mark";

const STREAK_SHARE = 0.35;

export function releaseTempest({ tier, x, y, face }: SkillCast): void {
  const damage = (tier.damage / 10) * progress.stats.ad * STREAK_SHARE;
  const height = y - 17;
  const end = clampStageX(x + face * tier.reach, -8);
  game.fx.push(createRoseLine(x, height, face, damage, "ultimate", roseMark, end));
  if (tier.around) {
    game.fx.push(
      createRoseLine(x, height, -face, damage, "ultimate", roseMark, clampStageX(x - face * tier.reach, -8)),
    );
  }
  lights.add(x, height, 30 + tier.level * 8, ROSE_RAMP[4], 0.9, 0.35);
}
