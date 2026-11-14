import { COIN_GOLD } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { arrow, drop, ring, sparkle, speedLines } from "../../../../ui/skills/icons/parts";
import { WHITE } from "../../../../utils/color";
import { JADE } from "../../look";
import { floor, foe, jian, qi, sage, spirit, swirl } from "./parts";

const J = JADE;

/** Yun's 20 skill icons, each built from his jian, his spirit swords and jade qi */
export const YUN_SKILL_BASE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** the jian, two spirit swords thrusting past its point */
  yu_echo: (s) => {
    jian(s, 2, 13, 10, 5);
    spirit(s, 4, 6, 15, 6);
    spirit(s, 4, 10, 15, 10);
  },
  /** a blade on a ripple of water, a gold glint where it meets */
  yu_flow: (s) => {
    swirl(s, 8, 12, 6, Math.PI, 2 * Math.PI, J[3]);
    swirl(s, 8, 12, 3.5, Math.PI, 2 * Math.PI, J[4]);
    jian(s, 3, 13, 13, 3);
    sparkle(s, 12, 4, 2.5, COIN_GOLD[3]);
  },
  /** a crescent of qi rolling along the floor */
  yu_tide: (s) => {
    floor(s, 14, J[2]);
    jian(s, 1, 4, 8, 13);
    qi(s, 9, 8, 5, J[5]);
    speedLines(s, 9, [4, 8, 12], 5, J[3]);
  },
  /** a long cut sweeping round behind and ahead */
  yu_crane: (s) => {
    swirl(s, 8, 9, 6.5, -Math.PI, 0.3, J[3]);
    jian(s, 2, 12, 14, 7);
  },
  /** petals of qi falling round a downward cut */
  yu_petal: (s) => {
    jian(s, 4, 3, 12, 13);
    drop(s, 3, 10, 1.3, J[4], WHITE);
    drop(s, 12, 4, 1.3, J[4], WHITE);
    drop(s, 8, 14, 1.1, J[3], WHITE);
  },
  /** a ring of qi under a figure in the air */
  yu_cloud: (s) => {
    sage(s, 8, 9);
    ring(s, 8, 12, 5, J[4]);
  },
  /** Yun's figure riding the jian */
  yu_ride: (s) => {
    jian(s, 2, 12, 15, 12);
    sage(s, 8, 11, J[4]);
    speedLines(s, 0, [7, 9], 3, J[2]);
  },
  /** a figure dodging through a foe, a spirit sword cutting it */
  yu_drift: (s) => {
    foe(s, 8, 9, 3);
    arrow(s, 1, 13, 15, 13, J[4]);
    spirit(s, 4, 3, 12, 11);
  },
  /** swords flying out in a fan */
  yu_fan: (s) => {
    spirit(s, 2, 8, 14, 2);
    spirit(s, 2, 8, 15, 8);
    spirit(s, 2, 8, 14, 14);
  },
  /** swords standing round a foe */
  yu_cage: (s) => {
    foe(s, 8, 10, 2.5);
    spirit(s, 3, 1, 3, 14);
    spirit(s, 13, 1, 13, 14);
    spirit(s, 8, 1, 8, 6);
    floor(s, 15);
  },
  /** a tall crescent of qi leaving the blade */
  yu_crescent: (s) => {
    jian(s, 1, 14, 7, 4);
    qi(s, 10, 8, 6, J[5]);
  },
  /** a foe with jade wounds glowing on it */
  yu_wound: (s) => {
    foe(s, 8, 8, 5);
    spirit(s, 1, 8, 6, 8);
    drop(s, 7, 6, 1, J[4], WHITE);
    drop(s, 10, 10, 1, J[4], WHITE);
    drop(s, 5, 11, 1, J[3], WHITE);
  },
  /** many fine cuts across a foe */
  yu_bleed: (s) => {
    foe(s, 8, 8, 5);
    for (const y of [4, 8, 12]) arrow(s, 2, y + 2, 14, y - 2, J[4], 1);
  },
  /** jade needles lodged in a foe */
  yu_needle: (s) => {
    foe(s, 7, 9, 4.5);
    for (const [x, y] of [
      [11, 3],
      [13, 7],
      [12, 12],
    ])
      spirit(s, x + 3, y - 1, x - 1, y + 1, J[5]);
  },
  /** a guardian sword circling a figure */
  yu_guardian: (s) => {
    sage(s, 8, 14);
    swirl(s, 8, 9, 6, 0, Math.PI * 1.5, J[2]);
    spirit(s, 14, 12, 14, 2);
  },
  /** a heron of qi in flight */
  yu_heron: (s) => {
    swirl(s, 6, 9, 4, Math.PI, Math.PI * 1.7, J[4]);
    swirl(s, 10, 9, 4, Math.PI * 1.3, Math.PI * 2, J[4]);
    arrow(s, 2, 10, 15, 8, J[5], 1.5);
  },
  /** Yun's shade behind a foe, cutting */
  yu_shade: (s) => {
    foe(s, 5, 10, 3.5);
    sage(s, 12, 15, J[2]);
    swirl(s, 9, 9, 5, -2.4, 0.4, J[4]);
  },
  /** a breath of qi round a fan of swords */
  yu_breath: (s) => {
    spirit(s, 4, 14, 6, 2);
    spirit(s, 8, 14, 8, 1);
    spirit(s, 12, 14, 10, 2);
    swirl(s, 8, 9, 7, -0.6, 3.7, J[2]);
  },
  /** a full fan of swords round a heart of light */
  yu_harmony: (s) => {
    sparkle(s, 8, 9, 3, J[5]);
    spirit(s, 2, 14, 4, 3);
    spirit(s, 14, 14, 12, 3);
    spirit(s, 8, 15, 8, 1);
  },
  /** swords falling point first on a foe */
  yu_rain: (s) => {
    foe(s, 8, 13, 2.5);
    spirit(s, 3, 1, 6, 10);
    spirit(s, 8, 0, 8, 9);
    spirit(s, 13, 1, 10, 10);
  },
};
