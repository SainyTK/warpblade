import { RITES } from "../../../constants/ysra/rites";
import { knowsRite } from "../../../game/hero/ysra/pyre/riteChoice";
import type { TouchButtonAction } from "../../../types/touch";
import type { RiteId } from "../../../types/ysra/pyre";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt } from "./iconArt";
import { JUMP, NOVA } from "./sharedArt";

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

/** a bronze-rimmed brace */
const GUARD: IconArt = {
  rows: ["..BBBBB..", ".BWWWWWB.", ".BWCCCWB.", ".BWCHCWB.", ".BWCCCWB.", "..BWCWB..", "...BWB...", "....B...."],
  colors: { B: BRONZE, W: HOT, C: hex("#8e1f2c"), H: hex("#c0383e") },
};

const RITE_ART: Record<RiteId, IconArt> = {
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

/** O: a pip for each of her rites in tab order, lit in its tint when she has it, the selected one white */
function cycleArt(selected: RiteId): IconArt {
  const pips = RITES.map((r, i) => (r.id === selected ? "W" : knowsRite(r) ? String.fromCharCode(65 + i) : "D"));
  const row = pips.join(".");
  const blank = ".".repeat(row.length);
  const colors: Record<string, number> = { W: ICON_WHITE, D: DEEP };
  RITES.forEach((r, i) => {
    colors[String.fromCharCode(65 + i)] = hex(r.tint);
  });
  return { rows: [blank, row, blank], colors };
}

/** Ysra's button art, per action and selected rite */
export function ysraArt(action: TouchButtonAction, rite: RiteId): IconArt {
  switch (action) {
    case "attack":
      return GLAIVE;
    case "up":
      return JUMP;
    case "dash":
      return GUARD;
    case "guard":
      return VAULT;
    case "cast":
      return RITE_ART[rite];
    case "cycle":
      return cycleArt(rite);
    case "ultimate":
      return NOVA;
  }
}
