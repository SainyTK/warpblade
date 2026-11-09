import { COIN_GOLD, PAL, WAX } from "../../../constants/palette";
import type { TouchButtonAction } from "../../../types/touch";
import type { WennaAbility } from "../../../types/wenna";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt } from "./iconArt";
import { JUMP } from "./sharedArt";

const VIOLET = PAL.wick;
const WOOD = hex("#8a6440");
const IRON = hex("#8e8ca0");
const HOOD = hex("#4e4b56");
const CLOAK = hex("#77737e");
const SKIN = hex("#9a7c4c");
const GOLD = COIN_GOLD[3];
const FROST = PAL.ice[3];

/** the colours of a Wick in the rows below: its flame, gold core and wax */
const WICK_COLORS = {
  f: VIOLET[3],
  F: VIOLET[4],
  c: GOLD,
  X: WAX[2],
  x: WAX[1],
  d: WAX[0],
  e: VIOLET[0],
};

/** the lamp: her pole held up on the slant, the lantern hanging lit from its iron hook */
const LAMP: IconArt = {
  rows: [
    "......WWWI..",
    ".....W...I..",
    "....W...IIi.",
    "...W...iVFVi",
    "..W....iFcFi",
    ".W.....iFFFi",
    "W......iVFVi",
    ".......iiii.",
  ],
  colors: { W: WOOD, I: ICON_WHITE, i: IRON, V: VIOLET[3], F: VIOLET[4], c: ICON_WHITE },
};

/** Light: a drop of violet flame falling onto an unlit candle */
const LIGHT: IconArt = {
  rows: [
    "....F....",
    "...FcF...",
    "..VFcFV..",
    "..VFFFV..",
    "...VVV...",
    ".........",
    "....k....",
    "...LXX...",
    "...XXx...",
    "...XXx...",
    ".ddddddd.",
  ],
  colors: { F: VIOLET[4], c: ICON_WHITE, V: VIOLET[3], k: VIOLET[0], L: WAX[3], X: WAX[2], x: WAX[1], d: WAX[0] },
};

/** Swap: the lamplighter and a Wick under a curved arrow that runs both ways */
const SWAP: IconArt = {
  rows: [
    "...AAAAAAA...",
    "..A.......A..",
    "AAAAA...AAAAA",
    ".AAA.....AAA.",
    "..A.......A..",
    ".............",
    "..hH......f..",
    ".hHS.....fcF.",
    "..CC.....XXX.",
    ".VCC.....eXe.",
    ".CCC....xXXXx",
    ".LLL.....ddd.",
  ],
  colors: { A: VIOLET[4], h: HOOD, H: CLOAK, S: SKIN, C: CLOAK, V: VIOLET[2], L: WAX[2], ...WICK_COLORS },
};

/** Kindle: a Wick bursting in a violet and gold star, its wax flying */
const KINDLE: IconArt = {
  rows: [
    "G...V...G",
    ".G..V..G.",
    "..VFFFV..",
    "VVFFcFFVV",
    "..VFFFV..",
    ".G..V..G.",
    "G...V...G",
    ".........",
    ".X.XXX.X.",
  ],
  colors: { G: GOLD, V: VIOLET[3], F: VIOLET[4], c: ICON_WHITE, X: WAX[2] },
};

/** Beckon: the lamplighter with a Wick drawn in from either side */
const BECKON: IconArt = {
  rows: ["....hH.....", "...hHS.....", "f...CC....f", "XA..VCC..AX", "XXA.CCC.AXX", "XA..CCC..AX", "d...LLL...d"],
  colors: { h: HOOD, H: CLOAK, S: SKIN, C: CLOAK, V: VIOLET[2], L: WAX[2], A: VIOLET[4], ...WICK_COLORS },
};

/** Lamp Volley: a Wick spitting two flame bolts */
const VOLLEY: IconArt = {
  rows: [
    "..f.........",
    ".fFf..vvVPW.",
    ".FcF........",
    "XXXXX.......",
    "XeXeX.vvVPW.",
    "XXXXX.......",
    ".ddd........",
  ],
  colors: { v: VIOLET[2], V: VIOLET[3], P: VIOLET[4], W: ICON_WHITE, ...WICK_COLORS },
};

/** Wax Pool: a Wick standing in a wide pool of wax, frost on the air over it */
const POOL: IconArt = {
  rows: [
    "....f.....",
    "...fcF..I.",
    "...XXX....",
    "...eXe.I..",
    "..xXXXx...",
    ".PPPPPPPP.",
    "PLLLLLLLLP",
    ".PPPPPPPP.",
  ],
  colors: { P: WAX[1], L: WAX[3], I: FROST, ...WICK_COLORS },
};

/** Wax Effigy: a tall wax figure with its arms spread, foes drawn in from both sides */
const EFFIGY: IconArt = {
  rows: [
    "....f....",
    "...fFf...",
    "...FcF...",
    "...XXX...",
    "XXXXXXXXX",
    "...XeX...",
    "A..XXX..A",
    ".A.XXX.A.",
    "A..XXX..A",
    "...ddd...",
  ],
  colors: { A: VIOLET[4], ...WICK_COLORS },
};

/** the special: the Great Wick, a giant Wick swinging one arm up */
const GREAT_WICK: IconArt = {
  rows: [
    ".....f.....",
    "....fFf..X.",
    "....FcF..X.",
    "...fFFFf.X.",
    "..XXXXXXXX.",
    "..XeXXXeX..",
    "..XeXXXeX..",
    "XXXXXXXXX..",
    "..XXXXXXX..",
    "..xXXXXXx..",
    "..ddddddd..",
  ],
  colors: WICK_COLORS,
};

const ABILITY_ART: Readonly<Record<WennaAbility, IconArt>> = {
  kindle: KINDLE,
  beckon: BECKON,
  w_lampVolley: VOLLEY,
  w_waxPool: POOL,
  w_effigy: EFFIGY,
};

/** where each of up to five abilities sits on the switch dial, clockwise from the top */
const DIAL: readonly [number, number][] = [
  [4, 0],
  [8, 3],
  [7, 8],
  [1, 8],
  [0, 3],
];

/** the switch: one mark for each ability she knows round a dial, the selected one white, as Mirel's */
function switchArt(selected: WennaAbility, known: readonly WennaAbility[]): IconArt {
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
  return { rows: grid.map((r) => r.join("")), colors: { B: VIOLET[2], W: ICON_WHITE } };
}

/** Wenna's buttons: the lamp, Light, Swap, the selected ability on I, the switch dial on O and the Great Wick */
export function wennaArt(action: TouchButtonAction, ability: WennaAbility, known: readonly WennaAbility[]): IconArt {
  switch (action) {
    case "attack":
      return LAMP;
    case "up":
      return JUMP;
    case "warp":
      return LIGHT;
    case "dash":
      return SWAP;
    case "cast":
      return ABILITY_ART[ability];
    case "cycle":
      return switchArt(ability, known);
    case "ultimate":
      return GREAT_WICK;
  }
}
