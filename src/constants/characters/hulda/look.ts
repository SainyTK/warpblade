import type { HeroSkin } from "../../../types/character";
import { hex, ramp, WHITE } from "../../../utils/color";
import type { HeroColors } from "../../palette";

/**
 * Hulda: deep brown skin, ash-grey hair shaved at the sides into a crest and a braid, a dark leather harness, a crimson
 * sash, heavy wrapped trousers, iron-toed boots, and iron-banded gauntlets with wrapped wrists
 */
const HULDA_COLORS: HeroColors = {
  outline: hex("#120a0c"),
  skinLight: hex("#b67e5a"),
  skin: hex("#8c5a3e"),
  skinShade: hex("#66402c"),
  skinDeep: hex("#44281c"),
  hairGlint: hex("#ecebe6"),
  hairLight: hex("#bcb6b0"),
  hair: hex("#8a8380"),
  hairDark: hex("#585050"),
  hairDeep: hex("#2c2628"),
  eyeWhite: hex("#eadccc"),
  iris: hex("#d88a1e"),
  pupil: hex("#2a1004"),
  coatLight: hex("#6e4c3a"),
  coat: hex("#4a3228"),
  coatDark: hex("#2e1e18"),
  coatDeep: hex("#1a100c"),
  steelGlint: hex("#f2f4f6"),
  steelLight: hex("#b4bcc4"),
  steel: hex("#78828c"),
  steelDark: hex("#464e58"),
  steelDeep: hex("#262a32"),
  trimLight: hex("#f0d8b0"),
  trim: hex("#b8946a"),
  trimDark: hex("#725638"),
  pantsLight: hex("#6c5c52"),
  pants: hex("#483c36"),
  pantsDark: hex("#2a2220"),
  bootLight: hex("#5c4a40"),
  boot: hex("#382a22"),
  bootDark: hex("#1e1612"),
  gloveLight: hex("#d8c8ac"),
  glove: hex("#9a876c"),
  scarfLight: hex("#ff5f6d"),
  scarf: hex("#c43848"),
  scarfDark: hex("#7a1e30"),
  bladeEdge: hex("#ffc2b8"),
  blade: hex("#ff5f6d"),
  bladeBack: hex("#c43848"),
  bladeDeep: hex("#7a1e30"),
  hilt: hex("#3a2a20"),
};

/**
 * Hulda's head, 24 by 22 image pixels, facing right in three-quarters: a crest of ash-grey hair over sides cropped to
 * dark stubble, a scar down through the brow, an amber eye under a heavy brow and a broad jaw. Letters: D d h H W hair deep
 * to glint, L s S m skin light to deep, w I P eye white, iris and pupil.
 */
const HEAD = [
  "........................",
  "..........DDDDD.........",
  ".......DDDhhhhhhD.......",
  ".....DDhhhHHHHhhhD......",
  "....DdhhHHHWWHHhhdD.....",
  "...DddhhhHHHHHhhddDD....",
  "..DdddddhhhhhhhddddddD..",
  "..DdSdddddhhhhdddSddddD.",
  ".DddddSdddddddddddddSdD.",
  ".DdSddddddSdddddSdddddD.",
  ".DddddSddddddSdddddSdddD",
  ".DDdSdddddSddddddddddddd",
  "..DDdddSddddddddLLLLssdd",
  "..DDddSdddddddLLssmsssss",
  "...DDdddDddSsLLssmDDdsss",
  "....DDddddSsLsLsmsdwIIss",
  ".....DDdddSssssssswIPsss",
  "......DDdSSssssssLIIssss",
  ".......DdSSsssssssssSsss",
  "........DdSSSsssssssmmSs",
  ".........DdSSSssssssSSS.",
  "..........SSSSSSSSSSS...",
] as const;
/** the back of her head: the crest drawn back into the braid's root at the nape, the shaved sides either side of it */
const HEAD_BACK = [
  "........................",
  "..........DDDDD.........",
  ".......DDDdhhhhdD.......",
  ".....DDdhhhhHHhhdD......",
  "....DdhhhhHHWHHhhhD.....",
  "...DddhhhhHHHHhhhhdD....",
  "..DdddDhhhhhhhhhhdDddD..",
  "..DdDddDhhhhhhhhdDdDdD..",
  ".DdddDddhhhhhhhhddDdddD.",
  ".DdDdddDdhhhhhhdDdddDdD.",
  ".DddddDddhhhhhhddDdddddD",
  "...DdDdddDhhhhdDdddDddD.",
  "....DddDdddhhhhdddDdddD.",
  "....DDdddDdhhhhdDdddDD..",
  ".....DdDdddhhhhddDddD...",
  ".....DDddDddhhdddDdDD...",
  "......DDdddDhhDdddDD....",
  ".......DDdddDDdddDD.....",
  "........DDdddddDDD......",
  ".........DDDDDDDD.......",
  "...........DSSSSD.......",
  "...........SSSSSS.......",
] as const;

/** her trails, rings and sparks: rust, dark to white */
export const RUST = ramp(["#1a0a0e", "#3e1220", "#7a1e30", "#c43848", "#ff5f6d", "#ffc2b8", "#ffffff"]);
const RUST_SPARKS = [WHITE, hex("#ffd8d0"), hex("#ff7a7a"), hex("#c43848")];

/** Hulda's look on the shared rig: iron gauntlets and rust-red rings */
export const HULDA_SKIN: HeroSkin = {
  colors: HULDA_COLORS,
  head: HEAD,
  headBack: HEAD_BACK,
  weapon: "gauntlets",
  reach: 6,
  ramp: RUST,
  glow: RUST[3],
  sparks: RUST_SPARKS,
};
