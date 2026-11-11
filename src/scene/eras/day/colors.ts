import type { Color } from "../../../types/color";
import { hex, mix, ramp } from "../../../utils/color";

/** The day scene's own colors, apart from the shared stage palette: the sky's parts at noon and in late afternoon. */

const NOON = {
  core: hex("#fffef4"),
  disc: hex("#fff6c8"),
  rim: hex("#ffe58a"),
  halo: hex("#fff3c4"),
  cloudLit: hex("#ffffff"),
  cloud: hex("#eef6fc"),
  cloudShade: hex("#d2e4f2"),
  cloudDeep: hex("#b4cfe6"),
  farSnow: hex("#f0f8fd"),
  farSnowShade: hex("#c6daee"),
};
const DUSK: typeof NOON = {
  core: hex("#fffbe8"),
  disc: hex("#ffe6a0"),
  rim: hex("#ffc260"),
  halo: hex("#ffe0a8"),
  cloudLit: hex("#fff6e6"),
  cloud: hex("#f8e8dc"),
  cloudShade: hex("#e2cccc"),
  cloudDeep: hex("#c8b4c4"),
  farSnow: hex("#fdeee0"),
  farSnowShade: hex("#d6c6d6"),
};
/** the two mountain ranges, each from its shaded slopes to its sunlit ones */
const NOON_RANGES = {
  far: ramp(["#7a9fd0", "#8fb2da", "#9dbde2", "#b4d0ec"]),
  near: ramp(["#76a2ae", "#84aeb2", "#96bcb6", "#aacdbc"]),
};
const DUSK_RANGES: typeof NOON_RANGES = {
  far: ramp(["#8c98c4", "#9aa6cc", "#b0aecc", "#c8bccc"]),
  near: ramp(["#8a9cac", "#98a8ac", "#acb4a8", "#c2c2a4"]),
};
export type SkyColors = typeof NOON & { far: readonly Color[]; near: readonly Color[] };

/** how far the day has warmed toward late afternoon at progress k */
const warmth = (k: number): number => k * 0.85;

/** the sky's own colors at progress k, warming from noon toward late afternoon */
export function skyColors(k: number): SkyColors {
  const u = warmth(k);
  const out = { ...NOON };
  for (const key of Object.keys(NOON) as (keyof typeof NOON)[]) out[key] = mix(NOON[key], DUSK[key], u);
  return {
    ...out,
    far: NOON_RANGES.far.map((c, i) => mix(c, DUSK_RANGES.far[i], u)),
    near: NOON_RANGES.near.map((c, i) => mix(c, DUSK_RANGES.near[i], u)),
  };
}

/** flower heads in the meadow, each with the color of its heart */
export const FLOWERS: readonly (readonly [Color, Color])[] = [
  [hex("#ffffff"), hex("#ffd84a")],
  [hex("#ffe14a"), hex("#e88a20")],
  [hex("#ff9ab8"), hex("#fff0a0")],
  [hex("#b8a0ff"), hex("#fff0a0")],
  [hex("#ff7a5a"), hex("#ffe14a")],
];
