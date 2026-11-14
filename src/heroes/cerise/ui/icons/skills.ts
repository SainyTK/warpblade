import { KEEN_RAMP } from "../../../../constants/combo";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { arc, arrow, drop, figure, ring, speedLines } from "../../../../ui/skills/icons/parts";
import { WHITE } from "../../../../utils/color";
import { foe, petal, pip, R, rapier, sigil, star, streak } from "./parts";

/** Cerise's 20 skill icons and her three damage sources */
export const CERISE_BASE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** a level rapier with a gold glint at its point */
  ce_measure: (s) => {
    rapier(s, 2, 9, 13, 9);
    star(s, 13, 9, 2.5, KEEN_RAMP[4]);
  },
  /** a rapier striking three times on a foe, in rising rose */
  ce_riposte: (s) => {
    foe(s, 12, 8, 3);
    streak(s, 3, 5, 9, R[3]);
    streak(s, 2, 8, 9, R[4]);
    streak(s, 3, 11, 9, R[5]);
  },
  /** a long streak through two foes */
  ce_lunge: (s) => {
    foe(s, 8, 9, 2.5);
    foe(s, 13, 9, 2.5);
    rapier(s, 1, 9, 15, 9);
    speedLines(s, 3, [5, 13], 3, R[3]);
  },
  /** a rapier through a foe into the floor */
  ce_pin: (s) => {
    foe(s, 8, 10, 3.5);
    rapier(s, 4, 3, 10, 14);
    arc(s, 8, 15, 4, 3.4, 6, R[3], 0.75);
  },
  /** a curved arrow round a foe: the feint turns it */
  ce_feint: (s) => {
    foe(s, 9, 9, 3);
    arc(s, 9, 9, 5.5, -2.6, 1.2, R[4], 0.75);
    rapier(s, 1, 12, 6, 6);
  },
  /** the thrown rapier and a rose sigil on its target */
  ce_markwarp: (s) => {
    speedLines(s, 4, [6, 9], 3, R[3]);
    rapier(s, 4, 11, 11, 4);
    sigil(s, 13, 3, 2.5);
  },
  /** a ghost of her and a thrust out of the dodge */
  ce_step: (s) => {
    figure(s, 4, 15, R[2], R[1]);
    speedLines(s, 7, [8, 11], 4, R[3]);
    rapier(s, 7, 9, 15, 9);
  },
  /** a dive on a slant onto a foe */
  ce_dive: (s) => {
    rapier(s, 3, 2, 11, 11);
    foe(s, 12, 13, 2.5);
    speedLines(s, 4, [3, 5], 3, R[3]);
  },
  /** petals bursting in a ring */
  ce_bloom: (s) => {
    ring(s, 8, 8, 5, R[3], 0.75);
    for (let i = 0; i < 6; i++) petal(s, 8 + Math.cos(i) * 5, 8 + Math.sin(i) * 5, 1.3, R[4]);
    petal(s, 8, 8, 1.8, R[5]);
  },
  /** needles falling in a row */
  ce_needle: (s) => {
    for (const x of [3, 7, 11]) {
      arrow(s, x + 0.5, 1 + (x % 3), x + 0.5, 12, R[4], 2);
    }
    arc(s, 8, 18, 9, 3.6, 5.8, R[2], 0.75);
  },
  /** a glass ring round a raised rapier */
  ce_mirrorguard: (s) => {
    ring(s, 8, 8, 6, R[5], 0.75);
    rapier(s, 6, 13, 10, 2);
    star(s, 12, 5, 2, WHITE);
  },
  /** a thorn with a drop of blood */
  ce_thorns: (s) => {
    rapier(s, 2, 13, 11, 4);
    drop(s, 12, 11, 1.6, 0xc8283c, 0xf0505a);
    drop(s, 7, 13, 1.1, 0xc8283c, 0xf0505a);
  },
  /** a rose sigil weeping a drop */
  ce_weep: (s) => {
    sigil(s, 8, 5, 4);
    drop(s, 8, 12, 2, 0xc8283c, 0xf0505a);
  },
  /** a wilting petal falling from a rapier */
  ce_curse: (s) => {
    rapier(s, 2, 6, 13, 6);
    petal(s, 7, 11, 1.8, 0x7a1a46);
    petal(s, 11, 13, 1.3, 0x5a1030);
  },
  /** two rapiers crossing, one of glass */
  ce_mirror: (s) => {
    rapier(s, 2, 13, 13, 2);
    rapier(s, 14, 13, 3, 2);
    star(s, 8, 7, 2, R[5]);
  },
  /** petal blades circling */
  ce_petals: (s) => {
    arc(s, 8, 8, 5.5, 0, 5.5, R[2], 0.75);
    petal(s, 13, 8, 1.6, R[4]);
    petal(s, 5, 4, 1.6, R[4]);
    petal(s, 5, 12, 1.6, R[4]);
  },
  /** a rapier of light planted in the floor */
  ce_sentinel: (s) => {
    rapier(s, 8, 4, 8, 14);
    arc(s, 8, 16, 5, 3.5, 5.9, R[3], 0.75);
    streak(s, 9, 6, 15, R[5]);
  },
  /** three rose pips over a crit star */
  ce_poise: (s) => {
    pip(s, 4, 12);
    pip(s, 8, 12);
    pip(s, 12, 12);
    star(s, 8, 5, 3.5, KEEN_RAMP[4]);
  },
  /** a rapier raised and a heart of rose light */
  ce_grace: (s) => {
    rapier(s, 3, 13, 7, 3);
    petal(s, 10, 9, 2.2, R[4]);
    petal(s, 13, 9, 2.2, R[4]);
    petal(s, 11.5, 11, 2, R[4]);
  },
  /** a storm of streaks and the lunge */
  ce_tempest: (s) => {
    for (const y of [3, 6, 9, 12]) streak(s, 2 + (y % 3), y, 13, R[3 + (y % 2)]);
    rapier(s, 1, 8, 15, 8);
  },
  cerise_attacks: (s) => {
    rapier(s, 2, 12, 14, 4);
  },
  cerise_abilities: (s) => {
    streak(s, 1, 8, 15, R[5]);
    petal(s, 5, 5, 1.5, R[4]);
    petal(s, 11, 11, 1.5, R[4]);
  },
  cerise_ultimate: (s) => {
    for (const y of [4, 8, 12]) streak(s, 2, y, 14, R[4]);
    star(s, 14, 8, 2.5, WHITE);
  },
};
