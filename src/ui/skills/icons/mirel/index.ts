import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { arc, fill, speedLines } from "../parts";
import { floor, foe, heart, seg } from "../ysra/parts";
import {
  ACCENT,
  blade,
  clockFace,
  clockHand,
  clockRing,
  dust,
  EMBER,
  echoArc,
  GOLD,
  GOLD_DARK,
  GOLD_LIGHT,
  gear,
  glint,
  HEART,
  HEART_LIGHT,
  HOUR,
  hand,
  hoop,
  hourglass,
  mage,
  motes,
  pivot,
  rewindArrow,
  SAND,
  smallMage,
  smear,
  staff,
  sun,
  sundial,
  ticks,
  tinyWren,
  WOOD,
  wren,
} from "./parts";

const UP = -Math.PI / 2;

/** an arrow pointing left along row y, from x1 back to its head at x0 */
const backArrow = (s: SpriteCanvas, x0: number, x1: number, y: number, c: Color) =>
  fill(s, () => {
    seg(s, x0, y, x1, y, c);
    seg(s, x0, y, x0 + 2, y - 2, c);
    seg(s, x0, y, x0 + 2, y + 2, c);
  });

/** Mirel's icons: her own sources, her 20 skills and their evolutions (`<id>_evo`, richer and lit gold) */
export const MIREL_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** her staff string: the staff swung, a teal smear tracing its clock ring's path */
  m_staff: (s) => {
    smear(s, 2, 14, 11.6, -1.65, -0.85, HOUR[3], HOUR[5]);
    staff(s, 2, 14, 11, 5, false, 3);
  },
  /** her abilities: the Stillfield, a teal clock ring with twelve ticks round a slowed foe */
  m_field: (s) => {
    clockRing(s, 8, 8, 7);
    foe(s, 8, 8.5, 2.2, -1);
    fill(s, () => {
      s.set(5, 5, HOUR[4]);
      s.set(11, 11, HOUR[4]);
    });
  },
  /** her special Hour of Stillness, and the ultimate skill that upgrades it: a big clock face with two hands */
  m_hour: (s) => {
    clockFace(s, 8, 8, 7.4);
    hand(s, 8, 8, UP, 5, HOUR[5]);
    hand(s, 8, 8, -0.35, 3.4, ACCENT, HOUR[5]);
    pivot(s, 8, 8, SAND.light);
  },

  /** a blow and its pale echo striking again a beat behind it */
  m_echo: (s) => {
    smear(s, 1, 8, 6, -1.2, 1.2, HOUR[3], HOUR[5]);
    echoArc(s, 6, 8, 6, -1.2, 1.2, HOUR[4]);
    echoArc(s, 5, 8, 5, -1, 1, HOUR[2]);
    foe(s, 13.5, 8, 2.2, -1);
  },
  /** Choir of Hours: three echoes rolling off one blow, the last ringing gold */
  m_echo_evo: (s) => {
    smear(s, -3, 8, 6, -1.1, 1.1, HOUR[2], HOUR[3]);
    smear(s, 1, 8, 6.5, -1.15, 1.15, HOUR[3], HOUR[5]);
    smear(s, 5, 8, 7, -1.2, 1.2, GOLD, GOLD_LIGHT);
    glint(s, 14, 2, 1, GOLD_LIGHT);
  },
  /** the staff's clock ring struck down on the floor, a toll ringing out both ways */
  m_toll: (s) => {
    floor(s, 0, 15, 15, HOUR[1]);
    arc(s, 8, 14, 7, Math.PI + 0.2, Math.PI + 0.9, HOUR[3], 0.45);
    arc(s, 8, 14, 7, -0.9, -0.2, HOUR[3], 0.45);
    arc(s, 8, 14, 4.6, Math.PI + 0.25, Math.PI + 0.9, HOUR[4], 0.45);
    arc(s, 8, 14, 4.6, -0.9, -0.25, HOUR[4], 0.45);
    staff(s, 8, 0, 8, 11, false, 2.6);
  },
  /** Midnight: a dark clock face with both hands at twelve under a crescent moon */
  m_toll_evo: (s) => {
    clockFace(s, 9, 9, 6.4, true, HOUR[0]);
    hand(s, 9, 9, UP, 5, GOLD_LIGHT);
    hand(s, 8, 9, UP, 3, GOLD, GOLD);
    fill(s, () => s.pixels([".GG", "G..", "G..", "G..", ".GG"], { G: GOLD_LIGHT }, 1, 0));
    glint(s, 14, 2, 1, GOLD_LIGHT);
  },
  /** a foe stopped inside a ring of ticks, a pale star struck on it */
  m_stillpoint: (s) => {
    ticks(s, 7, 9, 5.6, HOUR[3], HOUR[5]);
    foe(s, 7, 9.5, 3, 1);
    glint(s, 11, 5, 3, HOUR[4]);
  },
  /** a foe frozen in a crystal of still time, two gold strikes stored on it */
  m_stillpoint_evo: (s) => {
    fill(s, () => {
      s.poly(
        [
          [8, 1],
          [14, 6],
          [13, 13],
          [8, 15.5],
          [3, 13],
          [2, 6],
        ],
        HOUR[2],
      );
      seg(s, 4, 6, 7, 3, HOUR[4]);
      seg(s, 3, 7, 3, 11, HOUR[3]);
    });
    foe(s, 8, 9, 2.6, 1);
    glint(s, 13, 2, 2, GOLD_LIGHT);
    glint(s, 14, 12, 1, GOLD);
  },
  /** the staff diving clock ring first onto a ring on the floor */
  m_fallinghour: (s) => {
    fill(s, () => {
      const n = 22;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * TAU;
        if (Math.sin(a) < 0 && k % 2) continue;
        s.set(Math.round(8 + Math.cos(a) * 6.5), Math.round(13.5 + Math.sin(a) * 1.6), HOUR[3]);
      }
    });
    speedLines(s, 5, [2, 5], 2, HOUR[3]);
    fill(s, () => {
      seg(s, 12, 1, 12, 5, HOUR[2]);
      seg(s, 4, 3, 4, 7, HOUR[2]);
    });
    staff(s, 8, 0, 8, 10, false, 2.4);
  },
  /** Sky Clock: the dive landing opens a gold clock ring on the floor, a dial of light rising off it */
  m_fallinghour_evo: (s) => {
    fill(s, () => {
      const n = 26;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * TAU;
        s.set(Math.round(8 + Math.cos(a) * 7), Math.round(13 + Math.sin(a) * 2), k % 3 ? GOLD : GOLD_LIGHT);
      }
    });
    fill(s, () => {
      seg(s, 2, 12, 2, 6, HOUR[3]);
      seg(s, 14, 12, 14, 6, HOUR[3]);
      seg(s, 5, 14, 5, 9, HOUR[4]);
      seg(s, 11, 14, 11, 9, HOUR[4]);
    });
    staff(s, 8, 0, 8, 11, true, 2.4);
    glint(s, 13, 2, 2, GOLD_LIGHT);
  },
  /** a rewind arrow, then a hard forward blow out of it */
  m_backswing: (s) => {
    backArrow(s, 1, 9, 3, HOUR[4]);
    smear(s, 1, 17, 11.5, -1.1, -0.15, HOUR[3], HOUR[5]);
    glint(s, 13, 12, 2, WHITE);
  },
  /** Undone: every rewound blow replays on one foe, gold slashes stacked across it */
  m_backswing_evo: (s) => {
    foe(s, 9, 9.5, 3.6, -1);
    fill(s, () => {
      seg(s, 4, 7, 10, 13, HOUR[4]);
      seg(s, 6, 4, 13, 11, GOLD);
      seg(s, 9, 2, 15, 8, GOLD_LIGHT);
    });
    backArrow(s, 0, 6, 2, GOLD_LIGHT);
  },
  /** the hour keeper hanging still above the floor, sand trickling from under her */
  m_suspend: (s) => {
    floor(s, 1, 14, 15, HOUR[1]);
    mage(s, 7, 11, false, false);
    fill(s, () => {
      seg(s, 3, 13, 11, 13, HOUR[3]);
    });
    motes(s, [
      [6, 14],
      [9, 14],
      [12, 9],
      [1, 6],
    ]);
    speedLines(s, 15, [3, 6], 2, HOUR[3]);
  },
  /** Hanging Hour: she hangs on and on over a foe, grinding sand pouring down on it */
  m_suspend_evo: (s) => {
    mage(s, 5, 9, false, false);
    fill(s, () => seg(s, 1, 10, 9, 10, GOLD));
    motes(s, [
      [4, 11],
      [6, 12],
      [3, 13],
      [7, 14],
      [5, 15],
      [9, 12],
    ]);
    foe(s, 12, 13, 2.4, -1);
    glint(s, 13, 3, 2, GOLD_LIGHT);
  },
  /** the Stopped Moment: the staff raised upright in guard, a rewind arrow winding back round a heart beside it */
  m_longrewind: (s) => {
    rewindArrow(s, 10, 7, 4.6, 0.6, 0.6 - TAU * 0.78, HOUR[2], HOUR[4]);
    heart(s, 10, 7.5, 2.4, HEART, HEART_LIGHT);
    staff(s, 3, 15, 4, 3, false, 2.2);
  },
  /** Second Chance: a heart wound back inside a gold rewind loop */
  m_longrewind_evo: (s) => {
    rewindArrow(s, 8, 8, 6.2, 1.2, 1.2 - TAU * 0.82, GOLD_DARK, GOLD_LIGHT);
    heart(s, 8, 8.5, 3.4, HEART, HEART_LIGHT);
  },
  /** a clock with its hand spun fast, chevrons running past it */
  m_quicken: (s) => {
    hoop(s, 5, 8, 4.5, HOUR[3], ACCENT);
    echoArc(s, 5, 8, 3, -2.6, -1.9, HOUR[4]);
    hand(s, 5, 8, -0.6, 3, HOUR[5]);
    pivot(s, 5, 8, SAND.light);
    fill(s, () => {
      seg(s, 10, 5, 12, 8, HOUR[3]);
      seg(s, 12, 8, 10, 11, HOUR[3]);
      seg(s, 13, 5, 15, 8, HOUR[4]);
      seg(s, 15, 8, 13, 11, HOUR[4]);
    });
  },
  /** Overclock: a gear spun white-hot, gold sparks thrown off its teeth */
  m_quicken_evo: (s) => {
    echoArc(s, 8, 8, 7.4, -2.8, 0.2, GOLD_LIGHT);
    gear(s, 8, 8, 5.6, GOLD, GOLD_LIGHT, 8, 0.2);
    fill(s, () => {
      s.dot(8, 8, 1.8, HOUR[3]);
      s.set(8, 8, WHITE);
    });
    glint(s, 14, 13, 1, WHITE);
    glint(s, 2, 13, 1, GOLD_LIGHT);
  },
  /** her steady stride inside a ring on the floor */
  m_pace: (s) => {
    fill(s, () => {
      const n = 26;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * TAU;
        if (Math.sin(a) < 0 && k % 2) continue;
        s.set(Math.round(8 + Math.cos(a) * 7), Math.round(14 + Math.sin(a) * 1.5), HOUR[3]);
      }
    });
    mage(s, 8, 14, false, false);
    speedLines(s, 4, [8, 11], 3, HOUR[4]);
  },
  /** Calm Eye: an open eye at the heart of her clock ring, the ring moving with it */
  m_pace_evo: (s) => {
    clockRing(s, 8, 8, 7, true);
    fill(s, () => {
      s.poly(
        [
          [3, 8.5],
          [8.5, 5],
          [14, 8.5],
          [8.5, 12],
        ],
        HOUR[5],
      );
    });
    fill(s, () => {
      s.dot(8.5, 8.5, 1.8, HOUR[3]);
      s.set(8, 8, WHITE);
      s.set(9, 9, HOUR[0]);
    });
  },
  /** a sundial on the floor, its gnomon's shadow falling across the hours */
  m_sundial: (s) => {
    sundial(s, 8, 11, 7, 3.4);
    sun(s, 13, 3, 1.4, 2.6);
  },
  /** Solar Court: a wide gold dial under a full sun */
  m_sundial_evo: (s) => {
    sundial(s, 8, 12, 7.5, 3.2, true);
    sun(s, 12.5, 3.5, 2, 3.4);
    glint(s, 2, 2, 1, GOLD_LIGHT);
  },
  /** a teal blade falling onto a marked foe */
  m_foretell: (s) => {
    foe(s, 8, 12, 2.6, -1);
    fill(s, () => {
      s.set(4, 9, HOUR[4]);
      s.set(12, 9, HOUR[4]);
      s.set(4, 15, HOUR[4]);
      s.set(12, 15, HOUR[4]);
    });
    blade(s, 8, 7, 7);
  },
  /** Prophecy: an eye over every foe, a blade falling on each */
  m_foretell_evo: (s) => {
    fill(s, () => {
      s.poly(
        [
          [4, 2.5],
          [8.5, 0],
          [13, 2.5],
          [8.5, 5],
        ],
        GOLD_LIGHT,
      );
    });
    fill(s, () => {
      s.dot(8.5, 2.5, 1.2, HOUR[2]);
      s.set(8, 2, WHITE);
    });
    foe(s, 3, 13.5, 1.9, 1);
    foe(s, 13, 13.5, 1.9, -1);
    blade(s, 3, 10, 4, true);
    blade(s, 13, 10, 4, true);
    blade(s, 8, 13, 6, true);
  },
  /** a giant clock hand sweeping a half circle from its pivot */
  m_handsweep: (s) => {
    echoArc(s, 8, 14, 7, Math.PI, Math.PI * 1.6, HOUR[3]);
    echoArc(s, 8, 14, 4.6, Math.PI, Math.PI * 1.6, HOUR[2]);
    clockHand(s, 8, 14, 13.5, 2.5, HOUR[3], HOUR[5]);
  },
  /** Clockwork: two gold hands sweeping full circles round one pin */
  m_handsweep_evo: (s) => {
    echoArc(s, 8, 8, 7.2, 0, TAU, GOLD_DARK);
    clockHand(s, 8, 8, 2.5, 13, HOUR[3], HOUR[5]);
    clockHand(s, 8, 8, 13.5, 2.5, GOLD, GOLD_LIGHT);
  },
  /** an aging foe, dust falling off it, a small hourglass running out over it */
  m_wither: (s) => {
    hourglass(s, 3, 0, 5, 7, 0.2);
    foe(s, 9.5, 10, 3.6, -1);
    fill(s, () => {
      s.set(8, 12, 0x4a4456);
      s.set(11, 8, 0x4a4456);
      s.set(10, 12, 0x4a4456);
    });
    dust(s, [
      [5, 13],
      [14, 14],
      [6, 15],
      [12, 15],
      [9, 15],
    ]);
  },
  /** Dust to Dust: a foe crumbled to a heap of dust, gold motes rising */
  m_wither_evo: (s) => {
    fill(s, () => {
      s.poly(
        [
          [2, 15.5],
          [5, 12],
          [8, 10.5],
          [11, 12],
          [14, 15.5],
        ],
        0x8a8496,
      );
      seg(s, 5, 13, 8, 11, 0xc4bcc8);
    });
    fill(s, () => {
      s.set(7, 12, 0x2a2436);
      s.set(9, 12, 0x2a2436);
    });
    dust(s, [
      [6, 8],
      [10, 7],
      [8, 5],
      [12, 9],
      [4, 9],
    ]);
    motes(
      s,
      [
        [9, 3],
        [5, 4],
      ],
      GOLD_LIGHT,
      GOLD,
    );
    glint(s, 13, 3, 2, GOLD_LIGHT);
  },
  /** sand grinding round inside her clock ring */
  m_sandstorm: (s) => {
    clockRing(s, 8, 8, 7);
    fill(s, () => {
      for (let k = 0; k < 14; k++) {
        const a = k * 0.55;
        const r = 1 + k * 0.33;
        s.set(Math.round(8 + Math.cos(a) * r), Math.round(8 + Math.sin(a) * r), k % 3 ? SAND.light : SAND.shade);
      }
    });
  },
  /** Sandstorm: a funnel of grinding sand, gold grit whirling in it */
  m_sandstorm_evo: (s) => {
    fill(s, () => {
      const rows = [
        [1, 14, 1],
        [2, 13, 3],
        [4, 12, 5],
        [5, 11, 7],
        [6, 10, 9],
        [7, 10, 11],
        [6, 9, 13],
      ] as const;
      for (const [i, [x0, x1, y]] of rows.entries()) {
        seg(s, x0, y, x1, y, i % 2 ? SAND.shade : SAND.light);
        seg(s, x0 + 1, y + 1, x1 - 1, y + 1, i % 2 ? SAND.light : SAND.shade);
      }
    });
    motes(
      s,
      [
        [0, 4],
        [15, 6],
        [13, 10],
        [3, 9],
      ],
      GOLD_LIGHT,
      GOLD,
    );
    glint(s, 14, 13, 1, GOLD_LIGHT);
  },
  /** a clock cracked across, dust falling out of the break */
  m_entropy: (s) => {
    clockFace(s, 7, 7, 6.2, false, HOUR[2]);
    hand(s, 7, 7, UP + 0.5, 4, HOUR[4], HOUR[5]);
    fill(s, () => {
      seg(s, 2, 3, 5, 5, HOUR[0]);
      seg(s, 5, 5, 4, 7, HOUR[0]);
      seg(s, 4, 7, 8, 9, HOUR[0]);
      seg(s, 8, 9, 7, 11, HOUR[0]);
      seg(s, 7, 11, 10, 13, HOUR[0]);
    });
    dust(s, [
      [11, 14],
      [13, 15],
      [14, 12],
      [9, 15],
    ]);
  },
  /** Heat Death: a dying star stops every foe round it in a gold ring */
  m_entropy_evo: (s) => {
    hoop(s, 8, 8, 7, GOLD_DARK, GOLD_LIGHT);
    fill(s, () => {
      s.dot(8, 8, 3.2, EMBER[1]);
      s.dot(7.5, 7.5, 2, EMBER[2]);
      s.set(7, 7, EMBER[3]);
    });
    foe(s, 3, 3.5, 1.4, 1);
    foe(s, 13, 12.5, 1.4, -1);
    ticks(s, 8, 8, 5.2, HOUR[3], HOUR[5]);
  },
  /** the hour keeper and her pale past self a step behind */
  m_pastself: (s) => {
    mage(s, 4, 14, true, false);
    mage(s, 11, 15);
  },
  /** Many Selves: her with a ghost of her either side, a gold star over them */
  m_pastself_evo: (s) => {
    smallMage(s, 2.5, 13, true);
    smallMage(s, 13.5, 13, true);
    smallMage(s, 8, 15);
    glint(s, 8, 2, 1, GOLD_LIGHT);
  },
  /** a clockwork wren with a winding key on its back */
  m_wren: (s) => {
    wren(s, 8, 12);
    floor(s, 2, 14, 13, HOUR[1]);
    speedLines(s, 3, [3, 6], 2, HOUR[3]);
  },
  /** Cuckoo Chorus: a gold-roofed cuckoo clock, its wrens flying out */
  m_wren_evo: (s) => {
    fill(s, () => {
      s.poly(
        [
          [3, 8],
          [8.5, 2.5],
          [14, 8],
        ],
        GOLD,
      );
      s.block(4, 8, WOOD, 9, 8);
    });
    clockFace(s, 8.5, 11.5, 2.6, true);
    tinyWren(s, 0, 2, true, -1);
    tinyWren(s, 12, 0, true);
    tinyWren(s, 0, 9, false, -1);
  },
  /** three gear planets orbiting a small sun on a tilted ring */
  m_orrery: (s) => {
    fill(s, () => {
      const n = 32;
      for (let k = 0; k < n; k += 2) {
        const a = (k / n) * TAU;
        s.set(Math.round(8 + Math.cos(a) * 6.5), Math.round(8 + Math.sin(a) * 3.4), HOUR[2]);
      }
    });
    fill(s, () => {
      s.dot(8, 8, 2, SAND.light);
      s.set(7, 7, WHITE);
    });
    gear(s, 3, 6.5, 3, HOUR[3], HOUR[5], 8);
    gear(s, 12.5, 11.5, 3, HOUR[3], HOUR[5], 8);
    gear(s, 12, 3.5, 2.2, SAND.shade, SAND.light, 6);
  },
  /** Celestial Clock: a clock face at the centre of its orbit, gold gears riding it */
  m_orrery_evo: (s) => {
    echoArc(s, 8, 8, 6.8, 0, TAU, HOUR[3]);
    clockFace(s, 8, 8, 4.2, true);
    hand(s, 8, 8, UP, 2.4, GOLD_LIGHT);
    gear(s, 3, 3.5, 3, GOLD, GOLD_LIGHT, 8);
    gear(s, 13, 12.5, 3, GOLD, GOLD_LIGHT, 8);
  },
  /** an hourglass of warm sand, half run through */
  m_patience: (s) => {
    hourglass(s, 8, 1, 9, 14, 0.5);
  },
  /** Timeless: a gold hourglass held still inside a clock ring */
  m_patience_evo: (s) => {
    hoop(s, 8, 8, 7.2, HOUR[2], HOUR[4]);
    hourglass(s, 8, 2, 7, 12, 0.6, true);
    glint(s, 14, 2, 1, GOLD_LIGHT);
  },
  /** Eternal Noon: the sun stood at twelve on a clock ringed with twelve hours, both hands pointing up for good */
  m_hour_evo: (s) => {
    ticks(s, 8, 8, 7.2, GOLD, WHITE);
    sun(s, 8, 8, 4, 5.8);
    hand(s, 8, 8, UP, 3.4, HOUR[2], WHITE);
    hand(s, 7, 8, UP, 2.2, HOUR[2], HOUR[3]);
    hoop(s, 8, 8, 1.2, HOUR[3], HOUR[5]);
  },
};
