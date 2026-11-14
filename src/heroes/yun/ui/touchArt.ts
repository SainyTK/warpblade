import type { IconArt } from "../../../types/heroModule";
import type { TouchButtonAction } from "../../../types/touch";
import { ICON_WHITE } from "../../../ui/touch/icons/iconArt";
import { DODGE, JUMP } from "../../../ui/touch/icons/sharedArt";
import { hex } from "../../../utils/color";
import { YUN_ABILITIES } from "../constants/abilities";
import type { YunAbility } from "../types/ability";

const JADE = hex("#5fd6a4");
const MINT = hex("#9af0c8");
const DEEP = hex("#1f8a66");
const STEEL = hex("#c6e6dc");
const HILT = hex("#4a3a38");

/** the jian on a slant, its tassel hanging from the pommel */
const JIAN: IconArt = {
  rows: [
    "............W",
    "...........WS",
    "..........WS.",
    ".........WS..",
    "........WS...",
    ".......WS....",
    "......WS.....",
    "...J.WS......",
    "....JS.......",
    "....HJ.......",
    "...H..J......",
    "..H..........",
    ".JJ..........",
  ],
  colors: { W: ICON_WHITE, S: STEEL, J: JADE, H: HILT },
};

/** the guard: three spirit swords fanned upright, a spark off the middle one */
const SCREEN: IconArt = {
  rows: [
    ".........",
    "..W.W.W..",
    "..J.J.J..",
    ".J..J..J.",
    ".J..J..J.",
    ".J..J..J.",
    ".D.DDD.D.",
    "..D.D.D..",
    ".........",
  ],
  colors: { W: ICON_WHITE, J: JADE, D: DEEP },
};

const ABILITY_ART: Readonly<Record<YunAbility, IconArt>> = {
  /** swords flying out in a line */
  stream: {
    rows: [
      ".........",
      "D.JJJJJW.",
      ".........",
      "...D.JJJJ",
      "........W",
      "D.JJJJJW.",
      ".........",
      ".........",
      ".........",
    ],
    colors: { W: ICON_WHITE, J: JADE, D: DEEP },
  },
  /** swords spinning in a ring */
  lotus: {
    rows: [
      "...MWM...",
      ".W.....M.",
      ".M.....W.",
      "M...D...M",
      "W..DDD..M",
      "M...D...W",
      ".W.....M.",
      ".M.....W.",
      "...MWM...",
    ],
    colors: { W: ICON_WHITE, M: MINT, D: DEEP },
  },
  /** swords flying out in a spread */
  fan: {
    rows: [
      ".......JW",
      ".....JJ..",
      "...JJ....",
      "D.JJJJJJW",
      "...JJ....",
      ".....JJ..",
      ".......JW",
      ".........",
      ".........",
    ],
    colors: { W: ICON_WHITE, J: JADE, D: DEEP },
  },
  /** swords standing in the floor round a foe's place */
  cage: {
    rows: [
      ".W.....W.",
      ".J..W..J.",
      ".J..J..J.",
      ".J..J..J.",
      ".J.MMM.J.",
      ".J.MMM.J.",
      ".J..J..J.",
      "DDDDDDDDD",
      ".........",
    ],
    colors: { W: ICON_WHITE, J: JADE, D: DEEP, M: MINT },
  },
  /** a tall crescent of qi */
  crescent: {
    rows: [
      "...MW....",
      "....MW...",
      ".....MW..",
      ".....MW..",
      "......MW.",
      ".....MW..",
      ".....MW..",
      "....MW...",
      "...MW....",
    ],
    colors: { W: ICON_WHITE, M: MINT },
  },
};

/** Jade Rain: swords falling point first */
const RAIN: IconArt = {
  rows: ["J...J...J", "J...J...J", "J...J...J", "W...J...W", "....W....", ".........", "D.DDDDD.D"],
  colors: { W: ICON_WHITE, J: MINT, D: DEEP },
};

/** where each ability's dot sits on the switch button */
const DOTS: readonly (readonly [number, number])[] = [
  [4, 0],
  [8, 3],
  [6, 8],
  [2, 8],
  [0, 3],
];

/** the switch button: a dot per ability he knows round a ring, the selected one white */
function abilityDots(selected: YunAbility, known: readonly string[]): IconArt {
  const rows = Array.from({ length: 9 }, () => Array<string>(9).fill("."));
  YUN_ABILITIES.forEach((a, i) => {
    if (!known.includes(a)) return;
    const [x, y] = DOTS[i];
    rows[y][x] = a === selected ? "W" : "J";
  });
  return { rows: rows.map((r) => r.join("")), colors: { W: ICON_WHITE, J: JADE } };
}

/** Yun's button art, per action, selected ability and the abilities he knows */
export function yunArt(action: TouchButtonAction, ability: YunAbility, known: readonly string[]): IconArt {
  switch (action) {
    case "attack":
      return JIAN;
    case "up":
      return JUMP;
    case "dash":
      return DODGE;
    case "guard":
      return SCREEN;
    case "cast":
      return ABILITY_ART[ability];
    case "cycle":
      return abilityDots(ability, known);
    case "ultimate":
      return RAIN;
  }
}
