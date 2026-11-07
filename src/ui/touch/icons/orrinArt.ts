import type { OrrinAbility } from "../../../types/orrin";
import type { TouchButtonAction } from "../../../types/touch";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt } from "./iconArt";
import { JUMP, NOVA } from "./sharedArt";

const LINK = hex("#b8c0cc");
const STEEL = hex("#7e8898");
const BRASS = hex("#e8b04a");
const BRASS_LIGHT = hex("#ffe08a");
const BRASS_DARK = hex("#c08a2e");
const VOLT = hex("#6f8bff");
const FOE = hex("#9a6ad8");

/** the lash: a chain curving up and over to a brass hook hanging at its end */
const LASH: IconArt = {
  rows: [".....LSL.....", "...SL...SLBB.", "..L.......B..", ".S........B.W", "L.........B.B", "...........D."],
  colors: { L: LINK, S: STEEL, B: BRASS, D: BRASS_DARK, W: ICON_WHITE },
};

/** the reel: the chain winding back onto a brass drum, an arrow pulling toward it */
const REEL: IconArt = {
  rows: [
    "....W.........",
    "...WWWWWWWW...",
    "....W.........",
    ".BBB........W.",
    "BSLSB........B",
    "BLDLBSLSLSBBB.",
    "BSLSB.........",
    ".BBB..........",
  ],
  colors: { B: BRASS, D: BRASS_LIGHT, L: LINK, S: STEEL, W: ICON_WHITE },
};

/** the hook thrown up on its chain, speed ticks beside it */
const HOOK: IconArt = {
  rows: ["...BB.", "..B..B", "..B..W", "..B...", "..L...", "M.S.M.", "M.L.M.", "..S...", "..L..."],
  colors: { B: BRASS, L: LINK, S: STEEL, M: BRASS_DARK, W: ICON_WHITE },
};

/** Whirlwall: a ring of chain spun round him, the hook riding its edge */
const WHIRL: IconArt = {
  rows: ["..LSLSL..", ".S.....S.", "L.......L", "S...B...S", "L.......L", ".S.....B.", "..LSLS.BW"],
  colors: { L: LINK, S: STEEL, B: BRASS, W: ICON_WHITE },
};

/** Anchor Pin: the hook driven point first into the floor, its chain running up */
const PIN: IconArt = {
  rows: ["L.......", ".S......", "..L.....", "...BB...", "...B....", "..BBB...", "W..B..W.", "SSSWSSSS"],
  colors: { L: LINK, S: STEEL, B: BRASS, W: ICON_WHITE },
};

/** Chain Fence: two brass-capped posts with chain slung between them */
const FENCE: IconArt = {
  rows: ["B.......B", "PL.....LP", "P.S...S.P", "P..LSL..P", "PL.....LP", "P.SLSLS.P", "P.......P"],
  colors: { B: BRASS_LIGHT, P: BRASS_DARK, L: LINK, S: STEEL },
};

/** Tether: two foes linked by a chain */
const TETHER: IconArt = {
  rows: [".......FFF", ".....SLFEF", "....L..FFF", "FFFS......", "FEF.......", "FFF......."],
  colors: { F: FOE, E: ICON_WHITE, L: LINK, S: STEEL },
};

/** Anchor Fall: an iron anchor with brass flukes, a rift spark over its ring */
const ANCHOR: IconArt = {
  rows: [
    "....V....",
    "...SSS...",
    "...S.S...",
    "...SSS...",
    ".LLLLLLL.",
    "....L....",
    "B...L...B",
    "S...L...S",
    ".S..L..S.",
    "..SSLSS..",
  ],
  colors: { L: LINK, S: STEEL, B: BRASS, V: VOLT },
};

const ABILITY_ART: Readonly<Record<OrrinAbility, IconArt>> = {
  whirlwall: WHIRL,
  anchorPin: PIN,
  o_chainfence: FENCE,
  o_tether: TETHER,
  o_anchorfall: ANCHOR,
};

/** where each of up to five abilities sits on the switch dial, clockwise from the top */
const DIAL: readonly [number, number][] = [
  [4, 0],
  [8, 3],
  [7, 8],
  [1, 8],
  [0, 3],
];

/** the switch: one mark for each ability he knows round a dial, the selected one white, as Hulda's */
function switchArt(selected: OrrinAbility, known: readonly OrrinAbility[]): IconArt {
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
  return { rows: grid.map((r) => r.join("")), colors: { B: BRASS_DARK, W: ICON_WHITE } };
}

/** Orrin's buttons: the lash, the reel, the hook, the selected ability on I and the switch dial on O */
export function orrinArt(action: TouchButtonAction, ability: OrrinAbility, known: readonly OrrinAbility[]): IconArt {
  switch (action) {
    case "attack":
      return LASH;
    case "up":
      return JUMP;
    case "dash":
      return REEL;
    case "warp":
      return HOOK;
    case "cast":
      return ABILITY_ART[ability];
    case "cycle":
      return switchArt(ability, known);
    case "ultimate":
      return NOVA;
  }
}
