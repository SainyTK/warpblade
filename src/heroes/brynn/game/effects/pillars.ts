import { RES } from "../../../../constants/stage";
import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { ignite } from "../../../../game/enemies/burn";
import { enemyBox } from "../../../../game/enemies/enemy";
import { game, lights } from "../../../../game/state";
import { boxHit, shake } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { CRIMSON, CRIMSON_SPARKS } from "../../constants/colors";

/** a pillar's height, half width, the seconds it stands, and the share of that it strikes in */
const PILLAR = { height: 40, half: 6, life: 0.4, strike: 0.25 } as const;

/** one line of pillars: where it starts, which way, how many and how far apart, the gap in time, what each deals */
export interface PillarLine {
  x: number;
  y: number;
  face: number;
  count: number;
  gap: number;
  every: number;
  delay: number;
  damage: number;
  launch: number;
  burn?: number;
  stun?: number;
  halt?: number;
}

/**
 * Crimson pillars of fire that burst up out of the floor one after another along a line ahead, each throwing up every
 * foe over it once. It is the hero's own ability, so it builds Flow.
 */
export function createPillars(p: PillarLine): Effect {
  let t = -p.delay;
  const struck = new Set<Enemy>();
  const xs = Array.from({ length: p.count }, (_, i) => p.x + p.face * p.gap * (i + 0.5));
  const born = xs.map((_, i) => i * p.every);
  const fired = xs.map(() => false);
  return {
    update(dt) {
      t += dt;
      xs.forEach((x, i) => {
        const age = t - born[i];
        if (age < 0 || age > PILLAR.life * PILLAR.strike) return;
        if (!fired[i]) {
          fired[i] = true;
          lights.add(x, p.y - 16, 26, CRIMSON[4], 0.7, 0.25);
          shake(0.08, 1.2);
        }
        for (const e of game.enemies) {
          if (
            e.hp <= 0 ||
            struck.has(e) ||
            !boxHit([x - PILLAR.half, p.y - PILLAR.height, x + PILLAR.half, p.y + 2], enemyBox(e))
          )
            continue;
          struck.add(e);
          dealDamage(e, p.damage, {
            fromX: x,
            kx: p.face * 20,
            launch: p.launch,
            stun: p.stun,
            heavy: true,
            source: "abilities",
          });
          if (p.burn) ignite(e, p.burn);
          if (p.halt) e.halt = Math.max(e.halt, p.halt);
          game.fx.push(createImpact(e.x, e.y - 12, p.face, false, CRIMSON_SPARKS));
        }
      });
      return t < born[born.length - 1] + PILLAR.life;
    },
    draw() {
      place();
      xs.forEach((x, i) => {
        const age = t - born[i];
        if (age < 0 || age > PILLAR.life) return;
        const u = age / PILLAR.life;
        const rise = Math.min(1, u / 0.25);
        const k = 1 - Math.max(0, (u - 0.3) / 0.7);
        const h = PILLAR.height * rise;
        for (let s = -PILLAR.half * RES; s <= PILLAR.half * RES; s++) {
          const v = Math.abs(s) / (PILLAR.half * RES);
          const top = h * (1 - v * v * 0.6) * (0.8 + 0.2 * grain(s, i + Math.floor(age * 30)));
          const sx = x + s / RES;
          hairline(
            sx,
            p.y - top,
            sx,
            p.y,
            (w) => (v < 0.25 ? (w < 0.3 ? WHITE : CRIMSON[5]) : v < 0.6 ? CRIMSON[4] : CRIMSON[3]),
            k * (1 - v * 0.5),
          );
        }
        fleck(x, p.y - h, WHITE, k);
        glow(x, p.y - h / 2, 18, CRIMSON[4], 0.45 * k);
      });
    },
  };
}
