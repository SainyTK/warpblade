import { FIRE_RAMP, COIN_GOLD as G, KAEL_COLORS as HC, PAL, WORLD_COLORS as WC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { hex, WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";
import { chevron, fill, flame, ring, sparkle, sword } from "./parts";

const BLOOD = { h: hex("#e0405a"), l: hex("#ffb0bc"), w: WHITE, d: hex("#7e1530") };
const PURPLE = hex("#5a3aa0");
const COIN = { o: G[1], h: G[4], g: G[3], d: G[2] };

/** a small coin, its top left at (x, y) */
function coin(s: SpriteCanvas, x: number, y: number): void {
  fill(s, () => s.pixels([".ooo.", "ohggo", "oggdo", "ogddo", ".ooo."], COIN, x, y));
}

/** Shop icons: one for every stat and skill sold between runs */
export const SHOP_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  vitality: (s) => {
    fill(s, () =>
      s.pixels(
        [
          ".hhh...hhh.",
          "hlwhh.hhhhh",
          "hlhhhhhhhhh",
          "hhhhhhhhhhh",
          "hhhhhhhhhhd",
          ".hhhhhhhhd.",
          "..hhhhhhd..",
          "...hhhhd...",
          "....hhd....",
          ".....d.....",
        ],
        BLOOD,
        2,
        3,
      ),
    );
  },
  edge: (s) => {
    fill(s, () =>
      s.pixels(["..llllllll", ".lsssssssd", "dddddddddd"], { l: WC.slabLip, s: WC.slabEdge, d: WC.slab }, 4, 11),
    );
    sword(s, 3, 10, 14, 3);
    fill(s, () => {
      s.set(12, 8, FIRE_RAMP[2]);
      s.set(13, 9, FIRE_RAMP[4]);
      s.set(14, 7, FIRE_RAMP[3]);
    });
  },
  arcana: (s) => {
    fill(s, () =>
      s.pixels(
        [
          ".ppppp.ppppp.",
          "pwwwwwpwwwwwp",
          "pwmmwwpwwmmwp",
          "pwwwwwpwwwwwp",
          "pwmmmwpwmmwwp",
          "pwwwwwpwwwwwp",
          "pppppppppppp",
        ],
        { p: PURPLE, w: hex("#e8e6f6"), m: PAL.volt[2] },
        2,
        7,
      ),
    );
    sparkle(s, 8, 3, 2.5, PAL.volt[3]);
  },
  wellspring: (s) => {
    fill(s, () =>
      s.pixels(
        [
          "...ccc...",
          "...gwg...",
          "...geg...",
          "..geeeg..",
          ".geeeeeg.",
          "gmwmmmmmg",
          "gmmmmmmmg",
          "gmmmmmmlg",
          ".gmmmmlg.",
          "..ggggg..",
        ],
        { c: HC.bootLight, g: PAL.crystal[4], e: PAL.crystal[0], m: PAL.crystal[2], l: PAL.crystal[1], w: WHITE },
        4,
        3,
      ),
    );
  },
  precision: (s) => {
    ring(s, 8, 8, 5, HC.trim);
    fill(s, () => {
      s.stroke(8, 1, 8, 3, 0.4, WC.mist);
      s.stroke(8, 13, 8, 15, 0.4, WC.mist);
      s.stroke(1, 8, 3, 8, 0.4, WC.mist);
      s.stroke(13, 8, 15, 8, 0.4, WC.mist);
    });
    fill(s, () => {
      s.dot(8, 8, 1.6, BLOOD.h);
      s.set(7, 7, WHITE);
    });
  },
  fleet: (s) => {
    fill(s, () =>
      s.pixels(
        ["..bbbb...", "..bLbb...", "..bLbb...", "..bLbbb..", "..bLbbbbb", ".bbbbbbbb", "ssssssssss"],
        { b: HC.boot, L: HC.bootLight, s: HC.hilt },
        5,
        6,
      ),
    );
    fill(s, () => s.pixels(["ww...", ".www.", "..www", ".ww.."], { w: PAL.ice[4] }, 2, 6));
  },
  lungs: (s) => {
    chevron(s, 8, 1.5, 0, -1, 3.5, PAL.heal[3]);
    chevron(s, 8, 5, 0, -1, 3.5, PAL.heal[2]);
    fill(s, () =>
      s.pixels(
        ["kkkkkkkkkkkkkk", "kGGGGGnGGGGGGk", "kgggggnggggggk", "kkkkkkkkkkkkkk"],
        { k: WC.slabEdge, G: PAL.heal[3], g: PAL.heal[2], n: WC.slabUnder },
        1,
        10,
      ),
    );
  },
  lodestone: (s) => {
    fill(s, () =>
      s.pixels(
        ["tt....tt", "tt....tt", "rr....rr", "rr....rr", "rL....rr", "rLr..rrr", ".rrrrrr.", "..rrrr.."],
        { t: WC.slabLip, r: BLOOD.h, L: BLOOD.l },
        1,
        7,
      ),
    );
    fill(s, () => {
      s.set(9, 6, G[3]);
      s.set(10, 5, G[2]);
    });
    coin(s, 10, 1);
  },
  warpShock: (s) => {
    fill(s, () => {
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * TAU;
        s.set(8 + Math.cos(a) * 7, 12.5 + Math.sin(a) * 2.5, PAL.crystal[3]);
      }
    });
    sword(s, 8, 2, 8, 12);
    sparkle(s, 3, 5, 1.5, PAL.crystal[4]);
    sparkle(s, 13, 6, 1.5, PAL.crystal[4]);
  },
  headStart: (s) => {
    chevron(s, 8, 2, 0, -1, 4, G[4]);
    chevron(s, 8, 6.5, 0, -1, 4, G[3]);
    chevron(s, 8, 11, 0, -1, 4, G[2]);
  },
  lastLight: (s) => {
    fill(s, () =>
      s.pixels(
        ["..wwww..", "..wwwc..", "..wwwc..", "..wwwc..", "..wwwc..", "..wwcc..", "bbbbbbbb", ".bbbbbb."],
        { w: hex("#f0e6c8"), c: hex("#c9b88a"), b: HC.trim },
        4,
        8,
      ),
    );
    flame(s, 8, 8, 6);
    sparkle(s, 13, 4, 2, PAL.heal[4]);
  },
  rerolls: (s) => {
    fill(s, () =>
      s.pixels(
        [
          "....llllll..",
          "..llhhhhhhl.l",
          ".lhh.....lhll",
          ".lh.....lhhhl",
          "lh.......llll",
          "lh..........",
          "...........dc",
          "...........dc",
          "cccc.......dc",
          "cddd......dc.",
          "c.ddc....dcc.",
          "...ccddddcc..",
          ".....cccc....",
        ],
        { l: PAL.crystal[2], h: PAL.crystal[4], c: PAL.crystal[1], d: PAL.crystal[3] },
        2,
        2,
      ),
    );
  },
  skips: (s) => {
    fill(s, () =>
      s.pixels(
        [
          "h.....h.....",
          "hv....hv....",
          "hvv...hvv...",
          "hvvv..hvvv..",
          "hvvvv.hvvvv.",
          "hvvvvvhvvvvv",
          "hvvvd.hvvvd.",
          "hvvd..hvvd..",
          "hvd...hvd...",
          "hd....hd....",
          "d.....d.....",
        ],
        { h: PAL.volt[4], v: PAL.volt[3], d: PAL.volt[2] },
        3,
        3,
      ),
    );
  },
  banishes: (s) => {
    fill(s, () =>
      s.pixels(
        [
          "....rrrrrr....",
          "..rrhhhhhhrr..",
          ".rhh......rrr.",
          ".rh......rrrr.",
          "rh......rrr.rr",
          "rh.....rrr..rr",
          "rh....rrr...rr",
          "rr...rrr....rd",
          "rr..rrr.....rd",
          "rr.rrr......rd",
          ".rrrr......rd.",
          ".rrr......rdd.",
          "..rrddddddd...",
          "....dddddd....",
        ],
        { r: BLOOD.h, h: BLOOD.l, d: BLOOD.d },
        1,
        1,
      ),
    );
  },
};
