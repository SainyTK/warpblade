import { PAL, SPARKS } from "../../constants/palette";
import { STORM_STRIKE as S } from "../../constants/relics/storm";
import { place } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { boltPath, type Path, strokeBolt } from "../spells/lightning";
import { lights, particles, rng } from "../state";

/** seconds between redraws of the jagged path, so the bolt flickers */
const FLICKER = 0.05;

/** one Storm Rod strike as it looks: a bolt from the sky onto (x, y), and Thunder Crown's arcs on to more foes */
export function createStormStrike(
  x: number,
  y: number,
  ground: number,
  arcs: readonly (readonly [number, number])[],
  evolved: boolean,
): Effect {
  const V = PAL.volt;
  let t = 0;
  let regen = 0;
  let path: Path = [];
  let branches: Path[] = [];
  const build = () => {
    path = boltPath(x + rng.range(-10, 10), -4, x, y, 12, 4);
    branches = arcs.map(([ax, ay]) => boltPath(x, y, ax, ay, 8, 3));
  };
  build();
  lights.add(x, y, evolved ? 38 : 30, V[3], evolved ? 0.36 : 0.3, 0.25);
  lights.add(x, ground, 22, V[2], 0.3, 0.35);
  for (const [ax, ay] of arcs) lights.add(ax, ay, 20, V[3], 0.4, 0.25);
  for (let i = 0; i < (evolved ? 10 : 7); i++) {
    const a = rng.range(Math.PI, Math.PI * 2);
    const sp = rng.range(100, 260);
    particles.spawn(PK.SPARK, x, y, Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.15, 0.35), {
      sparks: SPARKS.volt,
    });
  }
  return {
    update(dt) {
      t += dt;
      regen -= dt;
      if (regen <= 0) {
        regen = FLICKER;
        build();
      }
      return t < S.life;
    },
    draw() {
      const k = 1 - t / S.life;
      place();
      strokeBolt(path, evolved || k > 0.55, k);
      for (const b of branches) strokeBolt(b, evolved && k > 0.5, k);
    },
  };
}
