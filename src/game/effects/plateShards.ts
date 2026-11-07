import { HERO_COLORS as HC } from "../../constants/palette";
import { glow, place } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { lights, particles, rng } from "../state";

/** one of Hulda's armour plates breaks: steel shards fly from her shoulder and a cold flash lights it */
export function createPlateShards(x: number, y: number, face: number): Effect {
  const steel = [HC.steelGlint, HC.steelLight, HC.steel, HC.steelDark];
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI / 2 - face * rng.range(0.2, 1.4);
    const sp = rng.range(60, 150);
    particles.spawn(PK.SHARD, x, y, Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.5, 0.9), {
      col: steel[rng.int(0, steel.length - 1)],
      size: rng.range(2, 3.5),
    });
  }
  lights.add(x, y, 26, HC.steelLight, 0.8, 0.15);
  let t = 0;
  const life = 0.1;
  return {
    update(dt) {
      t += dt;
      return t < life;
    },
    draw() {
      place();
      glow(x, y, 8, HC.steelGlint, 0.6 * (1 - t / life));
    },
  };
}
