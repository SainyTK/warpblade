import { GROUND, RES, W } from "../../../constants/stage";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import type { Rng } from "../../../utils/rng";
import type { PlatePaint } from "../../platePaint";
import type { ScenePalette } from "../sceneDef";

/** Far behind the ridge: broken spires in the haze, islands of rock torn loose, and shards drifting up to the rift. */

interface FarTones {
  body: Color;
  rim: Color;
}

/** the far ruins are hazed most of the way to the horizon's colour, their sunward edge a little lighter */
function farTones(P: ScenePalette): FarTones {
  const horizon = P.sky[P.sky.length - 1];
  return { body: mix(horizon, P.ridge, 0.62), rim: mix(horizon, P.ridgeTop, 0.9) };
}

/** a thin broken spire: a ragged, sloped top with a bite out of its sunward shoulder */
function spire(p: PlatePaint, r: Rng, T: FarTones, index: number): void {
  const x0 = Math.round(r.range(14, W - 22) * RES);
  const wide = Math.round(r.range(3, 8) * RES);
  const top = r.range(70, 100) * RES;
  const slope = r.range(0.4, 1.8);
  const peak = x0 + wide * r.range(0.2, 0.8);
  const bite = x0 + wide * r.range(0.55, 0.85);
  const biteDepth = r.range(0, 9) * RES;
  for (let ix = x0; ix < x0 + wide; ix++) {
    const roof = Math.floor(
      top + Math.abs(ix - peak) * slope + grain(ix, index * 7 + 1) * 3 + (ix > bite ? biteDepth : 0),
    );
    for (let iy = roof; iy < GROUND * RES; iy++) {
      p.put(ix, iy, ix >= x0 + wide - 1 || iy === roof ? T.rim : T.body);
    }
  }
}

/** an island of rock torn loose: a ragged flat top over an underside that tapers to hanging points */
function island(p: PlatePaint, r: Rng, T: FarTones, index: number): void {
  const cx = r.range(30, W - 40) * RES;
  const cy = r.range(48, 82) * RES;
  const half = r.range(5, 10) * RES;
  const deep = half * r.range(0.6, 1);
  for (let ix = Math.floor(cx - half); ix <= cx + half; ix++) {
    const u = Math.abs(ix - cx) / half;
    const top = Math.floor(cy - grain(ix >> 1, index * 5 + 2) * 3);
    const hang = (1 - u ** 1.4) * deep * (0.55 + 0.45 * grain(ix >> 2, index * 3 + 9));
    const bottom = Math.floor(cy + 2 + hang);
    for (let iy = top; iy <= bottom; iy++) {
      p.put(ix, iy, iy === top || ix >= cx + half - 1 ? T.rim : T.body);
    }
  }
}

/** a shard of stone adrift: a small diamond with its sunward edge lit */
function shard(p: PlatePaint, x: number, y: number, tall: number, wide: number, T: FarTones): void {
  for (let v = -tall; v <= tall; v++) {
    const reach = Math.round(wide * (1 - Math.abs(v) / (tall + 1)));
    for (let u = -reach; u <= reach; u++) {
      p.put(x + u, y + v, u === reach ? T.rim : T.body);
    }
  }
}

/** static: the far ruins, more of them torn loose as the era goes on */
export function paintFarRuins(p: PlatePaint, r: Rng, P: ScenePalette, k: number): void {
  const T = farTones(P);
  for (let i = 0; i < 11; i++) {
    spire(p, r, T, i);
  }
  const islands = 2 + Math.round(k * 3);
  for (let i = 0; i < islands; i++) {
    island(p, r, T, i);
  }
  const shards = 16 + Math.round(k * 26);
  for (let i = 0; i < shards; i++) {
    // the shards thin out with height, as if drawn up toward the rift
    const y = 100 - r.range(0, 1) ** 1.6 * 84;
    shard(p, Math.round(r.range(10, W - 10) * RES), Math.round(y * RES), r.int(1, 3), r.int(1, 2), T);
  }
}
