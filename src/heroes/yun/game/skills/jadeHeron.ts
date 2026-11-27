import { skillValues } from "../../../../game/skills/query";
import { game, hero, progress, rng } from "../../../../game/state";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skillIds";
import { createHeron } from "../effects/heron";
import { HERON, yunFx } from "../fx";

interface Memory extends SkillMemory {
  cd: number;
}
/** the heights herons fly at, from Yun's feet, and how far they fly */
const HEIGHTS = [-14, -30, -22] as const;
const REACH = 170;

/** herons leave from Yun's side and fly the line ahead */
function call(m: Memory): void {
  const v = skillValues(SKILL.heron);
  if (m.cd > 0 || !rng.chance(v.chance)) return;
  m.cd = v.cooldown;
  const at = {
    x: hero.x + hero.face * 6,
    y: hero.y - 22,
    face: hero.face,
    toX: hero.x + hero.face * REACH * 0.5,
    toY: hero.y - 22,
  };
  yunFx(SKILL.heron, "trail", at, { damage: progress.stats.ad * v.power * v.count, signature: HERON });
  for (let i = 0; i < v.count; i++)
    game.fx.push(
      createHeron({
        x: hero.x + hero.face * 6,
        y: hero.y + HEIGHTS[i % HEIGHTS.length],
        face: hero.face,
        reach: REACH,
        damage: progress.stats.ad * v.power,
        back: !!v.back,
        stun: v.stun ?? 0,
        source: SKILL.heron,
      }),
    );
}

/** Jade Heron: a cast may call herons of qi that fly through the line ahead; from level 8 Jade Rain calls them too */
export const jadeHeron: SkillBehavior = {
  create: (): Memory => ({ cd: 0 }),
  update(memory, _s, dt) {
    const m = memory as Memory;
    m.cd = Math.max(0, m.cd - dt);
  },
  on: {
    cast(memory) {
      call(memory as Memory);
    },
    ultimate(memory) {
      if (skillValues(SKILL.heron).ult) call(memory as Memory);
    },
  },
};
