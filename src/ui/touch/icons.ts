import { SpriteCanvas } from "../../engine/sprite";
import type { Color } from "../../types/color";
import type { Element } from "../../types/spell";
import type { SpriteImage } from "../../types/sprite";
import type { TouchButtonAction } from "../../types/touch";
import { hex } from "../../utils/color";

/** Button icons as pixel rows, one character per pixel, "." empty; each gets a dark outline. */
interface IconArt {
  rows: readonly string[];
  colors: Record<string, Color>;
}

const OUTLINE = hex("#0a0612");
const WHITE = hex("#ffffff");

const SWORD: IconArt = {
  rows: [
    "............W",
    "...........WC",
    "..........WC.",
    ".........WC..",
    "........WC...",
    ".......WC....",
    "...B..WC.....",
    "....BWC......",
    ".....B.......",
    "....G.B......",
    "...G...B.....",
    "..G..........",
    ".P...........",
  ],
  colors: { W: WHITE, C: hex("#7fe3ff"), B: hex("#e0ac48"), G: hex("#7a5236"), P: hex("#ffd27a") },
};

const JUMP: IconArt = {
  rows: ["....W....", "...WWW...", "..WW.WW..", ".WW...WW.", "....M....", "...MMM...", "..MM.MM..", ".MM...MM."],
  colors: { W: WHITE, M: hex("#9a94c4") },
};

const DASH: IconArt = {
  rows: [
    "....W....",
    "....WW...",
    "VV..WWW..",
    "...VWWWW.",
    "VVVVWWWWW",
    "...VWWWW.",
    "VV..WWW..",
    "....WW...",
    "....W....",
  ],
  colors: { W: WHITE, V: hex("#b4a8ff") },
};

const WARP: IconArt = {
  rows: [
    "....W....",
    "...WAC...",
    "..WAACC..",
    ".WAACCCB.",
    "WAACCCCBB",
    ".ACCCCBB.",
    "..CCCBB..",
    "...CBB...",
    "....B....",
  ],
  colors: { W: WHITE, A: hex("#a8ecff"), C: hex("#5ec8ef"), B: hex("#2f86c4") },
};

const NOVA: IconArt = {
  rows: [
    ".....W.....",
    ".....P.....",
    "..K..P..K..",
    "....PWP....",
    "...PWWWP...",
    "WPPPWWWPPPW",
    "...PWWWP...",
    "....PWP....",
    "..K..P..K..",
    ".....P.....",
    ".....W.....",
  ],
  colors: { W: WHITE, P: hex("#ff7ae0"), K: hex("#ffc8f2") },
};

const SPELLS: Record<Element, IconArt> = {
  fire: {
    rows: [
      "....F....",
      "...FF....",
      "...FOF.F.",
      "..FOOFFF.",
      ".FOYYOOF.",
      ".FOYWYOF.",
      "FOYWWWYOF",
      ".FOYWYOF.",
      "..FFOFF..",
    ],
    colors: { F: hex("#f2561d"), O: hex("#ff8a2a"), Y: hex("#ffe26b"), W: hex("#fff3a6") },
  },
  ice: {
    rows: [
      "....W....",
      ".W..C..W.",
      "..W.C.W..",
      "...CCC...",
      "WCCCWCCCW",
      "...CCC...",
      "..W.C.W..",
      ".W..C..W.",
      "....W....",
    ],
    colors: { W: WHITE, C: hex("#8fd3f2") },
  },
  volt: {
    rows: [
      "....WWW..",
      "...WYY...",
      "..WYY....",
      ".WYYYYYY.",
      "....YYV..",
      "...YYV...",
      "..YYV....",
      "..YV.....",
      ".V.......",
    ],
    colors: { W: WHITE, Y: hex("#a9c8ff"), V: hex("#6f8bff") },
  },
};

/** the three elements in a ring; the selected one gets a white core */
function cycleArt(selected: Element): IconArt {
  const rows = ["...F...", "..FFF..", "...F...", ".......", ".I...V.", "III.VVV", ".I...V."];
  const core: Record<Element, [number, number]> = { fire: [3, 1], ice: [1, 5], volt: [5, 5] };
  const [cx, cy] = core[selected];
  const marked = rows.map((row, y) => (y === cy ? `${row.slice(0, cx)}W${row.slice(cx + 1)}` : row));
  return {
    rows: marked,
    colors: { F: hex("#ff8a2a"), I: hex("#8fd3f2"), V: hex("#a9a0ff"), W: WHITE },
  };
}

function artFor(action: TouchButtonAction, element: Element): IconArt {
  switch (action) {
    case "attack":
      return SWORD;
    case "up":
      return JUMP;
    case "dash":
      return DASH;
    case "warp":
      return WARP;
    case "cast":
      return SPELLS[element];
    case "cycle":
      return cycleArt(element);
    case "ultimate":
      return NOVA;
  }
}

const cache = new Map<string, SpriteImage>();

/** a button's icon with its outline, drawn once per action and element */
export function touchIcon(action: TouchButtonAction, element: Element): SpriteImage {
  const key = `${action}:${element}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const art = artFor(action, element);
  const w = Math.max(...art.rows.map((r) => r.length));
  const canvas = new SpriteCanvas(w + 2, art.rows.length + 2, 0, 0);
  canvas.begin();
  canvas.pixels(art.rows, art.colors, 1, 1);
  canvas.commit(false);
  canvas.outline(OUTLINE);
  const icon = canvas.snapshot();
  cache.set(key, icon);
  return icon;
}
