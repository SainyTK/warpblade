import type { Color, Ramp } from "../types/color";
import type { KaelAbility } from "../types/spell";
import { hex, ramp, WHITE } from "../utils/color";

/** effect ramps, dark to bright */
export const PAL = {
  crystal: ramp(["#16224a", "#1f4a8a", "#2f86c4", "#5ec8ef", "#a8ecff", "#e4fbff", "#ffffff"]),
  ice: ramp(["#1b2a52", "#2b5a99", "#4f9bd4", "#8fd3f2", "#cbf1ff", "#f4fdff"]),
  volt: ramp(["#2a1660", "#4b3bc4", "#6f8bff", "#a9c8ff", "#e2efff"]),
  shadow: ramp(["#120a1e", "#2a1640", "#4a2470", "#7a3cb0", "#b673e8", "#ecc8ff"]),
  heal: ramp(["#123a2a", "#1f7a4a", "#3fc06a", "#9cf0a0", "#e8ffe0"]),
} as const;

/** spark colors, head to tail */
export const SPARKS = {
  hot: ramp(["#fff3a6", "#ffe26b", "#ff8a2a", "#f2561d"]),
  crystal: [WHITE, hex("#e4fbff"), hex("#7fe3ff"), hex("#2f86c4")],
  volt: [WHITE, hex("#e2efff"), hex("#a9c8ff"), hex("#6f8bff")],
  shadow: [hex("#ecc8ff"), hex("#b673e8"), hex("#7a3cb0"), hex("#4a2470")],
  ice: [WHITE, hex("#cbf1ff"), hex("#8fd3f2"), hex("#4f9bd4")],
  blood: [WHITE, hex("#ffd0d8"), hex("#e0405a"), hex("#7e1530")],
} satisfies Record<string, Ramp>;

/** white hot to smouldering, and fresh smoke to thin */
export const FIRE_RAMP = ramp([
  "#ffffff",
  "#fff3a6",
  "#ffe26b",
  "#ffc23d",
  "#ff8a2a",
  "#f2561d",
  "#c9281f",
  "#8a1f17",
  "#4a1712",
]);
export const SMOKE_RAMP = ramp(["#6e6478", "#544c60", "#3d3648", "#2a2532", "#1a171e"]);

/** the colour of each of Kael's abilities: the glow at his hand, the HUD tab and the touch button rim */
export const ABILITY_COLOR: Record<KaelAbility, Color> = {
  lance: hex("#7fe3ff"),
  burst: hex("#d8f4ff"),
  fire: hex("#ff8a2a"),
  ice: hex("#8fd3f2"),
  volt: hex("#a9a0ff"),
};

/** Kael: silver hair, teal coat with brass trim, steel plates, red scarf, crystal sword. Each material runs deep to glint. */
export const KAEL_COLORS = {
  outline: hex("#0d0a16"),
  skinLight: hex("#ffe0c0"),
  skin: hex("#f0c8a0"),
  skinShade: hex("#c98f72"),
  skinDeep: hex("#9a6452"),
  hairGlint: hex("#ffffff"),
  hairLight: hex("#e2e7f4"),
  hair: hex("#b7c0d8"),
  hairDark: hex("#7a84a6"),
  hairDeep: hex("#4a5274"),
  eyeWhite: hex("#e8eef8"),
  iris: hex("#3f7fd0"),
  pupil: hex("#14203e"),
  coatLight: hex("#3a8494"),
  coat: hex("#225a68"),
  coatDark: hex("#163c48"),
  coatDeep: hex("#0c2630"),
  steelGlint: hex("#f2f6ff"),
  steelLight: hex("#b8c2dc"),
  steel: hex("#7a83a2"),
  steelDark: hex("#454c66"),
  steelDeep: hex("#262a3c"),
  trimLight: hex("#ffe08a"),
  trim: hex("#e0ac48"),
  trimDark: hex("#9a6a26"),
  pantsLight: hex("#45425e"),
  pants: hex("#2c2a40"),
  pantsDark: hex("#1c1a2c"),
  bootLight: hex("#7a5236"),
  boot: hex("#4a3226"),
  bootDark: hex("#2a1a14"),
  gloveLight: hex("#5e4436"),
  glove: hex("#3b2a24"),
  scarfLight: hex("#f0505a"),
  scarf: hex("#c8283c"),
  scarfDark: hex("#7e1530"),
  bladeEdge: hex("#e8fdff"),
  blade: hex("#7fe3ff"),
  bladeBack: hex("#2f86c4"),
  bladeDeep: hex("#1f5a96"),
  hilt: hex("#3a2630"),
} as const;
export type HeroColors = Record<keyof typeof KAEL_COLORS, Color>;
/** the colours of the hero being played: Kael's until another is chosen (see game/hero/skin.ts) */
export const HERO_COLORS: HeroColors = { ...KAEL_COLORS };

export const ENEMY_COLORS = {
  outline: hex("#0a0612"),
  body: hex("#241838"),
  bodyDark: hex("#170f24"),
  bodyLight: hex("#3d2a5c"),
  rim: hex("#8a5ad0"),
  eye: hex("#ffd0ff"),
  eyeGlow: hex("#ff7ae0"),
  crack: hex("#b673e8"),
  claw: hex("#d8c0f8"),
  /** the deepest shadow of the shadow flesh, under each volume */
  bodyDeep: hex("#0e0818"),
  /** the white specular glint on lit shadow flesh */
  bodyGlint: hex("#d9bdfa"),
  clawDeep: hex("#5a4a80"),
  clawDark: hex("#9a84c4"),
  clawGlint: hex("#fbf6ff"),
  /** the hot centre of a glowing eye */
  eyeCore: hex("#fff6ff"),
  crackDeep: hex("#5e2c8e"),
  crackHot: hex("#f0d8ff"),
  /** the Rift Warden's pale mask, lit to shaded */
  maskLight: hex("#fbeeff"),
  mask: hex("#ecc8ff"),
  maskShade: hex("#b898dc"),
  maskDeep: hex("#6e5498"),
} as const;

export const WORLD_COLORS = {
  sky: ramp(["#0a0820", "#100c2a", "#181238", "#221846", "#2e1f56", "#3b2764"]),
  starDim: hex("#2a2050"),
  starBright: hex("#e8e4ff"),
  moonLit: hex("#ece6fa"),
  moonMid: hex("#c4bce0"),
  moonDark: hex("#8e86b4"),
  moonRim: hex("#6a5fa0"),
  moonHalo: hex("#4a3c86"),
  moonGlow: hex("#5a50a8"),
  ridgeTop: hex("#3a2c66"),
  ridge: hex("#231a44"),
  towerRim: hex("#33275a"),
  towerTop: hex("#3a2e66"),
  tower: hex("#18122f"),
  windowLit: hex("#ffcf6a"),
  windowLow: hex("#c98a3a"),
  windowDark: hex("#0e0a1c"),
  groundLip: hex("#6a6290"),
  groundEdge: hex("#4a4370"),
  stone: hex("#2a2442"),
  stoneTop: hex("#363058"),
  mortar: hex("#1a1630"),
  moss: hex("#3f6a4a"),
  mossTip: hex("#5f9a5a"),
  vine: hex("#2f5040"),
  slabLip: hex("#7a72a4"),
  slabEdge: hex("#544c80"),
  slab: hex("#2e2850"),
  slabUnder: hex("#120d22"),
  ironLip: hex("#8a6a50"),
  iron: hex("#3a2a2a"),
  ironEdge: hex("#120d1c"),
  brazierGlow: hex("#ff9a3a"),
  fireflyHot: hex("#f4ffb0"),
  firefly: hex("#9ad06a"),
  fireflyGlow: hex("#c8f060"),
  mist: hex("#8f8ab8"),
  dust: hex("#5a5270"),
  footDust: hex("#4e4866"),
  rubble: hex("#5a5478"),
} as const;

/** coins, dark rim to glint */
export const COIN_GOLD = ramp(["#5a3a12", "#9a6a1e", "#e0ac48", "#ffd86a", "#fff3c0"]);
/** experience orbs: lime, apart from the gold coins and the green heal orbs */
export const XP_GLOW = ramp(["#2e4a0e", "#5f8f18", "#a6e03a", "#d6ff6e", "#f6ffd0"]);
