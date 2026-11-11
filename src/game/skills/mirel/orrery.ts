import { PAL, SAND } from "../../../constants/palette";
import { glow, place } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { drawGearWheel } from "../../hero/mirel/trinkets";
import { game, hero, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe, touches } from "../targets";

const ID = "m_orrery";
/** seconds between a gear's hits, its turn a second, and Celestial Clock's throw */
const GEAR = { every: 0.3, spin: 2.2, throwSpeed: 220, throwPower: 3, chill: 0.6 } as const;

interface Thrown {
  x: number;
  y: number;
  target: Enemy;
}

interface OrreryMemory {
  /** seconds the gears still orbit, and the wait before the next cast may call them */
  left: number;
  cd: number;
  /** seconds until the gears' next hit */
  tick: number;
  thrown: Thrown[];
}

const memoryOf = (m: SkillMemory): OrreryMemory => m as unknown as OrreryMemory;

/** where each gear is now, round her chest */
function gears(): [number, number][] {
  const v = skillValues(ID);
  const n = Math.round(withCharms("amount", v.count));
  const r = withCharms("area", v.radius);
  return Array.from({ length: n }, (_, i) => {
    const a = game.t * GEAR.spin + (i * TAU) / n;
    return [hero.x + Math.cos(a) * r, hero.y - 18 + Math.sin(a) * r * 0.6];
  });
}

/** a small gear planet: a sand-brass rim with teeth, a teal heart */
function drawGear(x: number, y: number, k: number): void {
  drawGearWheel(x, y, game.t * 6, SAND.light, SAND.shade, k);
  glow(x, y, 6, PAL.hour[3], 0.25 * k);
}

/**
 * Orrery: a cast may call gear planets that orbit her and grind the foes they touch; levels raise the chance, the
 * gears' number, orbit, time and damage, and slow what they touch. Celestial Clock keeps them orbiting always and spins
 * them out at foes on every cast.
 */
export const orrery: SkillBehavior = {
  create: () => ({ left: 0, cd: 0, tick: 0, thrown: [] }),
  update(memory, state, dt) {
    const m = memoryOf(memory);
    const v = skillValues(ID);
    m.cd = Math.max(0, m.cd - dt);
    m.left = state.evolved ? Number.POSITIVE_INFINITY : Math.max(0, m.left - dt);
    m.tick -= dt;
    if (m.left > 0 && m.tick <= 0) {
      m.tick = GEAR.every;
      for (const [gx, gy] of gears())
        for (const e of game.enemies) {
          if (e.hp <= 0 || !touches(e, gx, gy, 3)) continue;
          dealDamage(e, progress.stats.ap * v.power, { fromX: gx, source: ID, dot: true });
          if (v.slow) e.chill = Math.max(e.chill, GEAR.chill);
        }
    }
    m.thrown = m.thrown.filter((g) => {
      if (g.target.hp <= 0) return false;
      const tx = g.target.x;
      const ty = g.target.y - 8;
      const d = Math.hypot(tx - g.x, ty - g.y);
      const step = GEAR.throwSpeed * dt;
      if (d <= step + 3) {
        dealDamage(g.target, progress.stats.ap * v.power * GEAR.throwPower, { fromX: g.x, kx: 40, source: ID });
        return false;
      }
      g.x += ((tx - g.x) / d) * step;
      g.y += ((ty - g.y) / d) * step;
      return true;
    });
  },
  draw(memory) {
    const m = memoryOf(memory);
    place();
    if (m.left > 0) {
      const k = Math.min(1, m.left * 3);
      for (const [gx, gy] of gears()) drawGear(gx, gy, k);
    }
    for (const g of m.thrown) drawGear(g.x, g.y, 1);
  },
  on: {
    cast(memory, _event, state) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (state.evolved) {
        for (const [gx, gy] of gears()) {
          const foe = nearestFoe(gx, gy);
          if (foe) m.thrown.push({ x: gx, y: gy, target: foe });
        }
        return;
      }
      if (m.cd > 0 || !rng.chance(v.chance)) return;
      m.cd = withCharms("cooldown", v.cooldown);
      m.left = withCharms("duration", v.life);
    },
  },
};
