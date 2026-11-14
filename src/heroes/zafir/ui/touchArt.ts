import type { Color } from "../../../types/color";
import type { IconArt } from "../../../types/heroModule";
import type { TouchButtonAction } from "../../../types/touch";
import { ICON_WHITE } from "../../../ui/touch/icons/iconArt";
import { DODGE, JUMP } from "../../../ui/touch/icons/sharedArt";
import { hex } from "../../../utils/color";
import { ABILITY_COLOR, ZAFIR_ABILITIES } from "../constants/abilities";
import type { ZafirAbility } from "../types/abilities";

const STEEL = hex("#e6dcc6");
const GOLD = hex("#e0ac48");
const SAFFRON = hex("#f2a03a");
const SAND = hex("#f0cf8a");
const DEEP = hex("#a8763a");

/** the scimitar: a broad blade curving up to a clipped point, a downturned guard and a saffron crystal */
const SCIMITAR: IconArt = {
  rows: [
    "..........WW.",
    ".........WCC.",
    "........WCC..",
    ".......WCC...",
    "......WCC....",
    ".....WCC.....",
    "....WCC......",
    "..G.CC.......",
    "...GS........",
    "..H.G........",
    ".H...G.......",
    "P............",
    ".............",
  ],
  colors: { W: ICON_WHITE, C: STEEL, G: GOLD, S: SAFFRON, H: hex("#4a2a1a"), P: GOLD },
};

/** the veil of sand: the scimitar raised, a fan of grains in front of it */
const VEIL: IconArt = {
  rows: [
    ".....W...",
    ".....C.s.",
    "..s..C...",
    ".s...C.s.",
    "s..s.C...",
    ".s...C.s.",
    "..s.GSG..",
    ".....H...",
    ".....P...",
  ],
  colors: { W: ICON_WHITE, C: STEEL, s: SAND, G: GOLD, S: SAFFRON, H: hex("#4a2a1a"), P: GOLD },
};

/** the face of each ability's button */
const ABILITY_ART: Readonly<Record<ZafirAbility, IconArt>> = {
  spout: {
    rows: [
      "SSSSSSSSS",
      ".SsSSsSS.",
      "..SSsSS..",
      "..SsSS...",
      "...SSs...",
      "...sS....",
      "....S....",
      "...DDD...",
      ".DDDDDDD.",
    ],
    colors: { S: SAND, s: ICON_WHITE, D: DEEP },
  },
  crescent: {
    rows: [
      ".....WW..",
      "...WC..s.",
      "..WC....s",
      ".WC.....s",
      ".C......s",
      ".WC.....s",
      "..WC....s",
      "...WC..s.",
      ".....WW..",
    ],
    colors: { W: ICON_WHITE, C: STEEL, s: SAND },
  },
  gale: {
    rows: [
      ".........",
      "OOOO.....",
      "....OO...",
      "WWWWWWOO.",
      ".......OO",
      "WWWWWWOO.",
      "....OO...",
      "OOOO.....",
      ".........",
    ],
    colors: { W: ICON_WHITE, O: ABILITY_COLOR.gale },
  },
  glass: {
    rows: [
      "G...W...G",
      "G..GWG..G",
      ".G..G..G.",
      ".G.....G.",
      "..G.G.G..",
      "....G....",
      ".........",
      ".s.s.s.s.",
      "sssssssss",
    ],
    colors: { W: ICON_WHITE, G: ABILITY_COLOR.glass, s: SAND },
  },
  quicksand: {
    rows: [
      ".........",
      ".........",
      "...WWW...",
      ".SS...SS.",
      "S..sss..S",
      "S.s...s.S",
      ".S..s..S.",
      "..SS.SS..",
      "....S....",
    ],
    colors: { W: ICON_WHITE, S: ABILITY_COLOR.quicksand, s: SAND },
  },
};

/** Sandstorm: a funnel of wind with grains round it */
const STORM: IconArt = {
  rows: [
    "s.SSSSSS.",
    ".SSWWWWS.",
    "..SSWWS.s",
    "s..SWS...",
    "...SSs...",
    "s..SS..s.",
    "...S.....",
    "..s...s..",
    "DDDDDDDDD",
  ],
  colors: { W: ICON_WHITE, S: SAND, s: SAFFRON, D: DEEP },
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

/** the switch button: a dot per ability he holds round a ring, in its own colour, the selected one white */
function abilityRing(selected: ZafirAbility, known: readonly ZafirAbility[]): IconArt {
  const rows = Array.from({ length: 9 }, () => Array<string>(9).fill("."));
  ZAFIR_ABILITIES.forEach((a, i) => {
    if (!known.includes(a)) return;
    const [x, y] = RING_DOTS[i];
    rows[y][x] = a === selected ? "W" : RING_KEYS[i];
  });
  const colors: Record<string, Color> = { W: ICON_WHITE };
  ZAFIR_ABILITIES.forEach((a, i) => {
    colors[RING_KEYS[i]] = ABILITY_COLOR[a];
  });
  return { rows: rows.map((r) => r.join("")), colors };
}

/** Zafir's button art, per action, selected ability and the abilities he holds */
export function zafirArt(action: TouchButtonAction, ability: ZafirAbility, known: readonly ZafirAbility[]): IconArt {
  switch (action) {
    case "attack":
      return SCIMITAR;
    case "up":
      return JUMP;
    case "dash":
      return DODGE;
    case "guard":
      return VEIL;
    case "cast":
      return ABILITY_ART[ability] ?? ABILITY_ART.spout;
    case "cycle":
      return abilityRing(ability, known);
    case "ultimate":
      return STORM;
  }
}
