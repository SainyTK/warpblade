import { PAL, SPARKS } from "../../../constants/palette";
import { glow, line, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { dealDamage } from "../../damage";
import { touches } from "../../skills/targets";
import { game, particles, progress, rng } from "../../state";

const SPEED = 240;

/** what a crescent does: how far it flies and how hard it hits, and whether it passes through foes */
export interface CrescentSpec {
  range: number;
  power: number;
  pierce: boolean;
}

/**
 * Sky Lash's brass crescent: thrown on from a Hanging Arc's tip, it flies down and ahead, cutting the first foe it meets
 * (every foe in its path once it pierces). It rides the hero's press, so it counts for his attacks.
 */
export function createBrassCrescent(x: number, y: number, dir: number, spec: CrescentSpec): Effect {
  const B = PAL.brass;
  const o = { x, y, flown: 0 };
  const vx = dir * SPEED * 0.85;
  const vy = SPEED * 0.5;
  const struck: Enemy[] = [];
  return {
    update(dt) {
      o.x += vx * dt;
      o.y += vy * dt;
      o.flown += SPEED * dt;
      if (rng.chance(0.5)) particles.spawn(PK.EMBER, o.x, o.y, -vx * 0.1, -vy * 0.1, 0.25, { sparks: SPARKS.brass });
      for (const e of game.enemies) {
        if (e.hp <= 0 || struck.includes(e) || !touches(e, o.x, o.y, 3)) continue;
        struck.push(e);
        dealDamage(e, progress.stats.ad * spec.power, {
          fromX: o.x - dir * 6,
          kx: dir * 50,
          ky: 20,
          melee: false,
          source: "o_skylash",
        });
        if (!spec.pierce) return false;
      }
      return o.flown < spec.range;
    },
    draw() {
      place();
      const ux = vx / SPEED;
      const uy = vy / SPEED;
      const nx = -uy;
      const ny = ux;
      for (let k = -3; k <= 3; k++) {
        const bend = Math.abs(k) * 0.8;
        const ax = o.x + nx * k - ux * bend;
        const ay = o.y + ny * k - uy * bend;
        px(ax, ay, Math.abs(k) < 2 ? WHITE : B[4]);
        px(ax - ux, ay - uy, B[3]);
      }
      line(o.x - ux * 6, o.y - uy * 6, o.x - ux * 2, o.y - uy * 2, B[2], 0.6);
      glow(o.x, o.y, 10, B[3], 0.4);
    },
  };
}
