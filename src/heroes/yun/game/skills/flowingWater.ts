import { KEEN } from "../../../../constants/combo";
import { createPayoff } from "../../../../game/skills/payoff";
import { skillLevel, skillValues } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { SKILL } from "../../constants/skillIds";
import { createQiWave } from "../effects/qiWave";
import { CRESCENTS, yunFx } from "../fx";
import { yun } from "../state";
import { gainSwords } from "../swords";

/** a Keen blow's qi wave: how far it runs, how fast, how tall; the rise of the second and third wave of Still Water */
const WAVE = { reach: 90, speed: 300, half: 9 } as const;
const STILL_WATER_RISE = [0, -10, 8] as const;
/** speed a Keen blow throws an airborne foe up with */
const LIFT = 160;

/** Keen timing with Flowing Water: a little longer */
export const keenWindow = (): number => KEEN.window + (skillValues(SKILL.flow).window ?? 0);

/** a Keen blow has landed: a spirit sword, a qi wave at its foe, and an airborne foe thrown higher */
export function keenLanded(foe: Enemy | null): void {
  if (!skillLevel(SKILL.flow)) return;
  const v = skillValues(SKILL.flow);
  if (v.sword && yun.keenSwordCd <= 0) {
    yun.keenSwordCd = v.sword;
    gainSwords(1);
  }
  if (v.lift && foe?.air) foe.vy = Math.min(foe.vy, -LIFT);
  const at = { x: hero.x + hero.face * 10, y: hero.y - 20, face: hero.face, reach: 18 };
  yunFx(SKILL.flow, "slash", at, { damage: progress.stats.ad * (v.wave ?? 1) * (v.waves ?? 1), signature: CRESCENTS });
  if (!v.wave) return;
  const payoff = createPayoff();
  for (let i = 0; i < (v.waves ?? 1); i++)
    game.fx.push(
      createQiWave(hero.x + hero.face * 10, hero.y - 20 + STILL_WATER_RISE[i % STILL_WATER_RISE.length], hero.face, {
        reach: WAVE.reach,
        speed: WAVE.speed,
        damage: progress.stats.ad * v.wave,
        half: WAVE.half,
        payoff,
      }),
    );
}
