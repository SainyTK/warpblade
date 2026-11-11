import { CRESCENT_SHAPE } from "../../../constants/orrin/chainLook";
import { PAL, SPARKS } from "../../../constants/palette";
import { glow, hairline, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { dealDamage } from "../../damage";
import { touches } from "../../skills/targets";
import { game, particles, progress, rng } from "../../state";
import { drawTurned } from "./turned";

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
      const { radius, thick, span, trail } = CRESCENT_SHAPE;
      for (let k = -2; k <= 2; k++) {
        const off = k * 1.6;
        const back = trail * (1 - Math.abs(k) * 0.3);
        hairline(
          o.x - uy * off - ux * 2,
          o.y + ux * off - uy * 2,
          o.x - uy * off - ux * (2 + back),
          o.y + ux * off - uy * (2 + back),
          k === 0 ? B[4] : B[3],
          (u) => (1 - u) * 0.9,
        );
      }
      // a crescent whose horns trail back: the outside of a disc with a smaller disc cut out of its back
      drawTurned(o.x, o.y, ux, uy, radius + 1, (d, w) => {
        const out = Math.hypot(d + radius * 0.4, w);
        if (out > radius + 0.5 || Math.abs(Math.atan2(w, d + radius * 0.4)) > span) return 0;
        const cut = Math.hypot(d + radius * 0.4 + thick, w * 0.9);
        if (cut < radius - 0.5) return 0;
        if (out > radius || cut < radius) return B[1];
        const q = (out - (radius - thick)) / thick;
        return q > 0.7 ? WHITE : q > 0.4 ? B[5] : B[4];
      });
      glow(o.x, o.y, 10, B[3], 0.4);
    },
  };
}
