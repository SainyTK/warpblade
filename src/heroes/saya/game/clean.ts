import { markFoe } from "../../../game/enemies/skillStatus";
import { refundWarp } from "../../../game/hero/warp";
import { skillLevel, skillValues, withBuild } from "../../../game/skills/query";
import { game, hero } from "../../../game/state";
import { SKILL } from "../constants/skills/ids";
import { resetBaseAbilities } from "./abilities";
import { createEchoRelease } from "./effects/echoRelease";
import { gainBreath } from "./focus";
import { sayaFx } from "./skillFx";
import { releaseCuts } from "./store";

/**
 * A clean sheathe: every stored cut releases as a sure critical hit, with Clean Sheathe's bonus on the nearest foe; it
 * gives a breath (two with the skill's seventh level), and with the skill marks the foes, gives the abilities and the
 * warp back, and as Perfect Stillness releases a second time.
 */
export function cleanSheathe(): void {
  const v = skillValues(SKILL.clean);
  const released = releaseCuts(true, { clean: true, bonus: v.bonus ?? 0 });
  if (skillLevel(SKILL.clean) && released.length) {
    const total = released.reduce((sum, cut) => sum + cut.amount, 0) * (v.twice ? 1 + v.twice : 1);
    const at = {
      x: hero.x - hero.face * 22,
      y: hero.y - 14,
      face: hero.face,
      toX: hero.x + hero.face * 10,
      toY: hero.y - 14,
    };
    sayaFx(SKILL.clean, at, { damage: total });
  }
  for (let i = 0; i < (v.breaths ?? 1); i++) gainBreath();
  if (v.mark) for (const c of released) markFoe(c.foe, SKILL.clean, withBuild("duration", v.markTime), v.mark);
  if (v.reset) resetBaseAbilities();
  if (v.warp) refundWarp();
  if (v.twice) game.fx.push(createEchoRelease(released, v.twice, "attacks"));
}
