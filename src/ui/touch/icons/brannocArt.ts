import { BRANNOC_SKIN } from "../../../constants/characters/brannoc/look";
import { PAL } from "../../../constants/palette";
import type { BrannocAbility } from "../../../types/brannoc";
import type { TouchButtonAction } from "../../../types/touch";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt } from "./iconArt";
import { JUMP } from "./sharedArt";

const R = PAL.rage;
const BC = BRANNOC_SKIN.colors;
/** the ash haft, lit so it reads on a dark button */
const HAFT = hex("#8a7058");

/** the colours of an axe in the rows below: haft, bone binding, iron head, its dark poll and its bright edge */
const AXE_COLORS = { h: HAFT, b: BC.trim, S: BC.steelLight, I: BC.steel, E: ICON_WHITE };

/** the great axe: the haft upright, the bearded head out to the right, its horn and beard curling past the neck */
const AXE: IconArt = {
  rows: [
    "..h.....E",
    "..hSS..EE",
    ".IhSSSSEE",
    ".IhSSSSSE",
    "..hSSSSSE",
    "..hS..SEE",
    "..h....EE",
    "..h.....E",
    "..b......",
    "..h......",
    "..h......",
    "..h......",
  ],
  colors: AXE_COLORS,
};

/** Frenzy: a raised fist in a red burst, the axe's edge drawn across the forearm and the cut it leaves */
const FRENZY: IconArt = {
  rows: [
    "R....R....R",
    ".R.K.K.K.R.",
    "...KFKFKF..",
    "RR.FFFFFF.R",
    "...FFFFFF..",
    ".R.TTTFFFR.",
    "....FFF..W.",
    "....FFFWW..",
    "....CCC....",
    "..WWFFF....",
    ".W..BBB....",
    "....FFF....",
  ],
  colors: { R: R[3], K: BC.skinLight, F: BC.skin, T: BC.skinShade, C: R[4], W: ICON_WHITE, B: BC.trim },
};

/** Hunt: the axe lunging head first, its edge leading and speed lines behind it */
const HUNT: IconArt = {
  rows: [
    "..........E.",
    "LLL......SEE",
    ".......SSSSE",
    "LLLLhhhhSSSE",
    ".......SSSSE",
    "LL.......SEE",
    "..........E.",
  ],
  colors: { L: R[4], ...AXE_COLORS },
};

/** War Cry: his face roaring, the mane round it, the bone war paint across his eyes, arcs of the roar either side */
const WAR_CRY: IconArt = {
  rows: [
    "...MMMMMMM...",
    "..MMSSSSSMM..",
    "..MPPPPPPPM..",
    "A.MPePPPePM.A",
    "A.MSSSSSSSM.A",
    ".AMSDDDDDSMA.",
    "A.MSDWDWDSM.A",
    "A..MSDDDSM..A",
    "....MSSSM....",
  ],
  colors: { A: R[4], M: BC.hairDark, S: BC.skin, P: BC.trim, e: R[3], D: R[0], W: ICON_WHITE },
};

/** Red Crescent: a crimson crescent running along the floor, a trail of drips behind it */
const RED_CRESCENT: IconArt = {
  rows: [
    ".....CC....",
    "......CC...",
    ".......CC..",
    ".......CPC.",
    ".......CPC.",
    ".......CC..",
    "......CC...",
    "dd..dCC....",
    "FFFFFFFFFFF",
  ],
  colors: { C: R[3], P: R[5], d: R[4], F: R[2] },
};

/** Blood Geyser: a pillar of blood bursting up out of the floor, drops thrown off its crown */
const GEYSER: IconArt = {
  rows: [
    ".P..W..P.",
    "...CCC...",
    "..CCCCC..",
    "..CPCCC..",
    "...PCC...",
    "...PCC...",
    "...PCC...",
    "..CPCCC..",
    "FFFFFFFFF",
  ],
  colors: { C: R[3], P: R[5], W: ICON_WHITE, F: R[2] },
};

/** Hurled Axe: a hand axe spinning, the arcs of its turn round it */
const AXE_THROW: IconArt = {
  rows: [
    "..AAA......",
    ".A.....SE..",
    "A.....SSSE.",
    ".....hSSSE.",
    "....h.SSE..",
    "...h.......",
    "..b......A.",
    ".h......A..",
    "......AA...",
  ],
  colors: { A: R[4], ...AXE_COLORS },
};

/** Blood Pact: an open palm cut across, a drop falling from it */
const PACT: IconArt = {
  rows: [
    ".F.F.F....",
    ".F.F.F....",
    ".FFFFF.F..",
    ".FFFFFFF..",
    ".CCFFFF...",
    ".FFCCF....",
    ".FFFFC....",
    "..FFF..D..",
    "..BBB.DDD.",
    "......DDD.",
  ],
  colors: { F: BC.skin, C: R[3], B: BC.trim, D: R[3] },
};

/** the special Berserk: two great axes crossed in a crimson ring */
const BERSERK: IconArt = {
  rows: [
    "....RRRRR....",
    "..RR.....RR..",
    ".RE.......ER.",
    ".RES.....SER.",
    "R.ESh...hSE.R",
    "R.E..h.h..E.R",
    "R.....h.....R",
    "R....h.h....R",
    "R...h...h...R",
    ".R.b.....b.R.",
    ".Rh.......hR.",
    "..RR.....RR..",
    "....RRRRR....",
  ],
  colors: { R: R[3], ...AXE_COLORS },
};

const ABILITY_ART: Readonly<Record<BrannocAbility, IconArt>> = {
  warCry: WAR_CRY,
  redCrescent: RED_CRESCENT,
  b_geyser: GEYSER,
  b_axeThrow: AXE_THROW,
  b_pact: PACT,
};

/** where each of up to five abilities sits on the switch dial, clockwise from the top */
const DIAL: readonly [number, number][] = [
  [4, 0],
  [8, 3],
  [7, 8],
  [1, 8],
  [0, 3],
];

/** the switch: one mark for each ability he knows round a dial, the selected one white */
function switchArt(selected: BrannocAbility, known: readonly BrannocAbility[]): IconArt {
  const grid = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => "."));
  known.forEach((id, i) => {
    const [x, y] = DIAL[i];
    const c = id === selected ? "W" : "B";
    for (const [dx, dy] of [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ])
      grid[y + dy][x + dx] = c;
  });
  return { rows: grid.map((r) => r.join("")), colors: { B: R[3], W: ICON_WHITE } };
}

/** Brannoc's buttons: the axe, Frenzy, Hunt, the selected ability on I, the switch dial on O and Berserk */
export function brannocArt(
  action: TouchButtonAction,
  ability: BrannocAbility,
  known: readonly BrannocAbility[],
): IconArt {
  switch (action) {
    case "attack":
      return AXE;
    case "up":
      return JUMP;
    case "guard":
      return FRENZY;
    case "dash":
      return HUNT;
    case "cast":
      return ABILITY_ART[ability];
    case "cycle":
      return switchArt(ability, known);
    case "ultimate":
      return BERSERK;
  }
}
