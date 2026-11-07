import { KEEN_RAMP } from "../../../../constants/combo";
import { FIRE_RAMP, KAEL_COLORS as HC, PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import {
  arc,
  arrow,
  bolt,
  chevron,
  crescent,
  drop,
  figure,
  fill,
  flame,
  gem,
  ring,
  sparkle,
  speedLines,
  sword,
} from "../parts";
import { foeBody, ground, spike } from "./parts";

const GHOST = PAL.shadow;
const C = PAL.crystal;

/** Kael's 20 skill icons */
export const KAEL_SKILL_BASE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** a sword with a gold glint at its point */
  k_keen: (s) => {
    sword(s, 3, 13, 13, 3);
    sparkle(s, 12, 4, 2.5, KEEN_RAMP[4]);
  },
  /** a foe thrown up off an uppercut */
  k_skyward: (s) => {
    foeBody(s, 9, 4, 2.4);
    sword(s, 4, 15, 7, 6);
    arrow(s, 13, 14, 13, 5, C[4], 2.5);
  },
  /** a low cut along the floor, a crescent under it */
  k_reap: (s) => {
    crescent(s, 8, 7, 7, 0.5, 2.6, C[3]);
    sword(s, 2, 11, 14, 11);
    ground(s, GHOST[3]);
  },
  /** a cut through a foe, out the other side */
  k_phase: (s) => {
    foeBody(s, 8, 8, 3.2);
    arrow(s, 1, 8, 14, 8, C[4]);
  },
  /** the thrown sword, Kael's ghost after it */
  k_warpcraft: (s) => {
    figure(s, 4, 15, GHOST[3], GHOST[2]);
    speedLines(s, 5, [4, 8], 4, C[3]);
    sword(s, 6, 6, 15, 6);
  },
  /** a ghost in front of a foe, Kael behind it */
  k_blink: (s) => {
    figure(s, 3, 15, GHOST[3], GHOST[2]);
    foeBody(s, 8, 11, 2.6);
    figure(s, 13, 15, HC.hair, HC.coat);
    arrow(s, 4, 3, 12, 3, C[4], 2);
  },
  /** dash lines through a foe, with a cut on it */
  k_passing: (s) => {
    foeBody(s, 10, 9, 3);
    speedLines(s, 3, [5, 9, 13], 6, C[3]);
    fill(s, () => s.stroke(7, 5, 13, 12, 0.4, WHITE));
  },
  /** a wheel of the blade in the air, the floor below */
  k_skydance: (s) => {
    arc(s, 8, 6, 5, -2.5, 3.5, C[3]);
    sword(s, 5, 9, 11, 3);
    chevron(s, 8, 13, 0, 1, 3, C[4]);
  },
  /** a flask with a flame curling out of its neck */
  k_flame: (s) => {
    drop(s, 8, 11, 4, FIRE_RAMP[3], FIRE_RAMP[1]);
    fill(s, () => s.stroke(8, 3, 8, 6, 1, HC.trim));
    flame(s, 11, 6, 5);
  },
  /** a row of ice spikes rising out of the floor */
  k_frost: (s) => {
    spike(s, 3, 6, 2);
    spike(s, 8, 11, 2);
    spike(s, 13, 8, 2);
    fill(s, () => s.stroke(1, 14.5, 15, 14.5, 0.7, PAL.ice[2]));
  },
  /** a bolt striking a foe and arcing to a second one */
  k_volt: (s) => {
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
  /** a foe with crystal shards stuck in it */
  k_splinters: (s) => {
    foeBody(s, 8, 9, 4.2);
    fill(s, () => {
      for (const [x0, y0, x1, y1] of [
        [3, 4, 6, 7],
        [13, 4, 10, 7],
        [8, 2, 8, 5],
        [14, 11, 11, 10],
      ])
        s.stroke(x0, y0, x1, y1, 0.45, C[4]);
      s.set(3, 4, WHITE);
      s.set(8, 2, WHITE);
    });
  },
  /** a dark rift slit down a foe */
  k_rift: (s) => {
    foeBody(s, 8, 8, 5, GHOST[2], GHOST[4]);
    fill(s, () => {
      s.stroke(9, 3, 7, 13, 0.6, GHOST[0]);
      s.stroke(10, 4, 8, 12, 0.3, GHOST[5]);
    });
  },
  /** sparks crackling round a foe the dash has passed */
  k_static: (s) => {
    foeBody(s, 8, 9, 3.5);
    chevron(s, 4, 9, 1, 0, 3, C[3]);
    bolt(s, [
      [12, 2],
      [10, 5],
      [13, 5],
      [11, 8],
    ]);
  },
  /** two blades, a shadow one behind the bright one */
  k_echo: (s) => {
    sword(s, 5, 14, 14, 5, GHOST[3]);
    sword(s, 2, 12, 11, 3);
  },
  /** a crystal familiar with a shard flying off it */
  k_familiar: (s) => {
    fill(s, () => {
      s.stroke(8, 9, 14, 3, 0.35, C[2]);
      s.stroke(10, 9, 15, 4, 0.25, C[3]);
    });
    gem(s, 6, 9, 3, 5);
    fill(s, () => s.set(14, 3, WHITE));
  },
  /** Kael and his mirror crossing blades */
  k_mirror: (s) => {
    sword(s, 3, 13, 13, 3);
    sword(s, 13, 13, 3, 3, GHOST[4]);
    ring(s, 8, 8, 2, KEEN_RAMP[4]);
  },
  /** three blades crossing */
  k_edges: (s) => {
    sword(s, 3, 13, 13, 3, C[4]);
    sword(s, 13, 13, 3, 3, C[4]);
    sword(s, 8, 15, 8, 1, PAL.volt[4]);
  },
  /** phantoms of Kael round a foe */
  k_legion: (s) => {
    figure(s, 3, 15, GHOST[4], GHOST[2]);
    figure(s, 13, 15, GHOST[4], GHOST[2]);
    figure(s, 8, 13, PAL.shadow[5], GHOST[3]);
  },
  /** a meteor falling in a fiery trail */
  k_starfall: (s) => {
    fill(s, () => {
      for (let i = 0; i < 7; i++) s.dot(2 + i, 2 + i, 0.6 + i * 0.12, FIRE_RAMP[Math.max(1, 6 - i)]);
    });
    fill(s, () => s.dot(11, 11, 2.8, FIRE_RAMP[3]));
    fill(s, () => s.set(10, 10, WHITE));
  },
  /** Kael's attacks on the end of run screen: his crystal sword */
  kael_attacks: (s) => {
    sword(s, 3, 13, 13, 3);
  },
  /** Kael's abilities: a crystal crescent flying ahead */
  kael_abilities: (s) => {
    crescent(s, 6, 8, 6, -1.2, 1.2, C[4]);
    speedLines(s, 1, [5, 11], 3, C[3]);
    fill(s, () => s.set(12, 8, WHITE));
  },
  /** Kael's special: a crystal in a bursting ring */
  kael_ultimate: (s) => {
    ring(s, 8, 8, 6.5, C[3]);
    gem(s, 8, 8, 5, 8);
    sparkle(s, 3, 3, 2, C[4]);
    sparkle(s, 13, 13, 2, C[4]);
  },
};
