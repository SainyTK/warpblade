import type { Color } from "../../../types/color";
import type { IconArt } from "../../../types/heroModule";
import type { TouchButtonAction } from "../../../types/touch";
import { ICON_WHITE } from "../../../ui/touch/icons/iconArt";
import { DODGE, JUMP } from "../../../ui/touch/icons/sharedArt";
import { hex } from "../../../utils/color";
import { ABILITY_TAB, ALDRIC_ABILITIES } from "../constants/abilities";
import type { AldricAbility } from "../types/state";

const GOLD = hex("#ffe08a");
const DEEP = hex("#c8962e");

/** the arming sword, point up and right, with its wide gold guard */
const SWORD: IconArt = {
  rows: [
    "............W",
    "...........WC",
    "..........WC.",
    ".........WC..",
    "........WC...",
    ".......WC....",
    "..B...WC.....",
    "...B.WC......",
    "....BB.......",
    "....GBB......",
    "...G...B.....",
    "..G..........",
    ".P...........",
  ],
  colors: { W: ICON_WHITE, C: hex("#c6d4ee"), B: GOLD, G: hex("#4e3828"), P: GOLD },
};

/** the kite shield face on, the rising sun on its upper half */
const SHIELD: IconArt = {
  rows: [
    ".BBBBBBB.",
    "BWWYYYWWB",
    "BWYYGYYWB",
    "BWWWWWWWB",
    "BWWWWWWWB",
    ".BWWWWWB.",
    "..BWWWB..",
    "...BWB...",
    "....B....",
  ],
  colors: { W: ICON_WHITE, B: GOLD, Y: DEEP, G: hex("#fff6dc") },
};

const ABILITY_ART: Record<AldricAbility, IconArt> = {
  rush: {
    rows: [
      ".........",
      "....BBBB.",
      "...BWWWWB",
      "WW.BWYYWB",
      "...BWWWWB",
      "WWW.BWWB.",
      "....BWWB.",
      "WW...BB..",
      ".........",
    ],
    colors: { W: ICON_WHITE, B: GOLD, Y: DEEP },
  },
  pillar: {
    rows: [
      "...YWY...",
      "...YWY...",
      "...YWY...",
      "...YWY...",
      "...YWY...",
      "...YWY...",
      "..YYWYY..",
      ".YYWWWYY.",
      "YYYYYYYYY",
    ],
    colors: { W: ICON_WHITE, Y: GOLD },
  },
  lance: {
    rows: [
      ".........",
      ".........",
      "......YY.",
      "Y.....YWY",
      "YYWWWWWWW",
      "Y.....YWY",
      "......YY.",
      ".........",
      ".........",
    ],
    colors: { W: ICON_WHITE, Y: GOLD },
  },
  mend: {
    rows: [
      "...GGG...",
      "...GWG...",
      "...GWG...",
      "GGGGWGGGG",
      "GWWWWWWWG",
      "GGGGWGGGG",
      "...GWG...",
      "...GWG...",
      "...GGG...",
    ],
    colors: { W: ICON_WHITE, G: hex("#9cf0a0") },
  },
  rally: {
    rows: [
      "..YYYYY..",
      ".Y.....Y.",
      "Y..OOO..Y",
      "Y.O...O.Y",
      "Y.O.W.O.Y",
      "Y.O...O.Y",
      "Y..OOO..Y",
      ".Y.....Y.",
      "..YYYYY..",
    ],
    colors: { W: ICON_WHITE, Y: GOLD, O: hex("#ffb870") },
  },
};

/** Sanctuary: the dome of light over the planted shield */
const DOME: IconArt = {
  rows: [
    ".............",
    "....YYYYY....",
    "..YY.....YY..",
    ".Y.........Y.",
    ".Y....B....Y.",
    "Y....BWB....Y",
    "Y....BWB....Y",
    "Y....BWB....Y",
    "Y.....B.....Y",
    "YYYYYYYYYYYYY",
    ".............",
    ".............",
    ".............",
  ],
  colors: { W: ICON_WHITE, Y: GOLD, B: DEEP },
};

/** the switch button: a dot per ability he holds round a ring, the selected one white */
const RING_DOTS: readonly (readonly [number, number])[] = [
  [4, 0],
  [8, 3],
  [6, 8],
  [2, 8],
  [0, 3],
];
const RING_KEYS = ["A", "B", "C", "D", "E"] as const;
function abilityRing(selected: AldricAbility, known: readonly string[]): IconArt {
  const rows = Array.from({ length: 9 }, () => Array<string>(9).fill("."));
  const colors: Record<string, Color> = { W: ICON_WHITE };
  ALDRIC_ABILITIES.forEach((a, i) => {
    colors[RING_KEYS[i]] = hex(ABILITY_TAB[a].tint);
    if (!known.includes(a)) return;
    const [x, y] = RING_DOTS[i];
    rows[y][x] = a === selected ? "W" : RING_KEYS[i];
  });
  return { rows: rows.map((r) => r.join("")), colors };
}

/** Aldric's touch button faces, per action, selected ability and the abilities he holds */
export function aldricArt(action: TouchButtonAction, ability: AldricAbility, known: readonly string[]): IconArt {
  switch (action) {
    case "attack":
      return SWORD;
    case "up":
      return JUMP;
    case "dash":
      return DODGE;
    case "guard":
      return SHIELD;
    case "cast":
      return ABILITY_ART[ability] ?? ABILITY_ART.rush;
    case "cycle":
      return abilityRing(ability, known);
    case "ultimate":
      return DOME;
  }
}
