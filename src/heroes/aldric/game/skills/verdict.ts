import { nativeOrDrill } from "../../../../drill";
import { glow, hairline, line, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { markFoe } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { WHITE } from "../../../../utils/color";
import { PILLAR } from "../../constants/abilities";
import { DAWN_RAMP, DAWN_SPARKS } from "../../constants/light";
import { VERDICT } from "../../constants/skillNumbers";
import { createSunPillar } from "../abilities/pillar";
import "../../types/events";
import { surfaceBelow } from "../../../../game/world";
import { aldricFx } from "../fx";

const ID = "al_verdict";
/** how far above the foe the sword appears */
const DROP = 44;

/** a sword of light that drops point first onto the foe and strikes it, marking it; as Final Verdict with a pillar */
export function createVerdictSword(foe: Enemy, delay: number): Effect {
  let t = -delay;
  let struck = false;
  const [x0] = enemyCenter(foe);
  return {
    update(dt) {
      t += dt;
      if (struck || t < VERDICT.fall) return t < VERDICT.fall + 0.2;
      struck = true;
      const v = skillValues(ID);
      const [x, y] = enemyCenter(foe);
      const damage = progress.stats.ad * v.power;
      aldricFx(
        ID,
        "bolt",
        { x, y, reach: Math.max(30, y - 20) },
        { damage, quiet: delay > 0, sigil: "sword", lift: 14 },
      );
      if (skillEvolved(ID)) {
        aldricFx(ID, "pillar", { x, y: surfaceBelow(x, y), reach: 30 }, { quiet: true, damage });
      }
      if (foe.hp > 0) {
        dealDamage(foe, progress.stats.ad * v.power, { source: ID, fromX: hero.x, ky: -20, heavy: true });
        game.fx.push(createImpact(x, y, hero.face, true, DAWN_SPARKS));
        if (v.mark) markFoe(foe, ID, withBuild("duration", VERDICT.mark), v.mark);
      }
      if (skillEvolved(ID))
        game.fx.push(
          createSunPillar({
            x,
            delay: 0,
            damage: progress.stats.ap * PILLAR.power * v.pillar,
            stun: PILLAR.stun,
            half: VERDICT.half,
            source: ID,
          }),
        );
      return true;
    },
    draw() {
      if (t < 0) return;
      place();
      const [x, yFoe] = foe.hp > 0 ? enemyCenter(foe) : [x0, 0];
      const u = Math.min(1, t / VERDICT.fall);
      const tip = yFoe - DROP * (1 - u * u);
      const k = struck ? Math.max(0, 1 - (t - VERDICT.fall) / 0.2) : 1;
      line(x, tip - 16, x, tip, DAWN_RAMP[4], k);
      hairline(x, tip - 15, x, tip, WHITE, k);
      line(x - 3, tip - 13, x + 3, tip - 13, DAWN_RAMP[3], k);
      hairline(x, tip - 20, x, tip - 30, DAWN_RAMP[5], (q) => k * 0.6 * (1 - q));
      glow(x, tip - 6, 9, DAWN_RAMP[4], 0.4 * k);
    },
  };
}

/** the swords fall on this foe, one swing at most */
function call(m: SkillMemory, foe: Enemy | null): void {
  if (!foe || foe.hp <= 0 || m.swing === hero.swing) return;
  m.swing = hero.swing;
  const swords = withBuild("amount", skillValues(ID).swords ?? 1);
  for (let i = 0; i < swords; i++) game.fx.push(createVerdictSword(foe, i * VERDICT.gap));
}

/** Verdict: a Keen blow of his own (and with its fourth level a Counterbash) calls swords of light down on its foe; on
 *  the drill the Sky cut calls them through the drill hooks */
export const verdict: SkillBehavior = nativeOrDrill({
  create: () => ({ swing: -1 }),
  on: {
    blow(m, ev) {
      if (ev.keen && ev.melee && ev.source === "attacks") call(m, ev.foe);
    },
    guardBash(m, ev) {
      if (ev.counter && skillValues(ID).counter) call(m, ev.foe);
    },
  },
});
