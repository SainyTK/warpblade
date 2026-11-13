import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { arc, bolt, chevron, fill, ring, sparkle, speedLines } from "../parts";
import {
  B,
  beatDisc,
  beatRing,
  boot,
  CLASH,
  crash,
  curtain,
  cymbal,
  DRUM,
  drum,
  drummer,
  ear,
  floor,
  fork,
  GOLD,
  GOLD_DARK,
  GOLD_LIGHT,
  gong,
  horn,
  jaggedNote,
  mallet,
  metronome,
  moon,
  note,
  seg,
  smallDrummer,
  soundRing,
  WOOD_LIGHT,
  waves,
} from "./parts";

/** two mallets crossed, for his string and its evolutions */
const crossed = (s: SpriteCanvas, gold = false) => {
  mallet(s, 3, 14, 11, 5, gold);
  mallet(s, 13, 14, 5, 5, gold);
};

/** each drawer with his beat behind it, lit gold for an evolution */
const withBeat = (icons: Record<string, (s: SpriteCanvas) => void>): Record<string, (s: SpriteCanvas) => void> =>
  Object.fromEntries(
    Object.entries(icons).map(([id, draw]) => [
      id,
      (s: SpriteCanvas) => {
        beatDisc(s, id.endsWith("_evo"));
        draw(s);
      },
    ]),
  );

/** Jory's icons: his own sources, his 20 skills and their evolutions (`<id>_evo`, the same parts lit gold) */
export const JORY_ICONS: Record<string, (s: SpriteCanvas) => void> = withBeat({
  /** his mallet string: two felt mallets crossed */
  j_mallets: (s) => crossed(s),
  /** his abilities: Boom, the drum with a ring of sound round it */
  j_boom: (s) => {
    soundRing(s, 8, 9, 6.5);
    drum(s, 8, 13, 4, 5);
  },
  /** his special Drumroll, and the Drumroll skill that upgrades it: the drum planted under both mallets, rings widening */
  j_drumroll: (s) => {
    beatRing(s, 8, 13, 7.5, 2, B[3]);
    beatRing(s, 8, 13, 5.5, 1.3, B[4]);
    drum(s, 8, 13, 3, 4);
    mallet(s, 2, 8, 5, 4);
    mallet(s, 14, 8, 11, 4);
    fill(s, () => {
      s.set(8, 2, WHITE);
      s.set(7, 4, B[5]);
      s.set(9, 4, B[5]);
    });
  },
  /** Heavy Accent: a mallet landing on a struck point, an accent ring bursting round it */
  j_accent: (s) => {
    soundRing(s, 6, 10, 4.5, false, 0.6);
    crash(s, 6, 10, 2.8, B[5]);
    fill(s, () => s.dot(6, 10, 1, WHITE));
    mallet(s, 14, 2, 10, 6);
  },
  /** Thunderclap: two gold mallets clapped together, thunder bursting from the clap */
  j_accent_evo: (s) => {
    mallet(s, 2, 14, 6.5, 8, true);
    mallet(s, 14, 14, 9.5, 8, true);
    crash(s, 8, 6, 4, GOLD_LIGHT);
    fill(s, () => s.dot(8, 6, 1, WHITE));
    bolt(
      s,
      [
        [3, 2],
        [4, 5],
        [2, 6],
      ],
      GOLD,
    );
    bolt(
      s,
      [
        [13, 2],
        [12, 5],
        [14, 6],
      ],
      GOLD,
    );
  },
  /** Paradiddle: one mallet down on the drum head, the other up and ready */
  j_paradiddle: (s) => {
    drum(s, 8, 15, 5, 4);
    mallet(s, 1, 4, 6, 9);
    mallet(s, 15, 10, 11, 3);
    arc(s, 11, 9, 4, -1.5, -0.6, B[4], 0.35);
  },
  /** Blast Beat: both gold mallets a blur over the drum */
  j_paradiddle_evo: (s) => {
    drum(s, 8, 15, 5, 4, true);
    mallet(s, 1, 5, 6, 9, true);
    mallet(s, 15, 5, 10, 9, true);
    fill(s, () => {
      seg(s, 4, 2, 6, 5, GOLD_LIGHT);
      seg(s, 12, 2, 10, 5, GOLD_LIGHT);
      seg(s, 8, 1, 8, 4, GOLD_LIGHT);
    });
  },
  /** Crash Wave: a mallet striking the floor, waves of sound running out along it */
  j_crashWave: (s) => {
    floor(s, 1, 15, 14);
    for (const [r, c] of [
      [4, B[5]],
      [7.5, B[4]],
      [11, B[3]],
    ] as const)
      arc(s, 2, 14, r, -Math.PI / 2 + 0.25, -0.05, c, 0.5);
    mallet(s, 1, 6, 2, 11);
  },
  /** Wall of Sound: the waves stood up into a gold wall from floor to sky */
  j_crashWave_evo: (s) => {
    floor(s, 1, 15, 14);
    for (const [r, c] of [
      [12, GOLD_DARK],
      [15, GOLD],
      [18, GOLD_LIGHT],
    ] as const)
      arc(s, -9, 8, r, -0.5, 0.5, c, 0.6);
  },
  /** Rimshot: a mallet cracking down on the drum's rim, a crack of white where it hits */
  j_rimshot: (s) => {
    drum(s, 7, 15, 5, 5);
    mallet(s, 15, 3, 11, 8);
    crash(s, 11, 9, 3);
  },
  /** Gunshot Snare: a gold mallet cracking a snare's rim, the shot streaking off it */
  j_rimshot_evo: (s) => {
    drum(s, 5, 15, 4, 3, true);
    mallet(s, 1, 3, 5, 8, true);
    fill(s, () => {
      s.stroke(10, 11, 15, 8, 0.5, GOLD);
      s.set(15, 8, WHITE);
      s.set(13, 12, GOLD_LIGHT);
      s.set(12, 7, GOLD_LIGHT);
    });
    sparkle(s, 9, 12, 1.5, GOLD_LIGHT);
  },
  /** Kick Drum: a boot kicking forward into a thump */
  j_kickDrum: (s) => {
    speedLines(s, 4, [7, 9], 3, B[4]);
    boot(s, 3, 10, 1);
    crash(s, 11, 8, 3, B[5]);
    waves(s, 11, 8, 1, 2, false, 3, 2, 0.7);
  },
  /** Four on the Floor: a gold boot over four beats struck along the floor */
  j_kickDrum_evo: (s) => {
    boot(s, 5, 9, 1, true);
    floor(s, 1, 15, 14);
    fill(s, () => {
      for (const x of [2, 6, 10, 14]) s.block(x - 1, 12, GOLD, 2, 2);
    });
  },
  /** Swell: bars rising from soft to loud, a lit edge along their tops */
  j_swell: (s) => {
    fill(s, () => {
      for (const [i, h] of [3, 5, 8, 11].entries()) s.block(2 + i * 3, 14 - h, B[2 + i], 2, h);
    });
    fill(s, () => seg(s, 1, 10, 13, 2, B[5]));
  },
  /** Fortissimo: the hairpin flung wide open in gold, bursting at its loud end */
  j_swell_evo: (s) => {
    fill(s, () => {
      seg(s, 1, 8, 12, 2, GOLD);
      seg(s, 1, 8, 12, 14, GOLD);
    });
    crash(s, 13, 8, 3, GOLD_LIGHT);
    fill(s, () => s.dot(13, 8, 1, WHITE));
  },
  /** Step Touch: a boot stepping down onto a beat ring */
  j_stepTouch: (s) => {
    beatRing(s, 9, 13, 5, 1.5, B[4]);
    boot(s, 7, 11, 1);
    speedLines(s, 6, [6, 8], 3, B[4]);
  },
  /** Moonwalk: a gold boot gliding backwards under a crescent moon */
  j_stepTouch_evo: (s) => {
    moon(s, 6, 6, 2.5, true);
    boot(s, 6, 13, 1, true);
    floor(s, 1, 15, 14);
    speedLines(s, 15, [9, 11], 3, GOLD_LIGHT);
  },
  /** War March: two boots marching, one raised, a note on the beat */
  j_march: (s) => {
    boot(s, 2, 13, 1);
    boot(s, 8, 9, 1);
    floor(s, 1, 15, 14);
    note(s, 12, 8, B[4], B[5]);
  },
  /** Parade: three gold boots in step along the floor */
  j_march_evo: (s) => {
    fill(s, () => {
      seg(s, 12, 2, 12, 9, WOOD_LIGHT);
      s.poly(
        [
          [12.5, 2],
          [12.5, 6],
          [8, 4],
        ],
        GOLD,
      );
    });
    boot(s, 1, 13, 1, true);
    boot(s, 8, 13, 1, true);
    floor(s, 1, 15, 14);
  },
  /** Downbeat Leap: a boot leaping high off a beat ring on the floor, its path dashed under it */
  j_leap: (s) => {
    beatRing(s, 5, 12.5, 4, 2, B[4]);
    fill(s, () => {
      for (const [x, y] of [
        [6, 9],
        [7, 7],
        [9, 6],
      ] as const)
        s.set(x, y, B[5]);
    });
    boot(s, 9, 6, 1);
    chevron(s, 13, 9, 0, -1, 2, B[4]);
  },
  /** Skybeat: a gold ring struck in mid air under the leaping boot */
  j_leap_evo: (s) => {
    beatRing(s, 8, 11, 5, 2, GOLD);
    boot(s, 5, 7, 1, true);
    sparkle(s, 3, 3, 1.5, GOLD_LIGHT);
    sparkle(s, 13, 3, 1.5, GOLD_LIGHT);
  },
  /** Gong: a bronze gong hanging in its frame, ringing */
  j_gong: (s) => {
    gong(s, 8, 8, 4);
    arc(s, 8, 8, 6.5, -0.5, 0.5, B[4], 0.4);
    arc(s, 8, 8, 6.5, Math.PI - 0.5, Math.PI + 0.5, B[4], 0.4);
  },
  /** Temple Bell: a gold bell hanging from its beam, ringing */
  j_gong_evo: (s) => {
    fill(s, () => s.block(2, 1, WOOD_LIGHT, 12, 2));
    fill(s, () => {
      s.poly(
        [
          [6, 4],
          [10, 4],
          [12, 12],
          [4, 12],
        ],
        GOLD,
      );
      s.dot(8, 4, 2, GOLD);
      s.block(3, 12, GOLD_DARK, 10, 1);
      seg(s, 6, 5, 5, 11, GOLD_LIGHT);
    });
    fill(s, () => s.dot(8, 13.5, 1, GOLD_LIGHT));
    arc(s, 8, 9, 7, -0.4, 0.4, GOLD_LIGHT, 0.4);
    arc(s, 8, 9, 7, Math.PI - 0.4, Math.PI + 0.4, GOLD_LIGHT, 0.4);
  },
  /** Tuning Fork: a pewter fork humming, waves either side of its tines */
  j_tuning: (s) => {
    fork(s, 8, 14, 12);
    waves(s, 8, 5, -1, 2, false, 3.5, 2, 0.6);
    waves(s, 8, 5, 1, 2, false, 3.5, 2, 0.6);
  },
  /** Perfect Pitch: the gold fork under a single pure note */
  j_tuning_evo: (s) => {
    fork(s, 6, 14, 11, true);
    note(s, 11, 7, GOLD, GOLD_LIGHT);
    sparkle(s, 13, 2, 1.5, GOLD_LIGHT);
  },
  /** Echo Chamber: a dome of sound over the floor, ring inside ring */
  j_echo: (s) => {
    floor(s, 1, 15, 14);
    arc(s, 8, 14, 7, Math.PI, Math.PI * 2, B[3], 0.5);
    arc(s, 8, 14, 4.5, Math.PI, Math.PI * 2, B[4], 0.45);
    arc(s, 8, 14, 2, Math.PI, Math.PI * 2, B[5], 0.45);
  },
  /** Cathedral: a gold pointed arch on pillars, the sound held in it */
  j_echo_evo: (s) => {
    floor(s, 1, 15, 14);
    arc(s, 13, 9, 10, Math.PI, Math.PI * 1.32, GOLD, 0.55);
    arc(s, 3, 9, 10, Math.PI * 1.68, Math.PI * 2, GOLD, 0.55);
    fill(s, () => {
      s.block(2, 9, GOLD_DARK, 2, 5);
      s.block(12, 9, GOLD_DARK, 2, 5);
    });
    arc(s, 8, 14, 3, Math.PI, Math.PI * 2, GOLD_LIGHT, 0.45);
  },
  /** Resonance: ripple rings stacked one over another, rising and narrowing */
  j_resonance: (s) => {
    beatRing(s, 8, 12, 6, 2.2, B[3]);
    beatRing(s, 8, 7.5, 4, 1.6, B[4]);
    beatRing(s, 8, 4, 2, 1, B[5]);
  },
  /** Sympathy: two rings ringing together, linked, a struck point at each heart */
  j_resonance_evo: (s) => {
    ring(s, 5, 9, 3.5, GOLD, 0.5);
    ring(s, 11, 9, 3.5, GOLD_LIGHT, 0.5);
    fill(s, () => {
      s.dot(5, 9, 0.8, WHITE);
      s.dot(11, 9, 0.8, WHITE);
    });
  },
  /** Ringing Ears: an ear with ringing lines coming off it */
  j_eardrum: (s) => {
    ear(s, 3, 4);
    waves(s, 8, 8, 1, 3, false, 2, 2, 0.7);
  },
  /** Deafening Roar: the ear struck by a gold roar, crash lines bursting where it lands */
  j_eardrum_evo: (s) => {
    ear(s, 2, 4);
    waves(s, 8, 8, 1, 3, true, 2, 2.2, 1);
    fill(s, () => {
      seg(s, 1, 2, 2, 3, GOLD_LIGHT);
      seg(s, 0, 8, 1, 8, GOLD_LIGHT);
      seg(s, 1, 14, 2, 13, GOLD_LIGHT);
    });
  },
  /** Dissonance: a note with a jagged stem, red clashes cracking off it */
  j_dissonance: (s) => {
    jaggedNote(s, 5, 12, B[4], B[5]);
    fill(s, () => {
      seg(s, 11, 9, 13, 11, CLASH);
      seg(s, 12, 13, 14, 13, CLASH);
      seg(s, 1, 6, 2, 8, CLASH);
    });
  },
  /** Cacophony: the jagged note in gold beside a second note, red clashes all round them */
  j_dissonance_evo: (s) => {
    jaggedNote(s, 5, 12, GOLD, GOLD_LIGHT);
    note(s, 12, 12, GOLD_DARK, GOLD_LIGHT);
    fill(s, () => {
      seg(s, 10, 3, 12, 5, CLASH);
      seg(s, 13, 7, 15, 7, CLASH);
      seg(s, 1, 6, 2, 8, CLASH);
    });
  },
  /** Drum Corps: a spectral drummer of cobalt light, mallets raised */
  j_drumCorps: (s) => {
    drummer(s, 8, 14, true);
  },
  /** Marching Band: three gold spectral drummers in step */
  j_drumCorps_evo: (s) => {
    smallDrummer(s, 2, 13, true, true);
    smallDrummer(s, 14, 13, true, true);
    smallDrummer(s, 8, 11, true, true);
    floor(s, 1, 15, 14, GOLD_DARK);
  },
  /** War Horn: a ghostly curved horn, its call rolling out of the bell */
  j_horn: (s) => {
    horn(s, 2, 9, 11, 5);
    waves(s, 12, 5, 1, 2, false, 1.5, 2, 0.7);
  },
  /** Herald: the gold horn with an oxblood banner hanging from it */
  j_horn_evo: (s) => {
    fill(s, () => {
      s.poly(
        [
          [4, 8],
          [10, 8],
          [10, 15],
          [7, 13],
          [4, 15],
        ],
        DRUM[2],
      );
      seg(s, 4, 9, 4, 14, DRUM[3]);
      s.set(7, 10, GOLD_LIGHT);
    });
    horn(s, 1, 7, 12, 3, true);
  },
  /** Iron Metronome: an iron metronome, its arm swung over */
  j_metronome: (s) => {
    arc(s, 7.5, 12, 11, -2.05, -1.1, B[4], 0.35);
    metronome(s, 7, 14, 8, 4);
  },
  /** Conductor: the metronome's arm a gold baton, sweeping its arc, a note in its wake */
  j_metronome_evo: (s) => {
    arc(s, 6.5, 12, 11, -2.05, -1.1, GOLD, 0.4);
    metronome(s, 6, 14, 8, -4, true);
    note(s, 12, 10, GOLD, GOLD_LIGHT);
  },
  /** Encore: the curtain drawn back on the drum left alone on the stage */
  j_encore: (s) => {
    curtain(s);
    drum(s, 8, 14, 3, 3);
    sparkle(s, 8, 6, 1.5, B[5]);
  },
  /** Standing Ovation: the curtain drawn back on a crowd with gold hands raised */
  j_encore_evo: (s) => {
    curtain(s, true);
    for (const x of [5, 11, 8]) {
      fill(s, () => {
        seg(s, x - 2, x === 8 ? 8 : 9, x - 1, 12, GOLD);
        seg(s, x + 2, x === 8 ? 8 : 9, x + 1, 12, GOLD);
      });
      fill(s, () => s.dot(x, x === 8 ? 12.5 : 13.5, 1.4, B[2]));
    }
    sparkle(s, 8, 4, 1.5, GOLD_LIGHT);
  },
  /** Encore of Thunder, Drumroll evolved: the gold drum under crashing gold cymbals and thunder */
  j_drumroll_evo: (s) => {
    drum(s, 8, 15, 4, 4, true);
    cymbal(s, 3, 7, 3, 1, true);
    cymbal(s, 13, 7, 3, -1, true);
    bolt(
      s,
      [
        [8, 0],
        [7, 3],
        [9, 4],
        [8, 8],
      ],
      GOLD_LIGHT,
    );
  },
});
