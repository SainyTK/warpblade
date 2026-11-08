import { COIN_GOLD, FIRE_RAMP } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { crack, shards } from "../hulda/parts";
import { arc, arrow, crescent, drop, fill, flame, sparkle, speedLines } from "../parts";
import { floor, foe, seg } from "../ysra/parts";
import {
  anchor,
  BLOOD,
  BLOOD_LIGHT,
  BRASS,
  BRASS_LINKS,
  ball,
  barb,
  bell,
  boot,
  chain,
  chainArc,
  dancer,
  flakes,
  floorRing,
  hook,
  kite,
  links,
  OC,
  plumb,
  post,
  RUST_FLAKE,
  reel,
  spiral,
  swingArc,
  tear,
  VOLT,
} from "./parts";

/** the gold of an evolved icon */
const GOLD = COIN_GOLD[3];
const GOLD_LIGHT = COIN_GOLD[4];

/** an infinity loop of chain round (cx, cy), r wide each side */
const infinity = (s: SpriteCanvas, cx: number, cy: number, r: number, gold = false) =>
  links(
    s,
    (u) => {
      const t = u * TAU;
      const k = 1 + Math.sin(t) ** 2;
      return [cx + (r * Math.cos(t)) / k, cy + (r * Math.sin(t) * Math.cos(t)) / k];
    },
    r * 6,
    gold ? BRASS_LINKS : undefined,
  );

/** Orrin's icons: his own sources, his 20 skills and their evolutions (`<id>_evo`, richer and lit gold) */
export const ORRIN_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** his chain string: a brass hook on a curved steel chain */
  o_chain: (s) => {
    chain(s, 1, 4, 3, 14, 9, 2);
    hook(s, 10, 2, 0, 1, 7, 1);
  },
  /** Whirlwall: a chain loop spun in a ring round him, the hook riding it */
  o_whirl: (s) => {
    swingArc(s, 8, 8, 7.4, -2.6, -0.6, BRASS[3]);
    chainArc(s, 8, 8, 5.2, 0.5, TAU - 0.2);
    fill(s, () => s.dot(8, 8, 1.4, OC.coat));
    hook(s, 13, 8, 0, 1, 3, 1);
  },
  /** Grand Pendulum: a figure swinging on a chain under a rift tear */
  o_pendulum: (s) => {
    tear(s, 6, 2, 10, 4);
    swingArc(s, 6, 3, 11, 0.6, 2.2, BRASS[3]);
    chain(s, 6, 3, 8, 5, 10, 6);
    dancer(s, 11, 15);
  },

  /** a chain's tip with a star bursting at its very end */
  o_sweetspot: (s) => {
    chain(s, 1, 14, 2, 4, 10, 6);
    sparkle(s, 12, 6, 3, BRASS[4]);
    fill(s, () => {
      s.set(10, 4, BRASS[5]);
      s.set(14, 4, BRASS[5]);
      s.set(10, 8, BRASS[5]);
      s.set(14, 8, BRASS[5]);
    });
  },
  /** a perfect brass arc, its tip flashing and a shock line running off it */
  o_sweetspot_evo: (s) => {
    crescent(s, 8, 14, 7, Math.PI + 0.1, TAU - 0.5, BRASS[4]);
    fill(s, () => {
      seg(s, 9, 3, 15, 1, WHITE);
      seg(s, 10, 6, 15, 6, GOLD_LIGHT);
    });
    sparkle(s, 13, 8, 2.6, GOLD);
  },
  /** a heavy brass hook hanging on a chain, weight lines under it */
  o_ironweight: (s) => {
    chain(s, 1, 1, 6, 0, 7, 3);
    hook(s, 7, 3, 0, 1, 7, 1);
    speedLines(s, 4, [9, 12], 3, BRASS[2]);
  },
  /** a spiked iron ball swung on a chain */
  o_ironweight_evo: (s) => {
    chain(s, 1, 1, 3, 8, 8, 8, BRASS_LINKS);
    ball(s, 10.5, 10, 3, true);
    sparkle(s, 13, 3, 2, GOLD);
  },
  /** a chain arcing down from above, its hook leading */
  o_skylash: (s) => {
    crescent(s, 6, 8, 6, -2.4, 0.2, BRASS[2]);
    chain(s, 1, 1, 14, 0, 12, 9);
    hook(s, 12, 9, 0, 1, 4, -1);
  },
  /** a brass crescent falling like a star, a trail behind it */
  o_skylash_evo: (s) => {
    fill(s, () => {
      s.stroke(1, 1, 7, 7, 0.9, BRASS[2]);
      s.stroke(3, 0, 8, 5, 0.5, BRASS[4]);
    });
    crescent(s, 10, 10, 4, -0.8, 2.4, BRASS[4]);
    sparkle(s, 11, 11, 2, WHITE);
    sparkle(s, 14, 3, 2, GOLD);
  },
  /** a boot kicking out at the bottom of a swing */
  o_pendulumkick: (s) => {
    swingArc(s, 8, 0, 11, 0.9, 2.2, BRASS[3]);
    chain(s, 8, 0, 7, 4, 5, 8);
    boot(s, 4, 13);
    foe(s, 14, 11, 2, -1);
  },
  /** a heel driving through with a brass comet trail */
  o_pendulumkick_evo: (s) => {
    fill(s, () => {
      s.stroke(0, 2, 5, 9, 1.2, BRASS[2]);
      s.stroke(1, 2, 5, 8, 0.5, BRASS[4]);
    });
    boot(s, 5, 12, true);
    sparkle(s, 13, 11, 2.6, GOLD);
  },
  /** a hook bitten into a foe, a pull line back toward him */
  o_gaff: (s) => {
    foe(s, 11, 11, 3.6, -1);
    chain(s, 0, 4, 4, 0, 8, 2);
    hook(s, 8, 2, 0, 1, 6, 1);
    arrow(s, 6, 14, 1, 14, OC.steelLight, 2);
  },
  /** a barbed harpoon dragging two foes along its shaft */
  o_gaff_evo: (s) => {
    foe(s, 4, 9, 2.4, 1);
    foe(s, 9, 9, 2.4, 1);
    fill(s, () => seg(s, 0, 9, 11, 9, BRASS[2]));
    fill(s, () => {
      s.poly(
        [
          [15.5, 9.5],
          [11, 5],
          [12, 9.5],
          [11, 14],
        ],
        BRASS[4],
      );
      s.set(15, 9, WHITE);
    });
    sparkle(s, 3, 3, 2, GOLD);
  },
  /** a swing pumped higher, its hook riding up the arc past chevrons */
  o_pump: (s) => {
    swingArc(s, 7, 0, 10, 0.5, 2.9, BRASS[2]);
    chain(s, 7, 0, 8, 1, 10, 2);
    hook(s, 10, 2, 0, 1, 5, 1);
    arrow(s, 3, 15, 3, 7, BRASS[4], 2);
  },
  /** chains hooked into the sky at three tears, meeting in a brass ring */
  o_pump_evo: (s) => {
    tear(s, 3, 2, 5, 3);
    tear(s, 8, 1, 5, 3);
    tear(s, 13, 2, 5, 3);
    chain(s, 3, 3, 4, 9, 8, 12, BRASS_LINKS);
    chain(s, 8, 2, 8, 7, 8, 11, BRASS_LINKS);
    chain(s, 13, 3, 12, 9, 8, 12, BRASS_LINKS);
    fill(s, () => {
      s.dot(8, 13, 1.6, BRASS[4]);
      s.set(8, 13, WHITE);
    });
  },
  /** a chain wound on a reel, its free end snapping in a burst */
  o_reelsnap: (s) => {
    reel(s, 5, 10, 4.5);
    chain(s, 9, 9, 11, 9, 12, 5);
    sparkle(s, 13, 4, 2.6, BRASS[5]);
    shards(s, 13, 4, 4, BRASS[4]);
  },
  /** a chain whip cracking round a full ring, gold sparks at its tip */
  o_reelsnap_evo: (s) => {
    swingArc(s, 8, 8, 3.6, 0, TAU, BRASS[3]);
    chainArc(s, 8, 8, 6.2, 0.6, TAU, BRASS_LINKS);
    shards(s, 12.6, 12.4, 4, GOLD);
    sparkle(s, 12.6, 12.4, 1.6, WHITE);
  },
  /** a hooked foe yanked back along the floor */
  o_undertow: (s) => {
    floor(s, 0, 15, 14, OC.steelDark);
    foe(s, 12, 10, 2.8, -1);
    chain(s, 0, 12, 5, 13, 10, 11);
    arrow(s, 12, 4, 3, 4, OC.steelLight, 2);
    speedLines(s, 15, [7], 3, OC.steelLight);
  },
  /** a swirl of chain dragging foes into its middle */
  o_undertow_evo: (s) => {
    spiral(s, 8, 8, 1.6, 7, 1.3, 0, BRASS_LINKS);
    foe(s, 3, 4, 1.8, 1);
    foe(s, 13, 11, 1.8, -1);
    fill(s, () => s.set(8, 8, WHITE));
    sparkle(s, 14, 2, 2, GOLD);
  },
  /** a weight dropping straight down onto a ring on the floor */
  o_plumbdrop: (s) => {
    floorRing(s, 8, 13.5, 6, 1.6, BRASS[3]);
    chain(s, 8, 0, 8, 1, 8, 2);
    plumb(s, 8, 3, 3);
    fill(s, () => {
      seg(s, 3, 4, 3, 8, BRASS[2]);
      seg(s, 13, 4, 13, 8, BRASS[2]);
    });
  },
  /** an anchor smashing into a floor cracked gold */
  o_plumbdrop_evo: (s) => {
    crack(s, 14, GOLD, GOLD_LIGHT);
    anchor(s, 8, 1, 11, true);
    sparkle(s, 2, 11, 2, GOLD);
    sparkle(s, 14, 11, 2, GOLD);
  },
  /** two posts with chain slung between them */
  o_chainfence: (s) => {
    chain(s, 3, 5, 8, 10, 12, 5);
    chain(s, 3, 10, 8, 14, 12, 10);
    post(s, 2, 4, 15);
    post(s, 13, 4, 15);
  },
  /** the fence strung with barbs, its posts capped gold */
  o_chainfence_evo: (s) => {
    chain(s, 3, 5, 8, 10, 12, 5, BRASS_LINKS);
    chain(s, 3, 10, 8, 14, 12, 10, BRASS_LINKS);
    for (const [x, y] of [
      [5, 6],
      [8, 7],
      [11, 6],
      [5, 11],
      [8, 12],
      [11, 11],
    ] as const)
      barb(s, x, y - 1.5, 0, -1);
    post(s, 2, 4, 15, true);
    post(s, 13, 4, 15, true);
    sparkle(s, 8, 2, 2, GOLD);
  },
  /** two foes linked by a chain */
  o_tether: (s) => {
    chain(s, 4, 10, 8, 12, 12, 6);
    foe(s, 3, 11, 2.8, 1);
    foe(s, 13, 5, 2.8, -1);
  },
  /** a gang of foes strung on one chain */
  o_tether_evo: (s) => {
    chain(s, 2, 12, 3, 8, 6, 7, BRASS_LINKS);
    chain(s, 6, 7, 8, 12, 10, 11, BRASS_LINKS);
    chain(s, 10, 11, 13, 10, 14, 5, BRASS_LINKS);
    foe(s, 2, 12, 1.9, 1);
    foe(s, 6, 7, 1.9, 1);
    foe(s, 10, 11, 1.9, -1);
    foe(s, 14, 5, 1.9, -1);
    sparkle(s, 13, 1, 1.6, GOLD);
  },
  /** an iron anchor falling out of a rift */
  o_anchorfall: (s) => {
    tear(s, 8, 2, 12, 4);
    speedLines(s, 4, [6, 9], 2, VOLT[3]);
    anchor(s, 8, 4, 11);
  },
  /** a rain of anchors out of a wide rift */
  o_anchorfall_evo: (s) => {
    tear(s, 8, 1.5, 15, 3);
    anchor(s, 3, 5, 8, true);
    anchor(s, 8.5, 3, 8, true);
    anchor(s, 13, 6, 8, true);
  },
  /** barbed chain links and a drop of blood */
  o_barbs: (s) => {
    chain(s, 1, 10, 7, 3, 15, 2);
    for (const [x, y] of [
      [3, 6],
      [7, 4],
      [11, 3],
    ] as const)
      barb(s, x, y, -1, -1.5);
    for (const [x, y] of [
      [5, 5],
      [9, 3],
      [13, 2],
    ] as const)
      barb(s, x, y, 1, 1.5);
    drop(s, 8, 12, 1.8, BLOOD, BLOOD_LIGHT);
  },
  /** a ring of barbed chain flaying round a bleeding heart */
  o_barbs_evo: (s) => {
    chainArc(s, 8, 8, 5.4, 0, TAU, BRASS_LINKS);
    fill(s, () => {
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU + 0.4;
        seg(s, 8 + Math.cos(a) * 6.2, 8 + Math.sin(a) * 6.2, 8 + Math.cos(a) * 7.4, 8 + Math.sin(a) * 7.4, WHITE);
      }
    });
    drop(s, 8, 9, 2, BLOOD, BLOOD_LIGHT);
  },
  /** a hook flaking with rust */
  o_rust: (s) => {
    chain(s, 6, 0, 6, 1, 6, 2);
    hook(s, 6, 2, 0, 1, 7, 1, false, true);
    fill(s, () => {
      s.set(6, 5, RUST_FLAKE[2]);
      s.set(7, 8, RUST_FLAKE[1]);
      s.set(10, 9, RUST_FLAKE[2]);
    });
    flakes(s, [
      [12, 3],
      [2, 8],
      [13, 13],
      [3, 13],
      [14, 7],
    ]);
  },
  /** a corroded hook bursting into rust */
  o_rust_evo: (s) => {
    shards(s, 8, 8, 8, RUST_FLAKE[2]);
    fill(s, () => {
      s.dot(8, 8, 3.4, RUST_FLAKE[1]);
      s.dot(7, 7, 1.8, RUST_FLAKE[2]);
      s.set(7, 6, RUST_FLAKE[3]);
    });
    hook(s, 7, 4, 0, 1, 4, 1, true);
    sparkle(s, 14, 2, 2, GOLD);
  },
  /** a chain arc with a flame riding its top */
  o_friction: (s) => {
    chainArc(s, 8, 14, 7, Math.PI + 0.25, TAU - 0.25);
    flame(s, 8, 8, 6);
    hook(s, 14.7, 12, 0.3, 1, 2.5, -1);
  },
  /** a burning arc left hanging in the air */
  o_friction_evo: (s) => {
    crescent(s, 8, 15, 7, Math.PI + 0.3, TAU - 0.3, FIRE_RAMP[2]);
    flame(s, 4, 11, 4);
    flame(s, 8, 9, 6);
    flame(s, 12, 11, 4);
    sparkle(s, 14, 2, 2, GOLD);
  },
  /** a brass diamond kite on its string */
  o_kite: (s) => {
    kite(s, 10, 1, 5, 2, 15);
    fill(s, () => {
      s.set(5, 11, BRASS[3]);
      s.set(7, 9, BRASS[3]);
    });
  },
  /** an armada of kites flown together */
  o_kite_evo: (s) => {
    kite(s, 3, 1, 3.2, 7, 15, true);
    kite(s, 12, 0, 3.2, 8, 15, true);
    kite(s, 8, 5, 3.6, 8, 15, true);
    sparkle(s, 14, 9, 1.6, GOLD);
  },
  /** a brass bell hung on a chain under a rift */
  o_bell: (s) => {
    tear(s, 8, 1.5, 11, 3);
    chain(s, 8, 2, 8, 3, 8, 4);
    bell(s, 8, 5, 4.4);
  },
  /** a great bell tolling, rings rolling off both sides */
  o_bell_evo: (s) => {
    bell(s, 8, 2, 5.4, true);
    arc(s, 8, 8, 7.2, -0.5, 0.5, GOLD);
    arc(s, 8, 8, 7.2, Math.PI - 0.5, Math.PI + 0.5, GOLD);
    fill(s, () => seg(s, 7, 0, 9, 0, GOLD_LIGHT));
  },
  /** the dancer and a ghost of him one step behind */
  o_twin: (s) => {
    dancer(s, 10, 13, true);
    dancer(s, 5, 15);
    speedLines(s, 15, [3, 6], 3, VOLT[3]);
  },
  /** three mirrored shades dancing, the middle one him */
  o_twin_evo: (s) => {
    dancer(s, 2.5, 14, true);
    dancer(s, 12.5, 14, true);
    dancer(s, 7.5, 15);
    sparkle(s, 8, 2, 2, GOLD);
  },
  /** a loop of chain turning back on itself, a brass arrowhead leading */
  o_perpetual: (s) => {
    chainArc(s, 8, 8.5, 5.4, -0.3, Math.PI * 1.3);
    fill(s, () => {
      s.poly(
        [
          [9.5, 3],
          [5, 0],
          [5, 6],
        ],
        BRASS[3],
      );
      seg(s, 5, 1, 5, 4, BRASS[5]);
    });
    fill(s, () => s.dot(8, 8.5, 1.2, BRASS[3]));
  },
  /** an endless figure eight of chain, a kite flying off it */
  o_perpetual_evo: (s) => {
    infinity(s, 8, 10, 7, true);
    kite(s, 12, 0, 2.6, 11, 8, true);
    sparkle(s, 3, 3, 1.6, GOLD);
  },
  /** a vortex of chain turning round a rift */
  o_maelstrom: (s) => {
    spiral(s, 8, 8, 3, 7.2, 1.15, 0.3);
    tear(s, 8, 8, 6, 3);
  },
  /** a giant vortex, two arms of chain round a rift opened like an eye */
  o_maelstrom_evo: (s) => {
    spiral(s, 8, 8, 4, 7.6, 0.9, 0.2, BRASS_LINKS);
    spiral(s, 8, 8, 4, 7.6, 0.9, 0.2 + Math.PI);
    fill(s, () => {
      s.poly(
        [
          [3.5, 8.5],
          [8.5, 5.5],
          [13.5, 8.5],
          [8.5, 11.5],
        ],
        VOLT[1],
      );
    });
    fill(s, () => {
      s.dot(8.5, 8.5, 1.6, VOLT[3]);
      s.set(8, 8, WHITE);
    });
  },
};
