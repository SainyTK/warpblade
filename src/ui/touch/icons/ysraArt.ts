import { YSRA_SLOTS } from "../../../game/hero/ysra/abilities";
import type { TouchButtonAction } from "../../../types/touch";
import type { YsraAbility } from "../../../types/ysra";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt } from "./iconArt";
import { DODGE, JUMP, NOVA } from "./sharedArt";

const HOT = hex("#ffe08a");
const FLAME = hex("#ec7228");
const DEEP = hex("#6a1a16");
const BRONZE = hex("#d08a3c");
const HAFT = hex("#6e4630");

/** a glaive across the face: dark haft, bronze collar and butt, a hooked blade of forge-fire */
const GLAIVE: IconArt = {
  rows: [
    "........WWO.",
    ".......WEEEO",
    "......WEEEO.",
    ".....WEEOO..",
    "......BOO...",
    ".....HB.....",
    "....H.......",
    "...H........",
    "..H.........",
    ".H..........",
    "T...........",
  ],
  colors: { W: hex("#fff2c4"), E: hex("#ffae48"), O: hex("#c0441a"), B: BRONZE, H: HAFT, T: BRONZE },
};

/** the arc of a vault over a planted pole */
const VAULT: IconArt = {
  rows: [
    "...AAA...",
    "..A...A..",
    ".A.....A.",
    ".A..H..A.",
    "A...H.AAA",
    "A...H..A.",
    "....H....",
    "....H....",
    "GGGGTGGGG",
  ],
  colors: { A: hex("#ffae48"), H: HAFT, T: BRONZE, G: hex("#6c6694") },
};

/** her guard: the glaive held upright before her, blade high, a blow striking sparks off the haft */
const GUARD: IconArt = {
  rows: [
    "....WE...",
    "....EEO..",
    "....EO...",
    "...BB....",
    "Y..H.....",
    ".YSH.....",
    "Y..H.....",
    "...H.....",
    "...H.....",
    "..T......",
  ],
  colors: {
    W: hex("#fff2c4"),
    E: hex("#ffae48"),
    O: hex("#c0441a"),
    B: BRONZE,
    H: HAFT,
    T: BRONZE,
    Y: HOT,
    S: ICON_WHITE,
  },
};

/** each ability's art on the I button: the vault's arc, then the rites */
const ABILITY_ART: Record<YsraAbility, IconArt> = {
  vault: VAULT,
  /** fire bursting out in a ring */
  flare: {
    rows: [
      "....Y....",
      ".Y..O..Y.",
      "..O...O..",
      "...OWO...",
      "YO.WWW.OY",
      "...OWO...",
      "..O...O..",
      ".Y..O..Y.",
      "....Y....",
    ],
    colors: { Y: HOT, O: FLAME, W: ICON_WHITE },
  },
  /** a whip of fire lashing low along the floor */
  cinderLash: {
    rows: [
      ".........",
      "........Y",
      ".......YO",
      "..WW..YO.",
      ".W..OYO..",
      "W...OO...",
      "W........",
      "DDDDDDDDD",
      ".........",
    ],
    colors: { Y: HOT, O: FLAME, W: ICON_WHITE, D: DEEP },
  },
  /** a column of fire out of the floor */
  flamePillar: {
    rows: [
      "...YWY...",
      "...OWO...",
      "..YOWOY..",
      "...OWO...",
      "..OOWOO..",
      "...OWO...",
      "..OYWYO..",
      ".DOOWOOD.",
      "DDDDDDDDD",
    ],
    colors: { Y: HOT, O: FLAME, W: ICON_WHITE, D: DEEP },
  },
  /** an iron bowl of fire on three legs */
  brazier: {
    rows: [
      "....Y....",
      "...YWY...",
      "..YOWOY..",
      "..OOYOO..",
      "BBBBBBBBB",
      ".IIIIIII.",
      "..I.I.I..",
      ".I..I..I.",
      "I...I...I",
    ],
    colors: { Y: HOT, O: FLAME, W: ICON_WHITE, B: BRONZE, I: hex("#5e4440") },
  },
  /** a white-hot heart of fire with flames leaping off it */
  overheat: {
    rows: [
      ".Y..Y..Y.",
      "..O.O.O..",
      ".OOYYYOO.",
      "OOYWWWYOO",
      ".OYWWWYO.",
      "..OYWYO..",
      "...OYO...",
      "....O....",
      ".........",
    ],
    colors: { Y: HOT, O: FLAME, W: ICON_WHITE },
  },
};

/** O: a pip for each of her abilities in tab order, lit in its tint when she has it, the selected one white */
function cycleArt(selected: string): IconArt {
  const pips = YSRA_SLOTS.map((slot, i) =>
    slot.id === selected ? "W" : slot.known() ? String.fromCharCode(65 + i) : "D",
  );
  const row = pips.join(".");
  const blank = ".".repeat(row.length);
  const colors: Record<string, number> = { W: ICON_WHITE, D: DEEP };
  YSRA_SLOTS.forEach((slot, i) => {
    colors[String.fromCharCode(65 + i)] = hex(slot.tint ?? "#ffae48");
  });
  return { rows: [blank, row, blank], colors };
}

/** Ysra's button art, per action and selected ability */
export function ysraArt(action: TouchButtonAction, ability: YsraAbility): IconArt {
  switch (action) {
    case "attack":
      return GLAIVE;
    case "up":
      return JUMP;
    case "dash":
      return DODGE;
    case "guard":
      return GUARD;
    case "cast":
      return ABILITY_ART[ability] ?? VAULT;
    case "cycle":
      return cycleArt(ability);
    case "ultimate":
      return NOVA;
  }
}
