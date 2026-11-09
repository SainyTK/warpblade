import { PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { glint, hoop } from "../mirel/parts";
import { arc, chevron, fill, speedLines } from "../parts";
import { floor, foe, seg } from "../ysra/parts";
import {
  ACCENT,
  burst,
  candle,
  flame,
  flameBolt,
  frost,
  GOLD,
  GOLD_DARK,
  GOLD_LIGHT,
  ghostCandle,
  greatWick,
  lampfly,
  lamplighter,
  lampPole,
  lantern,
  pool,
  quarryRing,
  smallWick,
  smoke,
  sparks,
  thread,
  VIOLET,
  WAX,
  WOOD,
  WOOD_LIGHT,
  waxDrop,
  wick,
} from "./parts";

/** a curved arrow over the top from (x0, y) to (x1, y), its head at x1, `both` heads at both ends */
const swapArrow = (s: SpriteCanvas, x0: number, x1: number, y: number, c: typeof WHITE, both = true) => {
  const cx = (x0 + x1) / 2;
  const r = (x1 - x0) / 2;
  arc(s, cx, y, r, Math.PI + 0.25, TAU_LESS, c, 0.45);
  chevron(s, x1, y, 0, 1, 2, c);
  if (both) chevron(s, x0, y, 0, 1, 2, c);
};
const TAU_LESS = Math.PI * 2 - 0.25;

/** Wenna's icons: her own sources, her 20 skills and their evolutions (`<id>_evo`, richer and lit gold) */
export const WENNA_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** her lamp string: the pole swung forward, its lantern swinging on the hook and throwing off light */
  w_lamp: (s) => {
    lampPole(s, 3, 15, 8, 2, 1);
    sparks(s, [
      [14, 5],
      [15, 9],
      [12, 12],
      [6, 9],
    ]);
    fill(s, () => {
      seg(s, 14, 7, 15, 7, VIOLET[3]);
      seg(s, 13, 11, 14, 12, VIOLET[3]);
    });
  },
  /** her Wicks and abilities: a Wick and a smaller one behind it */
  w_wicks: (s) => {
    smallWick(s, 12, 13, false, -1);
    wick(s, 6, 15);
  },
  /** her special Great Wick: a giant Wick swinging one arm up */
  w_great: (s) => {
    greatWick(s, 7, 15);
  },

  /** a foe under the Quarry's lamplight ring, a Wick running at it */
  w_quarry: (s) => {
    quarryRing(s, 10, 4, 3.5, 1.2);
    foe(s, 10, 10, 3.2, -1);
    speedLines(s, 6, [12, 14], 2, VIOLET[3]);
    smallWick(s, 3, 15);
  },
  /** Pack Law: three foes, each under a gold Quarry ring */
  w_quarry_evo: (s) => {
    quarryRing(s, 8, 1.5, 2.5, 1, true);
    foe(s, 8, 6, 2.2, -1);
    quarryRing(s, 3, 9.5, 2.5, 1, true);
    foe(s, 3, 13.5, 2.2, 1);
    quarryRing(s, 13, 9.5, 2.5, 1, true);
    foe(s, 13, 13.5, 2.2, -1);
  },
  /** a Wick's bite: violet jaws with bright fangs closing on a foe */
  w_fangs: (s) => {
    foe(s, 13, 8, 3, -1);
    fill(s, () => {
      s.stroke(1, 2, 9, 5, 0.6, VIOLET[3]);
      s.stroke(1, 14, 9, 11, 0.6, VIOLET[3]);
      seg(s, 1, 1, 8, 4, VIOLET[5]);
    });
    fill(s, () => {
      for (const x of [3, 6, 9]) {
        s.set(x, 4 + (x - 3) / 3, WHITE);
        s.set(x, 12 - (x - 3) / 3, WHITE);
      }
      s.set(6, 6, WHITE);
      s.set(6, 10, WHITE);
    });
  },
  /** Blue Flame: one bite running through two foes in a blue flame */
  w_fangs_evo: (s) => {
    foe(s, 7, 9, 2.6, -1);
    foe(s, 13, 11, 2.6, -1);
    fill(s, () => {
      s.stroke(1, 6, 15, 12, 0.5, PAL.volt[2]);
      seg(s, 1, 6, 15, 12, PAL.volt[4]);
    });
    sparks(s, [
      [6, 4],
      [12, 15],
      [9, 13],
    ]);
    glint(s, 2, 2, 1, GOLD_LIGHT);
  },
  /** the lantern's shutter thrown open, a cone of violet flame pouring out */
  w_flare: (s) => {
    fill(s, () => {
      s.poly(
        [
          [6, 6.5],
          [16, 1],
          [16, 13],
        ],
        VIOLET[2],
      );
    });
    fill(s, () => {
      s.poly(
        [
          [6, 6.5],
          [15, 4],
          [15, 9.5],
        ],
        VIOLET[4],
      );
      seg(s, 6, 6, 9, 6, WHITE);
    });
    lantern(s, 3, 3, true);
  },
  /** Lighthouse: a long gold beam from the lantern and a violet one from a Wick */
  w_flare_evo: (s) => {
    fill(s, () => {
      s.block(5, 4, GOLD, 11, 3);
      seg(s, 5, 5, 15, 5, GOLD_LIGHT);
    });
    lantern(s, 2, 2, true, true);
    fill(s, () => {
      s.block(6, 10, VIOLET[3], 10, 2);
      seg(s, 6, 10, 15, 10, VIOLET[5]);
    });
    smallWick(s, 3, 15);
  },
  /** two Wicks lunging from either side at a ringed Quarry */
  w_packLunge: (s) => {
    quarryRing(s, 8, 2.5, 3, 1);
    foe(s, 8, 8, 3, 1);
    fill(s, () => {
      seg(s, 4, 9, 5, 9, VIOLET[4]);
      seg(s, 11, 9, 12, 9, VIOLET[4]);
    });
    smallWick(s, 3, 15);
    smallWick(s, 13, 15, false, -1);
  },
  /** Feeding Frenzy: three gold strikes across the Quarry, Wicks either side */
  w_packLunge_evo: (s) => {
    foe(s, 8, 7, 3.4, 1);
    fill(s, () => {
      seg(s, 4, 3, 10, 9, GOLD);
      seg(s, 6, 2, 12, 8, GOLD_LIGHT);
      seg(s, 8, 1, 14, 7, GOLD);
    });
    smallWick(s, 3, 15, true);
    smallWick(s, 13, 15, true, -1);
  },
  /** a Wick melted to a puddle, bursting as it goes */
  w_gutter: (s) => {
    burst(s, 8, 9, 2, 6.5, VIOLET[3], VIOLET[5]);
    fill(s, () => {
      s.dot(8, 9, 1.6, VIOLET[4]);
      s.set(8, 9, GOLD_LIGHT);
    });
    pool(s, 8, 14, 6, 1.6);
    smoke(s, 12, 4);
  },
  /** Wildfire: fire running along the floor from a melted Wick */
  w_gutter_evo: (s) => {
    pool(s, 8, 14.5, 7.5, 1.4);
    flame(s, 3, 13, 6, true);
    flame(s, 8, 13, 9);
    flame(s, 13, 13, 6, true);
    glint(s, 14, 2, 1, GOLD_LIGHT);
  },
  /** a Wick bursting under Kindle, a flame thread chaining to the next */
  w_kindle: (s) => {
    burst(s, 5, 7, 2.2, 5.5, VIOLET[3], GOLD_LIGHT, 8, 0.4);
    fill(s, () => {
      s.dot(5, 7, 2, VIOLET[4]);
      s.set(5, 7, WHITE);
    });
    thread(s, 8, 10, 12, 8);
    smallWick(s, 13, 15, false, -1);
  },
  /** Bonfire: crossed logs under a tall violet and gold fire */
  w_kindle_evo: (s) => {
    flame(s, 7.5, 13, 12);
    flame(s, 4, 13, 5, true, -1);
    flame(s, 11, 13, 5, true, 1);
    fill(s, () => {
      s.stroke(2, 15, 13, 12, 0.6, WOOD);
      s.stroke(2, 12, 13, 15, 0.6, WOOD_LIGHT);
    });
  },
  /** the lamplighter and a Wick trading places under a two-way arrow */
  w_swap: (s) => {
    swapArrow(s, 3, 12, 6, VIOLET[4]);
    lamplighter(s, 4, 15, false);
    smallWick(s, 12, 15, false, -1);
  },
  /** Mirror Wick: the trade lights a gold Wick where she arrives */
  w_swap_evo: (s) => {
    swapArrow(s, 3, 12, 7, GOLD_LIGHT);
    smallWick(s, 3, 15);
    smallWick(s, 12, 15, true, -1);
    sparks(
      s,
      [
        [9, 12],
        [15, 11],
        [14, 9],
      ],
      true,
    );
    glint(s, 8, 2, 1, GOLD_LIGHT);
  },
  /** a hop off a Wick's head, a dashed arc curving up and over */
  w_hop: (s) => {
    smallWick(s, 4, 15);
    fill(s, () => {
      for (let k = 0; k <= 10; k += 2) {
        const u = k / 10;
        s.set(Math.round(4 + u * 9), Math.round(7 - Math.sin(u * Math.PI * 0.75) * 6), VIOLET[4]);
      }
    });
    chevron(s, 13, 2, 0.7, -0.7, 2, ACCENT);
    burst(s, 4, 8, 1, 2.5, VIOLET[3], VIOLET[5], 4, -Math.PI / 4);
  },
  /** Candle Stair: candles rising in steps, hops between them */
  w_hop_evo: (s) => {
    candle(s, 2.5, 16, 3, 3, true, 3);
    candle(s, 8, 16, 7, 3, true, 3);
    candle(s, 13.5, 16, 11, 3, true, 3);
    fill(s, () => {
      s.set(5, 9, GOLD_LIGHT);
      s.set(11, 5, GOLD_LIGHT);
    });
  },
  /** the lamplighter walking with a Wick at her side */
  w_procession: (s) => {
    floor(s, 0, 15, 15, VIOLET[1]);
    smallWick(s, 3, 14);
    lamplighter(s, 10, 14);
    speedLines(s, 15, [6, 9], 2, VIOLET[3]);
  },
  /** Vigil March: Wicks in a row leaving chilling wax on the floor behind them */
  w_procession_evo: (s) => {
    pool(s, 7, 14.5, 7, 1.2, WAX[1], PAL.ice[4]);
    smallWick(s, 3, 14, true);
    smallWick(s, 8, 14, true);
    smallWick(s, 13, 14, true);
    frost(s, [
      [1, 9],
      [6, 7],
      [11, 8],
    ]);
  },
  /** a Wick spitting two flame bolts */
  w_lampVolley: (s) => {
    wick(s, 4, 15);
    flameBolt(s, 13, 3, Math.PI + 0.45, 6);
    flameBolt(s, 14, 9, Math.PI + 0.1, 6);
  },
  /** Starfire: bolts curving to foes and bursting in gold stars */
  w_lampVolley_evo: (s) => {
    smallWick(s, 3, 15);
    arc(s, 8, 9, 5, Math.PI + 0.6, Math.PI * 1.9, VIOLET[3], 0.4);
    burst(s, 12.5, 6, 0.5, 3, GOLD, GOLD_LIGHT);
    burst(s, 12, 13, 0.5, 2.5, GOLD, GOLD_LIGHT, 4);
    glint(s, 2, 2, 1, GOLD_LIGHT);
  },
  /** a wide wax pool on the floor, a Wick mending in it */
  w_waxPool: (s) => {
    pool(s, 8, 13.5, 7.5, 2.4);
    smallWick(s, 9, 13);
    fill(s, () => s.pixels([".h.", "hHh", ".h."], { h: VIOLET[4], H: WHITE }, 2, 4));
    frost(s, [
      [14, 9],
      [13, 7],
    ]);
  },
  /** Hearth: a gold-rimmed pool round the lamplighter, going where she goes */
  w_waxPool_evo: (s) => {
    pool(s, 8, 14, 8, 2, GOLD_DARK, GOLD_LIGHT);
    lamplighter(s, 7, 13);
    speedLines(s, 3, [5, 8], 2, GOLD);
  },
  /** a tall wax effigy, arms wide, foes drawn in toward it */
  w_effigy: (s) => {
    fill(s, () => {
      s.block(6, 5, WAX[2], 4, 10);
      s.block(6, 5, WAX[3], 1, 9);
      s.block(3, 7, WAX[2], 10, 2);
      s.block(6, 15, WAX[0], 4, 1);
      s.set(7, 7, VIOLET[0]);
      s.set(8, 7, VIOLET[0]);
    });
    flame(s, 7.5, 5, 5);
    chevron(s, 2, 12, 1, 0, 2, ACCENT);
    chevron(s, 13, 12, -1, 0, 2, ACCENT);
  },
  /** Martyr's Light: the effigy bursting gold, two Wicks lit from it */
  w_effigy_evo: (s) => {
    burst(s, 8, 6, 2, 6, GOLD, GOLD_LIGHT);
    fill(s, () => {
      s.block(6, 4, WAX[2], 4, 5);
      s.set(7, 6, VIOLET[0]);
      s.set(8, 6, VIOLET[0]);
    });
    smallWick(s, 3, 15, true);
    smallWick(s, 13, 15, true, -1);
  },
  /** a foe singed by little violet flames */
  w_singe: (s) => {
    foe(s, 8, 10, 4.4, -1);
    flame(s, 4, 10, 6);
    flame(s, 10, 7, 6);
    flame(s, 12, 15, 4);
  },
  /** Ashfall: a full foe bursting, ash falling round it */
  w_singe_evo: (s) => {
    burst(s, 8, 8, 2.5, 7, VIOLET[3], GOLD_LIGHT);
    foe(s, 8, 8, 2.2, -1);
    fill(s, () => {
      for (const [x, y] of [
        [2, 14],
        [5, 15],
        [11, 14],
        [14, 15],
        [1, 3],
      ] as const)
        s.set(x, y, 0x8a8496);
    });
  },
  /** a drop of hot wax splashing on the floor */
  w_hotWax: (s) => {
    waxDrop(s, 8, 6, 2.4);
    fill(s, () => {
      s.set(5, 4, VIOLET[4]);
      s.set(11, 3, VIOLET[4]);
    });
    pool(s, 8, 14, 6, 1.4);
    sparks(s, [
      [2, 11],
      [14, 11],
      [3, 9],
      [13, 9],
    ]);
  },
  /** Candlemaker: two gold drops falling over a candle */
  w_hotWax_evo: (s) => {
    waxDrop(s, 3.5, 6, 2, true);
    waxDrop(s, 12.5, 5, 2, true);
    candle(s, 8, 16, 7, 3, false, 4);
  },
  /** both ends of a Swap smouldering, a flame thread strung between */
  w_smoulder: (s) => {
    floor(s, 0, 15, 15, VIOLET[1]);
    flame(s, 2.5, 14, 7);
    flame(s, 12.5, 14, 7);
    fill(s, () => {
      for (let x = 3; x <= 13; x++) {
        if (x % 3 === 2) continue;
        s.set(x, Math.round(6 - Math.sin(((x - 3) / 10) * Math.PI) * 4), x % 3 ? VIOLET[4] : GOLD_LIGHT);
      }
    });
  },
  /** Pyre Path: a trail of fire burning all along the floor */
  w_smoulder_evo: (s) => {
    floor(s, 0, 15, 15, GOLD_DARK);
    flame(s, 1.5, 14, 6, true);
    flame(s, 5.5, 14, 9);
    flame(s, 9.5, 14, 7, true);
    flame(s, 13.5, 14, 10);
  },
  /** lampflies darting out round her lantern */
  w_lampflies: (s) => {
    lantern(s, 7, 6);
    lampfly(s, 2, 3);
    lampfly(s, 13, 2);
    lampfly(s, 13, 12);
    lampfly(s, 3, 13);
  },
  /** Lantern Swarm: a gold lantern in a whirl of lampflies */
  w_lampflies_evo: (s) => {
    hoop(s, 8, 8, 6.5, VIOLET[2], VIOLET[4]);
    lantern(s, 8, 5, false, true);
    for (const [x, y] of [
      [2, 2],
      [8, 1],
      [14, 3],
      [1, 9],
      [14, 10],
      [4, 14],
      [11, 14],
    ] as const)
      lampfly(s, x, y, true);
  },
  /** two twin Wicks lit side by side */
  w_twinWick: (s) => {
    wick(s, 4.5, 15);
    wick(s, 11.5, 15, false, -1);
    glint(s, 8, 3, 1, VIOLET[5]);
  },
  /** Candelabra: a gold candelabra of three lit Wick flames */
  w_twinWick_evo: (s) => {
    fill(s, () => {
      seg(s, 2, 9, 14, 9, GOLD);
      seg(s, 2, 8, 2, 9, GOLD);
      seg(s, 14, 8, 14, 9, GOLD);
      seg(s, 8, 9, 8, 14, GOLD_DARK);
      seg(s, 5, 15, 11, 15, GOLD);
    });
    flame(s, 2, 8, 5);
    flame(s, 8, 8, 7);
    flame(s, 14, 8, 5);
  },
  /** a ghost candle firing a bolt */
  w_ghost: (s) => {
    ghostCandle(s, 4, 14, 8);
    flameBolt(s, 14, 6, Math.PI + 0.25, 6);
    fill(s, () => s.set(8, 3, VIOLET[4]));
  },
  /** Vigil of the Lost: two ghost candles, their bolts dripping hot wax */
  w_ghost_evo: (s) => {
    ghostCandle(s, 3, 14, 7, true);
    ghostCandle(s, 12, 15, 9, true);
    waxDrop(s, 7.5, 12, 1.4, true);
    flameBolt(s, 8, 4, Math.PI + 0.4, 4, true);
  },
  /** her satchel of candles, three tips showing above the flap */
  w_tallow: (s) => {
    fill(s, () => {
      s.block(4, 2, WAX[2], 2, 6);
      s.block(7, 1, WAX[3], 2, 7);
      s.block(10, 3, WAX[2], 2, 5);
    });
    fill(s, () => {
      s.poly(
        [
          [2, 7],
          [14, 7],
          [13, 15],
          [3, 15],
        ],
        WOOD_LIGHT,
      );
      s.poly(
        [
          [2, 7],
          [14, 7],
          [13, 10],
          [3, 10],
        ],
        WOOD,
      );
      s.set(8, 10, VIOLET[4]);
    });
    flame(s, 7.5, 1, 3);
  },
  /** Eternal Flame: a flame that never burns down, inside a gold ring */
  w_tallow_evo: (s) => {
    hoop(s, 8, 8, 7, GOLD_DARK, GOLD_LIGHT);
    candle(s, 8, 14, 4, 4, false, 8);
  },
  /** Thousand Candles: candles of every height rising across the floor */
  w_thousand: (s) => {
    candle(s, 1.5, 16, 4, 2, false, 3);
    candle(s, 5, 16, 8, 2, false, 3);
    candle(s, 8.5, 16, 5, 2, false, 3);
    candle(s, 12, 16, 9, 2, false, 3);
    candle(s, 15, 16, 3, 2, false, 3);
  },
  /** Night of Lamps: a gold moon over a stage full of candles */
  w_thousand_evo: (s) => {
    fill(s, () => s.pixels([".GG", "G..", "G..", ".GG"], { G: GOLD_LIGHT }, 1, 0));
    candle(s, 1.5, 16, 5, 2, true, 3);
    candle(s, 5, 16, 3, 2, true, 3);
    candle(s, 8.5, 16, 7, 2, true, 3);
    candle(s, 12, 16, 4, 2, true, 3);
    candle(s, 15, 16, 8, 2, true, 3);
    fill(s, () => {
      s.set(9, 1, WHITE);
      s.set(14, 3, GOLD);
      s.set(5, 4, VIOLET[4]);
    });
  },
};
