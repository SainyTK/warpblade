import { markFoe } from "../../../game/enemies/skillStatus";
import { refundWarp } from "../../../game/hero/warp";
import { skillValues, withBuild } from "../../../game/skills/query";
import { game } from "../../../game/state";
import { SKILL } from "../constants/skills/ids";
import { resetBaseAbilities } from "./abilities";
import { createEchoRelease } from "./effects/echoRelease";
import { gainBreath } from "./focus";
import { releaseCuts } from "./store";

/**
 * A clean sheathe: every stored cut releases as a sure critical hit, with Clean Sheathe's bonus on the nearest foe; it
 * gives a breath (two with the skill's seventh level), and with the skill marks the foes, gives the abilities and the
 * warp back, and as Perfect Stillness releases a second time.
 */
export function cleanSheathe(): void {
  const v = skillValues(SKILL.clean);
  const released = releaseCuts(true, { clean: true, bonus: v.bonus ?? 0 });
  for (let i = 0; i < (v.breaths ?? 1); i++) gainBreath();
  if (v.mark) for (const c of released) markFoe(c.foe, SKILL.clean, withBuild("duration", v.markTime), v.mark);
  if (v.reset) resetBaseAbilities();
  if (v.warp) refundWarp();
  if (v.twice) game.fx.push(createEchoRelease(released, v.twice, "attacks"));
}
