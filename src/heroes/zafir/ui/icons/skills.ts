import type { SpriteCanvas } from "../../../../engine/sprite";
import { arrow, crescent, drop, figure, fill, sparkle } from "../../../../ui/skills/icons/parts";
import { WHITE } from "../../../../utils/color";
import { funnel, grains, ICON, sandRing, scimitar, shard, wind, wound } from "./parts";

/** a small foe's body at (x, y) */
function foe(s: SpriteCanvas, x: number, y: number, r = 2.6): void {
  fill(s, () => {
    s.dot(x, y, r, ICON.saffronDeep);
    s.set(x + r * 0.4, y - r * 0.3, WHITE);
  });
}

/** a hawk, wings spread, at (x, y) */
function hawk(s: SpriteCanvas, x: number, y: number): void {
  fill(s, () => {
    s.stroke(x - 5, y - 2, x, y, 0.6, ICON.sand[3]);
    s.stroke(x + 5, y - 2, x, y, 0.6, ICON.sand[3]);
    s.stroke(x - 3, y - 1, x + 3, y - 1, 0.45, ICON.sand[2]);
    s.dot(x, y + 1, 0.7, ICON.sand[1]);
  });
}

/** Zafir's 20 skill icons */
export const ZAFIR_SKILL_BASE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** the scimitar inside a ring of cut, a crescent flying off each side */
  za_whirling: (s) => {
    crescent(s, 8, 9, 6, 2.8, 6.9, ICON.saffron);
    scimitar(s, 5, 12, 12, 5);
    crescent(s, 1.5, 9, 2.5, -1, 1, ICON.sand[0]);
    crescent(s, 14.5, 9, 2.5, 2.1, 4.2, ICON.sand[0]);
  },
  /** the scimitar with a hot spark at its point and a gust after it */
  za_sirocco: (s) => {
    scimitar(s, 3, 13, 12, 4);
    sparkle(s, 12, 4, 2.5, ICON.saffron);
    wind(s, 9, 15, 10, ICON.sand[1]);
    wind(s, 10, 15, 13, ICON.sand[2]);
  },
  /** a foe with wounds torn open, red spraying */
  za_veins: (s) => {
    foe(s, 8, 9, 4);
    wound(s, 6, 7);
    wound(s, 10, 10);
    grains(
      s,
      [
        [2, 4],
        [14, 5],
        [3, 13],
        [13, 14],
      ],
      ICON.wound[1],
    );
  },
  /** a figure with a cut on each side */
  za_twofaced: (s) => {
    figure(s, 8, 14, ICON.saffron, ICON.saffronDeep);
    crescent(s, 3, 9, 3.5, -1.4, 1.4, ICON.sand[0]);
    crescent(s, 13, 9, 3.5, 1.7, 4.5, ICON.sand[0]);
  },
  /** a turn dropping onto a ring in the sand */
  za_falling: (s) => {
    crescent(s, 8, 6, 4.5, 2.8, 6.9, ICON.saffron);
    arrow(s, 8, 1, 8, 9, ICON.sand[0], 2.5);
    sandRing(s, 8, 13, 6.5, 12);
  },
  /** footprints in sand behind a walking spin */
  za_dune: (s) => {
    crescent(s, 10, 8, 4.5, 2.8, 6.9, ICON.saffron);
    grains(
      s,
      [
        [2, 14],
        [4, 13],
        [6, 14],
        [8, 13],
      ],
      ICON.sand[2],
    );
    wind(s, 12, 15, 8, ICON.sand[0]);
  },
  /** the thrown scimitar, a spin where it lands */
  za_arrival: (s) => {
    wind(s, 1, 6, 3, ICON.sand[2]);
    wind(s, 1, 5, 6, ICON.sand[2]);
    scimitar(s, 5, 4, 14, 4);
    crescent(s, 9, 11, 4.5, 2.8, 6.9, ICON.saffron);
  },
  /** a dodge through a foe, sand behind */
  za_slip: (s) => {
    foe(s, 8, 8, 3);
    arrow(s, 1, 9, 15, 9, ICON.sand[0]);
    grains(
      s,
      [
        [2, 5],
        [3, 12],
        [1, 7],
      ],
      ICON.sand[2],
    );
  },
  /** lines of hot wind */
  za_gale: (s) => {
    wind(s, 2, 9, 8, ICON.saffron);
    wind(s, 3, 12, 5, ICON.sand[1]);
    wind(s, 3, 12, 11, ICON.sand[1]);
    wind(s, 6, 14, 2, ICON.sand[2]);
    wind(s, 6, 14, 14, ICON.sand[2]);
  },
  /** shards of glass falling */
  za_glass: (s) => {
    shard(s, 3, 9, 6);
    shard(s, 8, 12, 6);
    shard(s, 13, 8, 6);
    grains(
      s,
      [
        [1, 15],
        [5, 15],
        [10, 15],
        [15, 15],
      ],
      ICON.sand[2],
    );
  },
  /** a pit swirling down into the sand, a foe sinking */
  za_quicksand: (s) => {
    sandRing(s, 8, 11, 6.5, 16, ICON.sand[2]);
    sandRing(s, 8, 11, 3.5, 10, ICON.sand[1]);
    foe(s, 8, 8, 2.4);
  },
  /** a deep wound, three drops falling */
  za_deep: (s) => {
    wound(s, 8, 5);
    drop(s, 4, 12, 1.4, ICON.wound[1], ICON.wound[0]);
    drop(s, 8, 14, 1.4, ICON.wound[1], ICON.wound[0]);
    drop(s, 12, 12, 1.4, ICON.wound[1], ICON.wound[0]);
  },
  /** grit ringing a foe, a shard of glass from it */
  za_scour: (s) => {
    foe(s, 8, 9, 3.5);
    sandRing(s, 8, 9, 6.5, 14, ICON.sand[1]);
    shard(s, 13, 5, 4);
  },
  /** a dry drop over cracked sand */
  za_thirst: (s) => {
    drop(s, 8, 8, 2.6, ICON.wound[1], ICON.wound[0]);
    fill(s, () => {
      s.stroke(1, 14, 6, 13, 0.45, ICON.sand[3]);
      s.stroke(6, 13, 10, 15, 0.45, ICON.sand[3]);
      s.stroke(10, 15, 15, 13, 0.45, ICON.sand[3]);
    });
  },
  /** a hooded whirl of sand with two dark eyes */
  za_wraith: (s) => {
    funnel(s, 8, 5, 15, 4.5, 1.5);
    fill(s, () => s.dot(8, 4, 3, ICON.sand[2]));
    fill(s, () => {
      s.set(7, 4, ICON.hilt);
      s.set(9.5, 4, ICON.hilt);
    });
  },
  /** a pale second figure beside his own, cutting */
  za_mirage: (s) => {
    figure(s, 5, 14, ICON.saffron, ICON.saffronDeep);
    figure(s, 11, 14, ICON.sand[0], ICON.sand[1]);
    crescent(s, 11, 8, 4, 2.8, 6.9, ICON.sand[0]);
  },
  /** a hawk stooping onto a foe */
  za_hawk: (s) => {
    hawk(s, 6, 4);
    arrow(s, 7, 6, 11, 10, ICON.sand[0], 2);
    foe(s, 12, 12, 2.6);
  },
  /** a figure inside an unbroken ring of sand */
  za_unbroken: (s) => {
    figure(s, 8, 14, ICON.saffron, ICON.saffronDeep);
    sandRing(s, 8, 10, 6.5, 18);
  },
  /** the raised scimitar beside a wall of sand */
  za_veil: (s) => {
    funnel(s, 4, 2, 14, 2.5, 2.5);
    scimitar(s, 11, 14, 11, 2);
  },
  /** a storm funnel with grains flying */
  za_storm: (s) => {
    funnel(s, 8, 1, 15, 7, 2);
    grains(
      s,
      [
        [1, 13],
        [15, 12],
        [1, 5],
        [15, 6],
      ],
      ICON.saffron,
    );
  },
};
