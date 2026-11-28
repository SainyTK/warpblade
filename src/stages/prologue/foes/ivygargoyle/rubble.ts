import { GROUND } from "../../../../constants/stage";
import { place, polygon } from "../../../../engine/frame";
import { stageLeft, stageRight } from "../../../../game/adventure";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { GARGOYLE_COLORS as C, GARGOYLE_SPARKS } from "./colors";
import { GARGOYLE } from "./constants";

const R = GARGOYLE.rubble;
const STONES = [
  [0, 3.2, 0],
  [-4, 2.2, 1.7],
  [-7, 1.6, 3.1],
] as const;

export function createRubble(x0: number, dir: number, damage: number): Effect {
  let t = 0;
  let x = x0;
  const struck = new Set<number>();
  return {
    update(dt) {
      t += dt;
      x += dir * R.speed * (1 - (t / R.life) * 0.5) * dt;
      if (fxRng.chance(dt * 25))
        particles.spawn(PK.DUST, x, GROUND - 1, -dir * fxRng.range(4, 16), -fxRng.range(4, 12), 0.35, {
          col: fxRng.pick(GARGOYLE_SPARKS.chip),
          size: fxRng.range(1, 1.8),
        });
      eachStanding(() => {
        if (struck.has(heroSlot())) return;
        if (!boxHit([x - R.half, GROUND - R.height, x + R.half, GROUND], heroBox())) return;
        struck.add(heroSlot());
        hurtHero(damage, x - dir * 6);
      });
      const out = x < stageLeft() + 4 || x > stageRight() - 4;
      return t < R.life && !out;
    },
    draw() {
      place(x, GROUND);
      for (const [lag, size, phase] of STONES) {
        const sx = lag * dir;
        const hop = Math.abs(Math.sin(t * 14 + phase)) * 3;
        const spin = t * 12 * dir + phase;
        const pts = [0, 1, 2, 3, 4].map((i) => {
          const a = spin + (i / 5) * Math.PI * 2;
          const r = size * (i % 2 ? 0.8 : 1);
          return [sx + Math.cos(a) * r, -size - hop + Math.sin(a) * r] as const;
        });
        polygon(pts, C.slate[2]);
        polygon(pts.slice(0, 3), C.slate[3]);
      }
      place();
    },
  };
}
