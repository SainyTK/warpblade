import type { SpriteCanvas } from "../../../../engine/sprite";
import { arc, arrow, chevron, crescent, fill, ring, sparkle, speedLines } from "../../../../ui/skills/icons/parts";
import { WHITE } from "../../../../utils/color";
import { crossed, D, foe, GOLD, longBlade, moon, N, phantom, pips, shortBlade, sigil, swallow } from "./parts";

/** Vesper's 20 skill icons and her three damage sources */
export const VESPER_SKILL_BASE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** the long blade rising over Tempo pips that climb */
  ve_edge: (s) => {
    pips(s, 2, 14, 4);
    longBlade(s, 6, 13, 14, 2);
  },
  /** both blades crossed, a gold glint where they meet */
  ve_keen: (s) => {
    crossed(s);
    sparkle(s, 8, 8, 2.5, GOLD[4]);
  },
  /** a swooping arc under a foe in the air */
  ve_sky: (s) => {
    foe(s, 10, 4, 2.4);
    crescent(s, 8, 9, 6, 0.4, 2.8, D[4]);
    longBlade(s, 3, 13, 11, 10);
  },
  /** the short blade, waves fanning out both ways */
  ve_storm: (s) => {
    crescent(s, 3, 8, 4, -1, 1, D[4]);
    crescent(s, 13, 8, 4, 2.1, 4.2, N[4]);
    shortBlade(s, 8, 13, 8, 4);
  },
  /** the short blade turning a spark aside */
  ve_turn: (s) => {
    shortBlade(s, 4, 12, 11, 5);
    sparkle(s, 12, 4, 2, WHITE);
    arc(s, 8, 8, 6, -2.8, -1.4, D[4]);
  },
  /** her figure rising on chevrons */
  ve_ascend: (s) => {
    phantom(s, 8, 15, 1);
    chevron(s, 8, 3, 0, -1, 2.5, D[4]);
    chevron(s, 8, 6, 0, -1, 2.5, D[3]);
  },
  /** the long blade flying ahead, her shade behind it */
  ve_warp: (s) => {
    phantom(s, 3, 15, 1, N[3]);
    speedLines(s, 6, [4, 7], 4, D[3]);
    longBlade(s, 6, 6, 15, 5);
  },
  /** a dash through a foe, a cut across it */
  ve_slip: (s) => {
    foe(s, 9, 9, 3);
    arrow(s, 1, 11, 15, 11, D[4]);
    shortBlade(s, 6, 4, 13, 9);
  },
  /** a crescent moon falling onto a ring */
  ve_moon: (s) => {
    moon(s, 8, 5, 3.5);
    ring(s, 8, 13, 4, D[3]);
  },
  /** a whirl of wind on the floor */
  ve_gale: (s) => {
    arc(s, 8, 11, 5, 3.2, 6.2, D[4]);
    arc(s, 8, 8, 3.5, 0, 3, N[4]);
    arc(s, 8, 5, 2, 3.2, 6.2, D[5]);
    fill(s, () => s.stroke(2, 14.5, 14, 14.5, 0.5, D[2]));
  },
  /** a thread drawing a foe in */
  ve_thread: (s) => {
    foe(s, 12, 6, 2.6);
    fill(s, () => {
      for (let i = 0; i < 9; i++) s.set(3 + i, 13 - i * 0.8, i % 2 ? D[5] : D[3]);
    });
    arrow(s, 10, 9, 5, 12, WHITE, 2);
  },
  /** a dusk sigil in a ring */
  ve_hex: (s) => {
    ring(s, 8, 8, 6, N[3]);
    sigil(s, 8, 8, 4);
  },
  /** a dark crescent and stars over a foe in the air */
  ve_night: (s) => {
    moon(s, 5, 5, 3);
    foe(s, 11, 10, 2.6);
    fill(s, () => {
      s.set(12, 3, WHITE);
      s.set(14, 6, D[5]);
    });
  },
  /** a violet glow rising off a struck foe */
  ve_glow: (s) => {
    foe(s, 8, 11, 3);
    sparkle(s, 8, 5, 3, D[5]);
    fill(s, () => {
      s.set(4, 6, D[4]);
      s.set(12, 4, D[4]);
    });
  },
  /** a shade dashing, a cross where it passes */
  ve_shade: (s) => {
    phantom(s, 5, 15, 1, D[3]);
    speedLines(s, 3, [10, 12], 3, D[2]);
    crescent(s, 11, 7, 4, -2.4, 0.6, N[4]);
    crescent(s, 11, 7, 4, 0.8, 3.8, D[4]);
  },
  /** two swallows diving */
  ve_swallow: (s) => {
    swallow(s, 6, 5);
    swallow(s, 11, 10, D[3]);
  },
  /** her figure and its mirror */
  ve_twin: (s) => {
    phantom(s, 5, 15, 1, D[4]);
    phantom(s, 11, 15, -1, N[3]);
    fill(s, () => s.stroke(8, 3, 8, 15, 0.3, D[2]));
  },
  /** a ring of cuts round her figure */
  ve_waltz: (s) => {
    ring(s, 8, 8, 6.5, D[3]);
    phantom(s, 8, 13, 1, D[5]);
    sparkle(s, 3, 4, 1.5, WHITE);
    sparkle(s, 13, 12, 1.5, WHITE);
  },
  /** Tempo pips under a loop that never closes */
  ve_rhythm: (s) => {
    arc(s, 8, 7, 5, -3.6, 0.6, D[4]);
    chevron(s, 13, 7, 0, 1, 2, D[4]);
    pips(s, 3, 15, 5, D[5]);
  },
  /** a feather of dusk */
  ve_grace: (s) => {
    fill(s, () => {
      s.stroke(4, 14, 12, 3, 0.4, WHITE);
      for (let i = 1; i < 7; i++) {
        const [x, y] = [4 + i * 1.15, 14 - i * 1.55];
        s.stroke(x, y, x - 2.4, y - 1.4, 0.45, D[4]);
        s.stroke(x, y, x + 1.4, y + 1.6, 0.45, D[3]);
      }
    });
  },
  /** her attacks on the end of run screen: both blades */
  vesper_attacks: crossed,
  /** her abilities: two crossing waves */
  vesper_abilities: (s) => {
    crescent(s, 7, 6, 5, -1.2, 1.2, D[4]);
    crescent(s, 7, 10, 5, -1.2, 1.2, N[4]);
  },
  /** her ultimate: her figure inside a ring of cuts */
  vesper_ultimate: (s) => {
    ring(s, 8, 8, 6.5, D[4]);
    crescent(s, 8, 8, 5, -2.4, 0.6, N[4]);
    phantom(s, 8, 12, 1, WHITE);
  },
};
