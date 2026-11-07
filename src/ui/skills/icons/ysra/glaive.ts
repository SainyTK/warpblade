import { EMBER } from "../../../../constants/characters/ysra/look";
import { ENEMY_COLORS as EC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { evolvedStar } from "../evolution";
import { arc, arrow, chevron, crescent, fill, speedLines } from "../parts";
import { ember, floor, foe, glaive, seg } from "./parts";

/** a flyer: a foe with a pair of small wings */
function flyer(s: SpriteCanvas, x: number, y: number): void {
  fill(s, () => {
    seg(s, x - 4, y - 2, x - 2, y, EC.rim);
    seg(s, x + 4, y - 2, x + 2, y, EC.rim);
  });
  foe(s, x, y, 2.2);
}

/** Ysra's glaive attack icons and their evolved forms */
export const GLAIVE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** Deep Heft: the glaive drawn back while a coil of heat winds up behind it */
  y_heft: (s) => {
    arc(s, 4, 9, 3.5, 0.6, 5.6, EMBER[3]);
    arc(s, 4, 9, 1.8, 0.6, 5.6, EMBER[5]);
    glaive(s, 2, 9, 15, 9);
  },
  /** Rail Lance: the lunge run through a line of foes */
  y_heft_evo: (s) => {
    foe(s, 4, 10, 2.6);
    foe(s, 10, 10, 2.6);
    speedLines(s, 4.5, [6.5, 14.5], 3, EMBER[3]);
    speedLines(s, 15.5, [14.5], 6, EMBER[3]);
    glaive(s, 0, 10, 15, 10);
    evolvedStar(s);
  },
  /** Impale: a foe pinned to the floor under the glaive */
  y_impale: (s) => {
    floor(s, 1, 15, 15);
    foe(s, 8, 11);
    glaive(s, 8, 1, 8, 14, false, 5);
    fill(s, () => {
      seg(s, 3, 14, 4, 13, EMBER[4]);
      seg(s, 13, 14, 12, 13, EMBER[4]);
    });
  },
  /** Pillory: a row of burning stakes driven into the floor, a foe pinned on the middle one */
  y_impale_evo: (s) => {
    floor(s, 0, 16, 15, EMBER[2]);
    foe(s, 7, 11, 2.6);
    for (const x of [2, 7, 12]) {
      glaive(s, x, 5, x, 15, false, 4);
      ember(s, x, 6, 4);
    }
    evolvedStar(s);
  },
  /** Windmill: the glaive spun overhead, drawing foes in from both sides */
  y_windmill: (s) => {
    crescent(s, 8, 8, 6, Math.PI * 0.9, Math.PI * 2.1, EMBER[3]);
    crescent(s, 8, 8, 6, Math.PI * -0.1, Math.PI * 0.1, EMBER[3]);
    glaive(s, 2, 9, 14, 5);
    chevron(s, 4.5, 14.5, 1, 0, 2, EMBER[5]);
    chevron(s, 11.5, 14.5, -1, 0, 2, EMBER[5]);
  },
  /** Fire Wheel: the spinning glaive inside a whole wheel of flame */
  y_windmill_evo: (s) => {
    crescent(s, 7, 9, 5.5, 0, Math.PI, EMBER[3]);
    crescent(s, 7, 9, 5.5, Math.PI, Math.PI * 2, EMBER[4]);
    glaive(s, 2, 14, 12, 4);
    evolvedStar(s);
  },
  /** Counter Thrust: a blow turned back into a thrust, a hook round to the front and the glaive driving through */
  y_counter: (s) => {
    arc(s, 7, 6, 4, Math.PI * 0.5, Math.PI * 1.9, EMBER[4]);
    chevron(s, 11.5, 4.5, 1, -0.2, 2, EMBER[5]);
    glaive(s, 1, 12, 15, 12);
    foe(s, 13, 8, 2);
  },
  /** Sun Piercer: a burning thrust out of a sun, running the whole width */
  y_counter_evo: (s) => {
    fill(s, () => s.dot(3, 10, 3, EMBER[3]));
    fill(s, () => {
      seg(s, 5, 7, 15, 7, EMBER[4]);
      seg(s, 5, 13, 15, 13, EMBER[4]);
      seg(s, 8, 5, 13, 5, EMBER[3]);
      seg(s, 8, 15, 13, 15, EMBER[3]);
    });
    glaive(s, 1, 10, 15, 10);
    evolvedStar(s);
  },
  /** Skyhook: the glaive's hook reaching up to a flyer and dragging it down */
  y_skyhook: (s) => {
    floor(s, 1, 15, 15);
    flyer(s, 10, 4);
    glaive(s, 2, 15, 9, 3, true, 6);
    arrow(s, 14.5, 5.5, 14.5, 13.5, EMBER[5], 2.5);
  },
  /** Heaven's Hook: every flyer hooked down into one heap, slammed at her feet */
  y_skyhook_evo: (s) => {
    floor(s, 0, 16, 15);
    foe(s, 4, 12, 2.4);
    foe(s, 9, 12, 2.4);
    foe(s, 6.5, 8, 2.4);
    arrow(s, 2.5, 0.5, 2.5, 6.5, EMBER[5], 2.5);
    arrow(s, 7.5, 0.5, 7.5, 4.5, EMBER[5], 2.5);
    glaive(s, 13, 15, 13, 7, false, 5);
    evolvedStar(s);
  },
};
