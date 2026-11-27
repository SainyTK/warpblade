import { COIN_GOLD, PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { arc, arrow, chevron, figure, fill, flame, ring, sparkle, speedLines } from "../../../../ui/skills/icons/parts";
import { hex, WHITE } from "../../../../utils/color";
import { CRIMSON } from "../../constants/colors";
import { crack, crest, floor, greatsword, heavyArc } from "./parts";

const FOE = { body: PAL.shadow[3], eye: PAL.shadow[5] } as const;
const SKIN = hex("#f0c8a0");
const STEEL = hex("#867b80");

/** a foe's round body at (x, y) */
function foe(s: SpriteCanvas, x: number, y: number, r: number): void {
  fill(s, () => s.dot(x, y, r, FOE.body));
  fill(s, () => s.set(Math.round(x - r * 0.4), Math.round(y - r * 0.3), FOE.eye));
}

/** an ember: a small crimson flame dot */
function ember(s: SpriteCanvas, x: number, y: number): void {
  fill(s, () => {
    s.dot(x, y, 0.9, CRIMSON[4]);
    s.set(x, y - 1, CRIMSON[5]);
  });
}

/** Brynn's 20 skill icons, 16 by 16, in her crimson */
export const BRYNN_SKILL_BASE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** a heavy swing: the sword with a gold beat mark */
  br_heavy: (s) => {
    greatsword(s, 3, 13, 12, 4);
    sparkle(s, 12, 11, 2.5, COIN_GOLD[3]);
  },
  /** a wide flat arc round a foe */
  br_cleave: (s) => {
    foe(s, 11, 9, 3);
    heavyArc(s, 7, 9, 7, 2.6, 6.8, 1);
  },
  /** the heave throwing a foe up */
  br_launch: (s) => {
    greatsword(s, 4, 14, 8, 4, 1);
    foe(s, 12, 4, 2.5);
    arrow(s, 12, 13, 12, 8, CRIMSON[4]);
  },
  /** the slam into the floor and its shockwave */
  br_slam: (s) => {
    floor(s);
    greatsword(s, 3, 3, 9, 13, 1.1);
    crest(s, 14, 6, 4);
  },
  /** the Counter Cleave off a parry spark */
  br_counter: (s) => {
    sparkle(s, 5, 6, 3, CRIMSON[5]);
    heavyArc(s, 8, 8, 6, -2.4, 1, 1.2);
    foe(s, 13, 11, 2.5);
  },
  /** the greatsword spinning end over end */
  br_spin: (s) => {
    greatsword(s, 4, 12, 12, 4, 1);
    arc(s, 8, 8, 7, -2.8, -1.4, CRIMSON[4]);
    arc(s, 8, 8, 7, 0.4, 1.8, CRIMSON[4]);
  },
  /** the falling slam landing in a crater */
  br_crater: (s) => {
    heavyArc(s, 8, 14, 7, 3.3, 6.1, 0.8);
    greatsword(s, 8, 3, 8, 13, 1.4);
    chevron(s, 3, 9, -1, 0, 2, CRIMSON[4]);
    chevron(s, 13, 9, 1, 0, 2, CRIMSON[4]);
  },
  /** a shoulder driving forward through a foe */
  br_charge: (s) => {
    speedLines(s, 1, [5, 8, 11], 3, CRIMSON[3]);
    figure(s, 7, 13, SKIN, CRIMSON[2]);
    fill(s, () => s.dot(8.5, 7.5, 1.8, STEEL));
    foe(s, 13, 9, 2.5);
  },
  /** a tall crimson crescent in flight */
  br_arc: (s) => {
    heavyArc(s, 5, 8, 6, -1.3, 1.3, 1.4);
    speedLines(s, 1, [4, 12], 3, CRIMSON[3]);
  },
  /** pillars bursting from the floor */
  br_pillars: (s) => {
    floor(s);
    for (const [x, h] of [
      [4, 5],
      [8, 8],
      [12, 11],
    ] as const)
      fill(s, () => {
        s.stroke(x, 14, x, 14 - h, 1, CRIMSON[3]);
        s.stroke(x, 14, x, 14 - h, 0.35, CRIMSON[5]);
        s.set(x, 14 - h, WHITE);
      });
  },
  /** a roar: rings out from a face */
  br_cry: (s) => {
    ring(s, 8, 8, 6.5, CRIMSON[3]);
    ring(s, 8, 8, 4, CRIMSON[4]);
    fill(s, () => s.dot(8, 8, 2, SKIN));
    fill(s, () => s.set(9, 9, CRIMSON[1]));
  },
  br_cinder: (s) => {
    heavyArc(s, 7, 9, 6, -2.5, 0.7, 1);
    foe(s, 11, 11, 2.8);
    ember(s, 10, 10);
    ember(s, 13, 12);
    ember(s, 4, 14);
  },
  /** a burning crack in the floor */
  br_fault: (s) => {
    floor(s, CRIMSON[1]);
    crack(s, 1, 15);
    crest(s, 6, 5, 2);
    crest(s, 12, 7, 3);
  },
  /** a foe pressed down under a weight */
  br_crush: (s) => {
    floor(s);
    fill(s, () => s.stroke(7, 11, 11, 11, 2, FOE.body));
    fill(s, () => s.block(4, 3, STEEL, 8, 3));
    arrow(s, 8, 6, 8, 9, CRIMSON[4], 2);
    ember(s, 13, 10);
  },
  /** a phantom greatsword falling point first */
  br_falling: (s) => {
    floor(s);
    fill(s, () => s.stroke(4, 1, 4, 5, 0.3, CRIMSON[2]));
    fill(s, () => s.stroke(12, 1, 12, 5, 0.3, CRIMSON[2]));
    fill(s, () =>
      s.poly(
        [
          [6, 4],
          [10, 4],
          [10, 11],
          [8, 13],
          [6, 11],
        ],
        CRIMSON[3],
      ),
    );
    fill(s, () => s.stroke(6.5, 4.5, 6.5, 11, 0.3, CRIMSON[5]));
    fill(s, () => s.stroke(4, 3.5, 12, 3.5, 0.6, CRIMSON[4]));
    fill(s, () => s.stroke(8, 0.5, 8, 3, 0.5, CRIMSON[2]));
    fill(s, () => s.set(8, 13, WHITE));
  },
  /** a crimson echo behind a foe */
  br_echo: (s) => {
    fill(s, () => s.dot(12, 7, 2.2, CRIMSON[2]));
    fill(s, () => s.stroke(12, 9, 12, 14, 1.2, CRIMSON[2]));
    heavyArc(s, 10, 9, 5, -2.6, 0.6, 1);
    foe(s, 5, 11, 2.5);
  },
  br_splinter: (s) => {
    greatsword(s, 2, 14, 8, 8, 1.2);
    for (const [x, y] of [
      [10.5, 3],
      [14, 7.5],
      [12.5, 13],
    ] as const)
      fill(s, () => {
        s.poly(
          [
            [x, y - 2.5],
            [x + 1.8, y],
            [x, y + 2.5],
            [x - 1.8, y],
          ],
          CRIMSON[3],
        );
        s.set(x, y - 1, WHITE);
      });
    speedLines(s, 11, [7], 2, CRIMSON[4]);
  },
  /** a heavy pauldron */
  br_ironskin: (s) => {
    fill(s, () => s.dot(8, 9, 5, STEEL));
    fill(s, () => s.dot(8, 12, 4, hex("#4e464e")));
    fill(s, () => s.stroke(3, 10, 13, 10, 0.4, hex("#c48a3c")));
    fill(s, () => s.set(6, 6, WHITE));
  },
  /** the HF bar filling, a flame under it */
  br_bellows: (s) => {
    fill(s, () => s.block(2, 4, CRIMSON[1], 12, 3));
    fill(s, () => s.block(2, 4, CRIMSON[4], 9, 3));
    flame(s, 8, 14, 6);
  },
  /** one huge crescent over the floor */
  br_fall: (s) => {
    floor(s);
    heavyArc(s, 8, 10, 7, -2.9, 0.4, 1.6);
    sparkle(s, 13, 3, 2, CRIMSON[5]);
  },
};
