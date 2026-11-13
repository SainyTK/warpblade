import type { HuldaAbility } from "../../../types/hulda";
import type { TouchButtonAction } from "../../../types/touch";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt } from "./iconArt";
import { JUMP, NOVA } from "./sharedArt";

const IRON = hex("#b4bcc4");
const IRON_DARK = hex("#78828c");
const WRAP = hex("#d8c8ac");
const RUST = hex("#ff5f6d");
const RUST_DARK = hex("#c43848");
const PALE = hex("#ffc2b8");

/** an iron gauntlet's fist side on: the wrapped wrist, finger bands, and white studs on the knuckles leading */
const FIST: IconArt = {
  rows: [
    "....DIIIIID..",
    "...DIIIIIIIDG",
    "WWWDIIDIIDIIG",
    "WWWDIIDIIDIIG",
    "WWWDIIIIIIIIG",
    "WWWDDIIIIIIDG",
    "....DDDDDDDD.",
  ],
  colors: { I: IRON, D: IRON_DARK, W: WRAP, G: ICON_WHITE },
};

/** a shoulder plate lowered into the charge, speed lines trailing behind it */
const RUSH: IconArt = {
  rows: [
    "......PPPP..",
    "....PPRRRRP.",
    "LLL.PRRRRRRP",
    "...PRRRRRRRP",
    "LLLL.RRRRRRP",
    ".....DDDDDD.",
    "LL...DDDDD..",
  ],
  colors: { P: PALE, R: RUST, D: RUST_DARK, L: ICON_WHITE },
};

/** two gauntlets closing on a foe from either side, fingers curled in */
const GRAB: IconArt = {
  rows: ["IIII....IIII", "IDDI.FF.IDDI", "IIII.FF.IIII", ".II.FFFF.II.", "..I.FFFF.I..", ".....FF....."],
  colors: { I: IRON, D: IRON_DARK, F: RUST },
};

/** rings rolling out from an open mouth */
const BELLOW: IconArt = {
  rows: ["...P...P..", "..P...P...", ".P.MM.P..P", ".P.MM.P..P", "..P...P...", "...P...P.."],
  colors: { P: PALE, M: RUST },
};

/** a fist on a chest with a ring around it */
const TAUNT: IconArt = {
  rows: ["..GGGGG..", ".G.....G.", "G..III..G", "G..IWI..G", ".G.....G.", "..GGGGG.."],
  colors: { G: hex("#e0ac48"), I: IRON, W: ICON_WHITE },
};

/** a gauntlet flung out on a chain of links, fingers hooked */
const CHAIN: IconArt = {
  rows: ["........III", ".......IDDI", "L.L.L.LIIII", ".L.L.L.IDDI", "........III"],
  colors: { I: IRON, D: IRON_DARK, L: PALE },
};

/** a boot on the floor and a tremor running out both ways */
const STOMP: IconArt = {
  rows: ["....DD....", "....DD....", "...DDDD...", "...RRRR...", "W.RRRRRR.W", "RRWRRRRWRR"],
  colors: { D: IRON_DARK, R: RUST, W: ICON_WHITE },
};

/** two gauntlets crossed before the chest, a plate glinting between */
const WALL: IconArt = {
  rows: ["II.....II", "IDI...IDI", ".IDIWIDI.", "..IIWII..", ".IDIWIDI.", "IDI...IDI", "II.....II"],
  colors: { I: IRON, D: IRON_DARK, W: ICON_WHITE },
};

const ABILITY_ART: Readonly<Record<HuldaAbility, IconArt>> = {
  bellow: BELLOW,
  taunt: TAUNT,
  h_ironChain: CHAIN,
  h_tremorStomp: STOMP,
  h_ironWall: WALL,
};

/** where each of up to five abilities sits on the switch dial, clockwise from the top */
const DIAL: readonly [number, number][] = [
  [4, 0],
  [8, 3],
  [7, 8],
  [1, 8],
  [0, 3],
];

/** the switch: one mark for each ability she knows round a dial, the selected one white, as Kael's element ring */
function switchArt(selected: HuldaAbility, known: readonly HuldaAbility[]): IconArt {
  const grid = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => "."));
  known.forEach((id, i) => {
    const [x, y] = DIAL[i];
    const c = id === selected ? "W" : "R";
    for (const [dx, dy] of [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ])
      grid[y + dy][x + dx] = c;
  });
  return { rows: grid.map((r) => r.join("")), colors: { R: RUST_DARK, W: ICON_WHITE } };
}

/** Hulda's buttons: the fist, the rush, the grab, the selected ability on I and the switch dial on O */
export function huldaArt(action: TouchButtonAction, ability: HuldaAbility, known: readonly HuldaAbility[]): IconArt {
  switch (action) {
    case "attack":
      return FIST;
    case "up":
      return JUMP;
    case "dash":
      return RUSH;
    case "guard":
      return GRAB;
    case "cast":
      return ABILITY_ART[ability];
    case "cycle":
      return switchArt(ability, known);
    case "ultimate":
      return NOVA;
  }
}
