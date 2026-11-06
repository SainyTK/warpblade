import type { HeroSkin } from "../../../types/character";
import { hex, ramp, WHITE } from "../../../utils/color";
import type { HeroColors } from "../../palette";

/** Sable: a pine-green hood over copper hair, an olive leather jerkin with bone buckles, a rust half-cape and a
 *  crossbow of dark wood with jade-steel limbs */
const SABLE_COLORS: HeroColors = {
  outline: hex("#0a120e"),
  skinLight: hex("#ffe4cc"),
  skin: hex("#f0c6a2"),
  skinShade: hex("#c88e70"),
  skinDeep: hex("#94604c"),
  hairGlint: hex("#a8d49a"),
  hairLight: hex("#5e9462"),
  hair: hex("#3a6646"),
  hairDark: hex("#22402e"),
  hairDeep: hex("#12221a"),
  eyeWhite: hex("#eef4e8"),
  iris: hex("#8ed850"),
  pupil: hex("#1a2a10"),
  coatLight: hex("#8aa258"),
  coat: hex("#5e7a3a"),
  coatDark: hex("#3c5226"),
  coatDeep: hex("#223216"),
  steelGlint: hex("#f4f8f0"),
  steelLight: hex("#b6bcae"),
  steel: hex("#7c8476"),
  steelDark: hex("#464e44"),
  steelDeep: hex("#262c26"),
  trimLight: hex("#f4e8c8"),
  trim: hex("#ccb88c"),
  trimDark: hex("#8a7652"),
  pantsLight: hex("#5a4a3c"),
  pants: hex("#3a2e26"),
  pantsDark: hex("#241c18"),
  bootLight: hex("#6a4a34"),
  boot: hex("#3e2a1e"),
  bootDark: hex("#221610"),
  gloveLight: hex("#6a5040"),
  glove: hex("#40302a"),
  scarfLight: hex("#e88a4c"),
  scarf: hex("#b8502e"),
  scarfDark: hex("#6e2818"),
  bladeEdge: hex("#eafff2"),
  blade: hex("#9ad8b8"),
  bladeBack: hex("#4a8a78"),
  bladeDeep: hex("#2a5048"),
  hilt: hex("#5a3a24"),
};

/**
 * Sable's head, 24 by 22 image pixels, facing right in three-quarters: a pine hood drawn forward over the brow with a
 * shadowed rim, copper fringe (r) falling out under it, a green eye, the cowl draped down behind the jaw.
 */
const HEAD = [
  "........................",
  ".........DDDDDD.........",
  "......DDDdhhhhhdDD......",
  "....DDdhhhhHHHhhhdDD....",
  "...DdhhhhHHHWWHHhhhdD...",
  "..DdhhhhHHHHWHHHHhhhdD..",
  "..DdhhhHHHHHHHHHHHhhhdD.",
  ".DdhhhhHHHHHHHHHHHHhhhdD",
  ".DdhhhhhHHHHHHHHHhhhhhdD",
  ".DdhhhhhhhhhhhhhhhhDDDDD",
  ".DddhhhhhhhhhhhDDrrrrrrD",
  ".DddhhhhhhhhhDrrrrrrrrrr",
  ".DDddhhhhhhhDrrrLrrrrssr",
  "..DDdhhhhhhDrrLLssssssss",
  "..DDddhhhhhDdLLsssDDdsss",
  "..DDddhhhhDSsLsLssdwIIss",
  "...DDdhhhhDSssssssswIPss",
  "...DDddhhhDSSssssssLIIss",
  "....DDdhhhDdSSsssssssSs.",
  ".....DDdhhhDdSSSssssmmS.",
  "......DDddhhDDSSSssSS...",
  "........DDDDDDSSSSS.....",
] as const;
/** the back of her hood: the cloth gathered in folds down to the cowl */
const HEAD_BACK = [
  "........................",
  ".........DDDDDD.........",
  "......DDDdhhhhhdDD......",
  "....DDdhhhhHHHhhhdDD....",
  "...DdhhhhHHHWWHHhhhdD...",
  "..DdhhhhHHHHWHHHHhhhdD..",
  "..DdhhhHHHHdHHHHHHhhhdD.",
  ".DdhhhhHHHdHHHHdHHHhhhdD",
  ".DdhhhhhHdHHHHdHHHhhhhdD",
  ".DdhhhhhdhhhhhdhhhhhhhdD",
  ".DddhhhhdhhhhdhhhhhhhhdD",
  ".DddhhhdhhhhdhhhhhhhhddD",
  ".DDddhhdhhhhdhhhhhhhhddD",
  "..DDdhhdhhhdhhhhhhhhddD.",
  "..DDddhdhhhdhhhhhhhdddD.",
  "...DDddhhhdhhhhhhhdddD..",
  "...DDdddhhdhhhhhhdddDD..",
  "....DDddhhdhhhhhdddDD...",
  ".....DDdddhhhhhdddDD....",
  "......DDddddddddDDD.....",
  "........DDDSSSSDD.......",
  "...........SSSSSS.......",
] as const;

/** her bolts, trails and floor rings: jade, dark to white */
export const JADE = ramp(["#0a1a16", "#123a2e", "#1e6a4a", "#2fa86a", "#6ee0a0", "#c4ffd8", "#ffffff"]);
const JADE_SPARKS = [WHITE, hex("#d8ffe8"), hex("#7ee0a8"), hex("#2f9a6a")];

/** Sable's look on the shared rig: a repeating crossbow and jade bolts */
export const SABLE_SKIN: HeroSkin = {
  colors: SABLE_COLORS,
  head: HEAD,
  headBack: HEAD_BACK,
  weapon: "crossbow",
  reach: 14,
  ramp: JADE,
  glow: JADE[3],
  sparks: JADE_SPARKS,
};
