import type { HeroSkin } from "../../../types/character";
import type { Ramp } from "../../../types/color";
import { hex, WHITE } from "../../../utils/color";
import { type HeroColors, PAL, SPARKS } from "../../palette";

/**
 * Mirel: deep brown skin, silver-white hair in a low bun held by two clock-hand pins, a long high-collared robe coat in
 * slate plum with sand-gold trim over a dusk-lilac panel, dark leggings and soft wrapped boots. Her staff is dark wood
 * topped by a clock ring of teal glass.
 */
const MIREL_COLORS: HeroColors = {
  outline: hex("#0c0a12"),
  skinLight: hex("#b07a52"),
  skin: hex("#8a5638"),
  skinShade: hex("#683e28"),
  skinDeep: hex("#46281a"),
  hairGlint: hex("#ffffff"),
  hairLight: hex("#eceef6"),
  hair: hex("#c4c8d6"),
  hairDark: hex("#8a8ea4"),
  hairDeep: hex("#55586e"),
  eyeWhite: hex("#efe8e0"),
  iris: hex("#3fb0a0"),
  pupil: hex("#0e1a1c"),
  coatLight: hex("#7c6690"),
  coat: hex("#5a4670"),
  coatDark: hex("#3e2e50"),
  coatDeep: hex("#251a32"),
  steelGlint: hex("#f6f0fa"),
  steelLight: hex("#c6b4d4"),
  steel: hex("#9884aa"),
  steelDark: hex("#685878"),
  steelDeep: hex("#3e3048"),
  trimLight: hex("#f6e6b4"),
  trim: hex("#d8b870"),
  trimDark: hex("#8a6e3a"),
  pantsLight: hex("#4c4658"),
  pants: hex("#302c3c"),
  pantsDark: hex("#1e1a26"),
  bootLight: hex("#8e7e6c"),
  boot: hex("#5e5246"),
  bootDark: hex("#36302a"),
  gloveLight: hex("#e8d6a0"),
  glove: hex("#a8885a"),
  scarfLight: hex("#7c6690"),
  scarf: hex("#5a4670"),
  scarfDark: hex("#3e2e50"),
  bladeEdge: hex("#e6fff6"),
  blade: hex("#8ae6cf"),
  bladeBack: hex("#3fb0a0"),
  bladeDeep: hex("#24706c"),
  hilt: hex("#4a3022"),
};

/**
 * Mirel's head, 24 by 22 image pixels, facing right in three-quarters: silver hair parted and drawn back smooth over the
 * ear toward the bun at her nape, a straight brow, a teal eye and a long jaw. Letters: D d h H W hair deep to glint,
 * L s S m skin light to deep, w I P eye white, iris and pupil.
 */
const HEAD = [
  "........................",
  "..........DDDDDD........",
  "........DDhhHHhhDD......",
  "......DDhhHHWWHHhhD.....",
  ".....DdhhHHHdHHHHhhD....",
  "....DdhhhhdHHHhhdhhhD...",
  "...DdhhdhhhdhhhhdhhhhD..",
  "...DdhdhhhdhhhhdhHHhhhD.",
  "..DdhhdhhhdhhhdHHhhhhhD.",
  "..DdhdhhhhhhhhhhhhhhhhhD",
  "..DdhhdhhhhhhhhhhhhhhhhD",
  "..DDdhhdhhhhhhhhhLLLLhhD",
  "...DDdhhdhhhhhLLsssssssd",
  "...DDddhhhhhhLLsssDDdsss",
  "....DDdhhhSsLsLssdwIIsss",
  ".....DDdhhSssssssswIPsss",
  "......DDdSSssssssLIIssss",
  ".......DdSSsssssssssSss.",
  "........DdSSSssssssmmS..",
  ".........D.SSSsssssSS...",
  "...........SSSSSSSS.....",
  "........................",
] as const;
/** the back of her head: the hair combed smooth in a few strands down to the bun at her nape */
const HEAD_BACK = [
  "........................",
  "..........DDDDD.........",
  ".......DDDdhhhhdD.......",
  ".....DDdhhhhHHhhdD......",
  "....DdhhhhHHWHHhhhD.....",
  "...DdhhhhhHHHHhhhhhD....",
  "..DdhhHHhhhhhdhhhhhhD...",
  "..DdhHHhhhhhdhhhhdhhhD..",
  ".DdhhHhhhhhdhhhhdhhhhhD.",
  ".DdhhhhhhhdhhhhdhhhhdhD.",
  ".DddhhhhhdhhhhdhhhhdhhhD",
  "....DddhhhdhhhdhhhdhhddD",
  "....DddhhdhhhdhhhdhhdddD",
  "....DDdhhdhhdhhhdhhhddDD",
  ".....DdhhdhhdhhdhhhdddD.",
  ".....DDdhdhhdhhdhhdddDD.",
  "......DddhdhdhhdhdddDD..",
  ".......DDddhdddhddDD....",
  ".........DDdddddDD......",
  "...........DSSSSD.......",
  "...........SSSSSS.......",
  "........................",
] as const;

/** her echoes, field, Rewind and smears: clock teal, dark to white */
export const HOUR_RAMP: Ramp = [...PAL.hour, WHITE];

/** Mirel's look on the shared rig: a staff of dark wood topped by a teal clock ring */
export const MIREL_SKIN: HeroSkin = {
  colors: MIREL_COLORS,
  head: HEAD,
  headBack: HEAD_BACK,
  weapon: "staff",
  reach: 22,
  ramp: HOUR_RAMP,
  glow: HOUR_RAMP[3],
  sparks: SPARKS.hour,
  bun: true,
};
