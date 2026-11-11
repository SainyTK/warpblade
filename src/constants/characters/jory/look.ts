import type { HeroSkin } from "../../../types/character";
import type { Ramp } from "../../../types/color";
import { hex, WHITE } from "../../../utils/color";
import { type HeroColors, PAL, SPARKS } from "../../palette";

/**
 * Jory: deep brown skin, the sides of his head shaved with a short black topknot, a cobalt headband, a short black beard,
 * a sleeveless slate jerkin studded with pewter over bare arms with cobalt wrist wraps, a cobalt sash with two tassels,
 * wide dark trousers tucked into wrapped boots, and two mallets with dark wood shafts and cobalt felt heads.
 */
const JORY_COLORS: HeroColors = {
  outline: hex("#0a0a12"),
  skinLight: hex("#b07850"),
  skin: hex("#8a5634"),
  skinShade: hex("#643c22"),
  skinDeep: hex("#3e2414"),
  hairGlint: hex("#5a5a6a"),
  hairLight: hex("#34343e"),
  hair: hex("#1e1e26"),
  hairDark: hex("#121218"),
  hairDeep: hex("#08080c"),
  eyeWhite: hex("#e8dccc"),
  iris: hex("#6a3a1e"),
  pupil: hex("#100806"),
  coatLight: hex("#7a8494"),
  coat: hex("#566070"),
  coatDark: hex("#3a4250"),
  coatDeep: hex("#222832"),
  steelGlint: hex("#f0f4f8"),
  steelLight: hex("#b8c0cc"),
  steel: hex("#8a94a2"),
  steelDark: hex("#5a6270"),
  steelDeep: hex("#2e3440"),
  trimLight: hex("#a6c0ff"),
  trim: hex("#5a82ff"),
  trimDark: hex("#2c4fb0"),
  pantsLight: hex("#4a4652"),
  pants: hex("#322e38"),
  pantsDark: hex("#1e1a22"),
  bootLight: hex("#7a6452"),
  boot: hex("#544232"),
  bootDark: hex("#2e221a"),
  gloveLight: hex("#c8a882"),
  glove: hex("#8e6e50"),
  scarfLight: hex("#a6c0ff"),
  scarf: hex("#5a82ff"),
  scarfDark: hex("#2c4fb0"),
  bladeEdge: hex("#eef3ff"),
  blade: hex("#a6c0ff"),
  bladeBack: hex("#5a82ff"),
  bladeDeep: hex("#2c4fb0"),
  hilt: hex("#3a2618"),
};

/**
 * Jory's head, 24 by 22 image pixels, facing right in three-quarters: a short topknot on the crown, the sides shaved to
 * dark stubble, a cobalt headband across the brow, a deep brown face with a dark eye under a heavy brow, and a short
 * black beard along the jaw. Letters: D d h H W hair deep to glint, L s S m skin light to deep, w I P eye white, iris
 * and pupil, r v V the headband light to dark.
 */
const HEAD = [
  "........................",
  "..........DDDD..........",
  ".........DhHWhD.........",
  ".........DhHhhD.........",
  "........DDdhhdDD........",
  "......DDmmddddmmDD......",
  ".....DmmSmmmmmmSmmmD....",
  "....DmSSmSmmmmmSmSSmmD..",
  "...DrrrrrrrrrrrrrrrrrrD.",
  "...DvvvvvvvvvvvvvvvvvvvD",
  "...DVVvVVVVVVVVVVVVVVVVD",
  "...DSSmSSSssssssssssssss",
  "..DSSSmSSsssssLLssssssss",
  "..DSmSSSssssLLsssmDDDsss",
  "..DSSSSssssLssssswIIPss.",
  "..DDSSSsSsLsLssmswIPPss.",
  "...DSSSsssssssssssmssss.",
  "...DDdSSsssssssssssmLss.",
  "....DddSddssssssddddsss.",
  ".....DddddddddddhhddddD.",
  "......DDdddhdddhhdddD...",
  ".........DDDDDDDDD......",
] as const;

/** the back of his head: the topknot, the shaved crown, and the headband's knot at the nape over the beard's edge */
const HEAD_BACK = [
  "........................",
  "..........DDDD..........",
  ".........DhHWhD.........",
  ".........DhHhhD.........",
  "........DDdhhdDD........",
  "......DDmmddddmmDD......",
  ".....DmmSmmmmmmSmmmD....",
  "....DmSSmSmmmmmmSmSSD...",
  "...DrrrrrrrrrrrrrrrrrD..",
  "...DvvvvvvvvvvvvvvvvvD..",
  "...DVVVVVVvVrVVVVVVVVD..",
  "...DSSmSSSSvVvSSSmSSSD..",
  "...DSSSSmSSSSSSSSSSSSD..",
  "...DSSmSSSSSSSSmSSSSSD..",
  "....DSSSSSSmSSSSSSSSD...",
  "....DDSSSSSSSSSSSSSDD...",
  ".....DdSSSSSSSSSSSdD....",
  "......DddSSSSSSSSddD....",
  ".......DDdddddddddD.....",
  "........DDdddddddD......",
  "...........SSSSS........",
  "...........SSSSS........",
] as const;

/** his smears, rings, sound waves and the floor ring: cobalt from deep to white-hot, then white */
export const BEAT_RAMP: Ramp = [...PAL.beat, WHITE];

/** Jory's look on the shared rig: two mallets and a war drum at his hip */
export const JORY_SKIN: HeroSkin = {
  colors: JORY_COLORS,
  head: HEAD,
  headBack: HEAD_BACK,
  weapon: "mallets",
  reach: 10,
  ramp: BEAT_RAMP,
  glow: BEAT_RAMP[4],
  sparks: SPARKS.beat,
  bareArms: true,
  sash: true,
  headband: true,
  wraps: true,
  drum: true,
};
