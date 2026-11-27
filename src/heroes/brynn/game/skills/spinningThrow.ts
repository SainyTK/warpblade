import { usesDrill } from "../../../../drill";
import { fleck, glow, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { CRIMSON } from "../../constants/colors";
import { brynnFx, PLANTED } from "../fx";

const ID = "br_spin";
/** Iron Wheel: its radius, how often it cuts each foe in it, how fast it turns */
const WHEEL = { radius: 30, every: 0.3, spin: 14 } as const;

/** Iron Wheel: a crimson wheel of blade where she landed, cutting every foe in it now and then */
function createWheel(x: number, y: number): Effect {
  const v = skillValues(ID);
  const life = withBuild("duration", v.wheel);
  const radius = withBuild("area", WHEEL.radius);
  const last = new Map<Enemy, number>();
  let t = 0;
  return {
    update(dt) {
      t += dt;
      for (const e of game.enemies) {
        if (e.hp <= 0 || Math.hypot(e.x - x, e.y - 10 - (y - 16)) > radius) continue;
        if (t - (last.get(e) ?? -1) < WHEEL.every) continue;
        last.set(e, t);
        dealDamage(e, progress.stats.ad * v.wheelPower, { fromX: x, kx: Math.sign(e.x - x) * 40, source: ID });
      }
      return t < life;
    },
    draw() {
      place();
      const k = Math.min(1, (life - t) / 0.3);
      for (let i = 0; i < 2; i++) {
        const a = t * WHEEL.spin + i * Math.PI;
        for (let r = 4; r < radius; r += 0.5) {
          const c = r > radius - 3 ? WHITE : r > radius * 0.6 ? CRIMSON[5] : CRIMSON[4];
          fleck(x + Math.cos(a) * r, y - 16 + Math.sin(a) * r * 0.6, c, k);
          fleck(x + Math.cos(a - 0.2) * r, y - 16 + Math.sin(a - 0.2) * r * 0.6, CRIMSON[3], k * 0.5);
        }
      }
      for (let g = 0; g < TAU; g += 0.08)
        fleck(x + Math.cos(g) * radius, y - 16 + Math.sin(g) * radius * 0.6, CRIMSON[3], 0.4 * k);
      glow(x, y - 16, radius, CRIMSON[3], 0.25 * k);
    },
  };
}

/** Spinning Throw: its numbers tune the shared warp in the kit; Iron Wheel spins where she lands */
export const spinningThrow: SkillBehavior = {
  create: () => ({}),
  on: {
    warp() {
      if (!skillEvolved(ID)) return;
      game.fx.push(createWheel(hero.x, hero.y));
      const damage = progress.stats.ad * skillValues(ID).wheelPower * 4;
      if (!usesDrill())
        brynnFx(ID, "pillar", { x: hero.x, y: hero.y, reach: 40 }, { damage, quiet: true, signature: PLANTED });
    },
  },
};
