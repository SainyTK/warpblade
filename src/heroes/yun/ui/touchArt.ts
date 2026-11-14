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
};

/** Jade Rain: swords falling point first */
const RAIN: IconArt = {
  rows: ["J...J...J", "J...J...J", "J...J...J", "W...J...W", "....W....", ".........", "D.DDDDD.D"],
  colors: { W: ICON_WHITE, J: MINT, D: DEEP },
};

/** where each ability's dot sits on the switch button */
const DOTS: readonly (readonly [number, number])[] = [
  [2, 4],
  [6, 4],
];

/** the switch button: a dot per ability, the selected one white */
function abilityDots(selected: YunAbility): IconArt {
  const rows = Array.from({ length: 9 }, () => Array<string>(9).fill("."));
  YUN_ABILITIES.forEach((a, i) => {
    const [x, y] = DOTS[i];
    rows[y][x] = a === selected ? "W" : "J";
  });
  return { rows: rows.map((r) => r.join("")), colors: { W: ICON_WHITE, J: JADE } };
}

/** Yun's button art, per action and selected ability */
export function yunArt(action: TouchButtonAction, ability: YunAbility): IconArt {
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
      return abilityDots(ability);
    case "ultimate":
      return RAIN;
  }
}
