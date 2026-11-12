import type { HeroSkin } from "../../../types/character";
import type { Ramp } from "../../../types/color";
import { hex, WHITE } from "../../../utils/color";
import { type HeroColors, PAL, SPARKS } from "../../palette";

/**
 * Brannoc: pale weathered skin, a wild ash-blond mane and braided beard, a bone-white war paint band across both eyes, a
 * bare scarred chest under a dark wolf-fur mantle, iron bracers bound in bone cord, a wide leather belt with an iron
 * buckle, dark trousers and fur-wrapped boots, and a great axe with a dark ash haft and a bearded iron head.
 * The scarf colours are his bone: the war paint, the cord at his throat and the bindings on his haft.
 */
const BRANNOC_COLORS: HeroColors = {
  outline: hex("#120c0c"),
  skinLight: hex("#ecd0b8"),
  skin: hex("#cfa58a"),
  skinShade: hex("#a07a62"),
  skinDeep: hex("#6c4c3e"),
  hairGlint: hex("#f6eedc"),
  hairLight: hex("#dccfae"),
  hair: hex("#b2a07c"),
  hairDark: hex("#7c6c50"),
  hairDeep: hex("#3e3426"),
  eyeWhite: hex("#eae0cc"),
  iris: hex("#5c7c8c"),
  pupil: hex("#101418"),
  coatLight: hex("#6c645a"),
  coat: hex("#4a443e"),
  coatDark: hex("#2e2a26"),
  coatDeep: hex("#1a1816"),
  steelGlint: hex("#e8ecf0"),
  steelLight: hex("#a8b0b8"),
  steel: hex("#6e767e"),
  steelDark: hex("#444a52"),
  steelDeep: hex("#24282e"),
  trimLight: hex("#fbf4e2"),
  trim: hex("#eadbb8"),
  trimDark: hex("#b09c78"),
  pantsLight: hex("#4e4444"),
  pants: hex("#322a2a"),
  pantsDark: hex("#1c1616"),
  bootLight: hex("#867a6c"),
  boot: hex("#5a5046"),
  bootDark: hex("#302a24"),
  gloveLight: hex("#a4825e"),
  glove: hex("#6e5038"),
  scarfLight: hex("#fbf4e2"),
  scarf: hex("#eadbb8"),
  scarfDark: hex("#b09c78"),
  bladeEdge: hex("#f2eee6"),
  blade: hex("#9aa0a6"),
  bladeBack: hex("#5e646c"),
  bladeDeep: hex("#33383e"),
  hilt: hex("#3a2e24"),
};

/**
 * Brannoc's head, 24 by 22 image pixels, facing right in three-quarters: a wild ash-blond mane spilling back from the
 * crown, a heavy brow, a bone-white war paint band across both eyes with a grey eye in it, a broken nose, and a short
 * braided beard ending in a bound tip. Letters: D d h H W hair deep to glint, L s S m skin light to deep, w I P eye
 * white, iris and pupil, r the war paint.
 */
const HEAD = [
  "........................",
  ".......DDDDDDD..........",
  ".....DDhhHHHhhDD........",
  "...DDhhHHWWHHHhhDD......",
  "..DdhhHHHWHHHHHhhhD.....",
  ".DdhhhHHHHHHhhhhhhhD....",
  ".DdhhhhHHhhhhhhdhhhhD...",
  "DddhhhhhhhhhhdhhssssdD..",
  "DdhhhhdhhhhhdSssssssshD.",
  "DdhhhhhdhhhdSsssssssssD.",
  "DddhhhhhdhdSsssssssssssD",
  ".DdhhhhhhhdSSssssssLLsss",
  ".DddhhhhdhSSsssssmmmmmss",
  "..DdhhhhdrrrrrrrrrrrrrrS",
  "..DddhhhdrrrrrrrrrwIPrrs",
  "...DdhhhdSssssLssssmsss.",
  "...DddhhhSssssLLsssssss.",
  "....DdhhhSsssHHhhhhhhs..",
  ".....DdhhSShhHHHhhhhhh..",
  "......DdhhhhhhhHhhhhhd..",
  ".......DddddddhhHhhdD...",
  "..............DdhhdD....",
] as const;

/** the back of his head: the mane falling to the nape, where the two braids leave on the rope, and the neck under it */
const HEAD_BACK = [
  "........................",
  ".......DDDDDDD..........",
  ".....DDhhHHHhhDD........",
  "...DDhhHHWWHHHhhDD......",
  "..DdhhHHHWHHHHHhhhD.....",
  ".DdhhhHHHHHHhhhhhhhD....",
  ".DdhhhhHHhhhhhhdhhhhD...",
  "DddhhhhhhhhhhdhhhhhhdD..",
  "DdhhhhdhhhhhdhhhhhhhhD..",
  "DdhhhhhdhhhdhhhHhhhhhD..",
  "DddhhhhhdhdhhhHHhhhhhD..",
  ".DdhhhhhhhdhhHHhhhhhdD..",
  ".DddhhhhdhhhhhhhhhhdD...",
  "..DdhhhhdhhhhhhhhhhdD...",
  "..DddhhhdhhhhhhhhhdD....",
  "...DdhhhdhhhhhhhhdD.....",
  "...DDdhhhdhhhhhhdD......",
  "....DDdhhhhhhhhdD.......",
  ".....DDddhhhhddD........",
  ".......DDddddDD.........",
  "...........SSSSS........",
  "...........SSSSS........",
] as const;

/** his smears, rings, crescents and motes: crimson from clotted to pale, then white */
export const RAGE_RAMP: Ramp = [...PAL.rage, WHITE];

/** Brannoc's look on the shared rig: a great axe held in both hands, bare arms and chest, a fur mantle and a mane */
export const BRANNOC_SKIN: HeroSkin = {
  colors: BRANNOC_COLORS,
  head: HEAD,
  headBack: HEAD_BACK,
  weapon: "greatAxe",
  reach: 17,
  ramp: RAGE_RAMP,
  glow: RAGE_RAMP[3],
  sparks: SPARKS.rage,
  bareArms: true,
  bareChest: true,
  mane: true,
};
