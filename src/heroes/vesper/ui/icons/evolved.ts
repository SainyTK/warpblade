import type { SpriteCanvas } from "../../../../engine/sprite";
import {
  arc,
  arrow,
  chevron,
  crescent,
  evolvedStar,
  fill,
  ring,
  sparkle,
  speedLines,
} from "../../../../ui/skills/icons/parts";
import { WHITE } from "../../../../utils/color";
import { crossed, D, foe, GOLD, longBlade, moon, N, phantom, pips, shortBlade, sigil, swallow } from "./parts";

/** each evolved form: the skill's own marks grown, with the gold star */
const EVOLVED: Record<string, (s: SpriteCanvas) => void> = {
  /** Crescendo: both blades rising over full pips */
  ve_edge_evo: (s) => {
    pips(s, 1, 14, 6, D[5]);
    longBlade(s, 5, 13, 13, 3);
    shortBlade(s, 9, 14, 14, 8);
  },
  /** Perfect Pair: a gold cross cut */
  ve_keen_evo: (s) => {
    crescent(s, 8, 8, 6, -2.4, 0.6, GOLD[4]);
    crescent(s, 8, 8, 6, 2.5, 5.5, GOLD[3]);
    sparkle(s, 8, 8, 2.5, WHITE);
  },
  /** Heaven's Ribbon: ribbons both ways under a foe in the air */
  ve_sky_evo: (s) => {
    foe(s, 8, 4, 2.4);
    crescent(s, 4, 10, 4, 0.5, 2.8, N[4]);
    crescent(s, 12, 10, 4, 0.3, 2.6, D[4]);
    longBlade(s, 4, 15, 12, 12);
  },
  /** Thousand Crossings: waves out every way */
  ve_storm_evo: (s) => {
    crescent(s, 3, 5, 3, -1, 1, D[4]);
    crescent(s, 3, 11, 3, -1, 1, N[4]);
    crescent(s, 13, 5, 3, 2.1, 4.2, N[4]);
    crescent(s, 13, 11, 3, 2.1, 4.2, D[4]);
    crossed(s);
  },
  /** Whirling Mirror: both blades in a spinning ring */
  ve_turn_evo: (s) => {
    ring(s, 8, 8, 6.5, N[4]);
    longBlade(s, 3, 8, 13, 8);
    shortBlade(s, 8, 13, 8, 4);
  },
  /** Moonlit Steps: her figure on three chevrons in a ring */
  ve_ascend_evo: (s) => {
    phantom(s, 8, 15, 1, D[4]);
    chevron(s, 8, 2, 0, -1, 2.5, WHITE);
    chevron(s, 8, 5, 0, -1, 2.5, D[4]);
    arc(s, 8, 10, 6, 3.4, 6, D[3]);
  },
  /** Twin Throw: both blades flying together */
  ve_warp_evo: (s) => {
    speedLines(s, 5, [4, 7, 10], 4, D[3]);
    longBlade(s, 5, 5, 15, 4);
    shortBlade(s, 6, 11, 13, 10);
  },
  /** Dusk Current: a band of dusk along the floor, a figure dashing over it */
  ve_slip_evo: (s) => {
    phantom(s, 10, 12, 1, D[4]);
    speedLines(s, 7, [8, 10], 4, D[3]);
    fill(s, () => {
      for (let x = 1; x < 15; x++) s.set(x, 14 + (x % 3 === 0 ? -1 : 0), x % 2 ? D[4] : N[4]);
    });
  },
  /** Eclipse: a dark moon over a row of rings */
  ve_moon_evo: (s) => {
    moon(s, 8, 5, 4);
    ring(s, 4, 13, 2.5, D[3]);
    ring(s, 12, 13, 2.5, D[3]);
    sparkle(s, 8, 13, 1.5, WHITE);
  },
  /** Twilight Cyclone: a tall whirl with a foe caught in it */
  ve_gale_evo: (s) => {
    arc(s, 8, 12, 5.5, 3.2, 6.2, D[4]);
    arc(s, 8, 8, 4.5, 0, 3, N[4]);
    arc(s, 8, 4, 3.5, 3.2, 6.2, D[5]);
    foe(s, 8, 7, 1.8);
  },
  /** Fate Thread: threads to three foes */
  ve_thread_evo: (s) => {
    foe(s, 13, 3, 2);
    foe(s, 13, 9, 2);
    foe(s, 9, 13, 2);
    fill(s, () => {
      s.stroke(3, 9, 11, 3, 0.3, D[5]);
      s.stroke(3, 9, 11, 9, 0.3, D[5]);
      s.stroke(3, 9, 8, 12, 0.3, D[5]);
    });
  },
  /** Sigil Bloom: a sigil bursting open */
  ve_hex_evo: (s) => {
    sigil(s, 8, 8, 4, D[5]);
    for (const [dx, dy] of [
      [-5, 0],
      [5, 0],
      [0, -5],
      [0, 5],
    ])
      sparkle(s, 8 + dx, 8 + dy, 1.5, D[4]);
  },
  /** Starless Night: a dark moon swallowing the stars over a foe */
  ve_night_evo: (s) => {
    moon(s, 7, 6, 4);
    foe(s, 12, 12, 2.4);
    arrow(s, 12, 3, 12, 8, D[4], 2);
  },
  /** Dusk Fire: a flaring glow over a foe */
  ve_glow_evo: (s) => {
    foe(s, 8, 12, 2.6);
    sparkle(s, 8, 6, 4, D[5]);
    ring(s, 8, 6, 3, D[3]);
  },
  /** Shade Troupe: three shades in a row */
  ve_shade_evo: (s) => {
    phantom(s, 4, 15, 1, N[3]);
    phantom(s, 8, 15, 1, D[3]);
    phantom(s, 12, 15, 1, D[5]);
  },
  /** Swallow Storm: swallows circling */
  ve_swallow_evo: (s) => {
    ring(s, 8, 8, 6, N[3]);
    swallow(s, 8, 3, D[4]);
    swallow(s, 3, 10);
    swallow(s, 13, 10);
  },
  /** Mirror Dance: two figures back to back in gold */
  ve_twin_evo: (s) => {
    phantom(s, 5, 15, -1, D[4]);
    phantom(s, 11, 15, 1, D[4]);
    sparkle(s, 8, 4, 2, GOLD[4]);
  },
  /** Endless Waltz: two rings of cuts */
  ve_waltz_evo: (s) => {
    ring(s, 8, 8, 7, D[3]);
    ring(s, 8, 8, 4.5, N[4]);
    phantom(s, 8, 12, 1, WHITE);
  },
  /** Perpetual Tempo: a closed loop over full pips */
  ve_rhythm_evo: (s) => {
    ring(s, 8, 7, 5, D[4]);
    pips(s, 2, 15, 6, D[5]);
  },
  /** Dusk Ward: a feather inside a ring */
  ve_grace_evo: (s) => {
    ring(s, 8, 8, 6.5, D[4]);
    fill(s, () => {
      s.stroke(5, 12, 11, 4, 0.4, WHITE);
      for (let i = 1; i < 5; i++) s.stroke(5 + i * 1.2, 12 - i * 1.6, 3.5 + i * 1.2, 11 - i * 1.6, 0.45, D[4]);
    });
  },
};

/** every evolved icon with the gold star drawn last */
export const VESPER_EVOLVED_ICONS: Record<string, (s: SpriteCanvas) => void> = Object.fromEntries(
  Object.entries(EVOLVED).map(([id, draw]) => [
    id,
    (s: SpriteCanvas) => {
      draw(s);
      evolvedStar(s);
    },
  ]),
);
