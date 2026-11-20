import { fleck, glowLine, hairline, line, place } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox, enemyCenter } from "../../../../game/enemies/enemy";
import { game } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { SourceId } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { ROSE_LINE } from "../../constants/abilities";
import { ROSE_RAMP, ROSE_SPARKS } from "../../look/rose";

/** the line fades this long once its head has left the screen */
const FADE = 0.18;

/** what a Rose Line does to each foe it cuts, after the damage: a mark, pins, a skill's own extra */
export type LineCut = (e: Enemy) => void;

/**
 * Rose Line: a thin wave of rose light whose head runs along her line from (x, y) to the edge of the screen (or `stop`), cutting
 * each foe it crosses once. It is light, so guards do not stop it. The line stays drawn behind its head and fades.
 */
export function createRoseLine(
  x: number,
  y: number,
  face: number,
  damage: number,
  source: SourceId,
  cut?: LineCut,
  stop?: number,
): Effect {
  const o = { head: x, t: 0, out: 0 };
  const struck = new Set<Enemy>();
  const end = stop ?? (face > 0 ? stageRight() + 8 : stageLeft() - 8);
  return {
    update(dt) {
      o.t += dt;
      const from = o.head;
      o.head = face > 0 ? Math.min(end, o.head + ROSE_LINE.speed * dt) : Math.max(end, o.head - ROSE_LINE.speed * dt);
      const [a, b] = from < o.head ? [from, o.head] : [o.head, from];
      for (const e of game.enemies) {
        if (e.hp <= 0 || struck.has(e) || !boxHit([a - 2, y - ROSE_LINE.half, b + 2, y + ROSE_LINE.half], enemyBox(e)))
          continue;
        struck.add(e);
        dealDamage(e, damage, { fromX: e.x - face * 10, kx: face * 40, stagger: 0.3, source });
        const [, ey] = enemyCenter(e);
        game.fx.push(createImpact(e.x, ey, face, false, ROSE_SPARKS));
        cut?.(e);
      }
      if (o.head === end) o.out += dt;
      return o.out < FADE;
    },
    draw() {
      place();
      const k = 1 - o.out / FADE;
      const tail = o.head - face * Math.min(Math.abs(o.head - x), 140);
      line(x, y, o.head, y, ROSE_RAMP[2], 0.35 * k);
      line(tail, y, o.head, y, ROSE_RAMP[4], 0.85 * k);
      hairline(tail + face * 10, y, o.head, y, ROSE_RAMP[6], k);
      glowLine(tail, y, o.head, y, 4, ROSE_RAMP[3], 0.4 * k);
      if (o.out === 0) fleck(o.head, y, WHITE);
    },
  };
}
