import { CHEST_COLORS } from "./chest";
import { CHEST_DETAIL } from "./effectColors";
import { COIN_GOLD } from "./palette";

/** The chest at full detail, 26 by 20 image pixels, the same size and place as the 13 by 10 art pixel chest. */
export const CHEST_PIXELS = [
  "....DDDDDDDDDDDDDDDDDD....",
  "..DDdWWWWWWWWWWWWWWWWdDD..",
  ".DdWWHHHHHHHHHHHHHHHHWWdD.",
  ".DwWWwwwwwwwwwwwwwwwwWWwD.",
  "DdwWwwwwwwwwwwwwwwwwwwWwdD",
  "DdwwppppppppppppppppppwwdD",
  "DgLLLLLLLLLLLLLLLLLLLLLLgD",
  "DgGGrGGGGGGGGGGGGGGGGrGGgD",
  "DDDDDDDDDDgLLLLgDDDDDDDDDD",
  "DdWWWWWWWWgGKKGgWWWWWWWWdD",
  "DdwwwwwwwwgGKKGgwwwwwwwwdD",
  "DdwwwwwwwwgGGKGgwwwwwwwwdD",
  "DdppppppppgGGGGgppppppppdD",
  "DdwwwwwwwwwggggwwwwwwwwwdD",
  "DdwwwwwwwwwwwwwwwwwwwwwwdD",
  "DddddddddddddddddddddddddD",
  "DgLLLLLLLLLLLLLLLLLLLLLLgD",
  "DgGGrGGGGGGGGGGGGGGGGrGGgD",
  "DDDDDDDDDDDDDDDDDDDDDDDDDD",
  ".DDDDDDDDDDDDDDDDDDDDDDDD.",
] as const;
/** its colors: the chest's own wood and gold, plus the lit lid edge, plank lines, rivets and the keyhole */
export const CHEST_PIXEL_COLORS: Readonly<Record<string, number>> = {
  ...CHEST_COLORS,
  L: COIN_GOLD[4],
  G: COIN_GOLD[3],
  g: COIN_GOLD[1],
  H: CHEST_DETAIL.lidLight,
  p: CHEST_DETAIL.plank,
  r: CHEST_DETAIL.rivet,
  K: CHEST_DETAIL.keyhole,
};
