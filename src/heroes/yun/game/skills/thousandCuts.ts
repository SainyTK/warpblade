import { dealDamage } from "../../../../game/damage";
import { addStacks, consumeStacks } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillLevel, skillValues, withCharms } from "../../../../game/skills/query";
import { game, progress } from "../../../../game/state";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skillIds";

/** Thousand Cuts: ability cuts (and Jade Rain from level 5) leave bleeding wounds */
export const thousandCuts: SkillBehavior = {
  create: () => ({}),
  on: {
    blow(_m, e) {
      const v = skillValues(SKILL.bleed);
      if (e.source !== "abilities" && !(e.source === "ultimate" && v.ult)) return;
      addStacks(e.foe, SKILL.bleed, {
        stacks: 1,
        max: v.max,
        damage: progress.stats.ap * v.damage,
        every: v.every,
        duration: withCharms("duration", v.duration),
      });
    },
  },
};

/** Thousand Petals: a Sword Lotus has ended, so every wounded foe takes what its wounds had left to deal, at once */
export function lotusEnded(): void {
  if (!skillLevel(SKILL.bleed) || !skillEvolved(SKILL.bleed)) return;
  const v = skillValues(SKILL.bleed);
  const left = (progress.stats.ap * v.damage * withCharms("duration", v.duration)) / v.every;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const n = consumeStacks(e, SKILL.bleed);
    if (n) dealDamage(e, left * n * v.burst, { source: SKILL.bleed, kx: 0, ky: -30 });
  }
}
