import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox, enemyCenter } from "../../../../game/enemies/enemy";
import { game } from "../../../../game/state";
import { boxHit } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { JADE, JADE_SPARKS } from "../../look";

/** a heron's flight: where it starts, its height, how far it flies, its damage, and whether it flies back */
export interface HeronFlight {
  x: number;
  y: number;
  face: number;
  reach: number;
  damage: number;
  back: boolean;
  stun: number;
  source: string;
}

const SPEED = 330;
const HALF = 8;

/**
 * A jade heron of qi: it flies low along the line ahead with its wings beating, strikes each foe it passes once (and
 * again on its way back), then thins out
 */
export function createHeron(o: HeronFlight): Effect {
  const p = { x: o.x, dir: o.face, flown: 0, t: 0 };
  let struck = new Set<Enemy>();
  let turned = false;
  return {
    update(dt) {
      p.t += dt;
      p.x += p.dir * SPEED * dt;
      p.flown += SPEED * dt;
      for (const e of game.enemies) {
        if (struck.has(e) || e.hp <= 0 || !boxHit([p.x - 5, o.y - HALF, p.x + 5, o.y + HALF], enemyBox(e))) continue;
        struck.add(e);
        dealDamage(e, o.damage, {
          source: o.source,
          fromX: p.x - p.dir * 8,
          kx: p.dir * 50,
          ky: -30,
          stun: o.stun || undefined,
        });
        game.fx.push(createImpact(...enemyCenter(e), p.dir, false, JADE_SPARKS));
      }
      if (p.flown >= o.reach && o.back && !turned) {
        turned = true;
        p.dir = -p.dir;
        p.flown = 0;
        struck = new Set();
      }
      return p.flown < o.reach && p.x > stageLeft() - 20 && p.x < stageRight() + 20;
    },
    draw() {
      place();
      const beat = Math.sin(p.t * 26);
      const d = p.dir;
      const x = p.x;
      const y = o.y;
      hairline(x - d * 8, y + 1, x + d * 3, y, JADE[4]);
      hairline(x + d * 3, y, x + d * 6, y - 3, JADE[4]);
      hairline(x + d * 6, y - 3, x + d * 9, y - 2, JADE[5]);
      hairline(x - d * 2, y, x - d * 7, y - 6 * beat, JADE[3]);
      hairline(x - d * 1, y, x - d * 5, y - 5 * beat - 1, JADE[4]);
      hairline(x - d * 8, y + 1, x - d * 12, y + 3, JADE[2]);
      fleck(x + d * 9, y - 2, WHITE);
      glow(x, y, 9, JADE[3], 0.3);
    },
  };
}
