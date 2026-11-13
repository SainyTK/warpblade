import type { SableAbility } from "../../../types/sable";
import type { TouchButtonAction } from "../../../types/touch";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt } from "./iconArt";
import { DODGE, JUMP, NOVA } from "./sharedArt";

const JADE = hex("#6ee0a0");
const JADE_DARK = hex("#2e8a60");
const PALE = hex("#c4ffd8");
const WOOD = hex("#5a3a24");
const STEEL = hex("#9ad8b8");
const BONE = hex("#ccb88c");
const ROPE = hex("#c8b48a");
const IRON = hex("#5a6468");
const STRAW = hex("#d8c890");
const CLOAK = hex("#3a6646");
const EMBER = hex("#ff8a3a");

/** a crossbow side on: stock, limbs and a bolt on the rail */
const CROSSBOW: IconArt = {
  rows: ["........L...", ".......L....", "WWWWWWWWBBBP", "SSSSSSSL....", "SS.....L....", "S.......L..."],
  colors: { W: WOOD, S: WOOD, L: STEEL, B: JADE, P: ICON_WHITE },
};

/** her guard: the crossbow raised across, stock out, a parry spark off the stock and a boot below */
const GUARD: IconArt = {
  rows: [
    "........S.",
    ".......WS.",
    "......W..S",
    "..L..W....",
    "...LW.....",
    "...WL.....",
    "..W..L....",
    ".W........",
    "W....BBB..",
    ".....BBBBO",
  ],
  colors: { W: WOOD, L: STEEL, S: ICON_WHITE, B: BONE, O: ICON_WHITE },
};

/** a hop back: an arc to the left over a bolt flying right */
const HOP: IconArt = {
  rows: ["..AAAA...", ".A....A..", "A......A.", "VA.......", ".........", "...BBBP..", "........."],
  colors: { A: JADE, V: PALE, B: JADE, P: ICON_WHITE },
};

/** open jaws of a snare with a glowing plate */
const SNARE: IconArt = {
  rows: ["T.T...T.T", "TTT...TTT", ".T.....T.", ".SSSPSSS.", "SSSSSSSSS"],
  colors: { T: ICON_WHITE, S: hex("#8a9aa0"), P: hex("#e88a4c") },
};

/** a net spread open, its weights at the corners */
const NET: IconArt = {
  rows: ["W.......W", ".R.R.R.R.", "..R.R.R..", ".R.R.R.R.", "..R.R.R..", ".R.R.R.R.", "W.......W"],
  colors: { R: ROPE, W: IRON },
};

/** the straw decoy in her cloak, arms out */
const DECOY: IconArt = {
  rows: ["...CCC...", "..CSSSC..", "...CCC...", "SSSCCCSSS", "...CCC...", "...CCC...", "....S....", "...S.S..."],
  colors: { C: CLOAK, S: STRAW },
};

/** a powder keg with its lit fuse */
const KEG: IconArt = {
  rows: ["......E.", ".....EW.", "..BBBB..", ".WWWWWW.", ".BBIBBB.", ".BBIBBB.", ".WWWWWW.", "..BBBB.."],
  colors: { B: WOOD, W: BONE, I: IRON, E: EMBER },
};

const ABILITY_ART: Readonly<Record<SableAbility, IconArt>> = {
  hop: HOP,
  snare: SNARE,
  s_net: NET,
  s_decoy: DECOY,
  s_keg: KEG,
};

/** where each ability's mark sits on the switch button, in the order O turns through them */
const DIAL: readonly (readonly [number, number])[] = [
  [3, 0],
  [7, 3],
  [5, 7],
  [1, 7],
  [0, 3],
];

/** the switch: a mark for each ability she knows round a dial, the selected one white */
function switchArt(selected: SableAbility, known: readonly SableAbility[]): IconArt {
  const grid = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => "."));
  known.forEach((id, i) => {
    const [x, y] = DIAL[i] ?? DIAL[0];
    const c = id === selected ? "W" : "J";
    for (const [dx, dy] of [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ])
      grid[y + dy][x + dx] = c;
  });
  return { rows: grid.map((r) => r.join("")), colors: { J: JADE_DARK, W: ICON_WHITE } };
}

/** Sable's buttons: the crossbow, the stock guard, the selected ability on I and the switch dial on O */
export function sableArt(action: TouchButtonAction, ability: SableAbility, known: readonly SableAbility[]): IconArt {
  switch (action) {
    case "attack":
      return CROSSBOW;
    case "up":
      return JUMP;
    case "dash":
      return DODGE;
    case "guard":
      return GUARD;
    case "cast":
      return ABILITY_ART[ability] ?? HOP;
    case "cycle":
      return switchArt(ability, known);
    case "ultimate":
      return NOVA;
  }
}
