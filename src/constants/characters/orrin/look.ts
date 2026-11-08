import type { HeroSkin } from "../../../types/character";
import type { Ramp } from "../../../types/color";
import { hex, WHITE } from "../../../utils/color";
import { type HeroColors, PAL, SPARKS } from "../../palette";

/**
 * Orrin: warm tan skin, copper-red hair shaved at the sides and tied back in a short tail, an indigo sleeveless vest with
 * brass buckles over bare arms with wrist wraps, a long dark sash at the belt, loose slate trousers wrapped at the shins
 * and light boots. His chain is steel; its hook and his trims are brass.
 */
const ORRIN_COLORS: HeroColors = {
  outline: hex("#0e0a10"),
  skinLight: hex("#f2c69a"),
  skin: hex("#d8a072"),
  skinShade: hex("#a87250"),
  skinDeep: hex("#744a34"),
  hairGlint: hex("#ffc89a"),
  hairLight: hex("#e8784a"),
  hair: hex("#c04e2a"),
  hairDark: hex("#86301c"),
  hairDeep: hex("#4a1810"),
  eyeWhite: hex("#f0e8dc"),
  iris: hex("#5a8ac8"),
  pupil: hex("#121a2a"),
  coatLight: hex("#5a5ab0"),
  coat: hex("#3a3a86"),
  coatDark: hex("#262660"),
  coatDeep: hex("#16163c"),
  steelGlint: hex("#f4f6fa"),
  steelLight: hex("#b8c0cc"),
  steel: hex("#7e8898"),
  steelDark: hex("#4a5262"),
  steelDeep: hex("#282c38"),
  trimLight: hex("#ffe08a"),
  trim: hex("#e8b04a"),
  trimDark: hex("#9a6a26"),
  pantsLight: hex("#6e7888"),
  pants: hex("#4a5262"),
  pantsDark: hex("#2e3440"),
  bootLight: hex("#8a6a4a"),
  boot: hex("#5a422e"),
  bootDark: hex("#322418"),
  gloveLight: hex("#e8dcc4"),
  glove: hex("#b4a284"),
  scarfLight: hex("#4a4060"),
  scarf: hex("#2e2840"),
  scarfDark: hex("#1a1626"),
  bladeEdge: hex("#fff6d0"),
  blade: hex("#e8b04a"),
  bladeBack: hex("#c08a2e"),
  bladeDeep: hex("#7a4e1a"),
  hilt: hex("#3a2a20"),
};

/**
 * Orrin's head, 24 by 22 image pixels, facing right in three-quarters: a crest of copper hair swept back from the brow,
 * the sides shaved to stubble, a blue eye under a straight brow and a narrow jaw. Letters: D d h H W hair deep to glint,
 * L s S m skin light to deep, w I P eye white, iris and pupil.
 */
const HEAD = [
  "........................",
  "..........DDDDD.........",
  "........DDhhhhhD........",
  "......DDhhHHHHhhD.......",
  ".....DhhHHHWWHHhhD......",
  "....DdhhhHHHHHHhhhDD....",
  "...DddhhhhhhhhhhhhhhD...",
  "..DddddhhhhhhhhhhhhhhD..",
  "..DSSSSddhhhhhhhhsssssD.",
  ".DSSmSSSSddhhhssssssssD.",
  ".DSSSSmSSSSsssssssssssD.",
  ".DDSSSSSSsssssssssssssss",
  "..DSSmSSssssssssLLLLssss",
  "..DDSSSsssssssLLssmsssss",
  "...DDSSsSssSsLLssmDDssss",
  "....DDssssSsLsLsmsswIIss",
  ".....DDsssSssssssswIPsss",
  "......DDsSSssssssLIIssss",
  ".......DsSSsssssssssSsss",
  "........DsSSSssssssssmSs",
  ".........DsSSSsssssSSS..",
  "..........SSSSSSSSSS....",
] as const;
/** the back of his head: the crest drawn back to the tail's knot at the crown, shaved sides either side of it */
const HEAD_BACK = [
  "........................",
  "..........DDDDD.........",
  "........DDdhhhhD........",
  "......DDdhhhHHhhD.......",
  ".....DdhhhHHWHHhhD......",
  "....DdhhhhHHHHhhhhDD....",
  "...DSSdhhhhhhhhhhSdSD...",
  "..DSSSSdhhhhhhhhSSSSSD..",
  ".DSSmSSShhhhhhhhSSmSSSD.",
  ".DSSSSSShhhhhhhhSSSSSSD.",
  ".DSSSmSSShhhhhhSSSmSSSSD",
  "...DSSSSShhhhhhSSSSSSSD.",
  "....DSSSSShhhhSSSSSSSD..",
  "....DDSSSShhhhSSSSSSDD..",
  ".....DSSSSShhSSSSSSD....",
  ".....DDSSSSSSSSSSSDD....",
  "......DDSSSSSSSSSDD.....",
  ".......DDSSSSSSSDD......",
  "........DDSSSSSDD.......",
  ".........DDddddD........",
  "...........SSSSD........",
  "...........SSSSS........",
] as const;

/** his tip flashes, chain glow, smears and rings: brass, dark to white */
export const BRASS: Ramp = [...PAL.brass, WHITE];

/** Orrin's look on the shared rig: a brass hook on a steel chain, coiled round his far forearm */
export const ORRIN_SKIN: HeroSkin = {
  colors: ORRIN_COLORS,
  head: HEAD,
  headBack: HEAD_BACK,
  weapon: "chain",
  reach: 4,
  ramp: BRASS,
  glow: BRASS[3],
  sparks: SPARKS.brass,
  bareArms: true,
  sash: true,
};
