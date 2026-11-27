import { SPARKS } from "../../../../constants/palette";
import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { createImpact } from "../../../../game/effects/impact";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks } from "../../../../game/enemies/skillStatus";
import { skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, lights, progress } from "../../../../game/state";
import { shake, surfaceBelow } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { WHITE } from "../../../../utils/color";
import { DUSK_RAMP } from "../../look/colors";
import { vesperFx } from "../skillFx";

const ID = "ve_moon";
/** a moon falls from this high, this fast, and lands this far ahead of her; more moons land this far apart */
const FALL = { from: 70, speed: 380, ahead: 46, apart: 30 } as const;
/** Eclipse draws in foes this many radii from a burst, this hard for each pixel away */
const PULL = { reach: 1.8, strength: 6 } as const;

/** a crescent moon falling onto a point and bursting there */
function createMoon(x: number, delay: number, damage: number, radius: number, glowFor: number, pull: boolean): Effect {
  const launch = !!skillValues(ID).launch;
  const floor = surfaceBelow(x, hero.y);
  const o = { y: floor - FALL.from, t: -delay, done: false };
  return {
    update(dt) {
      o.t += dt;
      if (o.t < 0) return true;
      o.y += FALL.speed * dt;
      if (o.y < floor - 6) return true;
      game.fx.push(createFloorRing(x, floor, radius, DUSK_RAMP, 0.45));
      vesperFx(ID, { x, y: floor, face: hero.face, reach: 40 + radius }, { damage: damage * (pull ? 2 : 1) });
      lights.add(x, floor - 8, radius, DUSK_RAMP[4], 0.7, 0.3);
      shake(0.12, 1.6);
      // Eclipse: foes near the burst are drawn in to its middle first
      if (pull)
        for (const e of game.enemies)
          if (e.hp > 0 && Math.abs(e.x - x) <= radius * PULL.reach) e.vx += (x - e.x) * PULL.strength;
      for (const e of game.enemies) {
        if (e.hp <= 0) continue;
        const [ex, ey] = enemyCenter(e);
        if (Math.hypot(ex - x, (ey - floor) * 0.8) > radius) continue;
        dealDamage(e, damage, {
          fromX: x,
          kx: pull ? 0 : Math.sign(ex - x) * 70,
          ky: -60,
          launch: launch ? -220 : undefined,
          heavy: true,
          source: "abilities",
        });
        game.fx.push(createImpact(ex, ey, Math.sign(ex - x) || 1, false, SPARKS.shadow));
        if (glowFor) addStacks(e, ID, { stacks: 1, max: 3, damage: damage * 0.1, every: 0.5, duration: glowFor });
      }
      return false;
    },
    draw() {
      if (o.t < 0) return;
      place();
      const C = DUSK_RAMP;
      for (let a = -1.2; a <= 1.2; a += 0.08) {
        const r = 7;
        const px = x + Math.sin(a) * r;
        const py = o.y - Math.cos(a) * r * 0.9 + 6;
        fleck(px, py, Math.abs(a) < 0.6 ? WHITE : C[5]);
        fleck(px - Math.sin(a) * 1.2, py + Math.cos(a), C[4]);
      }
      hairline(x, o.y - 30, x, o.y - 4, C[4], (u) => u * 0.6);
      glow(x, o.y, 12, C[4], 0.5);
    },
  };
}

/**
 * Falling Moon: a crescent moon falls ahead of her and bursts where it lands, knocking foes about; its skill adds more
 * moons, a wider burst and a glow that keeps burning. Held, the moons fall in a row twice as long.
 */
export function castMoon(power: number, wide: boolean): void {
  const v = skillValues(ID);
  const count = withBuild("amount", v.moons) * (wide ? 2 : 1);
  const radius = withBuild("area", v.radius);
  const damage = progress.stats.ap * v.power * power;
  for (let i = 0; i < count; i++) {
    const x = hero.x + hero.face * (FALL.ahead + i * FALL.apart);
    game.fx.push(createMoon(x, i * 0.08, damage, radius, v.glow ?? 0, !!v.pull));
  }
}
