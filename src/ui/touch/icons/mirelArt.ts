import type { MirelAbility } from "../../../types/mirel";
import type { TouchButtonAction } from "../../../types/touch";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt } from "./iconArt";
import { JUMP, NOVA } from "./sharedArt";

const TEAL = hex("#3fb0a0");
const TEAL_DARK = hex("#24706c");
const TEAL_DEEP = hex("#163e44");
const PALE = hex("#8ae6cf");
const ACCENT = hex("#6fe0c8");
const SAND = hex("#e8d6a0");
const SAND_SHADE = hex("#a8885a");
const WOOD = hex("#7a5434");
const ROBE = hex("#6e5a7e");
const TRIM = hex("#d8b060");
const HAIR = hex("#d8dce6");
const SKIN = hex("#6a4028");
const FOE = hex("#9a6ad8");

/** the staff swung up, its clock ring at the top with one hand inside, a teal smear trailing behind it */
const STAFF: IconArt = {
  rows: [
    "..PPPP...CCC.",
    ".P......C.H.C",
    "T.......C.H.C",
    "T........CCC.",
    "T.......W....",
    ".T.....W.....",
    "......W......",
    ".....W.......",
    "....W........",
    "...W.........",
  ],
  colors: { P: PALE, T: TEAL, C: ACCENT, H: ICON_WHITE, W: WOOD },
};

/** the Stillfield: a teal clock ring, its four quarter ticks lit and one hand at twelve */
const STILL: IconArt = {
  rows: [
    "...CCCCC...",
    "..C..W..C..",
    ".C.......C.",
    "C....H....C",
    "C....H....C",
    "CW...O...WC",
    "C.........C",
    "C.........C",
    ".C.......C.",
    "..C..W..C..",
    "...CCCCC...",
  ],
  colors: { C: TEAL, W: PALE, H: ICON_WHITE, O: SAND },
};

/** Rewind: the hour keeper with an arrow curling back over her head to the left */
const REWIND: IconArt = {
  rows: [
    "...AAAAA.....",
    "..A.....P....",
    ".A.......P...",
    "AAA.......HH.",
    ".A.......HHS.",
    "..........SS.",
    ".........RTR.",
    ".........RRR.",
    "........RRRR.",
    "........TTTT.",
  ],
  colors: { A: PALE, P: TEAL_DARK, H: HAIR, S: SKIN, R: ROBE, T: TRIM },
};

/** Stopped Clock: a dark clock face, its hands stopped at three */
const CLOCK: IconArt = {
  rows: [
    "..CCCCC..",
    ".CDDWDDC.",
    "CDDDHDDDC",
    "CDDDHDDDC",
    "CWDDOHHWC",
    "CDDDDDDDC",
    "CDDDDDDDC",
    ".CDDWDDC.",
    "..CCCCC..",
  ],
  colors: { C: TEAL, D: TEAL_DEEP, W: PALE, H: ICON_WHITE, O: SAND },
};

/** Second Hand: a clock hand flung point first, its sand-gold tail ring behind and speed ticks beside it */
const SECOND_HAND: IconArt = {
  rows: ["...........P..", "M..........PWP.", "..OTTTTTTTPWWWP", "M..........PWP.", "...........P.."],
  colors: { M: PALE, O: SAND, T: TEAL, P: TEAL_DARK, W: ICON_WHITE },
};

/** Sundial: a dial of sand lying on the floor, its teal gnomon casting a shadow across the hours */
const SUNDIAL: IconArt = {
  rows: [
    ".....G.....",
    ".....GG....",
    ".....GGG...",
    "..sssGGGss.",
    ".sLLLLDDDLs",
    "sLLLLLLLDDs",
    ".sLLLLLLLs.",
    "..sssssss..",
  ],
  colors: { G: TEAL, s: SAND_SHADE, L: SAND, D: TEAL_DARK },
};

/** Foretell: a teal blade falling point first onto a marked foe */
const FORETELL: IconArt = {
  rows: [
    "....TTT....",
    ".....P.....",
    "....PWP....",
    "....PWP....",
    "....PWP....",
    ".....W.....",
    "...........",
    "M...FFF...M",
    "...FFFFF...",
    "...FFFEF...",
    "...FFFFF...",
    "M...FFF...M",
  ],
  colors: { T: TRIM, P: TEAL, W: PALE, F: FOE, E: ICON_WHITE, M: ACCENT },
};

/** Hour Hand: a giant clock hand sweeping up from its pivot, the dashes of its sweep behind */
const HAND_SWEEP: IconArt = {
  rows: [
    "..A.A.....W",
    "A.......WP.",
    "......WWP..",
    "A....WP....",
    "....WP.....",
    "A..WP......",
    "...OO......",
    "...OO......",
  ],
  colors: { A: TEAL_DARK, P: TEAL, W: PALE, O: SAND },
};

const ABILITY_ART: Readonly<Record<MirelAbility, IconArt>> = {
  stoppedClock: CLOCK,
  secondHand: SECOND_HAND,
  m_sundial: SUNDIAL,
  m_foretell: FORETELL,
  m_handsweep: HAND_SWEEP,
};

/** where each of up to five abilities sits on the switch dial, clockwise from the top */
const DIAL: readonly [number, number][] = [
  [4, 0],
  [8, 3],
  [7, 8],
  [1, 8],
  [0, 3],
];

/** the switch: one mark for each ability she knows round a dial, the selected one white, as Orrin's */
function switchArt(selected: MirelAbility, known: readonly MirelAbility[]): IconArt {
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
  return { rows: grid.map((r) => r.join("")), colors: { B: TEAL_DARK, W: ICON_WHITE } };
}

/** Mirel's buttons: the staff, the Stillfield, Rewind, the selected ability on I and the switch dial on O */
export function mirelArt(action: TouchButtonAction, ability: MirelAbility, known: readonly MirelAbility[]): IconArt {
  switch (action) {
    case "attack":
      return STAFF;
    case "up":
      return JUMP;
    case "warp":
      return STILL;
    case "dash":
      return REWIND;
    case "cast":
      return ABILITY_ART[ability];
    case "cycle":
      return switchArt(ability, known);
    case "ultimate":
      return NOVA;
  }
}
