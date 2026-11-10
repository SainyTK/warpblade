import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { arc, chevron, crescent, fill, ring, speedLines } from "../parts";
import { floor, seg } from "../ysra/parts";
import {
  assassin,
  BLOOD,
  backChevron,
  caltrop,
  crow,
  drops,
  eclipseDisc,
  foeBack,
  G,
  GOLD,
  GOLD_LIGHT,
  glint,
  inkPool,
  knife,
  needle,
  POISON,
  puff,
  rose,
  wraith,
} from "./parts";

/** two knives crossed, for his string and its evolutions */
const crossed = (s: SpriteCanvas, gold = false) => {
  knife(s, 3, 13, 12, 3, gold);
  knife(s, 13, 13, 4, 3, gold);
};

/** Tallis's icons: his own sources, his 20 skills and their evolutions (`<id>_evo`, the same parts lit gold) */
export const TALLIS_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** his knife string: two curved knives crossed */
  t_knives: (s) => crossed(s),
  /** his abilities: a Smoke Knot's cloud over its knot */
  t_smoke: (s) => {
    puff(s, 8, 7, 7);
    fill(s, () => {
      s.set(7, 12, G[5]);
      s.set(9, 12, G[5]);
      s.set(8, 13, G[4]);
    });
  },
  /** his special Gloaming: a rose crescent across the dark with him at its end */
  t_gloaming: (s) => {
    fill(s, () => s.dot(8, 8, 7, G[2]));
    crescent(s, 8, 8, 5.5, -2.4, 0.7, G[5]);
    assassin(s, 12, 15, -1);
  },

  /** Backbiter: a knife driven down into a foe's back, the chevron on it */
  t_backbiter: (s) => {
    foeBack(s, 6, 10, 3.5, -1);
    backChevron(s, 10, 10, -1);
    knife(s, 13, 2, 9, 9);
  },
  /** Last Breath: a gold knife through a foe gone dark, its last breath rising */
  t_backbiter_evo: (s) => {
    foeBack(s, 6, 10, 3.5, -1);
    knife(s, 14, 1, 8, 10, true);
    fill(s, () => {
      s.set(4, 4, GOLD_LIGHT);
      s.set(5, 2, GOLD);
      s.set(3, 1, GOLD);
    });
  },
  /** Ambush: a faded figure stepping out behind a foe, a crit star at the knife */
  t_ambush: (s) => {
    foeBack(s, 5, 10, 3, -1);
    assassin(s, 12, 15, -1);
    fill(s, () => {
      s.stroke(8, 5, 10, 7, 0.35, G[5]);
      s.set(8, 3, WHITE);
      s.set(7, 4, G[5]);
      s.set(9, 4, G[5]);
    });
  },
  /** Night Hunter: two foes felled, the figure fading back into the Veil in gold */
  t_ambush_evo: (s) => {
    foeBack(s, 3, 12, 2.5, -1);
    foeBack(s, 8, 13, 2.5, -1);
    assassin(s, 13, 15, -1, true);
    arc(s, 13, 8, 4, -2.6, -0.4, GOLD, 0.4);
  },
  /** Quick Knives: a knife thrown with speed lines behind it */
  t_quickKnives: (s) => {
    knife(s, 4, 9, 13, 6);
    speedLines(s, 5, [6, 9, 12], 4, G[3]);
  },
  /** Knife Storm: a fan of three gold knives */
  t_quickKnives_evo: (s) => {
    knife(s, 3, 8, 14, 2, true);
    knife(s, 3, 8, 15, 8, true);
    knife(s, 3, 8, 14, 14, true);
  },
  /** Turnabout: a heel kick arc and a foe spun round, a turning arrow over it */
  t_turnabout: (s) => {
    foeBack(s, 10, 11, 3, 1);
    arc(s, 10, 6, 3.5, Math.PI, Math.PI * 2, G[4], 0.45);
    chevron(s, 13.5, 6.5, 0, 1, 1.5, G[4]);
    fill(s, () => s.stroke(1, 14, 5, 9, 0.7, G[2]));
  },
  /** Pirouette: three foes turned round by one gold spin */
  t_turnabout_evo: (s) => {
    ring(s, 8, 9, 6, GOLD, 0.4);
    foeBack(s, 3, 12, 2.2, 1);
    foeBack(s, 13, 12, 2.2, -1);
    foeBack(s, 8, 4, 2.2, 1);
  },
  /** Plunge: a knife straight down onto the floor, a shock ring where it lands */
  t_plunge: (s) => {
    knife(s, 8, 2, 8, 11);
    floor(s, 1, 15, 14, G[2]);
    arc(s, 8, 14, 5, Math.PI, Math.PI * 2, G[4], 0.4);
  },
  /** Falling Night: a gold plunge into a dark ring that blinds */
  t_plunge_evo: (s) => {
    knife(s, 8, 1, 8, 10, true);
    fill(s, () => s.stroke(2, 14, 14, 14, 0.8, G[2]));
    arc(s, 8, 14, 6.5, Math.PI, Math.PI * 2, GOLD, 0.45);
    arc(s, 8, 14, 4, Math.PI, Math.PI * 2, G[4], 0.35);
  },
  /** Cut Tendon: a low sweep across a foe's ankle */
  t_cutTendon: (s) => {
    foeBack(s, 9, 7, 3.5, -1);
    fill(s, () => {
      s.stroke(8, 11, 8, 14, 0.5, G[2]);
      s.stroke(11, 11, 11, 14, 0.5, G[2]);
    });
    crescent(s, 6, 9, 7, 0.6, 1.6, G[4]);
    drops(s, 9, 15, 2);
  },
  /** Crippling Line: a gold wave running along the floor under three foes */
  t_cutTendon_evo: (s) => {
    foeBack(s, 4, 9, 2.2, -1);
    foeBack(s, 9, 9, 2.2, -1);
    foeBack(s, 14, 9, 2.2, -1);
    fill(s, () => {
      for (let x = 1; x < 16; x += 2) s.set(x, 13 + (x % 4 === 1 ? 0 : 1), GOLD);
    });
  },
  /** Deep Shadow: the ink pool gliding under a foe's feet */
  t_sink: (s) => {
    foeBack(s, 9, 7, 3.5, 1);
    inkPool(s, 7, 14, 10);
    speedLines(s, 3, [12], 2, G[3]);
  },
  /** Shadow Tide: a foe dragged half down into a gold-eyed pool */
  t_sink_evo: (s) => {
    foeBack(s, 8, 11, 3.5, 1);
    inkPool(s, 8, 14, 14, true);
    fill(s, () => s.stroke(3, 13, 13, 13, 0.6, G[2]));
  },
  /** Quiet Step: a faded foot over a row of soft prints */
  t_quietStep: (s) => {
    fill(s, () => {
      for (const x of [2, 7, 12]) s.block(x, x === 7 ? 11 : 13, G[3], 2, 1);
    });
    assassin(s, 8, 10, 1);
  },
  /** Phantom Walk: a gold trail of smoke behind the walking figure */
  t_quietStep_evo: (s) => {
    puff(s, 3, 11, 3, true);
    puff(s, 7, 13, 2.5, true);
    assassin(s, 12, 15, 1, true);
  },
  /** Night Leap: the figure jumping high in the air, a rose arc under him */
  t_nightLeap: (s) => {
    assassin(s, 9, 10, 1);
    arc(s, 7, 14, 5, Math.PI * 1.1, Math.PI * 1.9, G[4], 0.4);
    floor(s, 1, 15, 15, G[2]);
  },
  /** Raven Drop: a gold-winged dive straight down */
  t_nightLeap_evo: (s) => {
    crow(s, 4, 4, 1, true);
    knife(s, 10, 2, 10, 12, true);
    floor(s, 4, 15, 15, G[2]);
  },
  /** Needle Fan: five needles spreading out */
  t_needles: (s) => {
    for (const [x, y, dx, dy] of [
      [14, 3, 0.8, -0.6],
      [15, 6, 1, -0.25],
      [15, 9, 1, 0],
      [15, 12, 1, 0.25],
      [14, 15, 0.8, 0.6],
    ] as const)
      needle(s, x, y, dx, dy);
    fill(s, () => s.dot(3, 9, 1.4, G[4]));
  },
  /** Iron Rain: gold needles falling on two foes */
  t_needles_evo: (s) => {
    foeBack(s, 4, 12, 2.5, -1);
    foeBack(s, 12, 12, 2.5, -1);
    for (const x of [2, 5, 8, 11, 14]) needle(s, x, 6 + (x % 3), 0, 1, true);
  },
  /** Mark of Dusk: a rose mark over a foe */
  t_markDusk: (s) => {
    foeBack(s, 8, 11, 3.5, -1);
    fill(s, () => {
      s.set(8, 4, G[5]);
      s.set(7, 3, G[4]);
      s.set(9, 3, G[4]);
      s.set(8, 2, G[3]);
    });
    ring(s, 8, 11, 5.5, G[3], 0.35);
  },
  /** Death Sentence: a gold mark over a foe with a knife crossed through it */
  t_markDusk_evo: (s) => {
    foeBack(s, 8, 11, 3.5, -1);
    fill(s, () => {
      s.set(8, 4, GOLD_LIGHT);
      s.set(7, 3, GOLD);
      s.set(9, 3, GOLD);
      s.set(8, 2, GOLD);
    });
    knife(s, 13, 6, 4, 15, true);
  },
  /** Caltrops: a row of spikes on the floor */
  t_caltrops: (s) => {
    for (const x of [3, 7, 11, 14]) caltrop(s, x, 13 - (x % 2));
    floor(s, 1, 15, 14, G[2]);
  },
  /** Thorn Road: gold caltrops trailing behind an ink pool */
  t_caltrops_evo: (s) => {
    inkPool(s, 12, 13, 6, true);
    for (const x of [2, 5, 8]) caltrop(s, x, 13, true);
    floor(s, 1, 15, 14, G[2]);
  },
  /** Open Veins: a cut on a foe's back with blood running from it */
  t_openVeins: (s) => {
    foeBack(s, 7, 8, 4, -1);
    fill(s, () => s.stroke(9, 6, 11, 9, 0.4, BLOOD));
    drops(s, 10, 12, 3);
  },
  /** Exsanguinate: a foe bursting in a gold-rimmed spray */
  t_openVeins_evo: (s) => {
    ring(s, 8, 8, 6, GOLD, 0.4);
    foeBack(s, 8, 8, 3, -1);
    drops(s, 1, 3, 3);
    drops(s, 11, 13, 3);
  },
  /** Nightshade: a knife edge dripping green poison */
  t_nightshade: (s) => {
    knife(s, 3, 13, 13, 3);
    fill(s, () => {
      s.set(10, 7, POISON);
      s.set(11, 9, POISON);
      s.set(11, 11, POISON);
    });
  },
  /** Black Lotus: a dark lotus of poison with gold petals */
  t_nightshade_evo: (s) => {
    fill(s, () => {
      s.dot(8, 10, 2.5, G[2]);
      s.poly(
        [
          [8, 3],
          [10, 8],
          [6, 8],
        ],
        GOLD,
      );
      s.poly(
        [
          [2, 7],
          [7, 10],
          [4, 12],
        ],
        GOLD,
      );
      s.poly(
        [
          [14, 7],
          [9, 10],
          [12, 12],
        ],
        GOLD,
      );
    });
    fill(s, () => s.set(8, 10, POISON));
  },
  /** Ink Wound: a blot of ink spreading from a knife wound */
  t_inkWound: (s) => {
    foeBack(s, 7, 8, 4, -1);
    fill(s, () => {
      s.dot(9, 9, 1.6, G[0]);
      s.set(11, 11, G[2]);
      s.set(8, 12, G[2]);
    });
    fill(s, () => s.set(9, 8, G[4]));
  },
  /** Spreading Night: ink running between three foes, gold at the heart */
  t_inkWound_evo: (s) => {
    foeBack(s, 3, 6, 2.4, -1);
    foeBack(s, 13, 6, 2.4, -1);
    foeBack(s, 8, 12, 2.4, -1);
    fill(s, () => {
      seg(s, 4, 8, 7, 11, G[2]);
      seg(s, 12, 8, 9, 11, G[2]);
      s.set(8, 9, GOLD_LIGHT);
    });
  },
  /** Gloam Crows: three crows diving at a foe */
  t_crows: (s) => {
    foeBack(s, 11, 12, 3, -1);
    crow(s, 4, 3);
    crow(s, 8, 6);
    crow(s, 3, 9);
  },
  /** Murder of Crows: a gold-eyed flock filling the sky */
  t_crows_evo: (s) => {
    for (const [x, y] of [
      [3, 3],
      [8, 2],
      [13, 4],
      [5, 8],
      [11, 9],
      [7, 13],
    ] as const)
      crow(s, x, y, x < 8 ? 1 : -1, true);
  },
  /** Shadow Double: a dark copy of him behind a foe */
  t_double: (s) => {
    foeBack(s, 7, 11, 3, 1);
    fill(s, () => {
      s.poly(
        [
          [10, 15],
          [14, 15],
          [13.5, 9],
          [10.5, 9],
        ],
        G[2],
      );
      s.dot(12, 7, 1.8, G[2]);
    });
    fill(s, () => s.set(11, 7, G[5]));
    assassin(s, 3, 15, 1);
  },
  /** Two Moons: two gold-eyed shades either side of a foe */
  t_double_evo: (s) => {
    foeBack(s, 8, 11, 3, 1);
    for (const x of [2.5, 13.5])
      fill(s, () => {
        s.poly(
          [
            [x - 2, 15],
            [x + 2, 15],
            [x + 1.5, 9],
            [x - 1.5, 9],
          ],
          G[2],
        );
        s.dot(x, 7, 1.8, G[2]);
      });
    fill(s, () => {
      s.set(3.5, 7, GOLD_LIGHT);
      s.set(12.5, 7, GOLD_LIGHT);
    });
  },
  /** Hollow Wraith: a wraith rising from a fallen foe */
  t_wraith: (s) => {
    wraith(s, 8, 12);
    fill(s, () => s.stroke(3, 14, 13, 14, 0.8, G[2]));
  },
  /** Legion of Dusk: three gold-eyed wraiths */
  t_wraith_evo: (s) => {
    wraith(s, 3, 14, true);
    wraith(s, 8, 12, true);
    wraith(s, 13, 14, true);
  },
  /** Shroud: the hood drawn close, a rose rim round it */
  t_shroud: (s) => {
    arc(s, 8, 9, 6.5, Math.PI * 0.9, Math.PI * 2.1, G[4], 0.45);
    assassin(s, 8, 15, 1);
  },
  /** Endless Night: the hood under a dark moon with a gold rim */
  t_shroud_evo: (s) => {
    eclipseDisc(s, 8, 5, 3.5, true);
    assassin(s, 8, 15, 1, true);
  },
  /** Eclipse: a dark sun ringed in rose over a foe */
  t_eclipse: (s) => {
    eclipseDisc(s, 8, 6, 4.5);
    foeBack(s, 4, 13, 2.4, -1);
    foeBack(s, 12, 13, 2.4, -1);
  },
  /** Night Without End: the dark sun in gold over the whole floor, a crescent cut through it */
  t_eclipse_evo: (s) => {
    eclipseDisc(s, 8, 7, 5.5, true);
    crescent(s, 8, 7, 4, -2.4, 0.6, glint(true));
    fill(s, () => s.stroke(1, 15, 15, 15, 0.6, rose(true)));
  },
};
