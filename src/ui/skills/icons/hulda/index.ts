import { RUST } from "../../../../constants/characters/hulda/look";
import { COIN_GOLD } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { arc, arrow, chevron, fill, ring, sparkle, speedLines } from "../parts";
import { floor, foe, heart, seg } from "../ysra/parts";
import { bear, body, crack, fist, HC, plate, shards, shield } from "./parts";

/** the gold of an evolved icon */
const GOLD = COIN_GOLD[3];
const GOLD_LIGHT = COIN_GOLD[4];

/** Hulda's icons: her own sources, her 20 skills and their evolutions (`<id>_evo`, with a gold accent) */
export const HULDA_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** her blows: a heavy fist driving down, weight lines over it */
  h_fists: (s) => {
    speedLines(s, 9, [2, 4], 7, RUST[4]);
    fist(s, 9, 10, 4.6);
  },
  /** Bellow: rings rolling out from her toward a foe */
  h_bellow: (s) => {
    fill(s, () => s.dot(3, 8, 2.4, RUST[4]));
    arc(s, 3, 8, 6, -0.9, 0.9, RUST[5]);
    arc(s, 3, 8, 10, -0.7, 0.7, RUST[4]);
    foe(s, 13, 8, 2.4, -1);
  },
  /** Quake Drop: two fists on the floor and a crack running out lit from below */
  h_quake: (s) => {
    crack(s, 14, RUST[4], RUST[5]);
    fist(s, 5, 9, 3.2, -1);
    fist(s, 11, 9, 3.2);
    sparkle(s, 8, 13, 2, RUST[6]);
  },

  /** a fist pushing a curved pressure wave ahead */
  h_knuckleWave: (s) => {
    fist(s, 5, 8, 3.4);
    arc(s, 6, 8, 6, -0.8, 0.8, RUST[5]);
    arc(s, 6, 8, 9, -0.6, 0.6, RUST[4]);
  },
  /** waves running both ways from the fist, a burst at each end */
  h_knuckleWave_evo: (s) => {
    fist(s, 8, 8, 3);
    arc(s, 8, 8, 6, -0.7, 0.7, RUST[5]);
    arc(s, 8, 8, 6, Math.PI - 0.7, Math.PI + 0.7, RUST[5]);
    sparkle(s, 15, 8, 2, GOLD);
    sparkle(s, 1, 8, 2, GOLD);
  },
  /** an overhand fist coming down onto a cracked floor */
  h_haymaker: (s) => {
    crack(s, 14, RUST[3], RUST[4]);
    arc(s, 9, 9, 7, -2.6, -0.6, RUST[5]);
    fist(s, 10, 9, 4, 1);
  },
  /** a foe spiked into a quake, a gold fist over it */
  h_haymaker_evo: (s) => {
    crack(s, 14, GOLD, GOLD_LIGHT);
    body(s, 8, 12, 2.4);
    fist(s, 8, 5, 3.6, 1);
    sparkle(s, 2, 11, 2, RUST[5]);
    sparkle(s, 14, 11, 2, RUST[5]);
  },
  /** both hands closing on a foe mid-swing, a flash between them */
  h_counterGrab: (s) => {
    foe(s, 9, 7, 3, -1);
    fist(s, 4, 4, 2.6, 1);
    fist(s, 4, 11, 2.6, 1);
    sparkle(s, 13, 3, 2.2, RUST[6]);
  },
  /** a big foe lifted overhead, gold flash */
  h_counterGrab_evo: (s) => {
    body(s, 8, 4, 3.6);
    fist(s, 4, 9, 2.6, 1);
    fist(s, 12, 9, 2.6, -1);
    floor(s, 1, 14, 15, HC.trim);
    sparkle(s, 14, 2, 2, GOLD);
  },
  /** a body hitting the floor in a burst */
  h_wreckingThrow: (s) => {
    floor(s, 0, 15, 14, HC.trim);
    body(s, 8, 10, 3.4);
    sparkle(s, 2, 9, 3, RUST[5]);
    sparkle(s, 14, 8, 3, RUST[5]);
    arrow(s, 2, 1, 6, 5, RUST[4], 2);
  },
  /** a body flying flat at a wall, gold blast on the wall */
  h_wreckingThrow_evo: (s) => {
    fill(s, () => seg(s, 15, 1, 15, 14, HC.trim));
    speedLines(s, 7, [6, 9, 12], 6, RUST[4]);
    body(s, 10, 9, 2.8);
    sparkle(s, 14, 9, 3, GOLD);
  },
  /** a body swung round in a circle */
  h_giantSwing: (s) => {
    ring(s, 8, 8, 6.5, RUST[3]);
    fill(s, () => s.dot(8, 8, 2, HC.coat));
    body(s, 14, 8, 2.4);
    arrow(s, 9, 1, 4, 2, RUST[5], 2);
  },
  /** a whirlwind: two gold rings and a flung body */
  h_giantSwing_evo: (s) => {
    ring(s, 8, 8, 6.5, GOLD);
    ring(s, 8, 8, 4, RUST[4]);
    fill(s, () => s.dot(8, 8, 1.8, HC.coat));
    body(s, 14, 4, 2.2);
    body(s, 2, 12, 2.2);
  },
  /** a lowered shoulder carrying a foe, speed lines behind */
  h_bullHorns: (s) => {
    speedLines(s, 5, [8, 11, 14], 5, RUST[4]);
    fill(s, () => s.dot(10, 11, 4.2, HC.coat));
    plate(s, 6, 6, 8, 3);
    body(s, 11, 3, 2.6);
  },
  /** a heap of foes on the shoulder, a gold crater below */
  h_bullHorns_evo: (s) => {
    arc(s, 8, 15, 7, Math.PI, Math.PI * 2, GOLD);
    fill(s, () => s.dot(9, 12, 3.6, HC.coat));
    plate(s, 5, 8, 8, 3);
    body(s, 7, 4, 2.2);
    body(s, 12, 3, 2.2);
    body(s, 10, 0.5, 1.8);
  },
  /** cracks trailing behind a charging shoulder */
  h_stampede: (s) => {
    crack(s, 14, RUST[3], RUST[4], 0, 9);
    fill(s, () => s.dot(12, 9, 3.4, HC.coat));
    plate(s, 9, 5, 6, 3);
    speedLines(s, 7, [5, 8], 5, RUST[4]);
  },
  /** two shields beside the charge, the trail lit gold */
  h_stampede_evo: (s) => {
    crack(s, 14, GOLD, GOLD_LIGHT, 0, 11);
    fill(s, () => s.dot(9, 8, 3, HC.coat));
    shield(s, 13, 5, 2.4, RUST[5]);
    shield(s, 13, 11, 2.4, RUST[5]);
  },
  /** two hands diving down from above onto a foe */
  h_skyfall: (s) => {
    chevron(s, 8, 9, 0, 1, 3, RUST[5]);
    fist(s, 5, 4, 2.4, 1);
    fist(s, 11, 4, 2.4, -1);
    floor(s, 1, 14, 15, HC.trim);
    foe(s, 8, 12, 2.2, -1);
  },
  /** a gold comet falling onto the floor */
  h_skyfall_evo: (s) => {
    fill(s, () => {
      s.stroke(2, 1, 9, 9, 1, COIN_GOLD[2]);
      s.stroke(4, 1, 10, 8, 0.6, GOLD_LIGHT);
    });
    fist(s, 10, 10, 3.2, 1);
    floor(s, 1, 14, 15, HC.trim);
    sparkle(s, 14, 13, 2, GOLD);
  },
  /** a thick heart under a plate */
  h_ironHide: (s) => {
    heart(s, 8, 10, 6, RUST[3], RUST[5]);
    plate(s, 3, 1, 10, 3);
  },
  /** a wall of stacked plates, gold top */
  h_ironHide_evo: (s) => {
    plate(s, 1, 1, 6, 4);
    plate(s, 9, 1, 6, 4);
    plate(s, 1, 6, 6, 4);
    plate(s, 9, 6, 6, 4);
    plate(s, 5, 11, 6, 4);
    fill(s, () => seg(s, 2, 0, 14, 0, GOLD));
  },
  /** a gauntlet flying out on a chain to a foe */
  h_ironChain: (s) => {
    fill(s, () => {
      for (let x = 2; x <= 9; x += 2) s.dot(x, 11 - x * 0.4, 0.8, HC.steelLight);
    });
    fist(s, 11, 6, 2.6, 1);
    foe(s, 14, 3, 1.8, -1);
  },
  /** chains fanning out four ways, gold links */
  h_ironChain_evo: (s) => {
    fill(s, () => {
      for (const [dx, dy] of [
        [1, -1],
        [-1, -1],
        [1, 0.2],
        [-1, 0.2],
      ]) {
        for (let k = 2.5; k <= 6.5; k += 2) s.dot(8 + dx * k, 9 + dy * k, 0.9, GOLD);
      }
    });
    fist(s, 8, 10, 2.6, 1);
  },

  /** a boot stamping, a tremor ring along the floor */
  h_tremorStomp: (s) => {
    arc(s, 8, 14, 6, Math.PI, Math.PI * 2, RUST[4]);
    floor(s, 0, 15, 14, HC.trim);
    fill(s, () => {
      s.poly(
        [
          [6, 3],
          [10, 3],
          [10, 10],
          [12, 13],
          [5, 13],
          [6, 10],
        ],
        HC.steel,
      );
      seg(s, 6, 3, 10, 3, HC.steelGlint);
    });
  },
  /** the floor split wall to wall in gold */
  h_tremorStomp_evo: (s) => {
    crack(s, 13, GOLD, GOLD_LIGHT);
    arc(s, 8, 13, 5, Math.PI, Math.PI * 2, RUST[5]);
    arc(s, 8, 13, 8, Math.PI, Math.PI * 2, RUST[4]);
    fill(s, () => s.dot(8, 9, 2, HC.steel));
  },
  /** crossed gauntlets behind a plate, a blow breaking on it */
  h_ironWall: (s) => {
    plate(s, 3, 3, 10, 10);
    fist(s, 6, 8, 2.2, 1);
    fist(s, 10, 8, 2.2, -1);
    sparkle(s, 1, 4, 2, RUST[6]);
  },
  /** the wall with a gold rim and a fist above it */
  h_ironWall_evo: (s) => {
    plate(s, 3, 6, 10, 9);
    fill(s, () => seg(s, 4, 6, 12, 6, GOLD));
    fist(s, 8, 2.5, 2.4, 1);
    sparkle(s, 14, 3, 2, GOLD);
  },
  /** a fist leaving purple bruise marks on a foe */
  h_bruise: (s) => {
    foe(s, 11, 8, 4, -1);
    fill(s, () => {
      s.dot(10, 6.5, 1.3, RUST[1]);
      s.dot(12.5, 10, 1.2, RUST[1]);
      s.dot(9.5, 10.5, 1, RUST[2]);
    });
    fist(s, 3.5, 8, 2.6, 1);
  },

  /** a bruised foe shattering into gold shards */
  h_bruise_evo: (s) => {
    foe(s, 8, 8, 4, -1);
    fill(s, () => {
      s.dot(7, 7, 1.2, RUST[1]);
      s.dot(9.5, 10, 1, RUST[1]);
    });
    shards(s, 8, 8, 8, GOLD);
  },

  /** two fists clenched round a body */
  h_fracture: (s) => {
    body(s, 8, 8, 4);
    fist(s, 3, 8, 2.8, 1);
    fist(s, 13, 8, 2.8, -1);
  },
  /** a body cracked through in gold */
  h_fracture_evo: (s) => {
    body(s, 8, 8, 5);
    fill(s, () => {
      seg(s, 6, 3, 9, 7, GOLD);
      seg(s, 9, 7, 7, 10, GOLD);
      seg(s, 7, 10, 10, 13, GOLD);
    });
  },
  /** a cracked plate spraying rust flecks */
  h_rustShards: (s) => {
    plate(s, 1, 6, 8, 7, true);
    shards(s, 10, 6, 5, RUST[3]);
  },
  /** rust flecks swirling into a gold burst */
  h_rustShards_evo: (s) => {
    plate(s, 4, 6, 8, 7, true);
    shards(s, 8, 8, 7, RUST[3]);
    sparkle(s, 8, 3, 2.4, GOLD);
  },
  /** a round shield charging, speed lines behind */
  h_shieldSister: (s) => {
    fill(s, () => {
      for (const [i, y] of [4, 8, 12].entries()) s.block(1 + i, y, RUST[4], 5 - i, 1);
    });
    shield(s, 11, 8, 4.2, RUST[5]);
  },

  /** two shields facing each other across the floor, gold bosses */
  h_shieldSister_evo: (s) => {
    shield(s, 4, 8, 3.4, GOLD);
    shield(s, 12, 8, 3.4, GOLD);
    floor(s, 0, 15, 14, HC.trim);
  },
  /** a pale bear's head dropping onto the floor */
  h_spiritBear: (s) => {
    floor(s, 0, 15, 15, HC.trim);
    bear(s, 8, 8, RUST[5]);
    arrow(s, 8, 0, 8, 2, RUST[4], 1);
  },
  /** two bears side by side, gold eyes */
  h_spiritBear_evo: (s) => {
    bear(s, 4.5, 9, RUST[5], GOLD);
    bear(s, 11.5, 7, RUST[5], GOLD);
  },
  /** a giant pale fist slamming down on a small foe */
  h_ancestorFist: (s) => {
    floor(s, 0, 15, 15, HC.trim);
    foe(s, 8, 13, 1.8, -1);
    fill(s, () => {
      s.dot(8, 5, 4.6, RUST[5]);
      s.dot(7, 4, 2.4, RUST[6]);
    });
    fill(s, () => seg(s, 4, 8, 12, 8, RUST[3]));
  },
  /** the giant fist ringed in gold, foes pinned under it */
  h_ancestorFist_evo: (s) => {
    floor(s, 0, 15, 15, HC.trim);
    foe(s, 3, 13, 1.6, 1);
    foe(s, 13, 13, 1.6, -1);
    fill(s, () => {
      s.dot(8, 6, 5.2, RUST[5]);
      s.dot(7, 5, 2.6, RUST[6]);
    });
    ring(s, 8, 6, 6.4, GOLD);
  },
  /** a heap of foes flung in an arc */
  h_titanThrow: (s) => {
    arc(s, 7, 15, 8, Math.PI * 1.05, Math.PI * 1.75, RUST[4]);
    body(s, 12, 6, 2.6);
    body(s, 9, 3, 2.2);
    body(s, 14, 2, 1.8);
    fist(s, 3, 12, 2.6, -1);
  },
  /** the heap whirled on a gold ring */
  h_titanThrow_evo: (s) => {
    ring(s, 8, 9, 6, GOLD);
    body(s, 8, 3, 2.4);
    body(s, 13, 9, 2.2);
    body(s, 3, 9, 2.2);
    fill(s, () => s.dot(8, 9, 2, HC.coat));
  },
  /** a figure of iron: a plate chest, glowing seams */
  h_unbroken: (s) => {
    plate(s, 3, 2, 10, 6);
    plate(s, 4, 9, 8, 5);
    fill(s, () => {
      seg(s, 8, 3, 8, 13, RUST[4]);
      s.set(8, 8, RUST[6]);
    });
  },
  /** the iron figure twice the size, gold seams and a quake under it */
  h_unbroken_evo: (s) => {
    plate(s, 2, 1, 12, 7);
    plate(s, 3, 9, 10, 4);
    fill(s, () => seg(s, 8, 2, 8, 12, GOLD));
    crack(s, 15, GOLD, GOLD_LIGHT);
  },
};
