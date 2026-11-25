import { STAMINA } from "../../../../constants/combat";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { refundStamina } from "../../../../game/hero/stamina";
import { skillEvolved, skillLevel, skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { HeroKit } from "../../../../types/kit";
import { SKILL } from "../../constants/skillIds";
import { JADE_SPARKS } from "../../look";
import { createQiWave } from "../effects/qiWave";
import { yun } from "../state";
import { gainSwords } from "../swords";

/** the wave where the dodge ends: how far it runs, how fast, how tall and how hard, in attack damage */
const END_WAVE = { reach: 70, speed: 280, half: 8, power: 1 } as const;

/** a spirit sword cuts a foe the dodge passes through */
function passed(e: Enemy): void {
  if (!skillLevel(SKILL.drift)) return;
  const v = skillValues(SKILL.drift);
  const cuts = skillEvolved(SKILL.drift) ? 2 : 1;
  for (let i = 0; i < cuts; i++) dealDamage(e, progress.stats.ad * v.cut, { fromX: hero.x, kx: 0, ky: -20 });
  game.fx.push(createImpact(...enemyCenter(e), hero.face, false, JADE_SPARKS));
  if (v.chill) e.chill = Math.max(e.chill, withBuild("duration", v.chill));
  if (v.sword && yun.dodgeSwordCd <= 0) {
    yun.dodgeSwordCd = v.sword;
    gainSwords(1);
  }
}

/** the dodge ends: part of its stamina back, and a qi wave runs on ahead (both ways, evolved) */
function ended(): void {
  if (!skillLevel(SKILL.drift)) return;
  const v = skillValues(SKILL.drift);
  if (v.refund) refundStamina(STAMINA.dashCost * v.refund);
  if (!v.wave) return;
  const ways = skillEvolved(SKILL.drift) ? [hero.face, -hero.face] : [hero.face];
  for (const face of ways)
    game.fx.push(
      createQiWave(hero.x + face * 8, hero.y - 16, face, {
        reach: withBuild("area", END_WAVE.reach),
        speed: END_WAVE.speed,
        damage: progress.stats.ad * END_WAVE.power * v.wave,
        half: END_WAVE.half,
      }),
    );
}

/** Drifting Leaf on the shared front dodge */
export const DRIFT_DODGE: NonNullable<HeroKit["dodge"]> = { passed, ended };
