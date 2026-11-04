import type { CharacterDef } from "../../types/character";
import type { SkillBranch, SkillNode } from "../../types/skill";
import { hex, ramp } from "../../utils/color";
import { type HeroColors, SPARKS } from "../palette";
import { KAEL, ULT_CHARGE } from "./kael";

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

const EMBER = ramp(["#2a0a10", "#6a1a16", "#b0381a", "#ec7228", "#ffae48", "#ffe08a", "#ffffff"]);

const PYRE: SkillNode = {
  id: "a_pyre",
  name: "Pyre Wave",
  kind: "ultimate",
  text: `A wall of flame rolls out ahead of you, burning every foe it passes and leaving the floor on fire. The weakest ultimate; a stronger one replaces it. ${ULT_CHARGE}`,
  level: 3,
  ranks: 1,
  requires: [],
  ultimate: "pyreWave",
};

/** Kael's paths, with her own special in place of Crystal Nova and her name in the texts */
const branches: SkillBranch[] = KAEL.branches.map((b) => ({
  ...b,
  nodes: b.nodes.map((n) => (n.id === "a_nova" ? PYRE : { ...n, text: n.text.replaceAll("Kael", "Ysra") })),
}));

/** Ysra, the ember lancer: the second character */
export const YSRA: CharacterDef = {
  id: "ysra",
  name: "Ysra",
  title: "The ember lancer",
  blurb:
    "A flame-temple guard who woke when the braziers lit again. Her glaive reaches far and hits hard. She is tougher and slower than Kael, with less MP, and starts every run with the fire spell.",
  special: "pyreWave",
  base: { ad: 13, ap: 7, hp: 130, mp: 80, stamina: 110, crit: 0.03, move: 0.93, aspd: 0.92, haste: 1 },
  growth: { ad: 0.8, ap: 0.4, hp: 7, mp: 1.5 },
  branches,
  startRanks: { a_flame: 1 },
  skin: {
    colors: YSRA_COLORS,
    head: HEAD,
    headBack: HEAD_BACK,
    weapon: "glaive",
    reach: 23,
    ramp: EMBER,
    glow: EMBER[3],
    sparks: SPARKS.hot,
  },
};
