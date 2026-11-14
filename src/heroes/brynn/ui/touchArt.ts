import type { Color } from "../../../types/color";
import type { IconArt } from "../../../types/heroModule";
import type { TouchButtonAction } from "../../../types/touch";
import { ICON_WHITE } from "../../../ui/touch/icons/iconArt";
import { DODGE, JUMP } from "../../../ui/touch/icons/sharedArt";
import { hex } from "../../../utils/color";
import { BRYNN_ABILITIES } from "../constants/abilities";
import { CRIMSON } from "../constants/colors";
import type { BrynnAbility } from "../types/ability";

const STEEL = hex("#b9b2b8");
const BRONZE = hex("#c48a3c");
const GRIP = hex("#6a4a36");

/** Anvilheart point up and to the right: a broad slab, the crimson crystal, the heavy guard and the long grip */
const SWORD: IconArt = {
  rows: [
    "..........WW.",
    ".........WWSW",
    "........WWSS.",
    ".......WWSS..",
    "......WWSS...",
    ".....WWSS....",
    "..B.WRSS.....",
    "...BRSS......",
    "....BB.......",
    "...G.BB......",
    "..G....B.....",
    ".G...........",
    "P............",
  ],
  colors: { W: ICON_WHITE, S: STEEL, R: CRIMSON[3], B: BRONZE, G: GRIP, P: STEEL },
};

/** her guard: the blade upright before her, its flat to the front, a blow's spark off it */
const GUARD: IconArt = {
  rows: [
    "....WS...",
    "....WS.Y.",
    "....WS..Y",
    "....WSY..",
    "....WS.Y.",
    "....WS...",
    "..BBRBB..",
    ".....G...",
    ".....G...",
  ],
  colors: { W: ICON_WHITE, S: STEEL, R: CRIMSON[3], B: BRONZE, G: GRIP, Y: CRIMSON[5] },
};

const ABILITY_ART: Record<BrynnAbility, IconArt> = {
  /** a crest of crimson running along the floor */
  rend: {
    rows: [
      ".........",
      "......W..",
      ".....WC..",
      "....WCC..",
      "...WCCD..",
      "..WCCDD..",
      ".WCCDD...",
      "CCCDD....",
      "DDDDDDDDD",
    ],
    colors: { W: ICON_WHITE, C: CRIMSON[4], D: CRIMSON[2] },
  },
  /** the blade driven point first into the floor, cracks running out */
  quake: {
    rows: [
      "....B....",
      "...BBB...",
      "....W....",
      "....W....",
      "..C.W.C..",
      ".C..W..C.",
      "C...W...C",
      "DDDDWDDDD",
      ".D.D.D.D.",
    ],
    colors: { W: ICON_WHITE, B: BRONZE, C: CRIMSON[4], D: CRIMSON[2] },
  },
};

/** Crimson Fall: one huge crescent coming down into the floor */
const FALL: IconArt = {
  rows: [
    "...CCCC..",
    ".CC...WC.",
    "C.......W",
    "........W",
    ".......W.",
    "......W..",
    ".....W...",
    "DDDDDDDDD",
    "..D.D.D..",
  ],
  colors: { W: ICON_WHITE, C: CRIMSON[4], D: CRIMSON[2] },
};

/** where each ability's dot sits on the switch button, in rotation order round a ring */
const RING_DOTS: readonly (readonly [number, number])[] = [
  [4, 0],
  [8, 3],
  [6, 8],
  [2, 8],
  [0, 3],
];

/** the switch button: a dot per ability round a ring, the selected one white */
function abilityRing(selected: string, known: readonly string[]): IconArt {
  const rows = Array.from({ length: 9 }, () => Array<string>(9).fill("."));
  BRYNN_ABILITIES.forEach((a, i) => {
    if (!known.includes(a)) return;
    const [x, y] = RING_DOTS[i];
    rows[y][x] = a === selected ? "W" : "C";
  });
  const colors: Record<string, Color> = { W: ICON_WHITE, C: CRIMSON[4] };
  return { rows: rows.map((r) => r.join("")), colors };
}

/** Brynn's button art, per action, selected ability and the abilities she holds */
export function brynnArt(action: TouchButtonAction, ability: string, known: readonly string[]): IconArt {
  switch (action) {
    case "attack":
      return SWORD;
    case "up":
      return JUMP;
    case "dash":
      return DODGE;
    case "guard":
      return GUARD;
    case "cast":
      return ABILITY_ART[(ability || "rend") as BrynnAbility] ?? ABILITY_ART.rend;
    case "cycle":
      return abilityRing(ability, known);
    case "ultimate":
      return FALL;
  }
}
