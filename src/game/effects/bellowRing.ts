import { BELLOW } from "../../constants/hulda/bellow";
import { ROAR_LOOK } from "../../constants/hulda/look";
import { fleck, glow, place } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { grain } from "../../utils/grain";
import { clamp, ease, TAU } from "../../utils/math";
import { kindOf } from "../enemies/kinds";

/**
 * one ring of the roar: a bright line two image pixels thick with a dark rim outside it, breaking into dashes of sound
 * as it runs out and thins
 */
function roarRing(x: number, y: number, r: number, k: number, seed: number, ramp: Ramp): void {
  const n = Math.max(12, Math.ceil(TAU * r * 2.4));
  const dashes = Math.max(8, Math.round(r * 0.7));
  const wear = Math.max(0, (ROAR_LOOK.breakFrom - k) / ROAR_LOOK.breakFrom);
  const c = ramp[Math.min(6, 3 + Math.round(k * 3))];
  for (let i = 0; i < n; i++) {
    const g = (i / n) * TAU;
    if (wear > 0 && grain(Math.floor((i / n) * dashes), seed) < wear) continue;
    const ux = Math.cos(g);
    const uy = Math.sin(g) * ROAR_LOOK.squash;
    fleck(x + ux * (r + 0.5), y + uy * (r + 0.5), ramp[2], k * 2);
    fleck(x + ux * r, y + uy * r, c, k * 2);
    if (k > 0.5) fleck(x + ux * (r - 0.5), y + uy * (r - 0.5), ramp[4], k * 2);
  }
}

/**
 * Bellow: three rings run out from her mouth to the roar's reach, and every foe it caught is dragged toward her over a
 * quarter of a second, walkers sliding along the floor and flying minions drifting down to her hands. The wide Bellow
 * passes its own `reach` and `pull`.
 */
export function createBellowRing(
  x: number,
  y: number,
  caught: readonly Enemy[],
  [toX, toY]: readonly [number, number],
  ramp: Ramp,
  reach: number = BELLOW.reach,
  pull: number = BELLOW.pull,
): Effect {
  const pulls = caught.map((e) => ({
    e,
    dx: Math.sign(toX - e.x) * Math.max(0, Math.min(pull, Math.abs(toX - e.x) - 8)),
    dy: kindOf(e.type).flies && e.rank === "minion" ? clamp(toY + BELLOW.dropTo - e.y, -BELLOW.drop, BELLOW.drop) : 0,
  }));
  const life = BELLOW.ringTime + BELLOW.ringGap * 2;
  let t = 0;
  return {
    update(dt) {
      const step = Math.min(dt, Math.max(0, BELLOW.pullTime - t)) / BELLOW.pullTime;
      for (const p of pulls) {
        if (p.e.hp <= 0) continue;
        p.e.x += p.dx * step;
        p.e.y += p.dy * step;
      }
      t += dt;
      return t < life;
    },
    draw() {
      place();
      for (let i = 0; i < 3; i++) {
        const u = (t - i * BELLOW.ringGap) / BELLOW.ringTime;
        if (u <= 0 || u >= 1) continue;
        const r = reach * ease.outQuad(u);
        const k = 1 - u;
        roarRing(x, y, r, k, i, ramp);
      }
      glow(x, y, ROAR_LOOK.light, ramp[3], 0.3 * Math.max(0, 1 - t / life));
    },
  };
}
