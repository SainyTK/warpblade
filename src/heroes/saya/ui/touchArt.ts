import type { Color } from "../../../types/color";
import type { IconArt } from "../../../types/heroModule";
import type { TouchButtonAction } from "../../../types/touch";
import { ICON_WHITE } from "../../../ui/touch/icons/iconArt";
import { DODGE, JUMP } from "../../../ui/touch/icons/sharedArt";
import { hex } from "../../../utils/color";
import { ABILITY_ORDER, ABILITY_TAB } from "../constants/abilities";
import type { SayaAbility } from "../types/ability";

const STEEL = hex("#d4dbec");
const INK = hex("#3f4896");
const MOON = hex("#8fa2ff");
const WRAP = hex("#2a2f62");

/** the attack button: the katana's curved blade out of its round guard */
const KATANA: IconArt = {
  rows: [
    "...........W.",
    "..........WS.",
    ".........WS..",
    "........WS...",
    ".......WS....",
    "......WS.....",
    ".....WS......",
    "...GWS.......",
    "..GMG........",
    "...GH........",
    "..H..........",
    ".H...........",
    "H............",
  ],
  colors: { W: ICON_WHITE, S: STEEL, G: hex("#30354c"), M: MOON, H: WRAP },
};

/** the guard: the sheathed katana held level across, a blow's spark bursting off the lacquer */
const GUARD: IconArt = {
  rows: [
    ".........",
    "..S.S....",
    "...W.....",
    "..S.S....",
    "LLLLLLGHH",
    "IIIIII.H.",
    ".........",
    ".........",
    ".........",
  ],
  colors: { W: ICON_WHITE, S: MOON, L: hex("#3e3a5c"), I: INK, G: hex("#b4bcd4"), H: WRAP },
};

/** each ability's face: Brushline a long brush stroke with speed lines, Moonrise a crescent rising off the floor */
const ABILITY_ART: Record<SayaAbility, IconArt> = {
  line: {
    rows: [
      ".........",
      ".........",
      "WW.......",
      ".........",
      "WWW..KKW.",
      "KKKKKKKKW",
      ".KKKKKKW.",
      ".........",
      ".........",
    ],
    colors: { W: ICON_WHITE, K: INK },
  },
  rise: {
    rows: [
      "......WW.",
      ".....WKK.",
      "....WKK..",
      "....WK...",
      "...WKK...",
      "...WK....",
      "..WKK....",
      ".WKK.....",
      "KKKKKKKKK",
    ],
    colors: { W: ICON_WHITE, K: INK },
  },
  crescent: {
    rows: [
      "....WK...",
      ".....WK..",
      "......WK.",
      "......WK.",
      "......WK.",
      "......WK.",
      "......WK.",
      ".....WK..",
      "....WK...",
    ],
    colors: { W: ICON_WHITE, K: INK },
  },
  rain: {
    rows: [
      ".KKKKKKK.",
      "KKKKKKKKK",
      ".KKKKKKK.",
      ".........",
      ".W..W..W.",
      ".K..K..K.",
      "...W..W..",
      "...K..K..",
      ".........",
    ],
    colors: { W: ICON_WHITE, K: INK },
  },
  still: {
    rows: [
      ".........",
      ".........",
      ".........",
      "....W....",
      "...WMW...",
      "....W....",
      ".........",
      "KKKKKKKKK",
      ".IIIIIII.",
    ],
    colors: { W: ICON_WHITE, K: INK, M: MOON, I: hex("#12163a") },
  },
};

/** the ultimate: a crescent moon crossed by ink lines */
const SILENT_MOON: IconArt = {
  rows: [
    "...MMM...",
    ".MM...K..",
    "MM...K...",
    "MW..K....",
    "MKKKKKKKK",
    "MW..K....",
    "MM...K...",
    ".MM...K..",
    "...MMM...",
  ],
  colors: { M: MOON, W: ICON_WHITE, K: INK },
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

/** the switch button: a dot per ability she has round a ring, in its own colour, the selected one with a white core */
function abilityRing(selected: SayaAbility, known: readonly string[]): IconArt {
  const rows = Array.from({ length: 9 }, () => Array<string>(9).fill("."));
  const colors: Record<string, Color> = { W: ICON_WHITE };
  ABILITY_ORDER.forEach((a, i) => {
    colors[RING_KEYS[i]] = hex(ABILITY_TAB[a].tint);
    if (!known.includes(a)) return;
    const [x, y] = RING_DOTS[i];
    rows[y][x] = a === selected ? "W" : RING_KEYS[i];
  });
  return { rows: rows.map((r) => r.join("")), colors };
}

/** Saya's button art, per action, selected ability and the abilities she has */
export function sayaArt(action: TouchButtonAction, ability: SayaAbility, known: readonly string[]): IconArt {
  switch (action) {
    case "attack":
      return KATANA;
    case "up":
      return JUMP;
    case "dash":
      return DODGE;
    case "guard":
      return GUARD;
    case "cast":
      return ABILITY_ART[ability];
    case "cycle":
      return abilityRing(ability, known);
    case "ultimate":
      return SILENT_MOON;
  }
}
