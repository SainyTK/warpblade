import { dealDamage } from "../../../../game/damage";
import { skillValues, withCharms } from "../../../../game/skills/query";
import { distance2 } from "../../../../game/skills/targets";
import { game, hero, progress } from "../../../../game/state";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skillIds";
import { createQiRing } from "../effects/qiRing";
import { createQiWave } from "../effects/qiWave";
import { gainSwords } from "../swords";

interface Memory extends SkillMemory {
  /** he left the floor in a jump and has not landed yet */
  jumped: boolean;
  /** seconds before a second jump may give a sword again */
  swordCd: number;
}

/** the landing waves: how far they run, how fast and how tall; a pulled foe's speed toward him */
const LAND_WAVE = { reach: 50, speed: 260, half: 6 } as const;
const PULL = 120;

/** the second jump: a ring of qi round him cuts every foe it reaches */
function ring(m: Memory): void {
  const v = skillValues(SKILL.cloud);
  const radius = withCharms("area", v.radius);
  const cy = hero.y - 14;
  game.fx.push(createQiRing(hero.x, cy, radius));
  for (const e of game.enemies) {
    if (e.hp <= 0 || distance2(e, hero.x, cy) > radius * radius) continue;
    const dir = Math.sign(e.x - hero.x) || hero.face;
    dealDamage(e, progress.stats.ad * v.ring, { fromX: hero.x, kx: v.pull ? -dir * PULL : dir * 60, ky: -40 });
  }
  if (v.sword && m.swordCd <= 0) {
    m.swordCd = v.sword;
    gainSwords(1);
  }
}

/** landing from a jump: qi waves run both ways along the floor */
function land(): void {
  const v = skillValues(SKILL.cloud);
  if (!v.land) return;
  for (const face of [-1, 1])
    game.fx.push(
      createQiWave(hero.x + face * 6, hero.y - 6, face, {
        reach: withCharms("area", LAND_WAVE.reach),
        speed: LAND_WAVE.speed,
        damage: progress.stats.ad * v.land,
        half: LAND_WAVE.half,
      }),
    );
}

/** Cloud Step: the second jump sends a ring of qi, and a landing from a jump sends waves both ways */
export const cloudStep: SkillBehavior = {
  create: (): Memory => ({ jumped: false, swordCd: 0 }),
  update(memory, _s, dt) {
    const m = memory as Memory;
    m.swordCd = Math.max(0, m.swordCd - dt);
    if (!m.jumped || !hero.ground) return;
    m.jumped = false;
    land();
  },
  on: {
    jump(memory, e) {
      const m = memory as Memory;
      m.jumped = true;
      if (e.air) ring(m);
    },
  },
};
