import type { Color } from "../../../types/color";
import { hex, mix, ramp } from "../../../utils/color";
import { NIGHT_PALETTE } from "../night";
import type { ScenePalette } from "../sceneDef";

/** the magical colors the night palette turns toward by the era's last wave; no darker than the night */
const MAGIC: Partial<Record<keyof ScenePalette, Color>> = {
  starDim: hex("#3a2a6a"),
  starBright: hex("#f4eaff"),
  ridgeTop: hex("#4a3c8e"),
  ridge: hex("#281a50"),
  towerRim: hex("#3c3270"),
  towerTop: hex("#443878"),
  tower: hex("#1c1238"),
  windowLit: hex("#8af0ff"),
  windowLow: hex("#4a8ad8"),
  groundLip: hex("#7466a8"),
  groundEdge: hex("#52467e"),
  stone: hex("#2e244c"),
  stoneTop: hex("#3c3064"),
  moss: hex("#2a8a96"),
  mossTip: hex("#6ff0e0"),
  vine: hex("#2a6a80"),
  slabLip: hex("#8676b8"),
  slabEdge: hex("#5c4c8c"),
  slab: hex("#32285a"),
  ironLip: hex("#7a6aa8"),
  iron: hex("#2e2848"),
  mist: hex("#9a82d8"),
};
const SKY_MAGIC = ramp(["#1a1046", "#24145a", "#32196a", "#432078", "#562a86", "#6a368c"]);

const cache = new Map<number, ScenePalette>();

/** how far the first wave has already turned from the night toward the magical colors */
const FIRST_TURN = 0.22;

/** a step past the night palette at k = 0, shifting toward violet sky, cyan moss and teal-lit stone by k = 1 */
export function twilightPalette(progress: number): ScenePalette {
  const hit = cache.get(progress);
  if (hit) return hit;
  const k = FIRST_TURN + (1 - FIRST_TURN) * progress;
  const P: ScenePalette = { ...NIGHT_PALETTE, sky: NIGHT_PALETTE.sky.map((c, i) => mix(c, SKY_MAGIC[i], k)) };
  for (const key of Object.keys(MAGIC) as (keyof typeof MAGIC)[]) {
    const to = MAGIC[key] as Color;
    (P as unknown as Record<string, Color>)[key] = mix(NIGHT_PALETTE[key] as Color, to, k);
  }
  cache.set(progress, P);
  return P;
}
