import type { HeroSkin } from "../../../types/character";
import { hex, ramp } from "../../../utils/color";
import { type HeroColors, SPARKS } from "../../palette";

/** Ysra: dark skin, black braid with an ember streak, crimson coat with bronze trim, an orange sash and a glaive of forge-fire */
const YSRA_COLORS: HeroColors = {
  outline: hex("#140a10"),
  skinLight: hex("#c08458"),
  skin: hex("#9a6440"),
  skinShade: hex("#64402a"),
  skinDeep: hex("#4a2c1c"),
  hairGlint: hex("#8a7488"),
  hairLight: hex("#5a4656"),
  hair: hex("#2a1e2a"),
  hairDark: hex("#140e16"),
  hairDeep: hex("#0a070c"),
  eyeWhite: hex("#f0e4d8"),
  iris: hex("#ffb040"),
  pupil: hex("#3a1408"),
  coatLight: hex("#c0383e"),
  coat: hex("#8e1f2c"),
  coatDark: hex("#58121e"),
  coatDeep: hex("#380a12"),
  steelGlint: hex("#ffe0a8"),
  steelLight: hex("#c89058"),
  steel: hex("#8a5e3e"),
  steelDark: hex("#4e3428"),
  steelDeep: hex("#2a1c18"),
  trimLight: hex("#ffcc78"),
  trim: hex("#d08a3c"),
  trimDark: hex("#8a5420"),
  pantsLight: hex("#42343e"),
  pants: hex("#2a2028"),
  pantsDark: hex("#1a1218"),
  bootLight: hex("#6e4630"),
  boot: hex("#3c2420"),
  bootDark: hex("#24140f"),
  gloveLight: hex("#503628"),
  glove: hex("#30201a"),
  scarfLight: hex("#ffb24e"),
  scarf: hex("#e0702a"),
  scarfDark: hex("#963818"),
  bladeEdge: hex("#fff2c4"),
  blade: hex("#ff9a3a"),
  bladeBack: hex("#c0441a"),
  bladeDeep: hex("#8a2a10"),
  hilt: hex("#4e3020"),
};

/**
 * Ysra's head, 24 by 22 image pixels, facing right in three-quarters: dark hair pulled back from a bare brow, an ember
 * streak over the temple, an amber eye. Letters: D d h H W hair deep to glint, r streak, L s S m skin light to deep,
 * w I P eye white, iris and pupil.
 */
const HEAD = [
  "........................",
  "..........DDDDD.........",
  ".......DDDdhhhhdD.......",
  ".....DDdhhhhHHhhdD......",
  "....DdhhhhHHWHHhhhD.....",
  "...DdhhhhhHHHHhhhhhD....",
  "..DdhhrrhhhhhhhhhhhhD...",
  "..DdhrrhhhhhhhhhhhhhhD..",
  ".DdhhrhhhhhhhhhhhhhhhhD.",
  ".DdhhhhhhhhhhhhhhhhhhhD.",
  ".DddhhhhhhhhhhhhhhhhhhhD",
  ".DDdhhhhhhhhhhhhhhhhhhhd",
  "..DDdhhhhhhhhhhhLLLLsshd",
  "..DDddhhhhhhhhLLssssssss",
  "...DDdhhhhhSsLLsssDDdsss",
  "....DDdhhhSsLsLssdwIIsss",
  ".....DDdhhSssssssswIPsss",
  "......DDdSSssssssLIIssss",
  ".......DdSSsssssssssSss.",
  "........DdSSSssssssmmS..",
  ".........D.SSSsssssSS...",
  "...........SSSSSSSS.....",
] as const;
/** the back of her head: the hair drawn back in strands to the nape, the streak at the temple */
const HEAD_BACK = [
  "........................",
  "..........DDDDD.........",
  ".......DDDdhhhhdD.......",
  ".....DDdhhhhHHhhdD......",
  "....DdhhhhHHWHHhhhD.....",
  "...DdhhhhhHHHHhhhhhD....",
  "..DdhhrrhhhhhdhhhhhhD...",
  "..DdhrrhhhhhdhhhhdhhhD..",
  ".DdhhrhhhhhdhhhhdhhhhhD.",
  ".DdhhhhhhhdhhhhdhhhhdhD.",
  ".DddhhhhhdhhhhdhhhhdhhhD",
  "....DddhhhdhhhdhhhdhhddD",
  "....DddhhdhhhdhhhdhhdddD",
  "....DDdhhdhhdhhhdhhhddDD",
  ".....DdhhdhhdhhdhhhdddD.",
  ".....DDdhdhhdhhdhhdddDD.",
  "......DddhdhdhhdhdddDD..",
  "......DDddhdhdhdhddDD...",
  ".......DDddhdddhddDD....",
  ".........DDdddddDD......",
  "...........DSSSSD.......",
  "...........SSSSSS.......",
] as const;

export const EMBER = ramp(["#2a0a10", "#6a1a16", "#b0381a", "#ec7228", "#ffae48", "#ffe08a", "#ffffff"]);

/** Ysra's look on the shared rig: a long glaive of forge-fire with amber slashes */
export const YSRA_SKIN: HeroSkin = {
  colors: YSRA_COLORS,
  head: HEAD,
  headBack: HEAD_BACK,
  weapon: "glaive",
  reach: 23,
  ramp: EMBER,
  glow: EMBER[3],
  sparks: SPARKS.hot,
};
