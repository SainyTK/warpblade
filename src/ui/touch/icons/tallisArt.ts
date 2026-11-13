import { PAL } from "../../../constants/palette";
import type { TallisAbility } from "../../../types/tallis";
import type { TouchButtonAction } from "../../../types/touch";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt } from "./iconArt";
import { JUMP } from "./sharedArt";

const G = PAL.gloam;
const STEEL = hex("#aaa6b4");
const GRIP = hex("#5e554a");
const HOOD = hex("#3c3a46");
const MASK = hex("#5e2c56");
const SKIN = hex("#c08a5e");

/** the knives: two short curved blades crossed, rose glints at their edges */
const KNIFE: IconArt = {
  rows: [
    "W.........W",
    ".SR.....RS.",
    "..SS...SS..",
    "...SS.SS...",
    "....SSS....",
    "....SgS....",
    "...gg.gg...",
    "..gg...gg..",
    ".OO.....OO.",
  ],
  colors: { W: ICON_WHITE, S: STEEL, R: G[5], g: GRIP, O: G[4] },
};

/** the Veil: a hooded head fading out from solid to dithered, a rose outline round the fading half */
const VEIL: IconArt = {
  rows: [
    "...RRRRR...",
    "..RHHHH.R..",
    ".RHHHH.H.R.",
    ".RHHSSH.HR.",
    ".RHHWS.S.R.",
    ".RHMMM.M.R.",
    "..RMMM.MR..",
    "...RRRRR...",
  ],
  colors: { R: G[4], H: HOOD, S: SKIN, W: ICON_WHITE, M: MASK },
};

/** Sink: a pool of ink with two rose eyes and a down arrow into it */
const SINK: IconArt = {
  rows: [
    "....RR.....",
    "....RR.....",
    "..RRRRRR...",
    "...RRRR....",
    "....RR.....",
    "...........",
    ".IIIIIIIII.",
    "IIIEIIIEIII",
    ".IIIIIIIII.",
  ],
  colors: { R: G[5], I: G[2], E: G[5] },
};

/** Smoke Knot: a tied knot under a rolling cloud */
const SMOKE: IconArt = {
  rows: [
    "..LLL..LL..",
    ".LMMMLLMML.",
    "LMMDMMMDMML",
    ".MDDDMDDDM.",
    "..DDDDDDD..",
    "....RRR....",
    "...R.R.R...",
    "....RRR....",
  ],
  colors: { L: G[4], M: G[3], D: G[2], R: G[5] },
};

/** Hamstring: a low sweep of the knife at a pair of legs, a trip star over them */
const HAMSTRING: IconArt = {
  rows: [
    "........Y..",
    ".......YWY.",
    "........Y..",
    "........LL.",
    "........LL.",
    "RRRR...L.L.",
    "..RRRRL..L.",
    "S....RRRRR.",
  ],
  colors: { Y: hex("#ffe26b"), W: ICON_WHITE, L: hex("#6e6a78"), R: G[4], S: STEEL },
};

/** Needle Fan: five needles spreading from a hand */
const NEEDLES: IconArt = {
  rows: [".......RW", ".....RW..", "S.RRRRRRW", "SSRRRRRRW", "S.RRRRRRW", ".....RW..", ".......RW"],
  colors: { S: SKIN, R: G[3], W: G[5] },
};

/** Mark of Dusk: a rose mark over a foe's horned head */
const MARK: IconArt = {
  rows: ["...RWR...", "....R....", "...R.R...", ".........", "K.KKKKK.K", ".KKEKEKK.", "..KKKKK..", "...KKK..."],
  colors: { R: G[4], W: G[5], K: hex("#4a3a5a"), E: hex("#ff8a8a") },
};

/** Caltrops: a strip of four-pointed spikes on the floor */
const CALTROPS: IconArt = {
  rows: ["..W....W...", ".SRS..SRS..", "..S....S...", "....W....W.", "...SRS..SRS", "....S....S.", "DDDDDDDDDDD"],
  colors: { W: G[5], R: G[4], S: STEEL, D: G[2] },
};

/** the special: a rose crescent slash across a dark disc with a hooded figure at its edge */
const GLOAMING: IconArt = {
  rows: [
    "...DDDDD...",
    "..DDDDDDRR.",
    ".DDDDDDRWR.",
    ".DDDDDRWRD.",
    ".DDDDRWRDD.",
    ".DDDRWRDDD.",
    "..DRWRDDD..",
    "..RWRDDD...",
    ".RRDDD.....",
  ],
  colors: { D: G[1], R: G[4], W: G[5] },
};

const ABILITY_ART: Readonly<Record<TallisAbility, IconArt>> = {
  smokeKnot: SMOKE,
  hamstring: HAMSTRING,
  t_needles: NEEDLES,
  t_markDusk: MARK,
  t_caltrops: CALTROPS,
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
function switchArt(selected: TallisAbility, known: readonly TallisAbility[]): IconArt {
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
  return { rows: grid.map((r) => r.join("")), colors: { B: G[3], W: ICON_WHITE } };
}

/** Tallis's buttons: the knives, the Veil, Sink, the selected ability on I, the switch dial on O and Gloaming */
export function tallisArt(action: TouchButtonAction, ability: TallisAbility, known: readonly TallisAbility[]): IconArt {
  switch (action) {
    case "attack":
      return KNIFE;
    case "up":
      return JUMP;
    case "guard":
      return VEIL;
    case "dash":
      return SINK;
    case "cast":
      return ABILITY_ART[ability];
    case "cycle":
      return switchArt(ability, known);
    case "ultimate":
      return GLOAMING;
  }
}
