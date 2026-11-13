import type { HeroSkin } from "../../../types/character";
import type { Ramp } from "../../../types/color";
import { hex, WHITE } from "../../../utils/color";
import { type HeroColors, PAL, SPARKS } from "../../palette";

/**
 * Tallis: warm tan skin, black hair tied short under a deep charcoal hood, a half mask of dark plum cloth over nose and
 * mouth so only the eyes read, a short charcoal coat with a plum scarf end, fitted dark leathers with rose-stitched
 * straps, linen-wrapped forearms and shins, and soft split-toe boots. His knives are steel with a dusk rose edge.
 */
export const TALLIS_COLORS: HeroColors = {
  outline: hex("#0a080e"),
  skinLight: hex("#e0b48a"),
  skin: hex("#c08a5e"),
  skinShade: hex("#946240"),
  skinDeep: hex("#643e26"),
  hairGlint: hex("#6a6a7a"),
  hairLight: hex("#3a3a46"),
  hair: hex("#24242c"),
  hairDark: hex("#16161c"),
  hairDeep: hex("#0a0a0e"),
  eyeWhite: hex("#e8e0d8"),
  iris: hex("#d0a060"),
  pupil: hex("#120a10"),
  coatLight: hex("#5a5866"),
  coat: hex("#3c3a46"),
  coatDark: hex("#282630"),
  coatDeep: hex("#16141c"),
  steelGlint: hex("#ffb8dc"),
  steelLight: hex("#5e4c58"),
  steel: hex("#40343c"),
  steelDark: hex("#2a2028"),
  steelDeep: hex("#160e14"),
  trimLight: hex("#ffb8dc"),
  trim: hex("#c06a9e"),
  trimDark: hex("#6e4a78"),
  pantsLight: hex("#3e3a44"),
  pants: hex("#2a2830"),
  pantsDark: hex("#18161c"),
  bootLight: hex("#4a4450"),
  boot: hex("#2e2a34"),
  bootDark: hex("#18161c"),
  gloveLight: hex("#a89c8a"),
  glove: hex("#786c5e"),
  scarfLight: hex("#8a4a7a"),
  scarf: hex("#5e2c56"),
  scarfDark: hex("#3a1838"),
  bladeEdge: hex("#f4eef4"),
  blade: hex("#aaa6b4"),
  bladeBack: hex("#6c6876"),
  bladeDeep: hex("#3a3642"),
  hilt: hex("#2a2018"),
};

/**
 * Tallis's head, 24 by 22 image pixels, facing right in three-quarters: a deep hood lit from the top left with its plum
 * lining round the face, a black fringe under it, a shadowed brow, an amber eye, and the plum half mask over the nose and
 * mouth with a fold under the eye. Letters: K k c C hood deep to light, v V plum lining and mask, D d h H hair deep to
 * light, L s S m skin light to deep, w I P eye white, iris and pupil.
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
  "..KkcckcccccccccvVDdhdDV",
  "..KkcckccccccccvVDdhdDdD",
  "..KkcckcccccccvVDdSSSSSs",
  "..KkcckccccccvVSdSssDDDs",
  "...KkkcccccccvVSSsdwIIPs",
  "...KKkkccccccvVSssswIPPs",
  "....KKkkcccccvVSsvvvvvvv",
  ".....KKkkccccvVVvvVvvvvV",
  "......KKkkcccvVVvvvVvvV.",
  ".......KKkkkkvVKVvvvVV..",
  ".........KKKKKKKVVVVV...",
  "........................",
] as const;

/** the back of his hood: the cowl in folds round a seam, gathered at his nape over the mask's knot */
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
  ".........KKvVvVkKK......",
  "...........KSSSSK.......",
  "...........SSSSSS.......",
  "........................",
] as const;

/** his smears, the Veil's outline, the pool and Gloaming's slashes: the gloam ramp from ink to dusk rose, then white */
export const GLOAM_RAMP: Ramp = [...PAL.gloam, WHITE];

/** Tallis's look on the shared rig: two short curved knives in reverse grip */
export const TALLIS_SKIN: HeroSkin = {
  colors: TALLIS_COLORS,
  head: HEAD,
  headBack: HEAD_BACK,
  weapon: "knives",
  reach: 8,
  ramp: GLOAM_RAMP,
  glow: GLOAM_RAMP[4],
  sparks: SPARKS.gloam,
  hood: true,
  scarfEnd: true,
  wraps: true,
};
