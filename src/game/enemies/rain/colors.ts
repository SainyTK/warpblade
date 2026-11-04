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
