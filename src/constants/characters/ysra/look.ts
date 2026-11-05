import type { HeroSkin } from "../../../types/character";
import { hex, ramp } from "../../../utils/color";
import { type HeroColors, SPARKS } from "../../palette";

/** Ysra: dark skin, black braid with an ember streak, crimson coat with bronze trim, an orange sash and a glaive of forge-fire */
const YSRA_COLORS: HeroColors = {
  outline: hex("#140a10"),
  skin: hex("#9a6440"),
  skinShade: hex("#64402a"),
  hairLight: hex("#5a4656"),
  hair: hex("#2a1e2a"),
  hairDark: hex("#140e16"),
  coat: hex("#8e1f2c"),
  coatLight: hex("#c0383e"),
  coatDark: hex("#58121e"),
  trim: hex("#d08a3c"),
  shirt: hex("#2c1a1e"),
  pants: hex("#2a2028"),
  boot: hex("#3c2420"),
  bootLight: hex("#6e4630"),
  glove: hex("#30201a"),
  scarf: hex("#e0702a"),
  scarfLight: hex("#ffb24e"),
  scarfDark: hex("#963818"),
  eye: hex("#ffb040"),
  bladeEdge: hex("#fff2c4"),
  blade: hex("#ff9a3a"),
  bladeBack: hex("#c0441a"),
  hilt: hex("#4e3020"),
};

/** hair pulled back from a bare brow, an ember streak over the temple, amber eyes */
const HEAD = [
  "...dddd...",
  "..dhhhhd..",
  ".dhHHhhhd.",
  "dhhrrhhhhd",
  "dhhhhhhsss",
  "ddhhssSsEs",
  "ddhsssssss",
  ".dhssSssss",
  "..d.sSsss.",
  "....sSSs..",
] as const;
const HEAD_BACK = [
  "...dddd...",
  "..dhhhhd..",
  ".dhHHhhhd.",
  "dhrrhhhhhd",
  "dhhhhhhhhd",
  "ddhhhhhhdd",
  "ddhhhhhhdd",
  ".ddhhhhdd.",
  "..ddhhdd..",
  "...dSSd...",
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
