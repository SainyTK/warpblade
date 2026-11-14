import type { Color } from "../../../types/color";
import type { IconArt } from "../../../types/heroModule";
import type { TouchButtonAction } from "../../../types/touch";
import { ICON_WHITE } from "../../../ui/touch/icons/iconArt";
import { DODGE, JUMP } from "../../../ui/touch/icons/sharedArt";
import { hex } from "../../../utils/color";
import { ABILITY_COLOR, CALDER_ABILITIES } from "../constants/shots";
import type { CalderAbility } from "../types/ability";

const GUN = hex("#686f74");
const BRASS = hex("#c99a3c");
const GREEN = hex("#b4ff5a");
const GRIP = hex("#86603e");

/** the chamber sword on the diagonal: a broad blade, the cylinder at the guard with its green hub, a leather grip */
const SWORD: IconArt = {
  rows: [
    "...........WW",
    "..........WCW",
    ".........WCW.",
    "........WCW..",
    ".......WCW...",
    "......WCW....",
    "....GGCW.....",
    "...GGGG......",
    "...GEGG......",
    "..B.GG.......",
    ".B...........",
    "P............",
    ".............",
  ],
  colors: { W: ICON_WHITE, C: hex("#bcc6c6"), G: GUN, E: GREEN, B: GRIP, P: BRASS },
};

/** the guard: the blade upright, a blow's spark off its spine and a round ready in the cylinder */
const GUARD: IconArt = {
  rows: [
    "....W....",
    "..S.WC...",
    "...SWC...",
    "..S.WC...",
    "....WC...",
    "....WC...",
    "...GGG...",
    "...GEG...",
    "....B....",
  ],
  colors: { W: ICON_WHITE, C: hex("#bcc6c6"), G: GUN, E: GREEN, B: GRIP, S: hex("#ffe066") },
};

/** each ability's face */
const SHOTS: Record<CalderAbility, IconArt> = {
  slug: {
    rows: [
      ".........",
      ".........",
      ".........",
      "....D....",
      "CCCCDWWW.",
      "....D....",
      ".........",
      ".........",
      ".........",
    ],
    colors: { W: ICON_WHITE, C: ABILITY_COLOR.slug, D: hex("#56a83a") },
  },
  scatter: {
    rows: [
      "......Y..",
      "....Y...Y",
      "..Y...Y..",
      ".W..Y....",
      "WW.Y..Y.Y",
      ".W..Y....",
      "..Y...Y..",
      "....Y...Y",
      "......Y..",
    ],
    colors: { W: ICON_WHITE, Y: ABILITY_COLOR.scatter },
  },
  flare: {
    rows: [
      ".........",
      "....W....",
      "...WGW...",
      "....W....",
      ".........",
      "..G.G.G..",
      ".GGGGGGG.",
      "GGDGDGDGG",
      "DDDDDDDDD",
    ],
    colors: { W: ICON_WHITE, G: ABILITY_COLOR.flare, D: hex("#2f6a24") },
  },
  chain: {
    rows: [
      ".........",
      ".CC......",
      "CWWC.....",
      ".CC.C....",
      ".....C...",
      "......CC.",
      ".....CWWC",
      "......CC.",
      ".........",
    ],
    colors: { W: ICON_WHITE, C: ABILITY_COLOR.chain },
  },
  charge: {
    rows: [
      ".........",
      "....W....",
      "...O.O...",
      "....W....",
      "...OOO...",
      "..OOWOO..",
      "..OOOOO..",
      ".DDDDDDD.",
      ".........",
    ],
    colors: { W: ICON_WHITE, O: ABILITY_COLOR.charge, D: hex("#6a3a1a") },
  },
};

/** the ultimate: a cylinder of six rounds round a green hub */
const BREAK: IconArt = {
  rows: [
    ".........",
    "...Y.Y...",
    "..YRYRY..",
    ".Y.....Y.",
    ".R..E..R.",
    ".Y.....Y.",
    "..YRYRY..",
    "...Y.Y...",
    ".........",
  ],
  colors: { Y: BRASS, R: hex("#ffe49a"), E: GREEN },
};

/** where each ability's dot sits on the switch button, in rotation order round a ring */
const RING_DOTS: readonly (readonly [number, number])[] = [
  [4, 0],
  [8, 3],
  [6, 8],
  [2, 8],
  [0, 3],
];
const RING_KEYS = ["A", "B", "C", "D", "E"] as const;

/** the switch button: a dot per ability Calder knows round a ring, in its colour, the selected one with a white core */
function abilityRing(selected: CalderAbility, known: readonly CalderAbility[]): IconArt {
  const rows = Array.from({ length: 9 }, () => Array<string>(9).fill("."));
  CALDER_ABILITIES.forEach((a, i) => {
    if (!known.includes(a)) return;
    const [x, y] = RING_DOTS[i];
    rows[y][x] = a === selected ? "W" : RING_KEYS[i];
  });
  const colors: Record<string, Color> = { W: ICON_WHITE };
  CALDER_ABILITIES.forEach((a, i) => {
    colors[RING_KEYS[i]] = ABILITY_COLOR[a];
  });
  return { rows: rows.map((r) => r.join("")), colors };
}

/** Calder's button art, per action, selected ability and the abilities he knows */
export function calderArt(action: TouchButtonAction, ability: CalderAbility, known: readonly CalderAbility[]): IconArt {
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
      return SHOTS[ability] ?? SHOTS.slug;
    case "cycle":
      return abilityRing(ability, known);
    case "ultimate":
      return BREAK;
  }
}
