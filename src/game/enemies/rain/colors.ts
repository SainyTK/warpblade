import { hex, ramp } from "../../../utils/color";

/** The storm foes' colors: swamp skin, bog mud and reeds, storm hide, a violet rift glow in all of them. */
export const RAIN_FOES = {
  outline: hex("#0b0a10"),
  toadDark: hex("#1f2c26"),
  toad: hex("#34503c"),
  toadLight: hex("#5a7a4e"),
  toadRim: hex("#9cb878"),
  belly: hex("#8c8458"),
  sac: hex("#c89a7a"),
  sacHot: hex("#e8c0e8"),
  wart: hex("#9a6ad8"),
  tongue: hex("#d0607a"),
  tongueTip: hex("#f4a0b8"),
  eye: hex("#f0d4ff"),
  kiteDark: hex("#1c2036"),
  kite: hex("#323a5c"),
  kiteLight: hex("#55628e"),
  kiteRim: hex("#a8b8ec"),
  kiteVein: hex("#b673e8"),
  mudDark: hex("#211a16"),
  mud: hex("#3a2e24"),
  mudLight: hex("#5a4a36"),
  mudRim: hex("#8a7a5a"),
  reed: hex("#5a6a2e"),
  reedLight: hex("#9aa848"),
  moss: hex("#3c5a34"),
  glob: hex("#4a3a2a"),
  globLight: hex("#7a6448"),
  puddle: hex("#2e2a22"),
  puddleLip: hex("#7a6a50"),
  water: hex("#b4c4d8"),
  /** the detail tones: the deepest shade and the wet glint of each material, and the hot cores of the glows */
  toadDeep: hex("#121c17"),
  toadGlint: hex("#e2f2bc"),
  toadSpot: hex("#2a4030"),
  bellyLight: hex("#b8ae7c"),
  bellyDark: hex("#5c5638"),
  sacDeep: hex("#8a5a56"),
  tongueDark: hex("#8c3050"),
  wartHot: hex("#dcb8ff"),
  kiteDeep: hex("#0f1120"),
  kiteGlint: hex("#eef2ff"),
  veinDeep: hex("#5e3292"),
  veinHot: hex("#ecd2ff"),
  mudDeep: hex("#130e0b"),
  mudGlint: hex("#cdbd96"),
  mossLight: hex("#6c8c46"),
  mossDeep: hex("#22341e"),
  reedDark: hex("#343f1a"),
  cattail: hex("#4e3220"),
  cattailLight: hex("#835a36"),
  globDeep: hex("#2a2018"),
};

/** the kite's hostile lightning, violet against Kael's blue-white bolt */
export const STORM_VOLT = ramp(["#2a0c40", "#6a1c9a", "#b04ae0", "#e09cff", "#fbe8ff"]);
export const STORM_SPARKS = ramp(["#fbe8ff", "#e09cff", "#b04ae0", "#6a1c9a"]);
export const MUD_SPARKS = ramp(["#8a7a5a", "#5a4a36", "#3a2e24", "#211a16"]);
export const WATER_SPARKS = ramp(["#dce6f2", "#b4c4d8", "#7e8ea4", "#4e5a6c"]);

/** attack damage before wave scaling */
export const RAIN_HITS = {
  mireTongue: 14,
  mireGlob: 12,
  mirePuddle: 6,
  mireTouch: 8,
  kiteStrike: 12,
  hulkSlam: 22,
  hulkWave: 18,
  hulkGlob: 14,
} as const;
