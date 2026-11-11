import { PLATE_BREAK } from "../../constants/hulda/look";
import { HERO_COLORS as HC } from "../../constants/palette";
import { circle, place } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { grain } from "../../utils/grain";
import { ease } from "../../utils/math";
import { lights, particles, rng } from "../state";
import { ray } from "./fine";

/** one of Hulda's armour plates breaks: steel shards fly from her shoulder and splinters of cold light snap out of the break */
export function createPlateShards(x: number, y: number, face: number): Effect {
  // no near-white steel: the shards start in one clump, and a hit-stop holds it over her head
  const steel = [HC.steelLight, HC.steel, HC.steel, HC.steelDark];
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI / 2 - face * rng.range(0.2, 1.4);
    const sp = rng.range(60, 150);
    particles.spawn(PK.SHARD, x, y, Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.5, 0.9), {
      col: steel[rng.int(0, steel.length - 1)],
      size: rng.range(2, 3.5),
    });
  }
  lights.add(x, y, PLATE_BREAK.light, HC.steel, PLATE_BREAK.strength, PLATE_BREAK.life);
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < PLATE_BREAK.life;
    },
    draw() {
      place();
      const u = t / PLATE_BREAK.life;
      // the plate's edge snaps outward as a broken ring, with a few cold splinters past it
      const r = 3 + PLATE_BREAK.ring * ease.outCubic(u);
      for (let i = 0; i < PLATE_BREAK.splinters; i++) {
        const a = -Math.PI / 2 - face * (0.1 + (i / PLATE_BREAK.splinters) * 2.2);
        ray(x, y, a, r * 0.7, r + 2 * grain(i, x), HC.steelGlint, HC.steelLight, (1 - u) * 1.6);
      }
      if (u < 0.5) circle(x, y, 1.5 * (1 - u * 2) + 0.5, HC.steelGlint);
    },
  };
}
