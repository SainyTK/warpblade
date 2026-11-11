import { FN, FW, N } from "../../../constants/stage";
import { Rng } from "../../../utils/rng";
import { LAYER } from "../../plate";
import { PlatePaint } from "../../platePaint";
import type { ScenePalette } from "../sceneDef";
import { liftChunks } from "./chunks";
import { paintEclipse } from "./eclipse";
import { paintFarRuins } from "./farRuins";
import { paintNebula, paintSkyBands, paintStars, SKY_ROWS } from "./heavens";
import { drawTearLight as drawLightAlong, paintTear, type TearPath, tearPath } from "./tear";
import { paintTendrils } from "./tendrils";
import { paintThorns } from "./thorns";
import { paintVeins } from "./veins";

/** each part of the scene draws from its own seeded stream, so changing one never reshapes another */
const SEEDS = {
  tear: 21,
  stars: 31,
  farRuins: 33,
  tendrils: 35,
  branches: 37,
  eclipse: 39,
  veins: 41,
  thorns: 43,
  chunks: 45,
};
const OPEN_SKY = [LAYER.sky, LAYER.celestial] as const;

let tear: TearPath = tearPath(0, new Rng(SEEDS.tear));

/** the whole sky as a picture of its own, far to near, so it can also show through where a tower top is torn away */
function paintHeavens(P: ScenePalette, k: number): PlatePaint {
  // a layer map of zeros: every pixel of this picture is open sky
  const sky = new PlatePaint(new Uint32Array(FN), new Uint8Array(N));
  paintSkyBands(sky, P);
  paintNebula(sky);
  paintStars(sky, new Rng(SEEDS.stars), P);
  paintEclipse(sky, new Rng(SEEDS.eclipse), k);
  paintTear(sky, tear, new Rng(SEEDS.branches), k);
  paintFarRuins(sky, new Rng(SEEDS.farRuins), P, k);
  paintTendrils(sky, new Rng(SEEDS.tendrils), k);
  return sky;
}

/**
 * static: everything of the abyss that stands still, painted on the finished plate at the frame's full detail: the sky
 * wherever it shows, rift light and thorns on the ruins, and the tower tops lifted off to float.
 */
export function paintAbyss(p: PlatePaint, P: ScenePalette, k: number): void {
  tear = tearPath(k, new Rng(SEEDS.tear));
  const sky = paintHeavens(P, k);
  for (let iy = 0; iy < SKY_ROWS; iy++) {
    for (let ix = 0; ix < FW; ix++) {
      p.put(ix, iy, sky.get(ix, iy), OPEN_SKY);
    }
  }
  paintVeins(p, new Rng(SEEDS.veins), k);
  paintThorns(p, new Rng(SEEDS.thorns), k);
  liftChunks(p, sky, new Rng(SEEDS.chunks), k);
}

/** each frame: the rift's own light, along the path it was painted on */
export function drawTearLight(t: number, k: number): void {
  drawLightAlong(t, k, tear);
}
