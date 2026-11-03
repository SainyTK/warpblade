import { FIRE_RAMP, HERO_COLORS as HC, PAL, WORLD_COLORS as WC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { hex, WHITE } from "../../../utils/color";
import { arc, bolt, chevron, drop, fill, flame, gem, ring, snowflake, sparkle, sword } from "./parts";

const MANA = PAL.crystal;
const PURPLE = hex("#5a3aa0");

/** Arcane path icons: mana, runes and the elements */
export const ARCANE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** a flask with a flame curling out of its neck */
  a_flame: (s) => {
    drop(s, 8, 11, 4, FIRE_RAMP[3], FIRE_RAMP[1]);
    fill(s, () => s.stroke(8, 3, 8, 6, 1, HC.trim));
    flame(s, 11, 6, 5);
  },
  /** a row of ice spikes rising out of the floor */
  a_frost_spikes: (s) => {
    fill(s, () => {
      for (const [x, h] of [
        [3, 6],
        [8, 11],
        [13, 8],
      ])
        s.poly(
          [
            [x - 2, 14],
            [x + 2, 14],
            [x, 14 - h],
          ],
          PAL.ice[3],
        );
    });
    fill(s, () => {
      s.stroke(1, 14.5, 15, 14.5, 0.7, PAL.ice[2]);
      s.set(8, 5, WHITE);
    });
  },
  /** a bolt striking a foe and arcing to a second one */
  a_bolt: (s) => {
    bolt(s, [
      [7, 1],
      [4, 7],
      [7, 7],
      [5, 12],
    ]);
    fill(s, () => {
      s.dot(5, 13, 1.6, PAL.volt[2]);
      s.dot(13, 12, 1.6, PAL.volt[2]);
    });
    arc(s, 9, 13, 4, 3.5, 5.9, PAL.volt[4], 0.45);
  },
  /** a crystal at the heart of a bursting ring */
  a_nova: (s) => {
    ring(s, 8, 8, 6.5, MANA[3]);
    gem(s, 8, 8, 5, 8);
    sparkle(s, 3, 3, 2, MANA[4]);
    sparkle(s, 13, 13, 2, MANA[4]);
  },
  a_font: (s) => {
    fill(s, () => {
      s.stroke(8, 2, 8, 5, 1, WC.slabLip);
      s.dot(8, 10, 4.5, MANA[2]);
    });
    fill(s, () => {
      s.dot(8, 11, 3, MANA[3]);
      s.set(6, 9, WHITE);
    });
  },
  a_power: (s) => {
    ring(s, 8, 8, 6.5, PURPLE);
    sparkle(s, 8, 8, 5, PAL.volt[3]);
    fill(s, () => {
      for (const [x, y] of [
        [3, 3],
        [13, 3],
        [3, 13],
        [13, 13],
      ])
        s.set(x, y, PAL.volt[4]);
    });
  },
  /** an hourglass of mana inside a recharge arrow */
  a_sigils: (s) => {
    arc(s, 8, 8, 6.5, -1.2, 3.6, PURPLE, 0.6);
    chevron(s, 2.6, 3.8, 0.44, -0.9, 2.4, PURPLE);
    fill(s, () =>
      s.pixels(
        ["ttttttt", ".hhhhh.", "..hhh..", "...w...", "...l...", "..lll..", ".lllll.", "ttttttt"],
        { t: HC.trim, h: MANA[3], l: MANA[2], w: WHITE },
        5,
        4,
      ),
    );
  },
  a_spellblade: (s) => {
    sword(s, 5, 11, 14, 2);
    fill(s, () => s.dot(4, 12, 2.6, PAL.volt[2]));
    fill(s, () => s.set(3, 11, WHITE));
  },
  a_siphon: (s) => {
    drop(s, 9, 10, 3.5, MANA[3], WHITE);
    arc(s, 8, 8, 6.5, 3.6, 5.8, PAL.heal[3], 0.45);
    fill(s, () => s.set(13, 5, PAL.heal[4]));
  },
  a_quick: (s) => {
    arc(s, 9, 8, 6, 2.2, 4.1, PAL.volt[2], 0.4);
    arc(s, 9, 8, 4, 2.4, 3.9, PAL.volt[3], 0.4);
    fill(s, () => s.dot(10, 8, 2.8, PAL.volt[3]));
    fill(s, () => s.set(9, 7, WHITE));
  },
  a_fire: (s) => flame(s, 8, 15, 13),
  a_frost: (s) => snowflake(s, 8, 8, 6.5),
  a_storm: (s) =>
    bolt(s, [
      [10, 1],
      [5, 8],
      [10, 8],
      [5, 15],
    ]),
  a_archmage: (s) => {
    fill(s, () =>
      s.poly(
        [
          [2, 13],
          [14, 13],
          [9, 2],
        ],
        PURPLE,
      ),
    );
    fill(s, () => {
      s.stroke(1, 13.5, 15, 13.5, 0.7, HC.trim);
      s.set(9, 8, PAL.volt[4]);
      s.set(7, 10, WHITE);
    });
  },
  a_starfall: (s) => {
    fill(s, () => {
      for (let i = 0; i < 7; i++) s.dot(2 + i, 2 + i, 0.6 + i * 0.12, FIRE_RAMP[Math.max(1, 6 - i)]);
    });
    fill(s, () => s.dot(11, 11, 2.8, FIRE_RAMP[3]));
    fill(s, () => s.set(10, 10, WHITE));
  },
  a_tempest: (s) => {
    fill(s, () => {
      s.dot(5, 5, 3, WC.moonMid);
      s.dot(9, 4, 3.5, WC.moonLit);
      s.dot(12, 6, 2.5, WC.moonMid);
    });
    bolt(s, [
      [9, 8],
      [6, 12],
      [9, 12],
      [7, 15],
    ]);
  },
};
