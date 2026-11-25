import { PAL, SPARKS } from "../../../../../constants/palette";
import { dealDamage } from "../../../../../game/damage";
import { createImpact } from "../../../../../game/effects/impact";
import { createSlash } from "../../../../../game/effects/slash";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { fxRng, game, hero, rng } from "../../../../../game/state";
import { sfx } from "../../../../../services/audio";
import type { Effect } from "../../../../../types/effect";
import type { Enemy } from "../../../../../types/enemy";
import { NOVA_EDGES } from "../../../constants/nova";

/** one edge of the storm: a quick crystal crescent at a random tilt across (x, y) */
export function edgeSlash(x: number, y: number, big: boolean): void {
  const a0 = fxRng.range(-3, -1.5);
  game.fx.push(
    createSlash(x, y, fxRng.chance(0.5) ? 1 : -1, {
      cx: 0,
      cy: 0,
      R: big ? fxRng.range(16, 22) : fxRng.range(10, 16),
      sy: fxRng.range(0.25, 0.8),
      rot: fxRng.range(-1.2, 1.2),
      a0,
      a1: a0 + fxRng.range(2.6, 3.4),
      W: big ? 7 : 5,
      sweep: 0.04,
      hold: 0.03,
      trail: 0.16,
      ramp: PAL.crystal,
    }),
  );
}

/** one cut of the storm on a foe */
export function edgeCut(foe: Enemy, damage: number): void {
  const [ex, ey] = enemyCenter(foe);
  edgeSlash(ex + fxRng.range(-4, 4), ey + fxRng.range(-4, 4), true);
  game.fx.push(createImpact(ex, ey, fxRng.chance(0.5) ? 1 : -1, false, SPARKS.crystal));
  dealDamage(foe, damage, { fromX: hero.x, kx: 0, ky: -20, heavy: true, source: "ultimate" });
  sfx.hit(false);
}

/** Crystal Nova's storm of edges: `count` crescents flash across each struck foe, spread over a short moment */
export function createNovaEdges(foes: readonly Enemy[], count: number, damage: number): Effect {
  const cuts = foes.flatMap((foe) =>
    Array.from({ length: count }, (_, i) => ({
      foe,
      at: NOVA_EDGES.start + (NOVA_EDGES.span * (i + rng.next())) / count,
      done: false,
    })),
  );
  let t = 0;
  return {
    update(dt) {
      t += dt;
      for (const c of cuts) {
        if (c.done || t < c.at) continue;
        c.done = true;
        if (c.foe.hp > 0) edgeCut(c.foe, damage);
      }
      return cuts.some((c) => !c.done);
    },
    draw() {},
  };
}
