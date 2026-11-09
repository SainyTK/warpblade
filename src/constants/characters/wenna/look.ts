import type { HeroSkin } from "../../../types/character";
import type { Ramp } from "../../../types/color";
import { hex, WHITE } from "../../../utils/color";
import { type HeroColors, PAL, SPARKS } from "../../palette";

/**
 * Wenna: olive skin, short dark auburn hair under a deep ash-grey hood, a long ash-grey cloak lined in violet over a
 * violet tunic, a hem crusted in pale wax, a leather satchel of candles at her hip, dark trousers, linen-wrapped shins
 * and soft boots. Her lamp pole is dark wood with iron fittings and an iron hook at the top.
 */
const WENNA_COLORS: HeroColors = {
  outline: hex("#0c0a10"),
  skinLight: hex("#cdb084"),
  skin: hex("#a88a5c"),
  skinShade: hex("#7e6440"),
  skinDeep: hex("#52402a"),
  hairGlint: hex("#f0a878"),
  hairLight: hex("#b0603e"),
  hair: hex("#7e3a26"),
  hairDark: hex("#54241a"),
  hairDeep: hex("#321410"),
  eyeWhite: hex("#ece4d6"),
  iris: hex("#9a6ad8"),
  pupil: hex("#160e22"),
  coatLight: hex("#94929c"),
  coat: hex("#6c6a76"),
  coatDark: hex("#4a4854"),
  coatDeep: hex("#2a2832"),
  steelGlint: hex("#d8c4f0"),
  steelLight: hex("#8e6eb4"),
  steel: hex("#664c8a"),
  steelDark: hex("#443064"),
  steelDeep: hex("#281a3e"),
  trimLight: hex("#fff8e8"),
  trim: hex("#e8dcc4"),
  trimDark: hex("#a8947a"),
  pantsLight: hex("#46424c"),
  pants: hex("#2c2a32"),
  pantsDark: hex("#1a181e"),
  bootLight: hex("#76644e"),
  boot: hex("#4e4034"),
  bootDark: hex("#2c241c"),
  gloveLight: hex("#7c5a3c"),
  glove: hex("#523a28"),
  scarfLight: hex("#a46ae0"),
  scarf: hex("#6a3aa0"),
  scarfDark: hex("#3a1f5c"),
  bladeEdge: hex("#d4d6de"),
  blade: hex("#8a8e9a"),
  bladeBack: hex("#545862"),
  bladeDeep: hex("#2c2e36"),
  hilt: hex("#3a2618"),
};

/**
 * Wenna's head, 24 by 22 image pixels, facing right in three-quarters: a deep hood lit from the top left, its brim
 * jutting over her brow with the violet lining showing round the face, a short auburn fringe under it, a shadowed
 * forehead, a violet eye and a soft jaw. Letters: K k c C hood deep to light, v V lining, D d h H hair deep to light,
 * L s S m skin light to deep, w I P eye white, iris and pupil.
 */
const HEAD = [
  "........................",
  "..........KKKKKK........",
  "........KKkcccccKK......",
  "......KKkcCCCCcccckK....",
  ".....KkcCCCCCCcccccckK..",
  "....KkcCCCCCCcccccccckK.",
  "...KkcCCCCcccccccccccckK",
  "...KkcCcckcccccccccccccK",
  "..KkccCckccccccccccccccK",
  "..KkccckcccccccccvvvvvvK",
  "..KkcckcccccccccvVdhHhdV",
  "..KkcckccccccccvVdhHhdhd",
  "..KkcckcccccccvVdhSSSSSs",
  "..KkcckccccccvVSdSssDDds",
  "...KkkcccccccvVSSsdwIIss",
  "...KKkkccccccvVSssswIPss",
  "....KKkkcccccvVSsssLIIss",
  ".....KKkkccccvVSssssssSs",
  "......KKkkcccvVSSsssmmS.",
  ".......KKkkkkvVKSSssSS..",
  ".........KKKKKKKSSSSS...",
  "........................",
] as const;

/** the back of her hood: the cowl in folds round a seam, gathered at her nape */
const HEAD_BACK = [
  "........................",
  "..........KKKKK.........",
  ".......KKKkcccckK.......",
  ".....KKkcCCCCcckK.......",
  "....KkcCCCCCCccckK......",
  "...KkcCCCCCCcccccckK....",
  "..KkcCCCCcckcccccccckK..",
  "..KkcCccccckccccccccckK.",
  ".KkccCcccccckcccccccccK.",
  ".KkcccccccccckcccccccckK",
  ".KkccccccccckcccccccckkK",
  "....KkcccccckccccccckkkK",
  "....KkccccccckcccccckkkK",
  "....KKkcccccckccccckkkKK",
  ".....KkcccccckcccckkkkK.",
  ".....KKkccccckccckkkkKK.",
  "......KkkcccckcckkkkKK..",
  ".......KKkkkckkkkkKK....",
  ".........KKkkkkkKK......",
  "...........KSSSSK.......",
  "...........SSSSSS.......",
  "........................",
] as const;

/** her lantern's flame, the Flare, Swap, Kindle, the Quarry ring and her smears: lamp violet, dark to white */
export const LAMP_RAMP: Ramp = [...PAL.wick, WHITE];

/** Wenna's look on the shared rig: a lamp pole of dark wood with an iron hook at the top */
export const WENNA_SKIN: HeroSkin = {
  colors: WENNA_COLORS,
  head: HEAD,
  headBack: HEAD_BACK,
  weapon: "lampPole",
  reach: 30,
  ramp: LAMP_RAMP,
  glow: LAMP_RAMP[3],
  sparks: SPARKS.wick,
  hood: true,
  cloak: true,
  satchel: true,
  wraps: true,
};
