import { DRUM, PAL } from "../../../constants/palette";
import type { JoryAbility } from "../../../types/jory";
import type { TouchButtonAction } from "../../../types/touch";
import { hex } from "../../../utils/color";
import { ICON_WHITE, type IconArt } from "./iconArt";
import { JUMP } from "./sharedArt";

const B = PAL.beat;
const WOOD = hex("#8a6440");
const HIDE = hex("#e8dcc0");
const PEWTER = hex("#9a9ca8");
const IRON = hex("#6a6c7c");
const BRONZE = hex("#c08a3a");
const BRONZE_LIGHT = hex("#f0c878");
const BOOT = hex("#8a5e3e");

/** the colours of the drum in the rows below: hide head, pewter hoops, oxblood shell and cobalt lacing */
const DRUM_COLORS = { h: HIDE, p: PEWTER, D: DRUM[2], l: B[3] };

/** the mallets: two felt heads up top, their dark shafts crossed below */
const MALLETS: IconArt = {
  rows: [
    ".FF.....FF.",
    "FWFF...FFWF",
    "FFFF...FFFF",
    ".FF.S.S.FF.",
    "....S.S....",
    ".....S.....",
    "....S.S....",
    "...S...S...",
    "..S.....S..",
  ],
  colors: { F: B[3], W: ICON_WHITE, S: WOOD },
};

/** Boom: the drum inside a ring of sound */
const BOOM: IconArt = {
  rows: [
    "...RRRRR...",
    ".RR.....RR.",
    "R..phhhp..R",
    "R.ppppppp.R",
    "R.lDDDlDD.R",
    "R.DlDlDlD.R",
    ".RDDlDDDlR.",
    "..ppppppp..",
    "...RRRRR...",
  ],
  colors: { R: B[4], ...DRUM_COLORS },
};

/** Beat Step: a boot stepping onto a beat ring, speed lines behind */
const BEAT_STEP: IconArt = {
  rows: [
    "....BB.....",
    "SS..BB.....",
    "....BBB....",
    "SSS.BBBBB..",
    "....ddddd..",
    "...........",
    ".RRRRRRRRR.",
    "RR.......RR",
    ".RRRRRRRRR.",
  ],
  colors: { B: BOOT, d: hex("#4a2e1c"), S: B[4], R: B[4] },
};

/** Steady Hand: an iron metronome with its arm swung over */
const STEADY: IconArt = {
  rows: [
    "........W",
    ".......W.",
    "...I..W..",
    "...IIWI..",
    "..IIWII..",
    "..IWLLI..",
    ".IIKKII..",
    ".IIKKIII.",
    "IIIIIIIII",
  ],
  colors: { W: ICON_WHITE, I: IRON, L: B[5], K: B[3] },
};

/** Thunder Skin: the drum planted on the floor, a wave of sound running out along it both ways */
const THUNDER: IconArt = {
  rows: [
    "...phhhhp...",
    "...pppppp...",
    "...lDDDlD...",
    "...DlDlDl...",
    "...DDlDDD...",
    "...pppppp...",
    "WW........WW",
    ".WWW....WWW.",
    "RRRRRRRRRRRR",
  ],
  colors: { W: B[5], R: B[3], ...DRUM_COLORS },
};

/** Gong: a bronze gong hanging in its frame */
const GONG: IconArt = {
  rows: [
    "WWWWWWWWWWW",
    "W...b.b...W",
    "W..GGGGG..W",
    "W.GLGGGGG.W",
    "W.GGGooGG.W",
    "W.GGoLoGG.W",
    "W.GGGooGG.W",
    "W..GGGGG..W",
    "W.........W",
  ],
  colors: { W: WOOD, b: PEWTER, G: BRONZE, L: BRONZE_LIGHT, o: hex("#7a5222") },
};

/** Tuning Fork: a pewter fork humming between two sound waves */
const TUNING: IconArt = {
  rows: [
    "...L...P...",
    ".R.L...P.R.",
    "R..L...P..R",
    "R..L...P..R",
    ".R.L...P.R.",
    "....LPPP...",
    "......P....",
    "......P....",
    "......P....",
  ],
  colors: { L: hex("#d4d6de"), P: PEWTER, R: B[4] },
};

/** Echo Chamber: a dome of sound, ring within ring, over the floor */
const ECHO: IconArt = {
  rows: ["...RRRRR...", ".RR.....RR.", "R...MMM...R", "R..M...M..R", "R.M..W..M.R", "R.M.WWW.M.R", "FFFFFFFFFFF"],
  colors: { R: B[3], M: B[4], W: ICON_WHITE, F: B[2] },
};

/** the ultimate Drumroll: the drum under both mallets in a blur */
const DRUMROLL: IconArt = {
  rows: [
    ".FF..W..FF.",
    "FWFF...FFWF",
    "FFFF...FFFF",
    ".FFS...SFF.",
    "...S...S...",
    "..phhhhhp..",
    ".ppppppppp.",
    ".lDDDlDDDl.",
    ".DlDlDlDlD.",
    ".DDlDDDlDD.",
    ".ppppppppp.",
  ],
  colors: { F: B[3], W: ICON_WHITE, S: WOOD, ...DRUM_COLORS },
};

const ABILITY_ART: Readonly<Record<JoryAbility, IconArt>> = {
  steadyHand: STEADY,
  thunderSkin: THUNDER,
  j_gong: GONG,
  j_tuning: TUNING,
  j_echo: ECHO,
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
function switchArt(selected: JoryAbility, known: readonly JoryAbility[]): IconArt {
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
  return { rows: grid.map((r) => r.join("")), colors: { B: B[3], W: ICON_WHITE } };
}

/** Jory's buttons: the mallets, Beat Step, Boom, the selected ability on I, the switch dial on O and Drumroll */
export function joryArt(action: TouchButtonAction, ability: JoryAbility, known: readonly JoryAbility[]): IconArt {
  switch (action) {
    case "attack":
      return MALLETS;
    case "up":
      return JUMP;
    case "warp":
      return BOOM;
    case "dash":
      return BEAT_STEP;
    case "cast":
      return ABILITY_ART[ability];
    case "cycle":
      return switchArt(ability, known);
    case "ultimate":
      return DRUMROLL;
  }
}
