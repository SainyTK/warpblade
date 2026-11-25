import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { skillValues, withBuild } from "../../../../game/skills/query";
import { distance2 } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../../types/skillBehavior";
import { TAU } from "../../../../utils/math";
import { SKILL } from "../../constants/skillIds";
import { JADE_SPARKS } from "../../look";
import { drawSpiritSword } from "../art/spiritSword";

/** a guardian blade: seconds left, its place on the circle and seconds to its next strike */
interface Guardian {
  left: number;
  angle: number;
  next: number;
  /** seconds left of its dive at a foe, and the foe */
  dive: number;
  at: Enemy | null;
}
interface Memory extends SkillMemory {
  guards: Guardian[];
  cd: number;
}

/** the circle the guardians keep round him, their spin, how far they reach to strike, and a dive's length */
const ORBIT = { radius: 16, height: -20, spin: 2.6, reach: 44, dive: 0.12 } as const;

const where = (g: Guardian): [number, number] => {
  const [ox, oy] = [hero.x + Math.cos(g.angle) * ORBIT.radius, hero.y + ORBIT.height + Math.sin(g.angle) * 6];
  if (!g.at || g.dive <= 0) return [ox, oy];
  const [ex, ey] = enemyCenter(g.at);
  const u = 1 - g.dive / ORBIT.dive;
  return [ox + (ex - ox) * u, oy + (ey - oy) * u];
};

/** Guardian Blade: a landed blow may call a spirit sword that circles Yun and strikes foes near him; evolved, three
 *  always circle him */
export const guardianBlade: SkillBehavior = {
  create: (): Memory => ({ guards: [], cd: 0 }),
  update(memory, state, dt) {
    const m = memory as Memory;
    const v = skillValues(SKILL.guardian);
    m.cd = Math.max(0, m.cd - dt);
    if (state.evolved)
      while (m.guards.length < v.most)
        m.guards.push({ left: 1, angle: rng.range(0, TAU), next: v.every, dive: 0, at: null });
    for (const g of m.guards) {
      g.angle += ORBIT.spin * dt;
      g.dive = Math.max(0, g.dive - dt);
      if (!state.evolved) g.left -= dt;
      g.next -= dt;
      if (g.next > 0) continue;
      g.next = v.every;
      strike(g, v);
    }
    m.guards = m.guards.filter((g) => g.left > 0);
  },
  draw(memory) {
    for (const g of (memory as Memory).guards) {
      const [x, y] = where(g);
      const angle = g.at && g.dive > 0 ? Math.atan2(enemyCenter(g.at)[1] - y, enemyCenter(g.at)[0] - x) : -Math.PI / 2;
      drawSpiritSword(x, y, angle, Math.min(1, g.left * 2), 12);
    }
  },
  on: {
    blow(memory, _e, state) {
      const m = memory as Memory;
      const v = skillValues(SKILL.guardian);
      if (state.evolved || m.cd > 0 || m.guards.length >= v.most || !rng.chance(v.chance)) return;
      m.cd = v.cooldown;
      m.guards.push({ left: withBuild("duration", v.life), angle: rng.range(0, TAU), next: 0.2, dive: 0, at: null });
    },
  },
};

/** the guardian dives at the foes nearest him within reach */
function strike(g: Guardian, v: Readonly<Record<string, number>>): void {
  const near = game.enemies
    .filter((e) => e.hp > 0 && distance2(e, hero.x, hero.y - 16) < ORBIT.reach ** 2)
    .sort((a, b) => distance2(a, hero.x, hero.y) - distance2(b, hero.x, hero.y))
    .slice(0, v.targets);
  for (const e of near) {
    dealDamage(e, progress.stats.ad * v.power, {
      source: SKILL.guardian,
      fromX: hero.x,
      kx: 20 * Math.sign(e.x - hero.x),
    });
    if (v.chill) e.chill = Math.max(e.chill, v.chill);
    game.fx.push(createImpact(...enemyCenter(e), Math.sign(e.x - hero.x) || 1, false, JADE_SPARKS));
  }
  g.at = near[0] ?? null;
  if (g.at) g.dive = ORBIT.dive;
}
