import { COIN_GOLD as G, KAEL_COLORS as HC, PAL } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { CharmId } from "../../../types/build";
import { hex, WHITE } from "../../../utils/color";
import { arc, fill, sparkle, speedLines } from "./parts";

const BLOOD = { h: hex("#e0405a"), l: hex("#ffb0bc"), w: WHITE, d: hex("#7e1530") };
const EMBER = { h: hex("#ff8a2a"), l: hex("#ffe26b"), w: WHITE, d: hex("#c9281f") };
const GOLD = { o: G[1], g: G[3], h: G[4], d: G[2] };

/** Charm icons by `charm_<id>`: one shape and one colour each, so a build strip reads at a glance */
export const CHARM_ICONS: Record<`charm_${CharmId}`, (s: SpriteCanvas) => void> = {
  /** a clenched fist, glowing hot */
  charm_might: (s) => {
    fill(s, () =>
      s.pixels(
        [
          "..ddd.ddd.ddd..",
          ".dlwhdlwhdlwhd.",
          ".dhhhdhhhdhhhd.",
          ".dhhhdhhhdhhhdd",
          "ddddddddddhhhhd",
          "dlllllllldhhhhd",
          "dhhhhhhhhhhhhhd",
          ".dhhhhhhhhhhhd.",
          "..dhhhhhhhhhd..",
          "...dhhhhhhhd...",
          "...dhhhhhhhd...",
          "...ddddddddd...",
        ],
        EMBER,
        0,
        2,
      ),
    );
  },
  /** a clock face with its hands racing, speed lines behind */
  charm_haste: (s) => {
    fill(s, () => s.dot(9.5, 8.5, 5.6, PAL.volt[1]));
    fill(s, () => s.dot(9.5, 8.5, 4.4, PAL.volt[4]));
    fill(s, () => {
      s.stroke(9.5, 8.5, 9.5, 5, 0.45, PAL.volt[0]);
      s.stroke(9.5, 8.5, 12, 9.8, 0.45, PAL.volt[0]);
      s.set(9, 8, PAL.volt[2]);
    });
    fill(s, () => s.pixels(["ggg"], GOLD, 8, 1));
    speedLines(s, 3.5, [5, 8.5, 12], 3, PAL.volt[3]);
  },
  /** three daggers fanned out from one grip */
  charm_multitude: (s) => {
    const dagger = (x0: number, y0: number, x1: number, y1: number): void => {
      const L = Math.hypot(x1 - x0, y1 - y0);
      const ux = (x1 - x0) / L;
      const uy = (y1 - y0) / L;
      fill(s, () => {
        s.stroke(x0, y0, x0 + ux * 2, y0 + uy * 2, 0.5, HC.hilt);
        s.stroke(
          x0 + ux * 2.5 - uy * 1.6,
          y0 + uy * 2.5 + ux * 1.6,
          x0 + ux * 2.5 + uy * 1.6,
          y0 + uy * 2.5 - ux * 1.6,
          0.5,
          HC.trim,
        );
        s.stroke(x0 + ux * 3.5, y0 + uy * 3.5, x1, y1, 0.75, HC.blade);
        s.set(x1, y1, WHITE);
      });
    };
    dagger(4, 13, 1.5, 3);
    dagger(12, 13, 14.5, 3);
    dagger(8, 15, 8, 1);
  },
  /** a ring spreading out from a point, arrows pushing it wider */
  charm_reach: (s) => {
    arc(s, 8, 8, 6.4, 0, Math.PI * 2, PAL.crystal[3], 0.55);
    arc(s, 8, 8, 3.6, 0, Math.PI * 2, PAL.crystal[2], 0.5);
    fill(s, () => {
      s.dot(8, 8, 1, PAL.crystal[5]);
      s.set(8, 8, WHITE);
    });
  },
  /** an hourglass of gold, sand still in the top */
  charm_persistence: (s) => {
    fill(s, () =>
      s.pixels(
        [
          "oggggggggo",
          ".oddddddo.",
          ".o.ssss.o.",
          "..o.ss.o..",
          "...o..o...",
          "...osso...",
          "..o.ss.o..",
          ".o.ssss.o.",
          ".osssssso.",
          "oggggggggo",
        ],
        { ...GOLD, s: PAL.ice[4] },
        3,
        3,
      ),
    );
  },
  /** a feather with speed lines trailing */
  charm_swiftness: (s) => {
    fill(s, () =>
      s.pixels(
        [
          "..........lw",
          "........llwh",
          "......llhwhh",
          ".....lhhwhhd",
          "....lhhwhhd.",
          "...lhhwhhd..",
          "...lhwhhd...",
          "..lhwhdd....",
          "..lwhd......",
          ".wd.........",
          "w...........",
        ],
        { l: PAL.ice[4], h: PAL.ice[3], w: WHITE, d: PAL.ice[2] },
        3,
        2,
      ),
    );
    speedLines(s, 4, [4, 7], 3, PAL.ice[2]);
  },
  /** a four-leaf clover with a glint of gold */
  charm_fortune: (s) => {
    fill(s, () =>
      s.pixels(
        [
          "..hh...hh..",
          ".hlhh.hlhh.",
          ".hhhhdhhhd.",
          "..hhhdhhd..",
          "...dd.dd...",
          "..hhhdhhh..",
          ".hlhhdhhhd.",
          ".hhhd.hhhd.",
          "..dd..sdd..",
          "......s....",
          ".....s.....",
        ],
        { h: PAL.heal[2], l: PAL.heal[3], d: PAL.heal[1], s: PAL.heal[1] },
        2,
        2,
      ),
    );
    sparkle(s, 13, 3, 1.6, G[4]);
  },
  /** a heart with a green mend cross */
  charm_vigor: (s) => {
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
        1,
        2,
      ),
    );
    fill(s, () => s.pixels([".h.", "hwh", ".h."], { h: PAL.heal[2], w: PAL.heal[4] }, 11, 9));
  },
  /** an open eye, its iris lit */
  charm_insight: (s) => {
    fill(s, () =>
      s.pixels(
        [
          "....ddddd....",
          "..dd.....dd..",
          ".d..wwiww..d.",
          "d..wwippiw..d",
          ".d..wiipi..d.",
          "..dd..i..dd..",
          "....ddddd....",
        ],
        { d: PAL.shadow[4], w: PAL.shadow[5], i: PAL.volt[2], p: PAL.shadow[0] },
        1,
        5,
      ),
    );
    fill(s, () => {
      s.set(7, 2, PAL.shadow[4]);
      s.set(3, 3, PAL.shadow[3]);
      s.set(11, 3, PAL.shadow[3]);
    });
  },
  /** a tuning fork ringing, waves on both sides */
  charm_resonance: (s) => {
    fill(s, () =>
      s.pixels(
        ["g...g", "h...g", "h...g", "h...g", "h...d", "hg.gd", ".gdd.", "..g..", "..g..", "..d..", ".ddd."],
        GOLD,
        6,
        3,
      ),
    );
    arc(s, 8, 6, 5.2, Math.PI * 0.75, Math.PI * 1.25, PAL.volt[3], 0.45);
    arc(s, 8, 6, 5.2, -Math.PI * 0.25, Math.PI * 0.25, PAL.volt[3], 0.45);
    arc(s, 8, 6, 7.4, Math.PI * 0.8, Math.PI * 1.2, PAL.volt[2], 0.45);
    arc(s, 8, 6, 7.4, -Math.PI * 0.2, Math.PI * 0.2, PAL.volt[2], 0.45);
  },
};
