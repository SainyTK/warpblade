import { KEEN_RAMP } from "../../../../constants/combo";
import { FIRE_RAMP, KAEL_COLORS as HC, PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import {
  arc,
  arrow,
  bolt,
  crescent,
  drop,
  evolvedStar,
  figure,
  fill,
  flame,
  gem,
  ring,
  sparkle,
  speedLines,
  sword,
} from "../parts";
import { cloud, foeBody, ground, spike } from "./parts";

const GHOST = PAL.shadow;
const C = PAL.crystal;

/** each evolved form: the skill's own marks grown, with the gold star */
const EVOLVED: Record<string, (s: SpriteCanvas) => void> = {
  /** Peerless Edge: a gold cross cut */
  k_keen_evo: (s) => {
    crescent(s, 8, 8, 6, -2.4, 0.6, KEEN_RAMP[4]);
    crescent(s, 8, 8, 6, 2.5, 5.5, KEEN_RAMP[3]);
    sparkle(s, 8, 8, 2.5, WHITE);
  },
  /** Heavenfall: a phantom spiking a foe down */
  k_skyward_evo: (s) => {
    figure(s, 6, 6, GHOST[4], GHOST[2]);
    foeBody(s, 8, 10, 2.4);
    arrow(s, 12, 3, 12, 13, C[4], 2.5);
    ground(s);
  },
  /** Crystal Harvest: a crystal tide running both ways along the floor */
  k_reap_evo: (s) => {
    sword(s, 4, 11, 12, 11);
    fill(s, () => {
      for (const x of [1, 3, 5, 11, 13, 15]) s.stroke(x, 14, x + (x < 8 ? -1 : 1), 11, 0.4, C[4]);
    });
    ground(s);
  },
  /** Phantom Passage: one cut through a row of foes */
  k_phase_evo: (s) => {
    foeBody(s, 4, 9, 2.2);
    foeBody(s, 9, 9, 2.2);
    arrow(s, 0, 9, 15, 9, C[4]);
  },
  /** Rift Walker: the sword leaping from foe to foe */
  k_warpcraft_evo: (s) => {
    foeBody(s, 3, 12, 2);
    foeBody(s, 13, 12, 2);
    arc(s, 8, 12, 5, 3.4, 6, C[3]);
    sword(s, 5, 6, 13, 6);
  },
  /** Shadow Step: a phantom and Kael striking a foe from both sides */
  k_blink_evo: (s) => {
    figure(s, 3, 15, GHOST[4], GHOST[2]);
    foeBody(s, 8, 11, 2.6);
    figure(s, 13, 15, HC.hair, HC.coat);
  },
  /** Phantom Rush: a line of phantoms along the dash */
  k_passing_evo: (s) => {
    figure(s, 3, 15, GHOST[3], GHOST[2]);
    figure(s, 8, 15, GHOST[4], GHOST[2]);
    speedLines(s, 10, [6, 10], 5, C[3]);
  },
  /** Comet Dance: a comet plunging into a wide ring */
  k_skydance_evo: (s) => {
    gem(s, 8, 5, 2.5, 5);
    fill(s, () => s.stroke(5, 1, 7, 3, 0.4, C[3]));
    ring(s, 8, 13, 5, C[3]);
  },
  /** Sunflask: a big flask with three small flames around it */
  k_flame_evo: (s) => {
    drop(s, 8, 10.5, 4.2, FIRE_RAMP[3], FIRE_RAMP[1]);
    fill(s, () => s.stroke(8, 2, 8, 4.5, 1, HC.trim));
    flame(s, 2.5, 8, 6);
    flame(s, 2.5, 15.5, 5.5);
    flame(s, 13.5, 15.5, 6);
  },
  /** Glacier Bloom: a tall spire between two short spikes */
  k_frost_evo: (s) => {
    spike(s, 3.5, 6, 2);
    spike(s, 12.5, 6, 2);
    spike(s, 8, 13, 3);
    fill(s, () => s.stroke(1, 14.5, 15, 14.5, 0.7, PAL.ice[2]));
  },
  /** Thunderhead: a storm cloud with a bolt under it */
  k_volt_evo: (s) => {
    cloud(s);
    bolt(s, [
      [8, 11],
      [5, 13.5],
      [9, 13.5],
      [6, 16],
    ]);
  },
  /** Shatterstorm: shards bursting out of a foe */
  k_splinters_evo: (s) => {
    foeBody(s, 8, 9, 3);
    fill(s, () => {
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        s.stroke(8 + Math.cos(a) * 4, 9 + Math.sin(a) * 4, 8 + Math.cos(a) * 7, 9 + Math.sin(a) * 7, 0.4, C[4]);
      }
    });
  },
  /** Rift Collapse: a rift swallowing foes from both sides */
  k_rift_evo: (s) => {
    ring(s, 8, 8, 5, GHOST[4]);
    fill(s, () => s.dot(8, 8, 2.5, GHOST[0]));
    arrow(s, 0, 8, 4, 8, GHOST[5], 2);
    arrow(s, 15, 8, 12, 8, GHOST[5], 2);
  },
  /** Overload: lightning striking two foes at once */
  k_static_evo: (s) => {
    foeBody(s, 4, 12, 2.2);
    foeBody(s, 12, 12, 2.2);
    bolt(s, [
      [5, 1],
      [3, 6],
      [6, 6],
      [4, 10],
    ]);
    bolt(s, [
      [13, 1],
      [11, 6],
      [14, 6],
      [12, 10],
    ]);
  },
  /** Phantom Host: two phantom blades round a bright one */
  k_echo_evo: (s) => {
    sword(s, 2, 9, 14, 9, GHOST[3]);
    sword(s, 5, 14, 14, 5, GHOST[4]);
    sword(s, 2, 12, 11, 3);
  },
  /** Crystal Choir: three crystals singing */
  k_familiar_evo: (s) => {
    gem(s, 4, 9, 2, 3);
    gem(s, 12, 9, 2, 3);
    gem(s, 8, 6, 3, 4);
    arc(s, 8, 9, 6, 0.3, 2.8, C[3], 0.4);
  },
  /** Perfect Reflection: a gold ring round two crossed blades */
  k_mirror_evo: (s) => {
    ring(s, 8, 8, 7, KEEN_RAMP[3]);
    sword(s, 3, 13, 13, 3);
    sword(s, 13, 13, 3, 3, GHOST[4]);
  },
  /** Endless Edges: blades circling Kael */
  k_edges_evo: (s) => {
    figure(s, 8, 15, HC.hair, HC.coat);
    arc(s, 8, 9, 6.5, 3.4, 6.0, C[4]);
    sword(s, 2, 6, 6, 2, C[4]);
    sword(s, 14, 6, 10, 2, C[4]);
  },
  /** Phantom Army: a crowd of phantoms */
  k_legion_evo: (s) => {
    figure(s, 2, 15, GHOST[3], GHOST[2]);
    figure(s, 6, 13, GHOST[4], GHOST[2]);
    figure(s, 10, 13, GHOST[4], GHOST[2]);
    figure(s, 14, 15, GHOST[3], GHOST[2]);
  },
  /** Cataclysm: several meteors over the floor */
  k_starfall_evo: (s) => {
    fill(s, () => {
      for (const [x, y] of [
        [4, 5],
        [11, 3],
        [8, 10],
      ]) {
        s.dot(x, y, 2, FIRE_RAMP[3]);
        s.stroke(x - 3, y - 3, x - 1, y - 1, 0.4, FIRE_RAMP[4]);
      }
    });
    ground(s, FIRE_RAMP[5]);
  },
};

/** every evolved icon with the gold star drawn last */
export const KAEL_EVOLVED_ICONS: Record<string, (s: SpriteCanvas) => void> = Object.fromEntries(
  Object.entries(EVOLVED).map(([id, draw]) => [
    id,
    (s: SpriteCanvas) => {
      draw(s);
      evolvedStar(s);
    },
  ]),
);
