import { ENEMY_COLORS as EC, HERO_COLORS as HC, PAL, WORLD_COLORS as WC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { hex, WHITE } from "../../../utils/color";
import { arc, arrow, chevron, figure, fill, gem, ring, speedLines, sword } from "./parts";

const GHOST = PAL.shadow;
const RED = hex("#e0405a");

/** Phantom path icons: movement, crits and phantoms */
export const PHANTOM_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  p_djump: (s) => {
    chevron(s, 8, 2, 0, -1, 4, PAL.crystal[5]);
    chevron(s, 8, 7, 0, -1, 4, PAL.crystal[3]);
    fill(s, () => s.stroke(3, 14, 13, 14, 0.5, WC.slabEdge));
  },
  p_airdash: (s) => {
    fill(s, () => s.stroke(1, 14, 15, 14, 0.5, WC.slabEdge));
    fill(s, () => {
      for (const x of [2, 4, 6]) s.stroke(x, 4, x, 8, 0.35, GHOST[3]);
    });
    arrow(s, 7, 6, 14, 6, PAL.crystal[4]);
  },
  p_hang: (s) => {
    gem(s, 8, 4, 3, 4);
    fill(s, () => {
      s.stroke(8, 8, 8, 12, 0.4, HC.coat);
      s.dot(8, 13, 1.3, HC.glove);
    });
  },
  p_fleet: (s) => {
    fill(s, () =>
      s.poly(
        [
          [4, 4],
          [8, 4],
          [8, 10],
          [13, 11],
          [13, 13],
          [4, 13],
        ],
        HC.boot,
      ),
    );
    fill(s, () => {
      s.stroke(5, 5, 7, 5, 0.4, HC.bootLight);
      s.stroke(1, 6, 4, 7, 0.4, WHITE);
      s.stroke(1, 9, 4, 9, 0.4, WHITE);
    });
  },
  p_whirl: (s) => {
    arc(s, 8, 8, 6, 0, 4.5, PAL.crystal[3]);
    arc(s, 8, 8, 3.5, 1.5, 6, PAL.crystal[4]);
    fill(s, () => s.set(8, 8, WHITE));
  },
  p_meteor: (s) => {
    arrow(s, 8, 1, 8, 10, PAL.crystal[4]);
    fill(s, () => {
      for (let x = 2; x <= 14; x++) s.set(x, 13 + Math.round(Math.abs(x - 8) / 6), PAL.crystal[2]);
    });
  },
  p_crit: (s) => {
    ring(s, 8, 8, 5.5, WHITE);
    fill(s, () => {
      s.stroke(8, 0.5, 8, 4, 0.4, WHITE);
      s.stroke(8, 12, 8, 15.5, 0.4, WHITE);
      s.stroke(0.5, 8, 4, 8, 0.4, WHITE);
      s.stroke(12, 8, 15.5, 8, 0.4, WHITE);
      s.dot(8, 8, 1.2, RED);
    });
  },
  p_dashcut: (s) => {
    fill(s, () => {
      for (const x of [2, 4, 6]) s.stroke(x, 5, x, 11, 0.35, GHOST[4]);
    });
    sword(s, 6, 8, 15, 8);
  },
  p_thrust: (s) => {
    speedLines(s, 6, [4, 12], 5, PAL.crystal[3]);
    fill(s, () => {
      s.stroke(2, 8, 11, 8, 0.6, HC.hilt);
      s.poly(
        [
          [10, 5.5],
          [15, 8],
          [10, 10.5],
        ],
        HC.blade,
      );
      s.set(14, 8, WHITE);
    });
  },
  p_warpcraft: (s) => {
    fill(s, () => {
      for (const [x, y] of [
        [2, 14],
        [4, 12],
        [6, 10],
      ])
        s.set(x, y, PAL.crystal[4]);
    });
    sword(s, 7, 10, 14, 3);
    ring(s, 4, 5, 2.5, PAL.crystal[3]);
  },
  p_ddash: (s) => {
    chevron(s, 7, 8, 1, 0, 4, PAL.crystal[3]);
    chevron(s, 10, 8, 1, 0, 4, PAL.crystal[4]);
    chevron(s, 15, 8, 1, 0, 4, PAL.crystal[5]);
  },
  p_quick: (s) => {
    fill(s, () => {
      s.poly(
        [
          [4, 2],
          [12, 2],
          [8, 8],
        ],
        PAL.crystal[2],
      );
      s.poly(
        [
          [8, 8],
          [12, 14],
          [4, 14],
        ],
        PAL.crystal[4],
      );
    });
    fill(s, () => {
      s.stroke(3, 1.5, 13, 1.5, 0.45, HC.trim);
      s.stroke(3, 14.5, 13, 14.5, 0.45, HC.trim);
    });
  },
  p_blink: (s) => {
    figure(s, 4, 15, GHOST[3], GHOST[2]);
    figure(s, 12, 15, HC.hair, HC.coat);
    arrow(s, 5, 4, 11, 4, PAL.crystal[4], 2);
  },
  p_ult: (s) => {
    figure(s, 3, 15, GHOST[4], GHOST[2]);
    figure(s, 13, 15, GHOST[4], GHOST[2]);
    figure(s, 8, 13, EC.eye, GHOST[3]);
  },
};
